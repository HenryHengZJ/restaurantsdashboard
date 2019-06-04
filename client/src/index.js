import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/ie11'; // For IE 11 support
import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import InnerApp from './App';
import * as serviceWorker from './serviceWorker';
import { StripeProvider } from "react-stripe-elements";

const App = () => {
    return (
      <StripeProvider apiKey="pk_test_MQ87thwBK9MIVEqLB3jXQfHB00HFSE8cVS">
        <InnerApp />
      </StripeProvider>
    );
  };

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
