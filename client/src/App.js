import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import Loadable from 'react-loadable';
import './App.scss';
import Cookies from 'js-cookie';

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
    console.log(Cookies.get('refreshToken'))
    if (typeof Cookies.get('refreshToken') !== 'undefined') {
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
            <Route exact path="/404" name="Page 404" component={Page404} />
            <Route exact path="/500" name="Page 500" component={Page500} />
            <Route exact path="/login" name="Login" component={CatererLogin} />
            <Route path="/restaurant" name="Dashboard" component={DefaultLayout} />
            <Route path="/" name={this.state.loggedIn ? "Dashboard" : "Login"} component={this.state.loggedIn ? DefaultLayout : CatererLogin} />
          </Switch>
      </HashRouter>
    );
  }
}

export default App;
