import { h } from 'hyperapp';

import { HOME, CONFIG, RADIOS } from '../constants';

export default (state, actions) => {
  const { radios } = state;

  const { updateContentType, syncToServer } = actions;

  return (
    <div class="topbar">
      <button class="btn home-btn" onclick={() => updateContentType(HOME)}>
        Home
      </button>
      <button class="btn config-btn" onclick={() => updateContentType(CONFIG)}>
        Config
      </button>
      <button class="btn radios-btn" onclick={() => updateContentType(RADIOS)}>
        Radios ({radios.length})
      </button>
      <button class="btn sync-to-server" onclick={syncToServer}>
        Sync to Server
      </button>
    </div>
  );
};
