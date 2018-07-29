import { h } from 'hyperapp';

export default (state, { updateOptions, addRadio }) =>
  <section>
    <h3>Configure your new radio</h3>
    <p>
      <input
        id="tag"
        class="config-option"
        oninput={updateOptions}
        placeholder="Tag Name: MARS"
      />
    </p>
    <p>
      <input
        id="name"
        class="config-option"
        oninput={updateOptions}
        placeholder="Radio Name: ICOM 9000"
      />
    </p>
    <p>
      <input
        id="port"
        class="config-option"
        oninput={updateOptions}
        placeholder="Serial Port: COM3"
      />
    </p>
    <p>
      <input
        id="cmdname"
        class="config-option"
        oninput={updateOptions}
        placeholder="Command Name: Switch to FM"
      />
    </p>
    <p>
      <input
        id="cmdhex"
        class="config-option"
        oninput={updateOptions}
        placeholder="First Command: FE FE 94 E0 26 00 05 00 01 FD"
      />
    </p>
    <button
      class="btn save-radio-btn"
      onclick={addRadio}
    >
      Save New Radio
    </button>
  </section>;
