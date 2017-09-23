import React from 'react';
import { Doughnut as DoughnutChart } from 'react-chartjs-2';

import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import { formatPercentage } from 'common/format';

import Module from 'Parser/Core/Module';
import Combatants from 'Parser/Core/Modules/Combatants';
import ManaValues from 'Parser/Core/Modules/ManaValues';

import StatisticsListBox, { STATISTIC_ORDER } from 'Main/StatisticsListBox';

import PaladinAbilityTracker from './PaladinAbilityTracker';

const CHART_SIZE = 100;

class CastBehavior extends Module {
  static dependencies = {
    combatants: Combatants,
    abilityTracker: PaladinAbilityTracker,
    manaValues: ManaValues,
  };

  get iolProcsPerHolyShockCrit() {
    return this.combatants.selected.hasBuff(SPELLS.HOLY_PALADIN_T19_4SET_BONUS_BUFF.id) ? 2 : 1;
  }

  legend(items, total) {
    return items.map(({ color, label, tooltip, value, spellId }) => {
      label = tooltip ? (
        <dfn data-tip={tooltip}>{label}</dfn>
      ) : label;
      label = spellId ? (
        <SpellLink id={spellId}>{label}</SpellLink>
      ) : label;
      return (
        <div className="flex" style={{ borderBottom: '3px solid rgba(255,255,255,0.1)', marginBottom: 5 }}>
          <div className="flex-sub">
            <div
              style={{
                display: 'inline-block',
                background: color,
                borderRadius: '50%',
                width: 16,
                height: 16,
                marginBottom: -3,
              }}
            />
          </div>
          <div className="flex-main" style={{ paddingLeft: 5 }}>
            {label}
          </div>
          <div className="flex-sub">
            <dfn data-tip={value}>
              {formatPercentage(value / total, 0)}%
            </dfn>
          </div>
        </div>
      );
    });
  }
  chart(items) {
    return (
      <DoughnutChart
        data={{
          datasets: [{
            data: items.map(item => item.value),
            backgroundColor: items.map(item => item.color),
            borderColor: '#666',
            borderWidth: 1.5,
          }],
          labels: items.map(item => item.label),
        }}
        options={{
          legend: {
            display: false,
          },
          cutoutPercentage: 45,
          animation: false,
        }}
        width={CHART_SIZE}
        height={CHART_SIZE}
      />
    );
  }

  iolCastRatioChart() {
    const abilityTracker = this.abilityTracker;
    const getAbility = spellId => abilityTracker.getAbility(spellId);

    const flashOfLight = getAbility(SPELLS.FLASH_OF_LIGHT.id);
    const holyLight = getAbility(SPELLS.HOLY_LIGHT.id);
    const holyShock = getAbility(SPELLS.HOLY_SHOCK_HEAL.id);

    const iolFlashOfLights = flashOfLight.healingIolHits || 0;
    const iolHolyLights = holyLight.healingIolHits || 0;
    const totalIolUsages = iolFlashOfLights + iolHolyLights;

    const holyShockHeals = holyShock.healingHits || 0;
    const holyShockCrits = holyShock.healingCriticalHits || 0;
    const iolProcsPerHolyShockCrit = this.iolProcsPerHolyShockCrit;
    const totalIolProcs = holyShockCrits * iolProcsPerHolyShockCrit;
    const unusedProcs = totalIolProcs - totalIolUsages;

    const items = [
      {
        color: '#ecd1b6',
        label: 'Flash of Light',
        spellId: SPELLS.FLASH_OF_LIGHT.id,
        value: iolFlashOfLights,
      },
      {
        color: '#ff7d0a',
        label: 'Holy Light',
        spellId: SPELLS.HOLY_LIGHT.id,
        value: iolHolyLights,
      },
      {
        color: '#ff0000',
        label: 'Wasted procs',
        tooltip: `The amount of Infusion of Lights you did not use out of the total available. You cast ${holyShockHeals} (healing) Holy Shocks with a ${formatPercentage(holyShockCrits / holyShockHeals)}% crit ratio. This gave you ${totalIolProcs} Infusion of Light procs, of which you used ${totalIolUsages}.`,
        value: unusedProcs,
      },
    ];

    return (
      <div className="flex">
        <div className="flex-sub" style={{ marginLeft: -3, paddingRight: 6 }}>
          {this.chart(items)}
        </div>
        <div className="flex-main" style={{ fontSize: '90%', paddingTop: 9 }}>
          {this.legend(items, totalIolProcs)}
        </div>
      </div>
    );
  }

  fillerCastRatioChart() {
    const abilityTracker = this.abilityTracker;
    const getAbility = spellId => abilityTracker.getAbility(spellId);

    const flashOfLight = getAbility(SPELLS.FLASH_OF_LIGHT.id);
    const holyLight = getAbility(SPELLS.HOLY_LIGHT.id);

    const iolFlashOfLights = flashOfLight.healingIolHits || 0;
    const iolHolyLights = holyLight.healingIolHits || 0;

    const flashOfLightHeals = flashOfLight.casts || 0;
    const holyLightHeals = holyLight.casts || 0;
    const fillerFlashOfLights = flashOfLightHeals - iolFlashOfLights;
    const fillerHolyLights = holyLightHeals - iolHolyLights;
    const totalFillers = fillerFlashOfLights + fillerHolyLights;

    const items = [
      {
        color: '#ecd1b6',
        label: 'Flash of Light',
        spellId: SPELLS.FLASH_OF_LIGHT.id,
        value: fillerFlashOfLights,
      },
      {
        color: '#ff7d0a',
        label: 'Holy Light',
        spellId: SPELLS.HOLY_LIGHT.id,
        value: fillerHolyLights,
      },
    ];

    return (
      <div className="flex">
        <div className="flex-sub" style={{ marginLeft: -3, paddingRight: 6 }}>
          {this.chart(items)}
        </div>
        <div className="flex-main" style={{ fontSize: '90%', paddingTop: 9 }}>
          {this.legend(items, totalFillers)}
        </div>
      </div>
    );
  }

  statistic() {
    return (
      <StatisticsListBox
        title="Cast behavior"
      >
        <div>With Infusion of Light</div>
        {this.iolCastRatioChart()}
        <div>Fillers</div>
        {this.fillerCastRatioChart()}
      </StatisticsListBox>
    );
  }
  statisticOrder = STATISTIC_ORDER.CORE(40);
}

export default CastBehavior;
