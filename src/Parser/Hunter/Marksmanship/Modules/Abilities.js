import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import ITEMS from 'common/ITEMS';
import CoreAbilities from 'Parser/Core/Modules/Abilities';

class Abilities extends CoreAbilities {
  spellbook() {
    const combatant = this.selectedCombatant;
    return [
      {
        spell: SPELLS.AIMED_SHOT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: true,
      },
      {
        spell: SPELLS.ARCANE_SHOT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: true,
      },
      {
        spell: SPELLS.RAPID_FIRE,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: true,
        cooldown: 20,
      },
      {
        spell: SPELLS.STEADY_SHOT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: true,
        cooldown: 20,
      },
      {
        spell: SPELLS.MULTISHOT_MM,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL_AOE,
        gcd: true,
      },
      {
        spell: SPELLS.EXPLOSIVE_SHOT_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: 30,
        gcd: true,
        enabled: combatant.hasTalent(SPELLS.EXPLOSIVE_SHOT_TALENT.id),
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.95,
          extraSuggestion: (
            <React.Fragment>
              <SpellLink id={SPELLS.EXPLOSIVE_SHOT_TALENT.id} /> should be used on cooldown, and you should aim to hit it in the center of the mobs, as that will be where it does the most dmg.
            </React.Fragment>
          ),
        },
      },
      {
        spell: SPELLS.A_MURDER_OF_CROWS_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: 60,
        enabled: combatant.hasTalent(SPELLS.A_MURDER_OF_CROWS_TALENT.id),
        gcd: true,
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.8,
        },
      },
      {
        spell: SPELLS.BARRAGE_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: 20,
        enabled: combatant.hasTalent(SPELLS.BARRAGE_TALENT.id),
        gcd: true,
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.9,
        },
      },
      {
        spell: SPELLS.PIERCING_SHOT_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: 30,
        enabled: combatant.hasTalent(SPELLS.PIERCING_SHOT_TALENT.id),
        gcd: true,
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.9,
        },
      },
      {
        spell: SPELLS.TRUESHOT,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 180,
        gcd: false,
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.95,
        },
      },
      {
        spell: SPELLS.ARCANE_TORRENT_FOCUS,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 90,
        isUndetectable: true,
        gcd: false,
        castEfficiency: {
          suggestion: true,
        },
      },
      {
        spell: SPELLS.EXHILARATION,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        cooldown: 120,
        gcd: false,
      },
      {
        spell: SPELLS.DISENGAGE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 20,
        gcd: false,
      },
      {
        spell: SPELLS.BURSTING_SHOT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 24,
        gcd: true,
      },
      {
        spell: SPELLS.CONCUSSIVE_SHOT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 5,
        gcd: true,
      },
      {
        spell: SPELLS.COUNTER_SHOT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 24,
        gcd: false,
      },
      {
        spell: SPELLS.MISDIRECTION,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 30,
        gcd: false,
      },
      {
        spell: SPELLS.BINDING_SHOT_TALENT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 45,
        gcd: false,

      },
      {
        spell: SPELLS.ASPECT_OF_THE_TURTLE,
        buffSpellId: SPELLS.ASPECT_OF_THE_TURTLE.id,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        cooldown: combatant.hasWrists(ITEMS.CALL_OF_THE_WILD.id) ? 180 - (180 * 0.35) : 180,
        gcd: false,
      },
      {
        spell: SPELLS.ASPECT_OF_THE_CHEETAH,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: combatant.hasWrists(ITEMS.CALL_OF_THE_WILD.id) ? 180 - (180 * 0.35) : 180,
        gcd: false,
      },
      {
        spell: SPELLS.FREEZING_TRAP,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 30,
        gcd: true,
      },
      {
        spell: SPELLS.TAR_TRAP,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 30,
        gcd: true,
      },
      {
        spell: SPELLS.FLARE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 20,
        gcd: true,
      },
    ];
  }
}

export default Abilities;
