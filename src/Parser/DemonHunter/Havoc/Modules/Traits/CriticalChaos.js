import React from 'react';

import SPELLS from 'common/SPELLS';

import SpellLink from 'common/SpellLink';
import { formatPercentage } from 'common/format';

import Combatants from 'Parser/Core/Modules/Combatants';
import Analyzer from 'Parser/Core/Analyzer';
import HIT_TYPES from 'Parser/Core/HIT_TYPES';
import CritEffectBonus from 'Parser/Core/Modules/Helpers/CritEffectBonus';


const CRITICAL_CHAOS_INCREASE = 0.06;

const CRITICAL_CHAOS_SPELLS = [
	SPELLS.CHAOS_STRIKE_MH_DAMAGE.id,
	SPELLS.CHAOS_STRIKE_OH_DAMAGE.id,
	SPELLS.ANNIHILATION_MH_DAMAGE.id,
	SPELLS.ANNIHILATION_OH_DAMAGE.id,
];
/*
* Critical Chaos (Artifact Trait)
* Increases critical strike damage dealt by Chaos Strike by 6%.
*/

class CrticalChaos extends Analyzer {
	static dependencies = {
		combatants: Combatants,
		critEffectBonus: CritEffectBonus,
	}

	rank = 0;
	damage = 0;
  chaosStrikeCrit = false;

	constructor(...args) {
    super(...args);
 		this.rank = this.combatants.selected.traitsBySpellId[SPELLS.CRITICAL_CHAOS.id];
 		this.active = this.rank > 0;

 		if (this.active) {
      this.critEffectBonus.hook(this.getCritEffectBonus.bind(this));
    }
 	}

 	getCritEffectBonus(critEffectModifier, event) {
 		const spellId = event.ability.guid;
    if (CRITICAL_CHAOS_SPELLS.includes(spellId)) {
      critEffectModifier += this.rank * CRITICAL_CHAOS_INCREASE;
    }
    return critEffectModifier;
  }

  getDamageContributon(event) {
    const raw = (event.amount || 0) + (event.absorbed || 0);
    const rawNormalPart = raw / this.critEffectBonus.getBonus(event);
    const rawCritDamage = rawNormalPart * CRITICAL_CHAOS_INCREASE;
    return rawCritDamage;
  }

  on_byPlayer_damage(event) {
  	const spellId = event.ability.guid;
    //Chaos Cleave Attribution
    if(this.combatants.selected.hasTalent(SPELLS.CHAOS_CLEAVE_TALENT.id) && 
      spellId === SPELLS.CHAOS_CLEAVE_DAMAGE.id && 
      this.chaosStrikeCrit)
    {
      this.damage += this.getDamageContributon(event);
    }

  	if (!CRITICAL_CHAOS_SPELLS.includes(spellId) || (event.hitType !== HIT_TYPES.CRIT && event.hitType !== HIT_TYPES.BLOCKED_CRIT)) {
      this.chaosStrikeCrit = false;
  		return;
  	}
    this.chaosStrikeCrit = true;
  	this.damage += this.getDamageContributon(event);
  }

  subStatistic() {
    return (
      <div className="flex">
        <div className="flex-main">
          <SpellLink id={SPELLS.CRITICAL_CHAOS.id} />
        </div>
        <div className="flex-sub text-right">
 					{formatPercentage(this.owner.getPercentageOfTotalDamageDone(this.damage))} %
        </div>
      </div>
    );
  }
}

export default CrticalChaos;
