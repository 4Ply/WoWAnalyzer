import React from 'react';

import ITEMS from 'common/ITEMS';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import { formatPercentage } from 'common/format';
import Analyzer from 'Parser/Core/Analyzer';
import Combatants from 'Parser/Core/Modules/Combatants';

/**
 * Celerity of the Windrunners
 * Equip: Windburst grants you 15% Haste for 6 sec.
 */
class CelerityOfTheWindrunners extends Analyzer {
  static dependencies = {
    combatants: Combatants,
  };

  constructor(...args) {
    super(...args);
    this.active = this.combatants.selected.hasBack(ITEMS.CELERITY_OF_THE_WINDRUNNERS.id);
  }

  get buffUptime() {
    return this.combatants.selected.getBuffUptime(SPELLS.CELERITY_OF_THE_WINDRUNNERS_BUFF.id) / this.owner.fightDuration;
  }

  item() {
    return {
      item: ITEMS.CELERITY_OF_THE_WINDRUNNERS,
      result: <React.Fragment>You had {formatPercentage(this.buffUptime)}% uptime on <SpellLink id={SPELLS.CELERITY_OF_THE_WINDRUNNERS_BUFF.id} />.</React.Fragment>,
    };
  }
}

export default CelerityOfTheWindrunners;
