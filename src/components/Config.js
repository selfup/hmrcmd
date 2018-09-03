import { h } from 'hyperapp';

import NewRadioConfig from './NewRadioConfig';

function importJson(evt, syncFromFile) {
  const f = evt.target.files[0];

  if (f) {
    const r = new FileReader();

    r.onload = () => {
      syncFromFile(r.result);
    };

    r.readAsText(f);
  } else {
    alert('Failed to load file');
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

  const encdodedJSON = JSON.stringify(radios);
  const configHref = `data:text/json;charset=utf-8,${encdodedJSON}`;

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
          class="btn export"
        >
          <a
            href={configHref}
            download="hmrcmdr-config.json"
          >
            Export JSON Config
          </a>
        </button>
        <div class="import-json-config">
          <span>Import JSON Config</span>
          <input
            class="import-file"
            type="file"
            placeholder="Import JSON Config"
            onchange={e => importJson(e, syncFromFile)}
          />
        </div>
      </div>
      {newConfig ? NewRadioConfig(state, actions) : []}
    </div>
  );
};
