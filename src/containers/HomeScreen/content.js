import React, { Component, PropTypes } from 'react'
import { StyleSheet, View } from 'react-native'

import CustomButton from '../../components/CustomButton'

export default class Content extends Component {
  static propTypes = {
  }

  render () {
    return (
      <View style={styles.container}>
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
