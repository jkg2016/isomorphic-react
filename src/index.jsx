import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import getStore from './getStore';
import { Provider } from 'react-redux';

const store = getStore();

const fetchDataForLocation = () => {
    store.dispatch({type: `REQUEST_FETCH_QUESTIONS`});
};

const render = (_App) => {
    ReactDOM.render(
        <Provider store={store}>
            <_App />
        </Provider>,
        document.getElementById('AppContainer')
    )
};

//hot loading
if (module.hot){
    module.hot.accept('./App',() =>{
        const NextApp = require('./App').default;
        render(NextApp);
    })
}
render(App);

fetchDataForLocation();