import axios from 'axios';
import lspi from 'lspi';
import radio from './../objects/radio';

const ICOM_CMD_API = process.env.NODE_END !== 'production'
  ? 'http://localhost:8792/api/v1/icom-cmd'
  : '/api/v1/icom-cmd';

export default {
  newRadio: () => ({ newConfig }) => ({
    newConfig: !newConfig,
  }),

  addRadio: () => ({ radios, newRadioOptions }) => {
    const {
      name,
      port,
      commands,
    } = newRadioOptions;

    const newRadio = radio(
      name,
      port,
      commands,
    );

    const newRadios = [
      newRadio,
      ...radios,
    ];

    lspi.set('radios', newRadios);

    return {
      radios: newRadios,
      newRadioOptions: {},
    };
  },

  success: () => () => ({
    commandSent: true,
    commandSuccess: true,
  }),

  postIcomCmd: () => ({ cmd }, { success }) => {
    const {
      SerialPort,
      IcomCommand,
    } = cmd;

    axios.post(ICOM_CMD_API, { SerialPort, IcomCommand })
      .then(() => {
        success();
      })
      .catch((err) => {
        throw new Error(err);
      });
  },
};
