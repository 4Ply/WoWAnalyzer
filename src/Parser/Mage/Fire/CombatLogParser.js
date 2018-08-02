import CoreCombatLogParser from 'Parser/Core/CombatLogParser';
import DamageDone from 'Parser/Core/Modules/DamageDone';

import FlamestrikeNormalizer from './Normalizers/Flamestrike';
import Scorch from './Normalizers/Scorch';
import KaelthasUltimateAbility from './Normalizers/KaelthasUltimateAbility';
import PyroclasmBuff from './Normalizers/PyroclasmBuff';

import Checklist from './Modules/Features/Checklist';

import AlwaysBeCasting from './Modules/Features/AlwaysBeCasting';
import Abilities from './Modules/Features/Abilities';
import CooldownThroughputTracker from './Modules/Features/CooldownThroughputTracker';
import CancelledCasts from '../Shared/Modules/Features/CancelledCasts';

import MirrorImage from '../Shared/Modules/Features/MirrorImage';
import ArcaneIntellect from '../Shared/Modules/Features/ArcaneIntellect';
import RuneOfPower from '../Shared/Modules/Features/RuneOfPower';
import Kindling from './Modules/Features/Kindling';
import HotStreak from './Modules/Features/HotStreak';
import CombustionFirestarter from './Modules/Features/CombustionFirestarter';
import CombustionCharges from './Modules/Features/CombustionCharges';
import CombustionSpellUsage from './Modules/Features/CombustionSpellUsage';
import CombustionMarqueeBindings from './Modules/Features/CombustionMarqueeBindings';
import HeatingUp from './Modules/Features/HeatingUp';
import Pyroclasm from './Modules/Features/Pyroclasm';
import SearingTouch from './Modules/Features/SearingTouch';

import Tier20_4set from './Modules/Items/Tier20_4set';
import ShardOfTheExodar from '../Shared/Modules/Items/ShardOfTheExodar';
import DarcklisDragonfireDiadem from './Modules/Items/DarcklisDragonfireDiadem';
import ContainedInfernalCore from './Modules/Items/ContainedInfernalCore';
import PyrotexIgnitionCloth from './Modules/Items/PyrotexIgnitionCloth';
import MarqueeBindingsOfTheSunKing from './Modules/Items/MarqueeBindingsOfTheSunKing';
import KoralonsBurningTouch from './Modules/Items/KoralonsBurningTouch';

class CombatLogParser extends CoreCombatLogParser {
  static specModules = {
    //Normalizers
    FlameStrikeNormalizer: FlamestrikeNormalizer,
    scorch: Scorch,
    kaelthasUltimateAbility: KaelthasUltimateAbility,
    pyroclasmBuff: PyroclasmBuff,

    //Checklist
    checklist: Checklist,

    // Features
    alwaysBeCasting: AlwaysBeCasting,
    abilities: Abilities,
    cooldownThroughputTracker: CooldownThroughputTracker,
    damageDone: [DamageDone, { showStatistic: true }],
    cancelledCasts: CancelledCasts,
    hotStreak: HotStreak,
    combustionFirestarter: CombustionFirestarter,
    combustionCharges: CombustionCharges,
    combustionSpellUsage: CombustionSpellUsage,
    combustionMarqueeBindings: CombustionMarqueeBindings,
    heatingUp: HeatingUp,
    pyroclasm: Pyroclasm,
    searingTouch: SearingTouch,

    // Talents
    mirrorImage: MirrorImage,
    arcaneIntellect: ArcaneIntellect,
    runeOfPower: [RuneOfPower, { showStatistic: false, showSuggestion: false }],
    kindling: Kindling,

	  //Items
	  tier20_4set: Tier20_4set,
    shardOfTheExodar: ShardOfTheExodar,
    darcklisDragonfireDiadem: DarcklisDragonfireDiadem,
    containedInfernalCore: ContainedInfernalCore,
    pyrotexIgnitionCloth: PyrotexIgnitionCloth,
    marqueeBindingsOfTheSunKing: MarqueeBindingsOfTheSunKing,
    koralonsBurningTouch: KoralonsBurningTouch,

  };
}

export default CombatLogParser;
