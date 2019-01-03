import React from 'react';

import SPELLS from 'common/SPELLS';
import ITEMS from 'common/ITEMS';
import { calculateSecondaryStatDefault } from 'common/stats';
import { formatPercentage, formatNumber } from 'common/format';
import Tooltip from 'common/Tooltip';
import Analyzer from 'parser/core/Analyzer';

/**
 * Construct Overcharger -
 * Equip: Your attacks have a chance to increase your Haste by X for 10 sec, stacking up to 8 times.
 */

class ConstructOvercharger extends Analyzer {
  statBuff = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTrinket(ITEMS.CONSTRUCT_OVERCHARGER.id);
    if (this.active) {
      this.statBuff = calculateSecondaryStatDefault(385, 60, this.selectedCombatant.getItem(ITEMS.CONSTRUCT_OVERCHARGER.id).itemLevel);
    }
  }

  averageStatGain() {
    const averageStacks = this.selectedCombatant.getStackWeightedBuffUptime(SPELLS.TITANIC_OVERCHARGE.id) / this.owner.fightDuration;
    return averageStacks * this.statBuff;
  }

  totalBuffUptime() {
    return this.selectedCombatant.getBuffUptime(SPELLS.TITANIC_OVERCHARGE.id) / this.owner.fightDuration;
  }

  buffTriggerCount() {
    return this.selectedCombatant.getBuffTriggerCount(SPELLS.TITANIC_OVERCHARGE.id);
  }

  item() {
    return {
      item: ITEMS.CONSTRUCT_OVERCHARGER,
      result: (
        <Tooltip wrapperStyles={{ display: 'inline' }} content={`Procced ${this.buffTriggerCount()} times.`}>
          {formatPercentage(this.totalBuffUptime())}% uptime.<br />
          {formatNumber(this.averageStatGain())} average Haste.
        </Tooltip>
      ),
    };
  }
}

export default ConstructOvercharger;
