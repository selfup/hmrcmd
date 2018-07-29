import { h } from 'hyperapp';

import NewRadioConfig from './NewRadioConfig';

export default (state, actions) => {
  const {
    newConfig,
  } = state;

  const {
    newRadio,
  } = actions;

  return (
    <div>
      <div>
        <button
          class="btn add-radio"
          onclick={newRadio}
        >
          Add Radio
        </button>
        <button
          class="btn import"
          onclick={newRadio}
        >
          Import JSON Config
        </button>
        <button
          class="btn export"
          onclick={newRadio}
        >
          Export JSON Config
        </button>
      </div>
      {newConfig ? NewRadioConfig(state, actions) : []}
    </div>
  );
};
