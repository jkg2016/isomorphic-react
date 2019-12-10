import App from "./App";
import React from "react";
import ReactDOM from "react-dom";
import getStore from "./getStore";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import createHistory from "history/createBrowserHistory";

const history = createHistory();

const store = getStore(history);

const fetchDataForLocation = (location) => {
  if (location.pathname === "/"){
    store.dispatch({ type: `REQUEST_FETCH_QUESTIONS` });
  }
  if(location.pathname.includes(`questions`))
  {
    store.dispatch({ type: `REQUEST_FETCH_QUESTION`, question_id:location.pathname.split('/')[2] });
  }
  
};

const render = _App => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <_App />
      </ConnectedRouter>
    </Provider>,
    document.getElementById("AppContainer")
  );
};

//hot loading
if (module.hot) {
  module.hot.accept("./App", () => {
    const NextApp = require("./App").default;
    render(NextApp);
  });
}
//render(App);

store.subscribe(() => {
  const state = store.getState();
  if (state.questions.length > 0) {
    console.info("Mounting App");
    render(App);
  } else {
    console.info("App not yet mounting");
  }
});

fetchDataForLocation(history.location);
history.listen(fetchDataForLocation);
