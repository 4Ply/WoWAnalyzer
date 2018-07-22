import React from 'react';

import Analyzer from 'Parser/Core/Analyzer';
import Enemies from 'Parser/Core/Modules/Enemies';

import SpellLink from 'common/SpellLink';
import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import { formatPercentage } from 'common/format';
import StatisticBox, { STATISTIC_ORDER } from 'Interface/Others/StatisticBox';

class SunfireUptime extends Analyzer {
  static dependencies = {
    enemies: Enemies,
  };

  get suggestionThresholds() {
    const sunfireUptime = this.enemies.getBuffUptime(SPELLS.SUNFIRE.id) / this.owner.fightDuration;
    return {
      actual: sunfireUptime,
      isLessThan: {
        minor: 0.95,
        average: 0.9,
        major: 0.8,
      },
      style: 'percentage',
    };
  }

  suggestions(when) {
    when(this.suggestionThresholds).addSuggestion((suggest, actual, recommended) => {
      return suggest(<React.Fragment>Your <SpellLink id={SPELLS.SUNFIRE.id} /> uptime can be improved. Try to pay more attention to your Moonfire on the boss.</React.Fragment>)
        .icon(SPELLS.SUNFIRE.icon)
        .actual(`${formatPercentage(actual)}% Sunfire uptime`)
        .recommended(`>${formatPercentage(recommended)}% is recommended`);
    });
  }

  statistic() {
    const sunfireUptime = this.enemies.getBuffUptime(SPELLS.SUNFIRE.id) / this.owner.fightDuration;
    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.SUNFIRE.id} />}
        value={`${formatPercentage(sunfireUptime)} %`}
        label="Sunfire uptime"
      />
    );
  }

  statisticOrder = STATISTIC_ORDER.CORE(7);
}

export default SunfireUptime;
