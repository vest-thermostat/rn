import React, { Component, PropTypes } from 'react'
import { StyleSheet } from 'react-native'
import { Text, View } from 'react-native-animatable'
import { Container, Content, Item, Input, Label } from 'native-base';

import CustomButton from '../../components/CustomButton'
import metrics from '../../config/metrics'

export default class LoginForm extends Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    onLoginPress: PropTypes.func.isRequired,
    onSignupLinkPress: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    }
  }

  handleSubmit () {
    const { onLoginPress } = this.props;
    const form = {
      username, password,
    } = this.state;
    onLoginPress(form);
  }

  hideForm = async () => {
    if (this.buttonRef && this.formRef && this.linkRef) {
      await Promise.all([
        this.buttonRef.zoomOut(200),
        this.formRef.fadeOut(300),
        this.linkRef.fadeOut(300)
      ])
    }
  }

  render () {
    const { username, password } = this.state
    const { isLoading, onSignupLinkPress, onLoginPress } = this.props
    const isValid = username !== '' && password !== ''
    return (
      <View style={styles.container}>
        <View style={styles.form} ref={(ref) => { this.formRef = ref }}>
          <Item inlineLabel>
              <Input 
                style={{color:'#fff'}}
                placeholder="Nom d'utilisateur" 
                onChangeText={username => this.setState({ username })}
              />
          </Item>
          <Item inlineLabel last>
              <Input 
                style={{color:'#fff'}}
                placeholder="Mot de passe"
                onChangeText={password => this.setState({ password })}
              />
          </Item>
        </View>
        <View style={styles.footer}>
          <View ref={(ref) => this.buttonRef = ref} animation={'bounceIn'} duration={600} delay={400}>
            <CustomButton
              onPress={this.handleSubmit.bind(this)}
              isEnabled={isValid}
              isLoading={isLoading}
              buttonStyle={styles.loginButton}
              textStyle={styles.loginButtonText}
              text={'Se connecter'}
            />
          </View>
          <Text
            ref={(ref) => this.linkRef = ref}
            style={styles.signupLink}
            onPress={onSignupLinkPress}
            animation={'fadeIn'}
            duration={600}
            delay={400}
          >
            {'Pas encore inscrit ?'}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: metrics.DEVICE_WIDTH * 0.1
  },
  form: {
    marginTop: 20
  },
  footer: {
    height: 100,
    justifyContent: 'center'
  },
  loginButton: {
    backgroundColor: 'white'
  },
  loginButtonText: {
    color: '#3E464D',
    fontWeight: 'bold'
  },
  signupLink: {
    color: 'rgba(255,255,255,0.6)',
    alignSelf: 'center',
    padding: 20
  }
})
