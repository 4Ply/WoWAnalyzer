import React from 'react';
import Analyzer from 'Parser/Core/Analyzer';
import SPELLS from 'common/SPELLS';
import StatisticBox from 'Main/StatisticBox';
import SpellIcon from 'common/SpellIcon';

/**
 * Your next Sidewinders, Arcane Shot or Multi-Shot will apply Hunter's Mark.
 * Hunter's Mark activates Marked Shot.
 *
 * Note: Trueshot causes Sidewinders, Arcane Shot and Multi-Shot to always apply Hunter's Mark.
 */

const MS_BUFFER = 500;

const MARKING_TARGETS_DURATION = 15000;

const APPLICATORS = [SPELLS.ARCANE_SHOT.id, SPELLS.SIDEWINDERS_TALENT.id, SPELLS.SIDEWINDERS_CAST.id, SPELLS.MULTISHOT.id];

class MarkingTargets extends Analyzer {
  overwrittenProcs = 0;
  _totalPossible = 0;
  usedProcs = 0;
  huntersMarkActiveCasts = 0;
  specificCast = 0;
  totalHuntersMarkWasted = 0;
  trueshotHuntersMarkWasted = 0;
  lastTrueshotRefresh = 0;
  trueshotRefreshCasts = 0;
  expiredBuffs = 0;
  buffApplication = 0;
  buffActiveWhenLeavingTrueshot = 0;
  buffsGainedRightAfterTrueshot = 0;
  timesLeftTrueshotWithMarkingTargets = 0;
  timesEnteredTrueshotWithMarkingTargets = 0;

  wastedApplications = {};

  on_toPlayer_applybuff(event) {
    const spellID = event.ability.guid;
    if (spellID === SPELLS.TRUESHOT.id && this.selectedCombatant.hasBuff(SPELLS.MARKING_TARGETS.id)) {
      this.timesEnteredTrueshotWithMarkingTargets++;
    }
    if (spellID !== SPELLS.MARKING_TARGETS.id || this.selectedCombatant.hasBuff(SPELLS.TRUESHOT.id)) {
      return;
    }
    this.buffApplication = event.timestamp;
    this._totalPossible++;
  }

  on_toPlayer_refreshbuff(event) {
    const spellID = event.ability.guid;
    if (spellID !== SPELLS.MARKING_TARGETS.id || this.selectedCombatant.hasBuff(SPELLS.TRUESHOT.id)) {
      return;
    }
    if (this.buffActiveWhenLeavingTrueshot) {
      this.buffActiveWhenLeavingTrueshot = false;
      this._totalPossible++;
      this.buffsGainedRightAfterTrueshot++;
    }
    this.overwrittenProcs++;
    this._totalPossible++;
    this.buffApplication = event.timestamp;
  }

  on_toPlayer_removebuff(event) {
    const spellID = event.ability.guid;
    if (spellID === SPELLS.TRUESHOT.id && this.selectedCombatant.hasBuff(SPELLS.MARKING_TARGETS.id)) {
      this.buffActiveWhenLeavingTrueshot = true;
      this.timesLeftTrueshotWithMarkingTargets++;
    }
    if (spellID !== SPELLS.MARKING_TARGETS.id || this.selectedCombatant.hasBuff(SPELLS.TRUESHOT.id)) {
      return;
    }
    if (event.timestamp >= this.buffApplication + MARKING_TARGETS_DURATION) {
      this.expiredBuffs++;
    }
    this.buffApplication = null;
  }

  on_byPlayer_cast(event) {
    const spellID = event.ability.guid;
    if (!APPLICATORS.includes(spellID)) {
      return;
    }
    if (!this.selectedCombatant.hasBuff(SPELLS.MARKING_TARGETS.id) || this.selectedCombatant.hasBuff(SPELLS.TRUESHOT.id)) {
      return;
    }
    this.specificCast = event.ability;
    this.usedProcs++;
  }

