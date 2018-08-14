/**
 * All Paladin azerite powers go in here.
 * You need to do this manually, usually an easy way to do this is by opening a WCL report and clicking the icons of spells to open the relevant Wowhead pages, here you can get the icon name by clicking the icon, copy the name of the spell and the ID is in the URL.
 * You can access these entries like other entries in the spells files by importing `common/SPELLS` and using the assigned property on the SPELLS object. Please try to avoid abbreviating properties.
 */

export default {
  STALWART_PROTECTOR: {
    id: 274395,
    name: 'Stalwart Protector',
    icon: 'spell_holy_divineshield',
  },
  RADIANT_INCANDESCENCE: {
    id: 278147,
    name: 'Radiant Incandescence',
    icon: 'spell_holy_searinglight',
  },

  // Holy
  GRACE_OF_THE_JUSTICAR: {
    id: 278785,
    name: 'Grace of the Justicar',
    icon: 'spell_holy_healingaura',
  },
  CONCENTRATED_MENDING: {
    id: 272260,
    name: 'Concentrated Mending',
    icon: 'inv_offhand_1h_pvpdraenors1_d_02',
  },
};
