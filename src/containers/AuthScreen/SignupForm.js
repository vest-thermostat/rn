import React, { Component, PropTypes } from 'react'
import { Container, Content, Form, Item, Input, Label } from 'native-base';
import { StyleSheet } from 'react-native'
import { Text, View } from 'react-native-animatable'

import CustomButton from '../../components/CustomButton'
import metrics from '../../config/metrics'

export default class SignupForm extends Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    onSignupPress: PropTypes.func.isRequired,
    onLoginLinkPress: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    this.state = {
      username: '',
      firstname: '',
      lastname: '',
      password: '',
      confirm_password: '',
    };
  }

  handleSubmit () {
    const { onSignupPress } = this.props;
    const form = {
      username, firstname, lastname, password, confirm_password 
    } = this.state;
    onSignupPress(form);
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
    const { email, password, fullName } = this.state
    const { isLoading, onLoginLinkPress, onSignupPress } = this.props
    const isValid = email !== '' && password !== '' && fullName !== ''
    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <Item inlineLabel>
              <Input 
                style={{color:'#fff'}}
                placeholder="Nom d'utilisateur" 
                onChangeText={username => this.setState({ username })}
              />
          </Item>
          <Item inlineLabel>
              <Input 
                style={{color:'#fff'}}
                placeholder="Prénom"
                onChangeText={firstname => this.setState({ firstname })}
              />
          </Item>
          <Item inlineLabel>
              <Input 
                style={{color:'#fff'}}
                placeholder="Nom"
                onChangeText={lastname => this.setState({ lastname })}
              />
          </Item>
          <Item inlineLabel last>
              <Input 
                style={{color:'#fff'}}
                placeholder="Mot de passe"
                onChangeText={password => this.setState({ password })}
              />
          </Item>
          <Item inlineLabel last>
              <Input 
                style={{color:'#fff'}}
                placeholder="Confirmez le mot de passe"
                onChangeText={confirm_password => this.setState({ confirm_password })}
              />
          </Item>
        </View>
        <View style={styles.footer}>
          <View ref={(ref) => this.buttonRef = ref} animation={'bounceIn'} duration={600} delay={400}>
            <CustomButton
              onPress={this.handleSubmit.bind(this)}
              isEnabled={isValid}
              isLoading={isLoading}
              buttonStyle={styles.createAccountButton}
              textStyle={styles.createAccountButtonText}
              text={'Créer un compte'}
            />
          </View>
          <Text
            ref={(ref) => this.linkRef = ref}
            style={styles.loginLink}
            onPress={onLoginLinkPress}
            animation={'fadeIn'}
            duration={600}
            delay={400}
          >
            {'Déjà un compte ?'}
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
    marginTop: 20,
  },
  footer: {
    height: 100,
    justifyContent: 'center'
  },
  createAccountButton: {
    backgroundColor: 'white'
  },
  createAccountButtonText: {
    color: '#3E464D',
    fontWeight: 'bold'
  },
  loginLink: {
    color: 'rgba(255,255,255,0.6)',
    alignSelf: 'center',
    padding: 20
  }
})
