import React from 'react';

import SpellLink from 'common/SpellLink';
import Wrapper from 'common/Wrapper';
import { formatPercentage } from 'common/format';

import Analyzer from 'Parser/Core/Analyzer';
import SpellHistory from 'Parser/Core/Modules/SpellHistory';

import Tab from 'Main/Tab';
import CastEfficiencyComponent from 'Main/CastEfficiency';
import SpellTimeline from 'Main/Timeline/SpellTimeline';

import Abilities from './Abilities';
import AbilityTracker from './AbilityTracker';
import Combatants from './Combatants';
import Haste from './Haste';

const DEFAULT_RECOMMENDED = 0.80;
const DEFAULT_AVERAGE_DOWNSTEP = 0.05;
const DEFAULT_MAJOR_DOWNSTEP = 0.15;

class CastEfficiency extends Analyzer {
  static dependencies = {
    abilityTracker: AbilityTracker,
    combatants: Combatants,
    haste: Haste,
    spellHistory: SpellHistory,
    abilities: Abilities,
  };

  /*
   * Gets info about spell's cooldown behavior. All values are as of the current timestamp.
   * completedRechargeTime is the total ms of completed cooldowns
   * endingRechargeTime is the total ms into current cooldown
   * recharges is the total number of times the spell has recharged (either come off cooldown or gained a charge)
   * Only works on spells entered into CastEfficiency list.
   */
  _getCooldownInfo(spellId) {
    const history = this.spellHistory.historyBySpellId[spellId];
    if(!history) {
      return null;
    }

    let lastRechargeTimestamp = null;
    let recharges = 0;
    const completedRechargeTime = history
      .filter(event => event.type === 'updatespellusable')
      .reduce((acc, event) => {
        if(event.trigger === 'begincooldown') {
          lastRechargeTimestamp = event.timestamp;
          return acc;
        } else if(event.trigger === 'endcooldown') {
          const rechargingTime = (event.timestamp - lastRechargeTimestamp) || 0;
          recharges += 1;
          lastRechargeTimestamp = null;
          return acc + rechargingTime;
        // This might cause oddness if we add anything that externally refreshes charges, but so far nothing does
        } else if(event.trigger === 'restorecharge') {
          const rechargingTime = (event.timestamp - lastRechargeTimestamp) || 0;
          recharges += 1;
          lastRechargeTimestamp = event.timestamp;
          return acc + rechargingTime;
        } else {
          return acc;
        }
      }, 0);
    const endingRechargeTime = (!lastRechargeTimestamp) ? 0 : this.owner.currentTimestamp - lastRechargeTimestamp;

    return {
      completedRechargeTime,
      endingRechargeTime,
      recharges,
    };
  }

