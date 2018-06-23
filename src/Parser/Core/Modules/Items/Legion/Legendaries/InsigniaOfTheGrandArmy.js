import Analyzer from 'Parser/Core/Analyzer';
import Combatants from 'Parser/Core/Modules/Combatants';
import ITEMS from 'common/ITEMS/OTHERS';


/*
 * Insignia of the Grand Army
 * Equip: Increase the effects of Light and Shadow powers granted by the Netherlight Crucible by 50%.
*/

class InsigniaOfTheGrandArmy extends Analyzer {
  static dependencies = {
    combatants: Combatants,
  };

  constructor(...args) {
    super(...args);
    this.active = this.combatants.selected.hasFinger(ITEMS.INSIGNIA_OF_THE_GRAND_ARMY.id);
  }

  item() {
      return {
        item: ITEMS.INSIGNIA_OF_THE_GRAND_ARMY,
        result: `This used to buff your NLC Traits, which are now inactive.`,
      };
  }
}

export default InsigniaOfTheGrandArmy;
