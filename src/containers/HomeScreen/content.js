import React, { Component, PropTypes } from 'react'
import { StyleSheet, View, AsyncStorage } from 'react-native'
import axios from 'axios';

import LineGauge from 'react-native-line-gauge';

export default class Content extends Component {
  static propTypes = {
  }

  constructor (props) {
    super(props);

    this.state = {
      data: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.getLast = this.getLast.bind(this);
  }

  componentWillMount () {
    AsyncStorage.getItem('token', (err, token) => {
      if (err) {
        return console.error(err);
      }
      axios.get('http://vest.tperale.be/weather/own/', {
        headers: {
          'Authorization': 'Token ' + token,
        },
      }).then(r => {
        console.info(JSON.stringify(r.data));
        this.setState({ data : r.data.results });
      }).catch(e => {
        if (e.response) {
          console.error(e.response.data);
        } else {
          console.error('Error', e.message);
        }
      });
    });
  }

  getLast () {
    const { data } = this.state;
    return data ? data[data.length - 1] : [];
  }

  handleChange (value) {
    axios.post('http://vest.tperale.be/weather/set/', {
      temperature: value, 
    }).then(r => {
      this.setState({ current: r.data.value });
    }).catch(e => {
    
    });
  }

  render () {
    const last = this.getLast();
    return (
      <View style={styles.container}>
        <LineGauge 
          min={15} 
          max={30} 
          value={last ? last.current_temperature : 22}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#1976D2',
    margin: 20
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  }
})
