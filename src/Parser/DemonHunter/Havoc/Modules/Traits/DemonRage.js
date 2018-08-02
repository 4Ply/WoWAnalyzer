import React from 'react';

import Analyzer from 'Parser/Core/Analyzer';

import SPELLS from 'common/SPELLS';

import SpellLink from 'common/SpellLink';
import { formatPercentage } from 'common/format';
import calculateEffectiveDamageStacked from 'Parser/Core/calculateEffectiveDamageStacked';

const DEMON_RAGE_INCREASE = 0.06;

const DEMON_RAGE_SPELLS = [
  SPELLS.DEMONS_BITE.id,
  SPELLS.DEMON_BLADES_FURY.id,
];

/*
* Demon Rage (Artifact Trait)
* Increases damage dealt by Demons Bite/Demon Blades by 6%
*/

class DemonRage extends Analyzer {
  rank = 0;
  damage = 0;

  constructor(...args) {
    super(...args);
    this.rank = this.selectedCombatant.traitsBySpellId[SPELLS.DEMON_RAGE.id];
    this.active = this.rank > 0;
  }

  on_byPlayer_damage(event) {
 		if(!DEMON_RAGE_SPELLS.includes(event.ability.guid)){
 			return;
 		}

 		this.damage += calculateEffectiveDamageStacked(event, DEMON_RAGE_INCREASE, this.rank);
 	}

 	subStatistic() {
 		return (
 			<div className="flex">
 				<div className="flex-main">
 					<SpellLink id={SPELLS.DEMON_RAGE.id} />
 				</div>
 				<div className="flex-sub text-right">
 					{formatPercentage(this.owner.getPercentageOfTotalDamageDone(this.damage))} %
 				</div>
 			</div>
 		);
 	}
}

export default DemonRage;
