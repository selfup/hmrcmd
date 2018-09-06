import { h } from 'hyperapp';

import NewRadioConfig from './NewRadioConfig';

function importJson(evt, syncFromFile) {
  const file = evt.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = () => {
      syncFromFile(reader.result);
    };

    reader.readAsText(file);
  } else {
    document.window.prompt('Failed to load file');
  }
}

export default (state, actions) => {
  const {
    radios,
    newConfig,
  } = state;

  const {
    syncFromFile,
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
        <label class="btn import">
          <input
            hidden={true}
            type="file"
            placeholder="Import JSON Config"
            onchange={e => importJson(e, syncFromFile)}
          />
          Import JSON Config
        </label>
        <button
          class="btn export"
          onclick={() => document.querySelector('.export-json-link').click()}
        >
          <a
            hidden={true}
            href={`data:text/json;charset=utf-8,${JSON.stringify(radios)}`}
            download={
              `hmrcmdr-config-${
                new Date()
                  .toLocaleString()
                  .replace(',', '')
                  .split(' ')
                  .join(',')
              }.json`
            }
          >
          </a>
          Export JSON Config
        </button>
      </div>
      {newConfig ? NewRadioConfig(state, actions) : []}
    </div>
  );
};
