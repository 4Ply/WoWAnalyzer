import React from 'react';

import Tab from 'Main/Tab';
import Mana from 'Main/Mana';
import Feeding from 'Main/Feeding';

import CoreCombatLogParser from 'Parser/Core/CombatLogParser';
import LowHealthHealing from 'Parser/Core/Modules/Features/LowHealthHealing';
import Abilities from './Modules/Abilities';

import HealingDone from './Modules/ShamanCore/HealingDone';
import ShamanAbilityTracker from './Modules/ShamanCore/ShamanAbilityTracker';
import HealingRainLocation from './Modules/ShamanCore/HealingRainLocation';

import MasteryEffectiveness from './Modules/Features/MasteryEffectiveness';
import AlwaysBeCasting from './Modules/Features/AlwaysBeCasting';
import CooldownThroughputTracker from './Modules/Features/CooldownThroughputTracker';
import Checklist from './Modules/Features/Checklist/Module';
import SpellUsable from './Modules/Features/SpellUsable';
import StatValues from './Modules/Features/StatValues';

import AncestralVigor from './Modules/Features/AncestralVigor';
import TidalWaves from './Modules/Features/TidalWaves';
import CastBehavior from './Modules/Features/CastBehavior';
// Talents
import TalentStatisticBox from './Modules/Talents/TalentStatisticBox';
import Torrent from './Modules/Talents/Torrent';
import UnleashLife from './Modules/Talents/UnleashLife';
import Deluge from './Modules/Talents/Deluge';
import Undulation from './Modules/Talents/Undulation';
import FlashFlood from './Modules/Talents/FlashFlood';
import EarthShield from './Modules/Talents/EarthShield';
import EarthenWallTotem from './Modules/Talents/EarthenWallTotem';
import Downpour from './Modules/Talents/Downpour';
import CloudburstTotem from './Modules/Talents/CloudburstTotem';
import Ascendance from './Modules/Talents/Ascendance';
import Wellspring from './Modules/Talents/Wellspring';
import HighTide from './Modules/Talents/HighTide';
import NaturesGuardian from './Modules/Talents/NaturesGuardian';
// Items
import Restoration_Shaman_T21_2Set from './Modules/Items/T21_2Set';
import Restoration_Shaman_T21_4Set from './Modules/Items/T21_4Set';
import Nazjatar from './Modules/Items/Nazjatar';
import UncertainReminder from './Modules/Items/UncertainReminder';
import Jonat from './Modules/Items/Jonat';
import Nobundo from './Modules/Items/Nobundo';
import Tidecallers from './Modules/Items/Tidecallers';
import Roots from './Modules/Items/Roots';
import VelensFutureSight from './Modules/Items/VelensFutureSight';
import ElementalRebalancers from './Modules/Items/ElementalRebalancers';
// Spells
import ChainHeal from './Modules/Spells/ChainHeal';
import HealingSurge from './Modules/Spells/HealingSurge';
import HealingRain from './Modules/Spells/HealingRain';
import HealingWave from './Modules/Spells/HealingWave';
import LavaSurge from './Modules/Spells/LavaSurge';
import Resurgence from './Modules/Spells/Resurgence';
// Shared
import StaticCharge from '../Shared/Talents/StaticCharge';

import CloudburstNormalizer from './Normalizers/CloudburstNormalizer';

import { ABILITIES_AFFECTED_BY_HEALING_INCREASES } from './Constants';

class CombatLogParser extends CoreCombatLogParser {
  static abilitiesAffectedByHealingIncreases = ABILITIES_AFFECTED_BY_HEALING_INCREASES;

  static specModules = {
    // Override the ability tracker so we also get stats for Tidal Waves and beacon healing
    abilityTracker: ShamanAbilityTracker,
    lowHealthHealing: LowHealthHealing,
    healingDone: [HealingDone, { showStatistic: true }],
    abilities: Abilities,
    healingRainLocation: HealingRainLocation,

    // Features
    alwaysBeCasting: AlwaysBeCasting,
    masteryEffectiveness: MasteryEffectiveness,
    cooldownThroughputTracker: CooldownThroughputTracker,
    ancestralVigor: AncestralVigor,
    tidalWaves: TidalWaves,
    castBehavior: CastBehavior,
    checklist: Checklist,
    spellUsable: SpellUsable,
    statValues: StatValues,

    // Talents:
    talentStatisticBox: TalentStatisticBox,
    torrent: Torrent,
    unleashLife: UnleashLife,
    undulation: Undulation,
    deluge: Deluge,
    flashFlood: FlashFlood,
    earthShield: EarthShield,
    earthenWallTotem: EarthenWallTotem,
    downpour: Downpour,
    cloudburstTotem: CloudburstTotem,
    ascendance: Ascendance,
    wellspring: Wellspring,
    highTide: HighTide,
    naturesGuardian: NaturesGuardian,

    // Items:
    t21_2Set: Restoration_Shaman_T21_2Set,
    t21_4Set: Restoration_Shaman_T21_4Set,
    nobundo: Nobundo,
    nazjatar: Nazjatar,
    uncertainReminder: UncertainReminder,
    jonat: Jonat,
    tidecallers: Tidecallers,
    roots: Roots,
    velensFutureSight: VelensFutureSight,
    elementalRebalancers: ElementalRebalancers,

    // Spells:
    chainHeal: ChainHeal,
    healingSurge: HealingSurge,
    healingRain: HealingRain,
    healingWave: HealingWave,
    lavaSurge: LavaSurge,
    resurgence: Resurgence,

    // Shared:
    staticCharge: StaticCharge,

    // Normalizers:
    cloudburstNormalizer: CloudburstNormalizer,
  };

  generateResults(...args) {
    const results = super.generateResults(...args);

    results.tabs = [
      ...results.tabs,
      {
        title: 'Mana',
        url: 'mana',
        render: () => (
          <Tab style={{ padding: '15px 22px' }}>
            <Mana parser={this} />
          </Tab>
        ),
      },
      {
        title: 'Feeding',
        url: 'feeding',
        render: () => (
          <Tab style={{ padding: 0 }}>
            <Feeding
              cooldownThroughputTracker={this._modules.cooldownThroughputTracker}
            />
          </Tab>
        ),
      },
    ];

    return results;
  }
}

export default CombatLogParser;
