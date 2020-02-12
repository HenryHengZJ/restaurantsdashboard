import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import Loadable from 'react-loadable';
import './App.scss';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = Loadable({
  loader: () => import('./containers/DefaultLayout'),
  loading
});

// Pages

const ForgotPassword = Loadable({
  loader: () => import('./views/Pages/ForgotPassword'),
  loading
});

const ResetPassword = Loadable({
  loader: () => import('./views/Pages/ResetPassword'),
  loading
});

const CatererLogin = Loadable({
  loader: () => import('./views/Pages/CatererLogin'),
  loading
});

const DeliveryConfirmation = Loadable({
  loader: () => import('./views/Pages/DeliveryConfirmation'),
  loading
});

const SearchCaterer = Loadable({
  loader: () => import('./views/Pages/SearchCaterer'),
  loading
});

const CatererDetail = Loadable({
  loader: () => import('./views/Pages/CatererDetail'),
  loading
});

const Login = Loadable({
  loader: () => import('./views/Pages/Login'),
  loading
});

const Register = Loadable({
  loader: () => import('./views/Pages/Register'),
  loading
});

const Page404 = Loadable({
  loader: () => import('./views/Pages/Page404'),
  loading
});

const Page500 = Loadable({
  loader: () => import('./views/Pages/Page500'),
  loading
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {loggedIn: false}
    this.connecToServer = this.connecToServer.bind(this);
  }

  connecToServer() {
    fetch('/');
  }

  componentDidMount() {
    if (localStorage.getItem('jwt') && typeof localStorage.getItem('jwt') !== 'undefined') {
      this.setState({
        loggedIn: true
      })
    }
    this.connecToServer();
  }

  render() {
    return (
      <HashRouter>
          <Switch>
            <Route exact path="/forgotpassword" name="Forgot Password" component={ForgotPassword} />
            <Route exact path="/resetpassword/:resetlink" name="Reset Password" component={ResetPassword} />
            <Route exact path="/deliveryconfirmation" name="Delivery Confirmation" component={DeliveryConfirmation} />
            <Route exact path="/catererdetail" name="Caterer Detail" component={CatererDetail} />
            <Route exact path="/searchcaterer" name="Search Caterer" component={SearchCaterer} />
            <Route exact path="/login" name="Login Page" component={Login} />
            <Route exact path="/register" name="Register Page" component={Register} />
            <Route exact path="/404" name="Page 404" component={Page404} />
            <Route exact path="/500" name="Page 500" component={Page500} />
            <Route path="/caterer" name="Caterer Dashboard" component={DefaultLayout} />
            <Route path="/" name={this.state.loggedIn ? "Caterer Dashboard" : "CatererLogin"} component={this.state.loggedIn ? DefaultLayout : CatererLogin} />
          </Switch>
      </HashRouter>
    );
  }
}

export default App;
