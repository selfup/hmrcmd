import { h } from 'hyperapp';

import Home from './Home';
import Config from './Config';
import Radios from './Radios';
import TopBar from './TopBar';
import Indicators from './Indicators';

import {
  HOME,
  CONFIG,
  RADIOS,
} from './../constants';

const renderContent = (state, actions) => {
  const {
    contentType,
  } = state;

  switch (contentType) {
    case HOME:
      return Home();
    case CONFIG:
      return Config(state, actions);
    case RADIOS:
      return Radios(state, actions);
    default:
      return [];
  }
};

export default (state, actions) =>
  <div class="main">
    <div class="container">
      {Indicators(state, actions)}
      <div class="topbar">
        {TopBar(state, actions)}
      </div>
      <div class="content">
        {renderContent(state, actions)}
      </div>
    </div>
  </div>;
