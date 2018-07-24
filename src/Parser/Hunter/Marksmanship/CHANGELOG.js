import React from 'react';

import ItemLink from 'common/ItemLink';
import ITEMS from 'common/ITEMS';
import SpellLink from 'common/SpellLink';
import SPELLS from 'common/SPELLS';
import { Blazballs, JLassie82, Putro } from 'CONTRIBUTORS';

export default [
  {
    date: new Date('2018-07-23'),
    changes: 'Updated a large amount of modules to be ready for pre-patch and BFA. Updated patch combatility to 8.0.1.',
    contributors: [Putro],
  },
  {
    date: new Date('2018-04-10'),
    changes: <React.Fragment>Fixes A Murder of Crows to properly calculate the boss health.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2018-03-22'),
    changes: <React.Fragment>Fixed Sentinel module after Blizzard fixed the bugs with the spell. </React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2018-03-01'),
    changes: <React.Fragment>Added a Marking Targets and Hunter's Mark module. Also updated handling for <ItemLink id={ITEMS.ZEVRIMS_HUNGER.id} />.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2018-02-27'),
    changes: <React.Fragment>Updated the <SpellLink id={SPELLS.LOCK_AND_LOAD_TALENT.id} /> module to include some probability calculations on your chance of getting that amount or lower procs.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2018-02-19'),
    changes: 'Spring cleaning in many modules. Added icons to Vulnerable Applications and Focus Usage modules, added a breakdown of which casts were cancelled',
    contributors: [Putro],
  },
  {
    date: new Date('2018-02-05'),
    changes: <React.Fragment>Added additional information to the <ItemLink id={ITEMS.CALL_OF_THE_WILD.id} /> module, to show cooldown reduction on the various affected spells. </React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2018-01-30'),
    changes: 'Added a tooltip on the focus usage chart that shows focus used aswell as amount of casts of the the given ability',
    contributors: [Putro],
  },
  {
    date: new Date('2018-01-05'),
    changes: <React.Fragment>Added support for Sentinel, and included the current bugged ticks of Sentinel.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2017-12-30'),
    changes: 'Fixed a bug in the focus chart, that sometimes indicated you were at negative focus at any given moment',
    contributors: [Putro],
  },
  {
    date: new Date('2017-12-26'),
    changes: 'Added a focus usage chart',
    contributors: [Putro],
  },
  {
    date: new Date('2017-12-26'),
    changes: <React.Fragment>Added support for <ItemLink id={ITEMS.CELERITY_OF_THE_WINDRUNNERS.id} />, <ItemLink id={ITEMS.MAGNETIZED_BLASTING_CAP_LAUNCHER.id} />, <ItemLink id={ITEMS.ZEVRIMS_HUNGER.id} />, <ItemLink id={ITEMS.ROOTS_OF_SHALADRASSIL.id} />, <ItemLink id={ITEMS.CALL_OF_THE_WILD.id} />, <ItemLink id={ITEMS.THE_APEX_PREDATORS_CLAW.id} /> and <ItemLink id={ITEMS.THE_SHADOW_HUNTERS_VOODOO_MASK.id} />.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2017-12-26'),
    changes: 'Fix a bug with critical strike rating showing 5% too low for Marksmanship hunters.',
    contributors: [Putro],
  },
  {
    date: new Date('2017-12-24'),
    changes: 'Updated to the new checklist format',
    contributors: [Putro],
  },
  {
    date: new Date('2017-12-15'),
    changes: 'Reworked T21 almost from the ground up, the 4p now includes damage and procs',
    contributors: [Putro],
  },
  {
    date: new Date('2017-12-04'),
    changes: 'Added many talents and traits. Moved them into a singular box to improve visibility.',
    contributors: [Putro],
  },
  {
    date: new Date('2017-11-29'),
    changes: 'Upgraded spec completeness to great.',
    contributors: [Putro],
  },
  {
    date: new Date('2017-11-29'),
    changes: <React.Fragment>Updated Trick Shot to properly account for both single-target and cleave damage, added support for tier 21, and fixed a bug in the <SpellLink id={SPELLS.TRUESHOT.id} /> module where it counted too many <SpellLink id={SPELLS.AIMED_SHOT.id} /> than it should.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2017-11-17'),
    changes: 'Updated changelog to new format.',
    contributors: [Putro],
  },
  {
    date: new Date('2017-11-12'),
    changes: 'Upgraded spec completeness to good.',
    contributors: [Putro],
  },
  {
    date: new Date('2017-11-12'),
    changes: 'Updated config information.',
    contributors: [Putro],
  },
  {
    date: new Date('2017-11-12'),
    changes: <React.Fragment>Added a suggestion for execute trueshots and a A Murder of Crows suggestion when boss has between 25 and 20% hp, so the player can better utilise <SpellLink id={SPELLS.BULLSEYE_BUFF.id} />.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2017-11-08'),
    changes: 'Added cancelled cast module.',
    contributors: [Putro],
  },
  {
    date: new Date('2017-11-08'),
    changes: 'Fixed large FocusChart performance bugs.',
    contributors: [Blazballs],
  },
  {
    date: new Date('2017-11-03'),
    changes: <React.Fragment>Minor update to the <SpellLink id={SPELLS.LOCK_AND_LOAD_TALENT.id} /> module and its calculation of expected procs.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2017-10-25'),
    changes: <React.Fragment> Added 5 new talent modules (<SpellLink id={SPELLS.EXPLOSIVE_SHOT_TALENT.id} />, <SpellLink id={SPELLS.PIERCING_SHOT_TALENT.id} />, Volley, A Murder of Crows, Trick Shot), fixed <SpellLink id={SPELLS.TRUESHOT.id} /> CD, added Focus Dump Checker.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2017-10-25'),
    changes: <React.Fragment>Updated True Aim to include damage contributed information.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2017-10-25'),
    changes: <React.Fragment> Adjust <SpellLink id={SPELLS.HUNTER_MM_T20_2P_BONUS.id} /> to account for nerfs.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2017-10-22'),
    changes: <React.Fragment>Updated suggestions overall, added avatar, removed <SpellLink id={SPELLS.CYCLONIC_BURST_IMPACT_TRAIT.id} /> from cooldown tracker, added suggestion to TimeFocusCapped, updated AlwaysBeCasting and CastEfficiency.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2017-10-22'),
    changes: <React.Fragment>Added <SpellLink id={SPELLS.TRUESHOT.id} /> statistic with average <SpellLink id={SPELLS.AIMED_SHOT.id} /> per <SpellLink id={SPELLS.TRUESHOT.id} />, and average starting focus per <SpellLink id={SPELLS.TRUESHOT.id} />.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2017-10-22'),
    changes: <React.Fragment>Added <SpellLink id={SPELLS.HUNTER_MM_T20_2P_BONUS.id} /> dmg increase breakdown.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2017-10-22'),
    changes: <React.Fragment>Added <ItemLink id={ITEMS.SOUL_OF_THE_HUNTMASTER.id} />, <ItemLink id={ITEMS.MKII_GYROSCOPIC_STABILIZER.id} /> and <ItemLink id={ITEMS.WAR_BELT_OF_THE_SENTINEL_ARMY.id} />support.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2017-10-20'),
    changes: <React.Fragment>Added <ItemLink id={ITEMS.TARNISHED_SENTINEL_MEDALLION.id} /> and <SpellLink id={SPELLS.TRUESHOT.id} /> pairing tooltip.</React.Fragment>,
    contributors: [Blazballs],
  },
  {
    date: new Date('2017-10-20'),
    changes: <React.Fragment> Added True Aim and <SpellLink id={SPELLS.LOCK_AND_LOAD_TALENT.id} /> support.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2017-10-16'),
    changes: <React.Fragment> Added <ItemLink id={ITEMS.ULLRS_FEATHER_SNOWSHOES.id} /> to account for the <SpellLink id={SPELLS.TRUESHOT.id} />CDR it provides.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2017-10-16'),
    changes: <React.Fragment> Added <SpellLink id={SPELLS.HUNTER_MM_T19_2P_BONUS.id} /> support.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2017-10-14'),
    changes: <React.Fragment>Added Patient Sniper tracking.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2017-10-14'),
    changes: 'Added Focus Capped Statistic Box.',
    contributors: [Blazballs],
  },
  {
    date: new Date('2017-10-08'),
    changes: 'Added FocusTracker Module and FocusTracker Graph module and additional supporting modules.',
    contributors: [Blazballs],
  },
  {
    date: new Date('2017-10-05'),
    changes: <React.Fragment> remove <SpellLink id={SPELLS.CYCLONIC_BURST_TRAIT.id} /> from Cooldown view.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2017-10-05'),
    changes: <React.Fragment> Added <SpellLink id={SPELLS.QUICK_SHOT_TRAIT.id} /> reduction for <SpellLink id={SPELLS.TRUESHOT.id} />.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2017-10-04'),
    changes: <React.Fragment> Added <SpellLink id={SPELLS.AIMED_SHOT.id} /> and Vulnerable tracker.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2017-10-03'),
    changes: <React.Fragment>Added <SpellLink id={SPELLS.HUNTER_MM_T20_2P_BONUS.id} /> and <SpellLink id={SPELLS.HUNTER_MM_T20_4P_BONUS.id} /> support.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('02-10-2017'),
    changes: <React.Fragment> Added <SpellLink id={SPELLS.BULLSEYE_BUFF.id} /> buff to hunter_spells for future usage.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2017-10-02'),
    changes: 'Changed dead time to stricter, and get the player to cast more (should generally always be casting something).',
    contributors: [Putro],
  },
  {
    date: new Date('2017-10-02'),
    changes: <React.Fragment>Added suggestions to <SpellLink id={SPELLS.WINDBURST.id} /> and A Murder of Crows under CastEfficiency.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2017-10-02'),
    changes: 'Updated CastEfficiency to not show a lot of useless utility spells, unless they were specifically cast during that fight.',
    contributors: [Putro],
  },
  {
    date: new Date('2017-10-02'),
    changes: 'Added spec info aswell as spec discussion URL + some basic rotational information while the modules aren\'t completed.',
    contributors: [Putro],
  },
  {
    date: new Date('2017-09-26'),
    changes: <React.Fragment>Fixed Cooldown to not include <SpellLink id={SPELLS.WINDBURST_MOVEMENT_SPEED.id} /> buff.</React.Fragment>,
    contributors: [Putro],
  },
  {
    date: new Date('2017-09-05'),
    changes: 'Base files added.',
    contributors: [JLassie82],
  },
];
