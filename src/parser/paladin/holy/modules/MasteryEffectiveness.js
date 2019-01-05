import React from 'react';
import { Trans, t } from '@lingui/macro';

import SPELLS from 'common/SPELLS';
import { formatPercentage } from 'common/format';
import Analyzer from 'parser/core/Analyzer';
import Combatants from 'parser/shared/modules/Combatants';
import StatTracker from 'parser/shared/modules/StatTracker';
import HealingValue from 'parser/shared/modules/HealingValue';
import { i18n } from 'interface/RootLocalizationProvider';
import { STATISTIC_ORDER } from 'interface/others/StatisticBox';
import Statistic from 'interface/statistics/Statistic';
import Radar from 'interface/statistics/components/DistanceRadar';
import PlayerBreakdownTab from 'interface/others/PlayerBreakdownTab';

import BeaconTargets from './beacons/BeaconTargets';
import { ABILITIES_AFFECTED_BY_MASTERY } from '../constants';

const debug = false;

class MasteryEffectiveness extends Analyzer {
  static dependencies = {
    combatants: Combatants,
    beaconTargets: BeaconTargets,
    statTracker: StatTracker,
  };

  lastPlayerPositionUpdate = null;
  distanceSum = 0;
  distanceCount = 0;
  rawMasteryEffectivenessSum = 0;
  rawMasteryEffectivenessCount = 0;
  get rawMasteryEffectivenessAverage() {
    return this.rawMasteryEffectivenessSum / this.rawMasteryEffectivenessCount;
  }
  scaledMasteryEffectivenessSum = 0;
  scaledMasteryEffectivenessCount = 0;
  get scaledMasteryEffectivenessAverage() {
    return this.scaledMasteryEffectivenessSum / this.scaledMasteryEffectivenessCount;
  }
  totalMasteryHealingDone = 0;

  masteryHealEvents = [];

  on_cast(event) {
    if (this.owner.byPlayer(event)) {
      this.updatePlayerPosition(event);
    }
  }
  on_damage(event) {
    if (this.owner.toPlayer(event)) {
      // Damage coordinates are for the target, so they are only accurate when done TO player
      this.updatePlayerPosition(event);
    }
  }
  on_energize(event) {
    if (this.owner.toPlayer(event)) {
      this.updatePlayerPosition(event);
    }
  }
  on_heal(event) {
    if (this.owner.toPlayer(event)) {
      // Do this before checking if this was done by player so that self-heals will apply full mastery properly
      this.updatePlayerPosition(event);
    }

    if (this.owner.byPlayer(event)) {
      this.processForMasteryEffectiveness(event);
    }
  }

  processForMasteryEffectiveness(event) {
    if (!this.lastPlayerPositionUpdate) {
      console.error('Received a heal before we know the player location. Can\'t process since player location is still unknown.', event);
      return;
    }
    const isAbilityAffectedByMastery = ABILITIES_AFFECTED_BY_MASTERY.includes(event.ability.guid);
    if (!isAbilityAffectedByMastery) {
      return;
    }

    const distance = this.getPlayerDistance(event);
    this.distanceSum += distance;
    this.distanceCount += 1;

    const isRuleOfLawActive = this.selectedCombatant.hasBuff(SPELLS.RULE_OF_LAW_TALENT.id, event.timestamp);
    // We calculate the mastery effectiveness of this *one* heal
    const masteryEffectiveness = this.constructor.calculateMasteryEffectiveness(distance, isRuleOfLawActive);
    this.rawMasteryEffectivenessSum += masteryEffectiveness;
    this.rawMasteryEffectivenessCount += 1;

    // Hit points are the hitpoints after the heal event was applied
    const hp = event.hitPoints;
    const remainingHealthMissing = event.maxHitPoints - hp;
    const heal = new HealingValue(event.amount, event.absorbed, event.overheal);
    const applicableMasteryPercentage = this.statTracker.currentMasteryPercentage * masteryEffectiveness;

    // The base healing of the spell (excluding any healing added by mastery)
    const baseHealingDone = heal.raw / (1 + applicableMasteryPercentage);
    const actualMasteryHealingDone = Math.max(0, heal.effective - baseHealingDone);
    this.totalMasteryHealingDone += actualMasteryHealingDone;
    // The max potential mastery healing if we had a mastery effectiveness of 100% on this spell. This does NOT include the base healing. Example: a heal that did 1,324 healing with 32.4% mastery with 100% mastery effectiveness will have a max potential mastery healing of 324.
    const maxPotentialRawMasteryHealing = baseHealingDone * this.statTracker.currentMasteryPercentage; // * 100% mastery effectiveness
    const maxPotentialRawMasteryGain = maxPotentialRawMasteryHealing - actualMasteryHealingDone;
    const maxPotentialMasteryGain = actualMasteryHealingDone + Math.min(remainingHealthMissing, maxPotentialRawMasteryGain);

    const adjustedMasteryEffectiveness = actualMasteryHealingDone / maxPotentialMasteryGain;
    if (!isNaN(adjustedMasteryEffectiveness)) {
      this.scaledMasteryEffectivenessSum += adjustedMasteryEffectiveness;
      this.scaledMasteryEffectivenessCount += 1;
    }

    this.masteryHealEvents.push({
      ...event,
      distance,
      masteryEffectiveness,
      baseHealingDone,
      actualMasteryHealingDone,
      maxPotentialMasteryGain,
    });
    // Update the event information to include the heal's mastery effectiveness in case we want to use this elsewhere (hint: StatValues)
    event.masteryEffectiveness = masteryEffectiveness;
  }

