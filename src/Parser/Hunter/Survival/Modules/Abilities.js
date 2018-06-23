import React from 'react';

import SPELLS from 'common/SPELLS';
import ITEMS from 'common/ITEMS';
import CoreAbilities from 'Parser/Core/Modules/Abilities';
import SpellLink from 'common/SpellLink';
import ItemLink from 'common/ItemLink';

class Abilities extends CoreAbilities {
  spellbook() {
    const combatant = this.selectedCombatant;
    return [
      {
        spell: SPELLS.MONGOOSE_BITE,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: true,
        /* -- Commenting out the cooldown of this spell since there is no current way of tracking the resets on it properly
        cooldown: haste => 12 / (1 + haste),
        charges: 3,
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.95,
        },*/
      },
      {
        spell: SPELLS.FLANKING_STRIKE,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: true,
        cooldown: haste => 6 / (1 + haste),
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: .85,
          extraSuggestion: <React.Fragment> While <SpellLink id={SPELLS.FLANKING_STRIKE.id} /> is a very important spell to be casting as often as possible because of its damage, you want to be casting it at opportune moments because of its resetting <SpellLink id={SPELLS.MONGOOSE_BITE.id} /> functionality. This means you should cast it <strong>BEFORE</strong> you run out of charges on <SpellLink id={SPELLS.MONGOOSE_BITE.id} />, but also not while at 2 or 3 charges of <SpellLink id={SPELLS.MONGOOSE_BITE.id} />.</React.Fragment>,
        },
      },
      {
        spell: SPELLS.CARVE,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL_AOE,
        gcd: true,
        enabled: !combatant.hasTalent(SPELLS.BUTCHERY_TALENT.id),
      },
      {
        spell: SPELLS.FURY_OF_THE_EAGLE_TRAIT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: true,
        cooldown: 45,
      },
      {
        spell: SPELLS.EXPLOSIVE_TRAP_CAST,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: true,
        cooldown: combatant.traitsBySpellId[SPELLS.HUNTERS_GUILE_TRAIT.id] ? 30 * 0.8 : 30,
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: .70,
          extraSuggestion: <React.Fragment> Please do note, that because <SpellLink id={SPELLS.EXPLOSIVE_TRAP_CAST.id} /> is meant to be used as a filler spell, you might have bad cast efficiency on it, despite playing correctly because you had a lot of <SpellLink id={SPELLS.MONGOOSE_BITE.id} /> resets, in which case you'd ignore this suggestion. </React.Fragment>,
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
          recommendedEfficiency: .95,
        },
      },
      {
        spell: SPELLS.STEEL_TRAP_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: combatant.traitsBySpellId[SPELLS.HUNTERS_GUILE_TRAIT.id] ? 60 * 0.8 : 60,
        gcd: true,
        enabled: combatant.hasTalent(SPELLS.STEEL_TRAP_TALENT.id),
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.95,
        },
      },
      {
        spell: SPELLS.BUTCHERY_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL_AOE,
        cooldown: haste => 12 / (1 + haste),
        charges: 3,
        gcd: true,
        enabled: combatant.hasTalent(SPELLS.BUTCHERY_TALENT.id),
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.95,
        },
      },
      {
        spell: SPELLS.SPITTING_COBRA_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: 60,
        gcd: true,
        enabled: combatant.hasTalent(SPELLS.SPITTING_COBRA_TALENT.id),
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.9,
          extraSuggestion: <React.Fragment>Although you want to be casting Spitting Cobra as much as possible, you also want to be gaining as much as possible from each cast, and since <SpellLink id={SPELLS.SPITTING_COBRA_TALENT.id} icon /> scales extremely well with haste, it can be worth delaying usage to line it up with a haste buff such as <SpellLink id={SPELLS.HEROISM.id} icon /> or a <ItemLink id={ITEMS.SEPHUZS_SECRET.id} icon /> proc.</React.Fragment>,
        },
      },
      {
        spell: SPELLS.RAPTOR_STRIKE,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: true,
      },
      {
        spell: SPELLS.HATCHET_TOSS,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: true,
      },
      {
        spell: SPELLS.LACERATE,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: true,
      },
      {
        spell: SPELLS.ASPECT_OF_THE_EAGLE,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: () => {
          const hasEmbrace = combatant.traitsBySpellId[SPELLS.EMBRACE_OF_THE_ASPECTS.id];
          const cooldownAfterEmbrace = hasEmbrace ? 120 - (120 * 0.2) : 120;
          const hasCallOfTheWild = combatant.hasWrists(ITEMS.CALL_OF_THE_WILD.id);
          return cooldownAfterEmbrace * (1 - (hasCallOfTheWild ? 0.35 : 0));
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.85,
          extraSuggestion: <React.Fragment>You'll want to use <SpellLink id={SPELLS.ASPECT_OF_THE_EAGLE.id} /> as often as possible, as it's a very powerful cooldown partly due to the <SpellLink id={SPELLS.ASPECT_OF_THE_SKYLORD_TRAIT.id} /> trait. It should be used whenever you run out of <SpellLink id={SPELLS.MONGOOSE_BITE.id} /> stacks in your <SpellLink id={SPELLS.MONGOOSE_FURY.id} /> windows, or there's 10s seconds remaining of <SpellLink id={SPELLS.MONGOOSE_FURY.id} /> to fully utilise the pairing.</React.Fragment>,
        },
        gcd: false,
      },
      {
        spell: SPELLS.ASPECT_OF_THE_CHEETAH,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: () => {
          const hasEmbrace = combatant.traitsBySpellId[SPELLS.EMBRACE_OF_THE_ASPECTS.id];
          const cooldownAfterEmbrace = hasEmbrace ? 180 - (180 * 0.2) : 180;
          const hasCallOfTheWild = combatant.hasWrists(ITEMS.CALL_OF_THE_WILD.id);
          return cooldownAfterEmbrace * (1 - (hasCallOfTheWild ? 0.35 : 0));
        },
        gcd: false,
      },
      {
        spell: SPELLS.ASPECT_OF_THE_TURTLE,
        buffSpellId: SPELLS.ASPECT_OF_THE_TURTLE.id,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        cooldown: () => {
          const hasEmbrace = combatant.traitsBySpellId[SPELLS.EMBRACE_OF_THE_ASPECTS.id];
          const cooldownAfterEmbrace = hasEmbrace ? 180 - (180 * 0.2) : 180;
          const hasCallOfTheWild = combatant.hasWrists(ITEMS.CALL_OF_THE_WILD.id);
          return cooldownAfterEmbrace * (1 - (hasCallOfTheWild ? 0.35 : 0));
        },
        gcd: false,
      },
      {
        spell: SPELLS.EXHILARATION,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        cooldown: 120,
        gcd: false,
      },
      {
        spell: SPELLS.HARPOON,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: true,
        cooldown: 20,
      },
      {
        spell: SPELLS.MUZZLE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 15,
        gcd: false,
      },
      {
        spell: SPELLS.DISENGAGE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 20,
        gcd: false,
      },
      {
        spell: SPELLS.FREEZING_TRAP,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: combatant.traitsBySpellId[SPELLS.HUNTERS_GUILE_TRAIT.id] ? 30 * 0.8 : 30,
        enabled: !combatant.hasTalent(SPELLS.STEEL_TRAP_TALENT.id),
        gcd: true,
      },
      {
        spell: SPELLS.TAR_TRAP,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: combatant.traitsBySpellId[SPELLS.HUNTERS_GUILE_TRAIT.id] ? 30 * 0.8 : 30,
        enabled: !combatant.hasTalent(SPELLS.CALTROPS_TALENT.id),
        gcd: true,
      },
      {
        spell: SPELLS.FLARE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 20,
        gcd: true,
      },
      {
        spell: SPELLS.WING_CLIP,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        enabled: !combatant.hasTalent(SPELLS.RANGERS_NET_TALENT.id),
        gcd: true,
      },
    ];
  }
}

export default Abilities;
