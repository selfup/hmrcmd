import lspi from 'lspi';
import { app } from 'hyperapp';

import actions from './actions';
import state from './state';
import view from './components/CommandCenter';

const appArgs = [
  state,
  actions,
  view,
  document.getElementById('app'),
];

function onMount(main) {
  const {
    syncFromJSON,
  } = main;

  const radios = lspi.get('radios');

  if (radios && radios.length) {
    syncFromJSON(radios);
  }
}

let main;

if (process.env.NODE_ENV !== 'production') {
  import('hyperapp-redux-devtools')
    .then((devtools) => {
      main = devtools(app)(...appArgs);

      onMount(main);
    });
} else {
  main = app(...appArgs);

  onMount(main);
}
