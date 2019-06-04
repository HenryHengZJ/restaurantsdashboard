import React from 'react';
import {Elements} from 'react-stripe-elements';

import OnlinePayment from "../OnlinePayment/OnlinePayment";

class TopPayment extends React.Component {
  render() {
    return (
      <Elements>
        <OnlinePayment />
      </Elements>
    );
  }
}

export default TopPayment;