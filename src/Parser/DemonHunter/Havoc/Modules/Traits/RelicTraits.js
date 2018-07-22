import React from 'react';

import StatisticsListBox, { STATISTIC_ORDER } from 'Interface/Others/StatisticsListBox';

import Analyzer from 'Parser/Core/Analyzer';

import CriticalChaos from './CriticalChaos';
import ChaosVision from './ChaosVision';
import SharpenedGlaives from './SharpenedGlaives';
import DemonRage from './DemonRage';

class RelicTraits extends Analyzer {
	static dependencies = {
		criticalChaos: CriticalChaos,
		chaosVision: ChaosVision,
		sharpenedGlaives: SharpenedGlaives,
		demonRage: DemonRage,
	};

	statistic() {
		return (
			<StatisticsListBox
  title="Relic traits"
  tooltip="This only calculates the value of the last point of each relic trait; for you with your gear and only during this fight."
  style={{ minHeight: 186 }}
			>
				{this.criticalChaos.subStatistic()}
				{this.chaosVision.subStatistic()}
				{this.sharpenedGlaives.subStatistic()}
				{this.demonRage.subStatistic()}

			</StatisticsListBox>
		);
	}
	statisticOrder = STATISTIC_ORDER.OPTIONAL(0);
}

export default RelicTraits;
