import React from 'react';
import Analyzer from 'Parser/Core/Analyzer';
import SPELLS from "common/SPELLS";
import StatisticBox from "Main/StatisticBox";
import SpellIcon from "common/SpellIcon";
import { formatPercentage } from "common/format";
import STATISTIC_ORDER from 'Main/STATISTIC_ORDER';

/**
 * Summons a powerful wild beast to attack your target for 8 sec.
 * Generates 12 Focus over 8 sec.
 */
class DireBeastUptime extends Analyzer {

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.DIRE_BEAST_TALENT.id);
  }

  get percentUptime() {
    //This calculates the uptime over the course of the encounter of Dire Beast
    return this.selectedCombatant.getBuffUptime(SPELLS.DIRE_BEAST_BUFF.id) / this.owner.fightDuration;
  }
  statistic() {
    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.DIRE_BEAST_TALENT.id} />}
        value={`${formatPercentage(this.percentUptime)}%`}
        label="Dire Beast Uptime"
      />
    );
  }
  statisticOrder = STATISTIC_ORDER.CORE(6);

}

export default DireBeastUptime;