  /*
   * Packs cast efficiency results for use by suggestions / tab
   */
  _generateCastEfficiencyInfo() {
    const abilityInfo = this.abilities.constructor.ABILITIES;

    const fightDurationMs = this.owner.fightDuration;
    const fightDurationMinutes = fightDurationMs / 1000 / 60;

    return abilityInfo
      .filter(ability => !ability.isActive || ability.isActive(this.combatants.selected))
      .map(ability => {
        const spellId = ability.spell.id;
        const cooldown = ability.getCooldown(this.combatants.hastePercentage, this.combatants.selected);
        const cooldownMs = (cooldown === null) ? null : cooldown * 1000;
        const cdInfo = this._getCooldownInfo(spellId);

        // ability.getCasts is used for special cases that show the wrong number of cast events, like Penance
        // and also for splitting up differently buffed versions of the same spell (this use has nothing to do with CastEfficiency)
        const trackedAbility = this.abilityTracker.getAbility(spellId);
        const casts = (ability.getCasts ? ability.getCasts(trackedAbility, this.owner) : trackedAbility.casts) || 0;
        if (ability.isUndetectable && casts === 0) {
          // Some spells (most notably Racials) can not be detected if a player has them. This hides those spells if they have 0 casts.
          return null;
        }
        const cpm = casts / fightDurationMinutes;

        // ability.getMaxCasts is used for special cases for spells that have a variable availability or CD based on state, like Void Bolt.
        // This same behavior should be managable using SpellUsable's interface, so getMaxCasts is deprecated.
        // Legacy support: if getMaxCasts is defined, cast efficiency will be calculated using casts/rawMaxCasts
        let rawMaxCasts;
        const averageCooldown = (!cdInfo || cdInfo.recharges === 0) ? null : (cdInfo.completedRechargeTime / cdInfo.recharges);
        if (ability.getMaxCasts) {
          // getMaxCasts expects cooldown in seconds
          rawMaxCasts = ability.getMaxCasts(cooldown, this.owner.fightDuration, this.abilityTracker.getAbility, this.owner);
        } else if (averageCooldown) { // no average CD if spell hasn't been cast
          rawMaxCasts = (this.owner.fightDuration / averageCooldown) + (ability.charges || 1) - 1;
        } else {
          rawMaxCasts = (this.owner.fightDuration / cooldownMs) + (ability.charges || 1) - 1;
        }
        const maxCasts = Math.ceil(rawMaxCasts) || 0;
        const maxCpm = (cooldown === null) ? null : maxCasts / fightDurationMinutes;

        let castEfficiency;
        if(ability.getMaxCasts) { // legacy support for custom getMaxCasts
          castEfficiency = Math.min(1, casts / rawMaxCasts);
        } else {
          // Cast efficiency calculated as the percent of fight time spell was on cooldown
          const timeOnCd = !cdInfo ? null : (cdInfo.completedRechargeTime + cdInfo.endingRechargeTime);
          castEfficiency = (timeOnCd / this.owner.fightDuration) || null;
        }

        const recommendedCastEfficiency = ability.recommendedCastEfficiency || DEFAULT_RECOMMENDED;
        const averageIssueCastEfficiency = ability.averageIssueCastEfficiency || (recommendedCastEfficiency - DEFAULT_AVERAGE_DOWNSTEP);
        const majorIssueCastEfficiency = ability.majorIssueCastEfficiency || (recommendedCastEfficiency - DEFAULT_MAJOR_DOWNSTEP);

        const gotMaxCasts = (casts === maxCasts);
        const canBeImproved = castEfficiency !== null && castEfficiency < recommendedCastEfficiency && !gotMaxCasts;

        return {
          ability,
          cpm,
          maxCpm,
          casts,
          maxCasts,
          castEfficiency,
          recommendedCastEfficiency,
          averageIssueCastEfficiency,
          majorIssueCastEfficiency,
          gotMaxCasts,
          canBeImproved,
        };
      })
      .filter(item => item !== null);
  }

  suggestions(when) {
    const castEfficiencyInfo = this._generateCastEfficiencyInfo();
    castEfficiencyInfo.forEach(abilityInfo => {
      if(abilityInfo.ability.noSuggestion || abilityInfo.castEfficiency === null || abilityInfo.gotMaxCasts) {
        return;
      }
      const ability = abilityInfo.ability;
      when(abilityInfo.castEfficiency).isLessThan(abilityInfo.recommendedCastEfficiency)
        .addSuggestion((suggest, actual, recommended) => {
          return suggest(<Wrapper>Try to cast <SpellLink id={ability.spell.id} /> more often. {ability.extraSuggestion || ''} <a href="#spell-timeline">View timeline</a>.</Wrapper>)
            .icon(ability.spell.icon)
            .actual(`You kept it on cooldown ${formatPercentage(actual, 1)}% of the time (${abilityInfo.casts} out of ${abilityInfo.maxCasts} possible casts).`)
            .recommended(`>${formatPercentage(recommended, 1)}% is recommended`)
            .details(() => (
              <div style={{ margin: '0 -22px' }}>
                <SpellTimeline
                  historyBySpellId={this.spellHistory.historyBySpellId}
                  castEfficiency={this.castEfficiency}
                  spellId={ability.spell.id}
                  start={this.owner.fight.start_time}
                  end={this.owner.currentTimestamp}
                />
              </div>
            ))
            .regular(abilityInfo.averageIssueCastEfficiency).major(abilityInfo.majorIssueCastEfficiency).staticImportance(ability.importance);
        });
    });
  }

  tab() {
    return {
      title: 'Cast efficiency',
      url: 'cast-efficiency',
      render: () => (
        <Tab title="Cast efficiency">
          <CastEfficiencyComponent
            categories={this.abilities.constructor.SPELL_CATEGORIES}
            abilities={this._generateCastEfficiencyInfo()}
          />
        </Tab>
      ),
    };
  }
}

export default CastEfficiency;
