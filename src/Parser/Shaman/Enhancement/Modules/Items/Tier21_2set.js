import React from 'react';

import Analyzer from 'Parser/Core/Analyzer';
import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import SpellLink from 'common/SpellLink';
import ItemDamageDone from 'Interface/Others/ItemDamageDone';

class Tier21_2set extends Analyzer {
  extraDmg = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasBuff(SPELLS.ENHANCE_SHAMAN_T21_2SET_EQUIP.id);
  }

  on_byPlayer_damage(event) {
    if (this.selectedCombatant.hasBuff(SPELLS.FORCE_OF_THE_MOUNTAIN.id)) {
      if (event.ability.guid === SPELLS.ROCKBITER.id) {
        this.extraDmg += (event.amount + event.absorbed || 0) / 2;
      }
    }
  }

  item() {
    return {
      id: `spell-${SPELLS.FORCE_OF_THE_MOUNTAIN.id}`,
      icon: <SpellIcon id={SPELLS.FORCE_OF_THE_MOUNTAIN.id} />,
      title: <SpellLink id={SPELLS.FORCE_OF_THE_MOUNTAIN.id} icon={false} />,
      result: <ItemDamageDone amount={this.extraDmg} />,
    };
  }
}

export default Tier21_2set;
