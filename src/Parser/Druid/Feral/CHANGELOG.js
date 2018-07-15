import React from 'react';

import { Thieseract, Anatta336, sref } from 'CONTRIBUTORS';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';

export default [
  {
    date: new Date('2018-07-15'),
    changes: <React.Fragment>Added tracking for how <SpellLink id={SPELLS.BLOODTALONS_TALENT.id} /> charges are used.</React.Fragment>,
    contributors: [Anatta336],
  },
  {
    date: new Date('2018-07-15'),
    changes: <React.Fragment>Added tracking for number of targets hit by <SpellLink id={SPELLS.CAT_SWIPE.id} />, <SpellLink id={SPELLS.THRASH_FERAL.id} />, and <SpellLink id={SPELLS.BRUTAL_SLASH_TALENT.id} />.</React.Fragment>,
    contributors: [Anatta336],
  },
  {
    date: new Date('2018-06-30'),
    changes: <React.Fragment>Added tracking for <SpellLink id={SPELLS.PREDATORY_SWIFTNESS.id} />.</React.Fragment>,
    contributors: [Anatta336],
  },
  {
    date: new Date('2018-06-27'),
    changes: <React.Fragment>Added tracking for the <SpellLink id={SPELLS.PREDATOR_TALENT.id} /> talent.</React.Fragment>,
    contributors: [Anatta336],
  },
  {
    date: new Date('2018-06-11'),
    changes: <React.Fragment>Added statistics breaking down snapshot uptime by buff for <SpellLink id={SPELLS.RAKE.id} />, <SpellLink id={SPELLS.RIP.id} />, and <SpellLink id={SPELLS.MOONFIRE_FERAL.id} />.</React.Fragment>,
    contributors: [Anatta336],
  },
  {
    date: new Date('2018-06-09'),
    changes: <React.Fragment>Added snapshot tracking for <SpellLink id={SPELLS.MOONFIRE_FERAL.id} /></React.Fragment>,
    contributors: [Anatta336],
  },
  {
    date: new Date('2018-06-06'),
    changes: <React.Fragment>Added snapshot tracking for <SpellLink id={SPELLS.RIP.id} /></React.Fragment>,
    contributors: [Anatta336],
  },
  {
    date: new Date('2018-05-30'),
    changes: 'Configured buffs so they appear on timeline and arranged ordering of abilities on timeline.',
    contributors: [Anatta336],
  },
  {
    date: new Date('2018-05-28'),
    changes: <React.Fragment>Added snapshot tracking for <SpellLink id={SPELLS.RAKE.id} /></React.Fragment>,
    contributors: [Anatta336],
  },
  {
    date: new Date('2018-05-23'),
    changes: <React.Fragment>Corrected GCD tracking of <SpellLink id={SPELLS.MOONFIRE.id} /> and instant <SpellLink id={SPELLS.REGROWTH.id} />/<SpellLink id={SPELLS.ENTANGLING_ROOTS.id} /></React.Fragment>,
    contributors: [Anatta336],
  },
  {
    date: new Date('2018-02-10'),
    changes: <React.Fragment><SpellLink id={SPELLS.PRIMAL_FURY.id} /> procs from an ability used at 4 CPs no longer count as 'wasted' CPs because it's not within the player's control. Also, <SpellLink id={SPELLS.PRIMAL_FURY.id} /> procs will no longer be shown in the Cooldowns tab.</React.Fragment>,
    contributors: [sref],
  },
  {
    date: new Date('2018-01-29'),
    changes: <React.Fragment>Added low energy <SpellLink id={SPELLS.FEROCIOUS_BITE.id} /> tracking</React.Fragment>,
    contributors: [Anatta336],
  },
  {
    date: new Date('2018-01-24'),
    changes: <React.Fragment>Added Ashamane's Rip uptime tracking</React.Fragment>,
    contributors: [Anatta336],
  },
  {
    date: new Date('2017-09-22'),
    changes: 'Added 5 combo point finisher tracking',
    contributors: [Thieseract],
  },
  {
    date: new Date('2017-09-11'),
    changes: 'Refactored combo point tracking properties',
    contributors: [Thieseract],
  },
  {
    date: new Date('2017-09-11'),
    changes: <React.Fragment>Added <SpellLink id={SPELLS.SAVAGE_ROAR_TALENT.id} /> damage contribution</React.Fragment>,
    contributors: [Thieseract],
  },
  {
    date: new Date('2017-09-10'),
    changes: 'Changed exceptions to conditional assignment on combo point tracker',
    contributors: [Thieseract],
  },
  {
    date: new Date('2017-09-06'),
    changes: 'Updated combo point tracking to handle non standard generator and spenders',
    contributors: [Thieseract],
  },
  {
    date: new Date('2017-09-04'),
    changes: 'Cleaned up this.owner modules where possible',
    contributors: [Thieseract],
  },
  {
    date: new Date('2017-09-04'),
    changes: 'Added combo point tracking',
    contributors: [Thieseract],
  },
  {
    date: new Date('2017-09-04'),
    changes: 'Added bleed uptime tracking',
    contributors: [Thieseract],
  },
  {
    date: new Date('2017-09-04'),
    changes: 'CooldownTracker configured',
    contributors: [Thieseract],
  },
  {
    date: new Date('2017-09-03'),
    changes: 'Initial commit. Damage done, ABC, and Abilities added',
    contributors: [Thieseract],
  },
];
