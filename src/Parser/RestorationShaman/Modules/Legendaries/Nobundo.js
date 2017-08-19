import ITEMS from 'common/ITEMS';
import SPELLS from 'common/SPELLS';

import Module from 'Parser/Core/Module';

const LEGENDARY_NOBUNDO_BUFF = 208764;
const LEGENDARY_NOBUNDO_BUFF_EXPIRATION_BUFFER = 50; // the buff expiration can occur several MS before the heal event is logged, this is the buffer time that an IoL charge may have dropped during which it will still be considered active.

class Nobundo extends Module {

  discounts = 0;

  on_initialized() {
    if (!this.owner.error) {
      this.active = this.owner.selectedCombatant.hasWrists(ITEMS.NOBUNDOS_REDEMPTION.id);
    }
  }

  on_byPlayer_heal(event) {
    const spellId = event.ability.guid;

        if (!(spellId === SPELLS.HEALING_SURGE_RESTORATION.id)) {
        return;
    }

    const buff = this.owner.selectedCombatant.getBuff(LEGENDARY_NOBUNDO_BUFF, event.timestamp, LEGENDARY_NOBUNDO_BUFF_EXPIRATION_BUFFER);

    if (buff) {
        this.discounts += 1;
    }

  }

}

export default Nobundo;
