import SPELLS from 'common/SPELLS';
import processEvents from 'tests/Parser/Brewmaster/Fixtures/processEvents';
import { EarlyFinish, incomingDamage, SimpleFight } from 'tests/Parser/Brewmaster/Fixtures/SimpleFight';

import StaggerFabricator from './StaggerFabricator';
import Stagger from './Stagger';

describe('Brewmaster.Stagger', () => {
  let stagger;
  let fab;
  beforeEach(() => {
    fab = new StaggerFabricator({
      toPlayer: () => true,
      byPlayer: () => true,
      toPlayerPet: () => false,
      byPlayerPet: () => false,
      selectedCombatant: {
        hasBuff: () => false,
        traitsBySpellId: { [SPELLS.STAGGERING_AROUND.id]: 0 },
      },
    });
    stagger = new Stagger({
      toPlayer: () => true,
      byPlayer: () => true,
      toPlayerPet: () => false,
      byPlayerPet: () => false,
    });
    stagger.fab = fab;
    fab.owner.fabricateEvent = (event, obj) => stagger.triggerEvent({ ...event, trigger: obj });
  });
  it('total amount of stagger taken with no events', () => {
    expect(stagger.totalStaggerTaken).toBe(0);
  });
  it('total amount of stagger taken with no stagger', () => {
    processEvents(incomingDamage, fab, stagger);
    expect(stagger.totalStaggerTaken).toBe(0);
  });
  it('total amount of stagger damage taken', () => {
    processEvents(SimpleFight, fab, stagger);
    expect(stagger.totalStaggerTaken).toBe(240);
  });
  it('track how much damage in total is absorbed by stagger, with no stagger absorbs', () => {
    processEvents(incomingDamage, fab, stagger);
    expect(stagger.totalPhysicalStaggered + stagger.totalMagicalStaggered).toBe(0);
  });
  it('track how much damage in total is absorbed by stagger', () => {
    processEvents(SimpleFight, fab, stagger);
    expect(stagger.totalPhysicalStaggered + stagger.totalMagicalStaggered).toBe(599);
  });
  it('track how much physical damage was staggered', () => {
    processEvents(SimpleFight, fab, stagger);
    expect(stagger.totalPhysicalStaggered).toBe(300);
  });
  it('track how much magical damage was staggered', () => {
    processEvents(SimpleFight, fab, stagger);
    expect(stagger.totalMagicalStaggered).toBe(299);
  });
  it('Tracks the amount of stagger missing from the fight', () => {
    processEvents(EarlyFinish, fab, stagger);
    // this doesn't actually do anything for the test.... stagger.owner = myOwner;
    stagger.triggerEvent({
      type: 'finished',
    });
    expect(stagger.staggerMissingFromFight).toBe(484);
  });
});

