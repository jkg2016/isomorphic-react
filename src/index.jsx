import App from './App';
import React from 'react'
import ReactDOM from 'react-dom'

const render = (_App) => {
    ReactDOM.render(
        <_App />,
        document.getElementById('AppContainer')
    )
};

render(App);