  updatePlayerPosition(event) {
    if (!event.x || !event.y) {
      return;
    }
    this.verifyPlayerPositionUpdate(event, this.lastPlayerPositionUpdate, 'player');
    this.lastPlayerPositionUpdate = event;
  }
  verifyPlayerPositionUpdate(event, lastPositionUpdate, forWho) {
    if (!event.x || !event.y || !lastPositionUpdate) {
      return;
    }
    const distance = this.constructor.calculateDistance(lastPositionUpdate.x, lastPositionUpdate.y, event.x, event.y);
    const timeSince = event.timestamp - lastPositionUpdate.timestamp;
    const maxDistance = Math.max(1, timeSince / 1000 * 10 * 1.5); // 10 yards per second + 50% margin of error
    if (distance > maxDistance) {
      debug && console.warn(forWho, `distance since previous event (${Math.round(timeSince / 100) / 10}s ago) was ${Math.round(distance * 10) / 10} yards:`, event.type, event, lastPositionUpdate.type, lastPositionUpdate);
    }
  }

  getPlayerDistance(event) {
    return this.constructor.calculateDistance(this.lastPlayerPositionUpdate.x, this.lastPlayerPositionUpdate.y, event.x, event.y);
  }
  static calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) / 100;
  }
  static calculateMasteryEffectiveness(distance, isRuleOfLawActive) {
    // https://docs.google.com/spreadsheets/d/1kcIuIYgn61tZoAM6nS_vzGllOuIuMxBZXunDodBTvC0/edit?usp=sharing
    const fullEffectivenessRadius = isRuleOfLawActive ? 15 : 10;
    const falloffRadius = isRuleOfLawActive ? 60 : 40;

    return Math.min(1, Math.max(0, 1 - (distance - fullEffectivenessRadius) / (falloffRadius - fullEffectivenessRadius)));
  }

  get report() {
    let totalHealingWithMasteryAffectedAbilities = 0;
    let totalActualMasteryHealingDone = 0;
    let totalMaxPotentialMasteryGain = 0;

    const statsByTargetId = this.masteryHealEvents.reduce((obj, event) => {
      // Update the fight-totals
      totalHealingWithMasteryAffectedAbilities += event.amount;
      totalActualMasteryHealingDone += event.actualMasteryHealingDone;
      totalMaxPotentialMasteryGain += event.maxPotentialMasteryGain;

      // Update the player-totals
      if (!obj[event.targetID]) {
        const combatant = this.combatants.players[event.targetID];
        obj[event.targetID] = {
          combatant,
          healingReceived: 0,
          healingFromMastery: 0,
          maxPotentialHealingFromMastery: 0,
        };
      }
      const playerStats = obj[event.targetID];
      playerStats.healingReceived += event.amount;
      playerStats.healingFromMastery += event.actualMasteryHealingDone;
      playerStats.maxPotentialHealingFromMastery += event.maxPotentialMasteryGain;

      return obj;
    }, {});

    return {
      statsByTargetId,
      totalHealingWithMasteryAffectedAbilities,
      totalActualMasteryHealingDone,
      totalMaxPotentialMasteryGain,
    };
  }

  get overallMasteryEffectiveness() {
    return this.report.totalActualMasteryHealingDone / (this.report.totalMaxPotentialMasteryGain || 1);
  }

  statistic() {
    // is raw unadjusted mastery effectiveness (each cast is equal, even if it's a tiny heal or fully overhealed)
    console.log('raw', this.rawMasteryEffectivenessAverage);
    // heal size adjusted (e.g. a big heal's mastery effectiveness outweights a small heal's) and capped by remaining health missing (so if 1 more mastery lead to overhealing, it wouldn't count)
    console.log('scaling (health capped)', this.scaledMasteryEffectivenessAverage);
    console.log('total mastery healing done', this.owner.formatItemHealingDone(this.totalMasteryHealingDone));
    // TODO: Should overallMasteryEffectiveness account for overhealing? It would probably be cleaner
    return (
      <Statistic position={STATISTIC_ORDER.CORE(10)}>
        <div className="pad" style={{ position: 'relative' }}>
          <label><Trans>Mastery effectiveness</Trans></label>
          <div className="value">
            {formatPercentage(this.overallMasteryEffectiveness, 0)}%
          </div>

          <div
            style={{
              position: 'absolute',
              top: 12,
              right: 0,
              textAlign: 'center',
            }}
          >
            <Radar
              distance={this.distanceSum / this.distanceCount}
              style={{
                display: 'inline-block',
              }}
              playerColor="#f58cba" // Paladin color
            />
            <div style={{ opacity: 0.5, lineHeight: 1, marginTop: -4, fontSize: 13 }}>Average distance</div>
          </div>
        </div>
      </Statistic>
    );
  }

  get suggestionThresholds() {
    return {
      actual: this.overallMasteryEffectiveness,
      isLessThan: {
        minor: 0.75,
        average: 0.7,
        major: 0.6,
      },
      style: 'percentage',
    };
  }
  suggestions(when) {
    when(this.suggestionThresholds).addSuggestion((suggest, actual, recommended) => {
      return suggest(<Trans>Your Mastery Effectiveness can be improved. Try to improve your positioning, usually by sticking with melee.</Trans>)
        .icon('inv_hammer_04')
        .actual(i18n._(t`${formatPercentage(actual)}% mastery effectiveness`))
        .recommended(i18n._(t`>${formatPercentage(recommended)}% is recommended`));
    });
  }

  tab() {
    return {
      title: i18n._(t`Mastery effectiveness`),
      url: 'mastery-effectiveness',
      render: () => (
        <PlayerBreakdownTab
          report={this.report}
          playersById={this.owner.playersById}
        />
      ),
    };
  }
}

export default MasteryEffectiveness;
