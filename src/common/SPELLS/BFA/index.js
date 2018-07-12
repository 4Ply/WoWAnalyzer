import safeMerge from 'common/safeMerge';
import Dungeons from './Dungeons';
import Raids from './Raids';
import AzeriteTraits from './AzeriteTraits';
import Enchants from './Enchants';
import Potions from './Potions';
import Crafted from './Crafted';

export default safeMerge(Dungeons, Raids, AzeriteTraits, Enchants, Potions, Crafted);
