import React, { Component, PropTypes } from 'react'
import { StyleSheet, AsyncStorage } from 'react-native'
import { View } from 'react-native-animatable';
import { Content, ListItem, Text, Spinner } from 'native-base';
import Zeroconf from 'react-native-zeroconf'

export default class ScanContent extends Component {
  constructor (props) {
    super(props);

    this.zeroconf = new Zeroconf()

    this.state = {
      scanning: false, 
      services: [],
    };
  }

  componentDidMount () {
    this.zeroconf.scan()

    this.zeroconf.on('start', () => {
      this.setState({ scanning: true });
      console.log('start');
    });

    this.zeroconf.on('found', () => console.log('found'));

    this.zeroconf.on('resolved', (service) => {
      console.log('found service, adding to list', service)
      this.setState({
        devices: this.state.services.concat([service])
      })
    });

    this.zeroconf.on('remove', (serviceName) => {
      console.log('removed', serviceName)
      this.setState({
        devices: this.state.services.filter((service) => service.name !== serviceName)
      })
    })

    this.zeroconf.on('error', () => console.log('error.'))
  }

  componentWillUnmount () {
    this.zeroconf.stop()
  }

  renderServices () {
    if (this.state.services.length) {
      return this.state.services.map(x => {
        return (
          <ListItem>
            <Text>{ x.name }</Text>
          </ListItem>
        )
      }) 
    } else {
      return (<Spinner color='blue'/>);
    }
  }

  render () {
    return (
      <View>
        {this.renderServices()}
      </View>
    );
  
  }
}
