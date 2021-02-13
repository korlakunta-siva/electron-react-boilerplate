import React from 'react';
import { render } from 'react-dom';
import App from './AppWithRouterAccess';
import './App.global.css';
//import Header from './components/header/Header';
import { history } from './components/common/history';

const rootElement = document.getElementById('root');
render(
  <>
    <App history={history} />
  </>,
  rootElement
);
