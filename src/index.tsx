import React from 'react';
import { render } from 'react-dom';
import App from './App';
import './App.global.css';
import { history } from './components/common/history';

render(<App history={history} />, document.getElementById('root'));

