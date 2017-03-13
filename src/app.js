import React, { Component } from 'react';
import axios from 'axios';

import AuthScreen from './containers/AuthScreen';
import HomeScreen from './containers/HomeScreen';

const VEST_URL = 'http://vest.tperale.be/';

/**
 * The root component of the application.
 * In this component I am handling the entire application state, but in a real app you should
 * probably use a state management library like Redux or MobX to handle the state (if your app gets bigger).
 */
export class LoginAnimation extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isLoggedIn: false, // Is the user authenticated?
      isLoading: false, // Is the user loggingIn/signinUp?
      isAppReady: false // Has the app completed the login animation?
    }
  }
  /**
   * Two login function that waits 1000 ms and then authenticates the user succesfully.
   * In your real app they should be replaced with an API call to you backend.
   */
  _login (form) {
    this.setState({ isLoading: true });
    setTimeout(() => {
      axios.post(VEST_URL + 'api-auth/', form).then(x => {
        this.setState({ isLoggedIn: true, isLoading: false })
      }).catch(x => {
        this.setState({ isLoggedIn: false, isLoading: false })
      })
    }, 1000);
  }

  _signup (form) {
    this.setState({ isLoading: true })
    setTimeout(() => {
      axios.post(VEST_URL + 'users/register/', form).then(x => {
        this.setState({ isLoggedIn: true, isLoading: false })
      }).catch(x => {
        this.setState({ isLoggedIn: false, isLoading: false })
      })
    }, 1000);
  }

  _logout () {
    this.setState({ isLoggedIn: false, isAppReady: false })
  }

  render () {
    if (this.state.isAppReady) {
      return (
        <HomeScreen
          logout={this._logout.bind(this)}
        />
      )
    } else {
      return (
        <AuthScreen
          login={this._login.bind(this)}
          signup={this._signup.bind(this)}
          isLoggedIn={this.state.isLoggedIn}
          isLoading={this.state.isLoading}
          onLoginAnimationCompleted={() => this.setState({ isAppReady: true })}
        />
      )
    }
  }
}

export default LoginAnimation
