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

if (process.env.NODE_ENV !== 'production') {
  import('hyperapp-redux-devtools')
    .then((devtools) => {
      devtools(app)(...appArgs);
    });
} else {
  app(...appArgs);
}
