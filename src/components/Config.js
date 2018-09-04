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
    importJSON,
  } = state;

  const {
    toggleImportJSON,
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
        <button
          class="btn import"
          onclick={toggleImportJSON}
        >
          Import JSON Config
        </button>
        <button
          class="btn export"
          onclick={() => document.querySelector('.export-json-link').click()}
        >
          <a
            hidden={true}
            class="export-json-link"
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
      {
        importJSON
          ? <div class="import-json-config">
            <p>Import JSON Config</p>
            <input
              class="import-file"
              type="file"
              placeholder="Import JSON Config"
              onchange={e => importJson(e, syncFromFile)}
            />
          </div>
          : []
      }
    </div>
  );
};
