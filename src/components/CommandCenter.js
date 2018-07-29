import { h } from 'hyperapp';

const configureNewRadio = (state, { newOptions }) =>
  <section>
    <h3>Configure your new radio</h3>
    <p>
      <input
        id="newtag"
        class="config-option"
        oninput={newOptions}
        placeholder="Tag Name: MARS"
      />
    </p>
    <p>
      <input
        id="newname"
        class="config-option"
        oninput={newOptions}
        placeholder="Radio Name: ICOM 9000"
      />
    </p>
    <p>
      <input
        id="newport"
        class="config-option"
        oninput={newOptions}
        placeholder="Serial Port: COM3"
      />
    </p>
    <p>
      <input
        id="newcmdname"
        class="config-option"
        oninput={newOptions}
        placeholder="Command Name: Switch to FM"
      />
    </p>
    <p>
      <input
        id="newcmdhex"
        class="config-option"
        oninput={newOptions}
        placeholder="First Command: FE FE 94 E0 26 00 05 00 01 FD"
      />
    </p>
    <button class="btn save-radio-btn">Save New Radio</button>
  </section>;

export default (state, actions) => {
  const {
    newRadio,
  } = actions;

  const {
    radios,
    newConfig,
  } = state;

  return (
    <div class="main">
      <div class="container">
        <div class="sidebar">
          <div>
            <button class="btn home-btn">Home</button>
            <button class="btn config-btn">Config</button>
            <button class="btn radios-btn">Radios ({radios.length})</button>
          </div>
        </div>
        <div class="content">
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
            {newConfig ? configureNewRadio(state, actions) : []}
          </div>
        </div>
      </div>
    </div>
  );
};
