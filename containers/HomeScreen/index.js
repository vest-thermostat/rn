import React, { PropTypes, Component } from 'react';
import { AsyncStorage } from 'react-native'
import { NativeRouter, Route } from 'react-router-native'
import { Location } from 'expo';
import axios from 'axios';
import { 
  Container, 
  Header, 
  Title, 
  Content, 
  Drawer, 
  Button, 
  Left, 
  Right, 
  Body, 
  Icon,
  Tabs,
  Tab,
} from 'native-base';

import SideBar from '../../components/Sidebar';

import HomeContent from './content';
import SettingsContent from './settings'
import ScanContent from './scan';

export default class HomeScreen extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    logout: PropTypes.func,    
  }

  closeDrawer = () => {
    this._drawer._root.close()
  };

  openDrawer = () => {
    this._drawer._root.open()
  };

  constructor (props) {
    super(props);

    this.state = {
      current: 'HOME',
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  async componentDidMount () {
    Location.watchPositionAsync({
      enableHighAccuracy: true,
      timeInterval: 300000,
    }, (coords) =>{

      console.log({
        "position": {
          "type": "Point",
          "coordinates": [coords.longitude, coords.latitude],
        }
      });

      if (!(coords.longitude || coords.latitude)) {
        return; 
      }

      axios.post('http://vest.tperale.be/location/', {
        "position": {
          "type": "Point",
          "coordinates": [coords.longitude, coords.latitude],
        }
      }, {
        headers: {
          'Authorization': 'Token ' + this.props.token,
        },
      }).then(r => {
        return
      }).catch(e => {
        if (e.response) {
          console.error(e.response.data);
        } else {
          console.error('Error', e.message);
        }
      });
    });
  }

  handlePageChange (page) {
    this.setState({ current: page });
  }

  renderPage () {
    switch (this.state.current) {
      case 'HOME':
        return (<HomeContent token={this.props.token}/>);
      case 'SETTINGS':
        return (<SettingsContent token={this.props.token}/>);
    }
    return null; 
  }

  render() {
    return (
      <Container>
        <Drawer
          ref={ref => { this._drawer = ref; }}
          content={
              <SideBar
                  navigator={this._navigator}
                  changePage={this.handlePageChange}
                  logout={this.props.logout}
              />
          }
          onClose={this.closeDrawer.bind(this)}
        >
          <Header>
            <Left>
              <Button onPress={this.openDrawer.bind(this)} transparent>
                  <Icon name='menu' />
              </Button>
            </Left>
            <Body>
              <Title>VEST</Title>
            </Body>
            <Right />
          </Header>

          <Content>
            {this.renderPage()}
          </Content>
        </Drawer>
      </Container>
    );
  }
}
