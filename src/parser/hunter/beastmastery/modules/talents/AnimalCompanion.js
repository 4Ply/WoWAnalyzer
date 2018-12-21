import React from 'react';
import Analyzer from 'parser/core/Analyzer';
import SPELLS from 'common/SPELLS';
import { formatNumber } from 'common/format';
import TalentStatisticBox from 'interface/others/TalentStatisticBox';

/**
 * Your Call Pet additionally summons the first pet from your stable.
 * This pet will obey your Kill Command, but cannot use pet family abilities.
 *
 * Additionally this talent baseline reduces all pet damage by 40%.
 *
 * Example log: https://www.warcraftlogs.com/reports/aNRJKvknX1FYqQ6G#fight=4&type=damage-done&source=7
 */

class AnimalCompanion extends Analyzer {
  damage = 0;
  pets = [];
  mainPetName = null;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.ANIMAL_COMPANION_TALENT.id);
  }

  on_byPlayerPet_damage(event) {
    const sourcePet = this.owner.playerPets.find(pet => pet.id === event.sourceID);
    const foundPet = this.pets.find(pet => pet.sourceID === event.sourceID);
    const damage = event.amount + (event.absorbed || 0);
    if (!foundPet) {
      this.pets.push({ petName: sourcePet.name, sourceID: event.sourceID, damage: damage });
    } else {
      foundPet.damage += damage;
    }
  }

  on_fightend() {
    let max = 0;
    this.pets.forEach(pet => {
      if (pet.damage > max) {
        max = pet.damage;
        this.mainPetName = pet.petName;
      }
    });
  }

  statistic() {
    const totalDamage = this.pets.map(pet => pet.damage).reduce((total, current) => total + current, 0);
    return (
      <TalentStatisticBox
        talent={SPELLS.ANIMAL_COMPANION_TALENT.id}
        value={<>{formatNumber(totalDamage)} / {formatNumber(totalDamage / (this.owner.fightDuration / 1000))} DPS</>}
<<<<<<< HEAD
        label="Animal Companion"
        category={STATISTIC_CATEGORY.TALENTS}
=======
        tooltip="Without this talent your main pet would have done 66% more damage than it did as Animal Companion nerfs all pet damage by 40% - however if you're using the azerite trait Pack Alpha, your main pet would have done less damage that way."
>>>>>>> Start work on WFI
      >
        <table className="table table-condensed">
          <thead>
            <tr>
              <th>Pet</th>
              <th>Damage</th>
              <th>DPS</th>
              <th>Main pet?</th>
            </tr>
          </thead>
          <tbody>
            {this.pets.map((pet, idx) => (
              <tr key={idx}>
                <td>{pet.petName}</td>
                <td>{formatNumber(pet.damage)}</td>
                <td>{formatNumber(pet.damage / (this.owner.fightDuration / 1000))}</td>
                <td>{pet.petName === this.mainPetName ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TalentStatisticBox>
    );
  }
}

export default AnimalCompanion;
