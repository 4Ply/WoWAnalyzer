import React from 'react';

import SPELLS from 'common/SPELLS';
import ITEMS from 'common/ITEMS';
import SpellLink from 'common/SpellLink';
import Analyzer from 'Parser/Core/Analyzer';
import ItemDamageDone from 'Main/ItemDamageDone';

import CHI_SPENDERS from '../../Constants';

class TheEmperorsCapacitor extends Analyzer {
  totalStacks = 0;
  currentStacks = 0;
  stacksUsed = 0;
  stacksWasted = 0;
  cjlCasts = 0;
  averageStacksUsed = 0;
  damage = 0;
  chiSpenders = CHI_SPENDERS;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasChest(ITEMS.THE_EMPERORS_CAPACITOR.id);
  }

  on_byPlayer_applybuff(event) {
    const spellId = event.ability.guid;
    // First stack of the buff
    if (SPELLS.THE_EMPERORS_CAPACITOR_STACK.id === spellId) {
      this.totalStacks += 1;
      this.currentStacks += 1;
    }
  }

  on_byPlayer_applybuffstack(event) {
    const spellId = event.ability.guid;
    // You can only ever apply 1 stack at a time
    if (SPELLS.THE_EMPERORS_CAPACITOR_STACK.id === spellId) {
      this.totalStacks += 1;
      this.currentStacks += 1;
    }
  }

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;
    if (this.chiSpenders.includes(spellId) && this.currentStacks === 20) {
      this.stacksWasted += 1;
    }

    if (SPELLS.CRACKLING_JADE_LIGHTNING.id === spellId) {
      this.stacksUsed += this.currentStacks;
      this.currentStacks = 0;
      this.cjlCasts += 1;
      this.averageStacksUsed = this.stacksUsed / this.cjlCasts;
    }
  }

  on_byPlayer_damage(event) {
    const spellId = event.ability.guid;

    if (spellId === SPELLS.CRACKLING_JADE_LIGHTNING.id) {
      this.damage += event.amount + (event.absorbed || 0);
    }
  }

  on_byPlayerPet_damage(event) {
    const spellId = event.ability.guid;
    if (spellId === SPELLS.CRACKLING_JADE_LIGHTNING.id) {
      this.damage += event.amount + (event.absorbed || 0);
    }
  }

  item() {
    return {
      item: ITEMS.THE_EMPERORS_CAPACITOR,
      result: (
        <dfn data-tip={`Damage dealt does not account for opportunity cost.<br/> Stacks generated ${this.totalStacks}
        <br/>Stacks consumed: ${this.stacksUsed}<br/> Stacks wasted by generating at cap: ${this.stacksWasted}<br/> Average stacks spent on each cast: ${this.averageStacksUsed.toFixed(2)}`}>
          <ItemDamageDone amount={this.damage} />
        </dfn>
      ),
    };
  }

  get wastedStacksSuggestionThresholds() {
    return {
      actual: this.stacksWasted / this.totalStacks,
      isGreaterThan: {
        minor: 5,
        average: 10,
        major: 15,
      },
      style: 'percentage',
    };
  }

  get averageStacksSuggestionThresholds() {
    return {
      actual: this.averageStacksUsed,
      isLessThan: {
        minor: 18,
        average: 16,
        major: 14,
      },
      style: 'decimal',
    };
  }

  suggestions(when) {
    when(this.wastedStacksSuggestionThresholds).addSuggestion((suggest, actual, recommended) => {
      return suggest(<span> You wasted your <SpellLink id={SPELLS.THE_EMPERORS_CAPACITOR_STACK.id} /> stacks by using chi spenders while at 20 stacks </span>)
        .icon(ITEMS.THE_EMPERORS_CAPACITOR.icon)
        .actual(`You wasted ${this.stacksWasted}% of your stacks`)
        .recommended(`<${(recommended)}% is recommended`);
    });
    when(this.averageStacksSuggestionThresholds).addSuggestion((suggest, actual, recommended) => {
      return suggest(<span> Your average number of <SpellLink id={SPELLS.THE_EMPERORS_CAPACITOR_STACK.id} /> stacks used when you cast <SpellLink id={SPELLS.CRACKLING_JADE_LIGHTNING.id} /> was low </span>)
        .icon(ITEMS.THE_EMPERORS_CAPACITOR.icon)
        .actual(`${this.averageStacksUsed.toFixed(2)} average stacks used`)
        .recommended(`Try to cast Crackling Jade Lightning while as close to 20 stacks as possible`);
    });
  }
}

export default TheEmperorsCapacitor;
