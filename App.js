import React, { Component } from 'react';
import Exponent from 'expo';
import { Platform, AsyncStorage } from 'react-native'
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
      isLoggedIn: false,
      isLoading: false,
      isAppReady: false,
      token: '',
    }
  }

  async componentWillMount () {
    if (Platform.OS === 'android') {
      await Exponent.Font.loadAsync({
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      });
    }

    AsyncStorage.getItem('token', (err, res) => {
      if (res) {
        this.setState({ isLoggedIn: true, isLoading: false, token: res });
      }
    })
  }

  /**
   * Two login function that waits 1000 ms and then authenticates the user succesfully.
   * In your real app they should be replaced with an API call to you backend.
   */
  _login (form) {
    this.setState({ isLoading: true });
    setTimeout(() => {
      axios.post(VEST_URL + 'api-auth/', form).then(x => {
        AsyncStorage.setItem('token', x.data.token);
        this.setState({ isLoggedIn: true, isLoading: false, token: x.data.token })
      }).catch(e => {
        if (e.response) {
          console.log(e.response.data);
        } else {
          console.log(e.message);
        }
        this.setState({ isLoggedIn: false, isLoading: false })
      })
    }, 1000);
  }

  _signup (form) {
    this.setState({ isLoading: true })
    console.log(JSON.stringify(form));
    setTimeout(() => {
      axios.post(VEST_URL + 'users/register/', form).then(x => {
        this._login(form);
      }).catch(x => {
        this.setState({ isLoggedIn: false, isLoading: false })
      })
    }, 1000);
  }

  _logout () {
    AsyncStorage.removeItem('token', () => {
      this.setState({ isLoggedIn: false, isAppReady: false })
    });
  }

  render () {
    if (this.state.isAppReady) {
      return (
        <HomeScreen
          token={this.state.token}
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
