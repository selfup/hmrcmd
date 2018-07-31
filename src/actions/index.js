import axios from 'axios';
import lspi from 'lspi';

const ICOM_CMD_API = '/api/v1/icom-cmd';

export default {
  syncFromJSON: radios => () => {
    if (typeof json === 'string') {
      return {
        radios: JSON.parse(radios),
      };
    }

    return {
      radios,
      displayRadios: [...radios],
    };
  },

  filterDisplayRadiosByTag: searchTerm => ({ radios }) => ({
    displayRadios: radios.filter((radio) => {
      const term = searchTerm.trim().toLowerCase();
      const tag = radio.tag.toLowerCase();

      return tag.includes(term);
    }),
  }),

  filterDisplayRadiosByName: searchTerm => ({ radios }) => ({
    displayRadios: radios.filter((radio) => {
      const term = searchTerm.trim().toLowerCase();
      const name = radio.name.toLowerCase();

      return name.includes(term);
    }),
  }),

  updateNewCmdName: ({ target: { value: newCmdName } }) => () => ({
    newCmdName: newCmdName.trim(),
  }),

  updateNewCmdHex: ({ target: { value: newCmdHex } }) => () => ({
    newCmdHex: newCmdHex.trim(),
  }),

  saveNewCmd: idx => ({
    radios,
    displayRadios,
    newCmdName,
    newCmdHex,
  }) => {
    const updatedDisplayRadios = displayRadios.map((displayRadio, i) => {
      if (i === idx) {
        const {
          port,
        } = displayRadio;

        const newCmds = [
          { name: newCmdName, hex: newCmdHex, port },
          ...displayRadio.commands,
        ];

        const updatedDisplayRadio = Object.assign({}, displayRadio);

        updatedDisplayRadio.addingNewCmd = false;
        updatedDisplayRadio.commands = newCmds;

        return updatedDisplayRadio;
      }

      return displayRadio;
    });

    const updatedRadio = Object.assign({}, updatedDisplayRadios[idx]);

    const updatedRadios = radios.map((radio) => {
      if (radio.name === updatedRadio.name && radio.tag === updatedRadio.tag) {
        return updatedRadio;
      }

      return radio;
    });

    lspi.set('radios', updatedRadios);

    return {
      newCmdName,
      newCmdHex,
      radios: updatedRadios,
      displayRadios: updatedDisplayRadios,
    };
  },

  addCmd: idx => ({ displayRadios }) => {
    const newRadioState = displayRadios.map((radio, i) => {
      if (i === idx) {
        return Object.assign({}, radio, { addingNewCmd: true });
      }

      return radio;
    });

    return {
      displayRadios: newRadioState,
    };
  },

  updateContentType: contentType => () => ({
    contentType,
  }),

  newRadio: () => ({ newConfig }) => ({
    newConfig: !newConfig,
  }),

  updateOptions: ({ target: { id, value } }) => ({ newRadioOptions }) => {
    const options = Object.assign({}, newRadioOptions);

    options[id] = value.trim();

    return {
      newRadioOptions: options,
    };
  },

  addRadio: () => ({ radios, newRadioOptions }) => {
    const {
      port,
      cmdname,
      cmdhex,
    } = newRadioOptions;

    const commands = [{
      port,
      name: cmdname,
      hex: cmdhex,
    }];

    const newRadios = [
      Object.assign({}, { commands, addingNewCmd: false }, newRadioOptions),
      ...radios,
    ];

    lspi.set('radios', newRadios);

    return {
      radios: newRadios,
      displayRadios: newRadios,
      newConfig: false,
      newRadioOptions: {},
    };
  },

  success: () => () => ({
    commandSent: true,
    commandSuccess: true,
  }),

  postIcomCmd: ({ SerialPort, IcomCommand }) => (state, { success }) => {
    axios.post(ICOM_CMD_API, { SerialPort, IcomCommand })
      .then(() => {
        success();
      })
      .catch((err) => {
        throw new Error(err);
      });
  },
};
