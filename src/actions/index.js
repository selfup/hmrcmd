import axios from 'axios';
import lspi from 'lspi';

const ICOM_CMD_API = '/api/v1/icom-cmd';
const HMRCMD_SYNC_API = '/api/v1/sync';

export default {
  syncFromServer: () => (state, actions) => {
    actions.posting();

    return axios
      .get(HMRCMD_SYNC_API)
      .then((res) => {
        const { data } = res;
        if (data.length) {
          actions.syncFromJSON(data);
        }

        actions.success();
      })
      .catch((err) => {
        actions.failure();
        throw new Error(err);
      });
  },

  syncToServer: () => (state, actions) => {
    actions.posting();

    return axios
      .post(HMRCMD_SYNC_API, { Config: localStorage.radios })
      .then(() => {
        actions.success();
      })
      .catch((err) => {
        actions.failure();
        throw new Error(err);
      });
  },

  syncFromJSON: (radios) => () => {
    if (typeof json === 'string') {
      return {
        radios: JSON.parse(radios),
        displayRadios: [...JSON.parse(radios)],
      };
    }

    return {
      radios,
      displayRadios: [...radios],
    };
  },

  syncFromFile: (radios) => (state, { syncToServer, syncFromJSON }) => {
    localStorage.radios = radios;

    const parsedRadios = JSON.parse(radios);

    syncFromJSON(parsedRadios);
    syncToServer();
  },

  filterDisplayRadiosByTag: (searchTerm) => ({ radios }) => ({
    displayRadios: radios.filter((radio) => {
      const term = searchTerm.trim().toLowerCase();
      const tag = radio.tag.toLowerCase();

      return tag.includes(term);
    }),
  }),

  filterDisplayRadiosByName: (searchTerm) => ({ radios }) => ({
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

  saveNewCmd: (idx) => (
    { radios, displayRadios, newCmdName, newCmdHex },
    { syncFromJSON, syncToServer },
  ) => {
    const updatedDisplayRadios = displayRadios.map((displayRadio, i) => {
      if (i === idx) {
        const { port } = displayRadio;

        const newCmds = [
          { name: newCmdName, hex: newCmdHex, port },
          ...displayRadio.commands,
        ];

        const updatedDisplayRadio = Object.assign({}, displayRadio);

        updatedDisplayRadio.addingNewCmd = !updatedDisplayRadio.addingNewCmd;
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
    syncFromJSON(updatedRadios);
    syncToServer();

    return {
      newCmdName,
      newCmdHex,
    };
  },

  addCmd: (idx) => ({ displayRadios }) => {
    const newRadioState = displayRadios.map((radio, i) => {
      if (i === idx) {
        return Object.assign({}, radio, { addingNewCmd: !radio.addingNewCmd });
      }

      return radio;
    });

    return {
      displayRadios: newRadioState,
    };
  },

  removeCmd: ({ radioIdx, cmdIdx }) => (
    { radios },
    { syncFromJSON, syncToServer },
  ) => {
    radios[radioIdx].commands.splice(cmdIdx, 1);

    lspi.set('radios', radios);
    syncFromJSON(radios);
    syncToServer();
  },

  updateContentType: (contentType) => () => ({
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

  addRadio: () => (
    { radios, newRadioOptions },
    { syncToServer, syncFromJSON },
  ) => {
    const { port, cmdname, cmdhex, cmdbaud } = newRadioOptions;

    const commands = [
      {
        port,
        name: cmdname,
        hex: cmdhex,
        baud: cmdbaud,
      },
    ];

    const newRadios = [
      Object.assign({}, { commands, addingNewCmd: false }, newRadioOptions),
      ...radios,
    ];

    lspi.set('radios', newRadios);
    syncFromJSON(newRadios);
    syncToServer();

    return {
      newConfig: false,
      newRadioOptions: {},
    };
  },

  success: () => () => ({
    posting: false,
    success: true,
  }),

  failure: () => () => ({
    posting: false,
    success: false,
  }),

  posting: () => () => ({
    cmdSent: true,
    posting: true,
  }),

  postIcomCmd: ({ SerialPort, IcomCommand, BaudRate }) => (
    _state,
    { success, posting, failure },
  ) => {
    posting();

    setTimeout(
      () =>
        axios
          .post(ICOM_CMD_API, { SerialPort, IcomCommand, BaudRate })
          .then(() => {
            success();
          })
          .catch((err) => {
            failure();
            throw new Error(err);
          }),
      10,
    );
  },
};
