import React from 'react';

import SPELLS from 'common/SPELLS';

import CoreCooldownThroughputTracker, { BUILT_IN_SUMMARY_TYPES } from 'Parser/Core/Modules/CooldownThroughputTracker';

import Tab from 'Interface/Others/Tab';
import CooldownOverview from 'Interface/Others/CooldownOverview';

class ProcTracker extends CoreCooldownThroughputTracker {
  static cooldownSpells = [
    {
      spell: SPELLS.ASCENDANCE_TALENT_ENHANCEMENT,
      summary: [
        BUILT_IN_SUMMARY_TYPES.DAMAGE,
      ],
    },
  ];

  tab() {
    return {
      title: 'Procs',
      url: 'procs',
      render: () => (
        <Tab>
          <CooldownOverview
            fightStart={this.owner.fight.start_time}
            fightEnd={this.owner.fight.end_time}
            cooldowns={this.pastCooldowns}
          />
        </Tab>
      ),
    };
  }
}

export default ProcTracker;
