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
      Object.assign({}, { commands }, newRadioOptions),
      ...radios,
    ];

    lspi.set('radios', newRadios);

    return {
      radios: newRadios,
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
