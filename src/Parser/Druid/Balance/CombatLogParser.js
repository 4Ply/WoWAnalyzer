import MainCombatLogParser from 'Parser/Core/CombatLogParser';
import DamageDone from 'Parser/Core/Modules/DamageDone';
import Haste from './Modules/Core/Haste';
import GlobalCooldown from './Modules/Core/GlobalCooldown';

//Features
import Checklist from './Modules/Features/Checklist';
import AlwaysBeCasting from './Modules/Features/AlwaysBeCasting';
import CancelledCasts from './Modules/Features/CancelledCasts';
import Abilities from './Modules/Abilities';
import LunarEmpowerment from './Modules/Features/LunarEmpowerment';
import SolarEmpowerment from './Modules/Features/SolarEmpowerment';
import CooldownThroughputTracker from './Modules/Features/CooldownThroughputTracker';
import MoonfireUptime from './Modules/Features/MoonfireUptime';
import SunfireUptime from './Modules/Features/SunfireUptime';
import UnempoweredLunarStrike from './Modules/Features/UnempoweredLunarStrike';
import EarlyDotRefreshes from './Modules/Features/EarlyDotRefreshes';
import EarlyDotRefreshesInstants from './Modules/Features/EarlyDotRefreshesInstants';

//Talents
import StellarFlareUptime from './Modules/Talents/StellarFlareUptime';
import TwinMoons from './Modules/Talents/TwinMoons';
import StellarDrift from './Modules/Talents/StellarDrift';
import Starlord from './Modules/Talents/Starlord';

//Resources
import AstralPowerDetails from './Modules/ResourceTracker/AstralPowerDetails';
import AstralPowerTracker from './Modules/ResourceTracker/AstralPowerTracker';

//Items
import TheEmeraldDreamcatcher from './Modules/Items/TheEmeraldDreamcatcher';
import ImpeccableFelEssence from './Modules/Items/ImpeccableFelEssence';
import SoulOfTheArchdruid from '../Shared/Modules/Items/SoulOfTheArchdruid';
import LadyAndTheChild from './Modules/Items/LadyAndTheChild';
import OnethsIntuition from './Modules/Items/OnethsIntuition';
import PromiseOfElune from './Modules/Items/PromiseOfElune';
import RadiantMoonlight from './Modules/Items/RadiantMoonlight';
import Tier20_2set from './Modules/Items/Tier20_2set';
import Tier20_4set from './Modules/Items/Tier20_4set';
import Tier21_2set from './Modules/Items/Tier21_2set';
import Tier21_4set from './Modules/Items/Tier21_4set';

class CombatLogParser extends MainCombatLogParser {
  static specModules = {
    damageDone: [DamageDone, { showStatistic: true }],
    haste: Haste,
    globalCooldown: GlobalCooldown,

    //Features
    checklist: Checklist,
    alwaysBeCasting: AlwaysBeCasting,
    cancelledCasts: CancelledCasts,
    abilities: Abilities,
    lunarEmpowerment: LunarEmpowerment,
    solarEmpowerment: SolarEmpowerment,
    cooldownThroughputTracker: CooldownThroughputTracker,
    moonfireUptime: MoonfireUptime,
    sunfireUptime: SunfireUptime,
    unempoweredLunarStrike: UnempoweredLunarStrike,
    earlyDotRefreshes: EarlyDotRefreshes,
    earlyDotRefreshesInstants: EarlyDotRefreshesInstants,

    //Talents
    stellarFlareUptime: StellarFlareUptime,
    twinMoons: TwinMoons,
    stellarDrift: StellarDrift,
    starlord: Starlord,

    //Resources
    astralPowerTracker: AstralPowerTracker,
    astralPowerDetails: AstralPowerDetails,

    //Items
    theEmeraldDreamcatcher: TheEmeraldDreamcatcher,
    impeccableFelEssence : ImpeccableFelEssence,
    soulOfTheArchdruid : SoulOfTheArchdruid,
    ladyAndTheChild : LadyAndTheChild,
    onethsIntuition : OnethsIntuition,
    promiseOfElune : PromiseOfElune,
    radiantMoonlight : RadiantMoonlight,
    tier20_2set : Tier20_2set,
    tier20_4set : Tier20_4set,
    tier21_2set : Tier21_2set,
    tier21_4set : Tier21_4set,
  };
}

export default CombatLogParser;
