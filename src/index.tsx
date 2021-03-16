import React from 'react';
import { render } from 'react-dom';
// import App from './AppWithRouterAccess';
import './App.global.css';
//import Header from './components/header/Header';
import { history } from './components/common/history';
import MainPage from './components/MainPage';

const rootElement = document.getElementById('root');
render(
  <>
    <MainPage history={history} />
  </>,
  rootElement
);
