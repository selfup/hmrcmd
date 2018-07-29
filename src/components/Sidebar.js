import { h } from 'hyperapp';

import {
  HOME,
  CONFIG,
  RADIOS,
} from './../constants';

export default (state, actions) => {
  const {
    radios,
  } = state;

  const {
    updateContentType,
  } = actions;

  return (
    <div>
      <button
        class="btn home-btn"
        onclick={() => updateContentType(HOME)}
      >
        Home
      </button>
      <button
        class="btn config-btn"
        onclick={() => updateContentType(CONFIG)}
      >
        Config
      </button>
      <button
        class="btn radios-btn"
        onclick={() => updateContentType(RADIOS)}
      >
        Radios ({radios.length})
      </button>
    </div>
  );
};
