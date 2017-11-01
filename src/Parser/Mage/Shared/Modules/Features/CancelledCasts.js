import React from 'react';

import CoreCancelledCasts from 'Parser/Core/Modules/CancelledCasts';

import SPELLS from 'common/SPELLS';
import { formatPercentage } from 'common/format';
import { STATISTIC_ORDER } from 'Main/StatisticBox';

class CancelledCasts extends CoreCancelledCasts {
  static IGNORED_ABILITIES = [
    //Include the spells that you do not want to be tracked and spells that are castable while casting (Like Fire Blast, Combustion, or Shimmer)
    SPELLS.FIRE_BLAST.id,
    SPELLS.COMBUSTION.id,
    SPELLS.SHIMMER_TALENT.id,
  ];

  suggestions(when) {
    const cancelledPercentage = this.castsCancelled / this.totalCasts;

    when(cancelledPercentage).isGreaterThan(0.05)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<span>You cancelled {formatPercentage(cancelledPercentage)}% of your spells. While it is expected that you will have to cancel a few casts to react to a boss mechanic or to move, you should try to ensure that you are cancelling as few casts as possible.</span>)
          .icon('inv_misc_map_01')
          .actual(`${formatPercentage(actual)}% casts cancelled`)
          .recommended(`<${formatPercentage(recommended)}% is recommended`)
          .regular(.1).major(recommended + 0.2);
      });
  }

  statisticOrder = STATISTIC_ORDER.CORE(1);
}

export default CancelledCasts;
