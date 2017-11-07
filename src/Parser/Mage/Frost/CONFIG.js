import React from 'react';

import SPECS from 'common/SPECS';
import SPEC_ANALYSIS_COMPLETENESS from 'common/SPEC_ANALYSIS_COMPLETENESS';

import CombatLogParser from './CombatLogParser';
import CHANGELOG from './CHANGELOG';

import SharrqAvatar from './Images/Sharrq_avatar.jpg';

export default {
  spec: SPECS.FROST_MAGE,
  maintainer: '@Sharrq and @sref',
  maintainerAvatar: SharrqAvatar,
  completeness: SPEC_ANALYSIS_COMPLETENESS.GOOD, // When changing this please make a PR with ONLY this value changed, we will do a review of your analysis to find out of it is complete enough.
  changelog: CHANGELOG,
  description: (
    <div>
      Hello Everyone! We are always looking to improve the Frost Mage Analyzers and Modules; so if you find any issues or if there is something missing that you would like to see added, please open an Issue on GitHub or send a message to us on Discord (Sharrq#7530 or Sref#3865) <br /> <br />
	    Additionally, if you need further assistance in improving your gameplay as a Frost Mage, you can refer to the following resources:<br /> <br />
      Discord <br />
      https://discord.gg/0gLMHikX2aZ23VdA <br /> <br />
      Altered Time (Mage Forums/Guides) <br />
      https://www.altered-time.com/forum/ <br /> <br />
      Icy Veins (Class Guides) <br />
      https://www.icy-veins.com/wow/frost-mage-pve-dps-guide <br />
    </div>
  ),
  specDiscussionUrl: 'https://github.com/WoWAnalyzer/WoWAnalyzer/milestone/3',
  parser: CombatLogParser,
  path: __dirname, // used for generating a GitHub link directly to your spec
};
