import React from 'react';

import Analyzer from 'Parser/Core/Analyzer';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import resourceSuggest from 'Parser/Core/Modules/ResourceTracker/ResourceSuggest';

import EnergyTracker from '../../../Common/Resources/EnergyTracker';
import EnergyCapTracker from '../../../Common/Resources/EnergyCapTracker';

class Energy extends Analyzer {
  static dependencies = {
    energyTracker: EnergyTracker,
    energyCapTracker: EnergyCapTracker,
  };
  

  get energyThresholds() {
    return {
      actual: (this.energyTracker.wasted+this.energyCapTracker.missedRegen) / (this.energyTracker.generated+this.energyCapTracker.naturalRegen),
      isGreaterThan: {
        minor: 0.033,
        average: 0.066,
        major: 0.1,
      },
      style: 'percentage',
    };
  }
  
  suggestions(when) {
    resourceSuggest(when, this.energyTracker, {
      spell: SPELLS.SYMBOLS_OF_DEATH,
      minor: 0.10,
      avg: 0.20, 
      major: 0.50,
      extraSuggestion: <React.Fragment>Try to spend energy before using <SpellLink id={SPELLS.SYMBOLS_OF_DEATH.id} />, but do not delay it to avoid waste! </React.Fragment>,
    });
      
    resourceSuggest(when, this.energyTracker, {
      spell: SPELLS.RELENTLESS_STRIKES,
      minor: 0.15,
      avg: 0.25, 
      major: 0.40,
      extraSuggestion: <React.Fragment> You are wasting more energy then normal. You may be pooling too much energy or not casting enough spenders. </React.Fragment>,
    });
  }
}

export default Energy;