  on_byPlayer_refreshdebuff(event) {
    const spellID = event.ability.guid;
    if (spellID !== SPELLS.HUNTERS_MARK_DEBUFF.id) {
      return;
    }
    if (this.selectedCombatant.hasBuff(SPELLS.TRUESHOT.id)) {
      this.trueshotHuntersMarkWasted++; //counts any while under the effects of Trueshot
      if (event.timestamp > this.lastTrueshotRefresh + MS_BUFFER) { //counts once per cast to ensure that Sidewinders/Multi Shot hitting several mobs isn't counted more than needed.
        this.trueshotRefreshCasts++;
      }
      this.lastTrueshotRefresh = event.timestamp;
      return;
    }
    //counts all (including AoE) wasted applications (outside of trueshot)
    this.totalHuntersMarkWasted++;
    //counting only once per cast
    if (this.specificCast) {
      this.huntersMarkActiveCasts++;
      this.addWastedApplication(this.specificCast);
      this.specificCast = null;
    }
  }
  addWastedApplication(event) {
    if (!this.wastedApplications[event.guid]) {
      this.wastedApplications[event.guid] = {
        'spellName': event.name,
        'amount': 1,
      };
    } else {
      this.wastedApplications[event.guid].amount += 1;
    }
  }

  on_finished() {
    if (this.buffApplication) {
      this._totalPossible--;
    }
  }

  statistic() {
    const applicators = Object.keys(this.wastedApplications).map(wastedApplication =>
      `<li>
        ${this.wastedApplications[wastedApplication].spellName}: ${this.wastedApplications[wastedApplication].amount} ${this.wastedApplications[wastedApplication].amount > 1 ? `casts` : `cast`}
      </li>`
    ).join(' ');
    const applicatorTooltipText = applicators.length > 0 ? `<ul>  ${applicators} </ul>` : ``;
    return (
      <StatisticBox icon={<SpellIcon id={SPELLS.MARKING_TARGETS.id} />}
        value={(
          <React.Fragment>
            {this.usedProcs + '/' + this._totalPossible}{' '}
            <SpellIcon
              id={SPELLS.MARKING_TARGETS.id}
              style={{
                height: '1.3em',
                marginTop: '-.1em',
              }}
            />{' '}
            {this.huntersMarkActiveCasts}{' '}
            <SpellIcon
              id={SPELLS.HUNTERS_MARK_DEBUFF.id}
              style={{
                height: '1.3em',
                marginTop: '-.1em',
                filter: 'grayscale(50%)',
              }}
            />
          </React.Fragment>
        )}
        label="Marking Targets info"
        tooltip={`This module ignores Trueshot, but if you have any Hunter's Mark wasted during Trueshot, it'll show in the bottom of this tooltip.</br>
        ${this.overwrittenProcs > 0 ? `You had a Marking Targets proc while you already had the buff active ${this.overwrittenProcs} ${this.overwrittenProcs > 1 ? `times` : `time`}.` : ``}
        ${this.buffsGainedRightAfterTrueshot > 0 ? `<ul><li>${this.buffsGainedRightAfterTrueshot} of these were because you had Marking Targets active right after leaving Trueshot.</li></ul>` : ``}
        ${this.expiredBuffs > 0 ? `The Marking Targets buff expired ${this.expiredBuffs} ${this.expiredBuffs > 1 ? `times` : `time`}.` : ``}
        ${this.timesLeftTrueshotWithMarkingTargets + this.timesEnteredTrueshotWithMarkingTargets > 0 ? `</br>` : ``}
        ${this.timesEnteredTrueshotWithMarkingTargets > 0 ? `You entered Trueshot with Marking Targets active ${this.timesEnteredTrueshotWithMarkingTargets} ${this.timesEnteredTrueshotWithMarkingTargets > 1 ? `times` : `time` }. ` : `` }
        ${this.timesLeftTrueshotWithMarkingTargets > 0 ? `You left Trueshot with Marking Targets active ${this.timesLeftTrueshotWithMarkingTargets} ${this.timesLeftTrueshotWithMarkingTargets > 1 ? `times` : `time` }. ` : `` }
        ${this.totalHuntersMarkWasted > 0 ? `<ul><li>You reapplied Hunter's Mark to a target while it was already active on the target ${this.totalHuntersMarkWasted} ${this.totalHuntersMarkWasted > 1 ? `times` : `time`}, distributed over the following casts: </li> ${applicatorTooltipText}</ul>` : ``}
        ${this.trueshotHuntersMarkWasted > 0 ? `The above ignores Trueshot, but during Trueshot you reapplied Hunter's Mark a total of ${this.trueshotHuntersMarkWasted} ${this.trueshotHuntersMarkWasted > 1 ? `times` : `time`} over ${this.trueshotRefreshCasts} ${this.trueshotRefreshCasts > 1 ? `casts` : `cast`}. ` : ``}
        `} />
    );
  }

}

export default MarkingTargets;
