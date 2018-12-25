import React from 'react';

import Panel from 'interface/others/Panel';
import Analyzer from 'parser/core/Analyzer';
import HealingValue from 'parser/shared/modules/HealingValue';
import HealingDone from 'parser/shared/modules/throughput/HealingDone';

import BeaconHealSource from './BeaconHealSource';
import BeaconHealingBreakdown from './BeaconHealingBreakdown';

class BeaconHealingDone extends Analyzer {
  static dependencies = {
    beaconHealSource: BeaconHealSource, // for the events
    healingDone: HealingDone,
  };

  _totalBeaconHealing = new HealingValue();
  _beaconHealingBySource = {};

  on_beacontransfer(event) {
    this._totalBeaconHealing = this._totalBeaconHealing.add(event.amount, event.absorbed, event.overheal);

    const source = event.originalHeal;
    const spellId = source.ability.guid;
    let sourceHealing = this._beaconHealingBySource[spellId];
    if (!sourceHealing) {
      sourceHealing = this._beaconHealingBySource[spellId] = {
        ability: source.ability,
        healing: new HealingValue(),
      };
    }
    sourceHealing.healing = sourceHealing.healing.add(event.amount, event.absorbed, event.overheal);
  }

  tab() {
    return {
      title: 'Beacons',
      url: 'beacons',
      render: () => (
        <Panel
          title="Beacon healing sources"
          explanation={(
            <>
              Beacon healing is triggered by the <b>raw</b> healing done of your primary spells. This breakdown shows the amount of effective beacon healing replicated by each beacon transfering heal.
            </>
          )}
        >
          <BeaconHealingBreakdown
            totalHealingDone={this.healingDone.total}
            totalBeaconHealing={this._totalBeaconHealing}
            beaconHealingBySource={this._beaconHealingBySource}
            fightDuration={this.owner.fightDuration}
          />
        </Panel>
      ),
    };
  }
}

export default BeaconHealingDone;
