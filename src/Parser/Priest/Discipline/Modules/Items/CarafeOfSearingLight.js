import React from 'react';

import ITEMS from 'common/ITEMS';
import SPELLS from 'common/SPELLS/OTHERS';
import CoreCarafeOfSearingLight from 'Parser/Core/Modules/Items/Legion/AntorusTheBurningThrone/CarafeOfSearingLight';
import ItemHealingDone from 'Interface/Others/ItemHealingDone';
import ItemDamageDone from 'Interface/Others/ItemDamageDone';
import ItemManaGained from 'Interface/Others/ItemManaGained';

import isAtonement from '../Core/isAtonement';
import AtonementDamageSource from '../Features/AtonementDamageSource';

class CarafeOfSearingLight extends CoreCarafeOfSearingLight {
  static dependencies = {
    ...CoreCarafeOfSearingLight.dependencies,
    atonementDamageSource: AtonementDamageSource,
  };

  healing = 0;

  on_byPlayer_heal(event) {
    if (!isAtonement(event)) {
      return;
    }
    if (!this.atonementDamageSource.event || this.atonementDamageSource.event.ability.guid !== SPELLS.REFRESHING_AGONY_DOT.id) {
      return;
    }

    this.healing += event.amount + (event.absorbed || 0);
  }

  on_byPlayer_energize(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.REFRESHING_AGONY_MANA.id) {
      return;
    }

    this.manaGained += event.resourceChange;
  }

  item() {
    const damage = this.damage || 0;
    const healing = this.healing || 0;
    const manaGained = this.manaGained || 0;

    return {
      item: ITEMS.CARAFE_OF_SEARING_LIGHT,
      result: (
        <React.Fragment>
          <ItemDamageDone amount={damage} /><br />
          <ItemHealingDone amount={healing} /><br />
          <ItemManaGained amount={manaGained} />
        </React.Fragment>
      ),
    };
  }
}

export default CarafeOfSearingLight;
