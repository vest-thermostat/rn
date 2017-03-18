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

  }

  async componentDidMount () {
    Location.watchPositionAsync({
      timeInterval: 300000,
    }, (coords) =>{
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

  render() {
    return (
      <NativeRouter>
        <Container>
          <Drawer
            ref={ref => { this._drawer = ref; }}
            content={
                <SideBar
                    navigator={this._navigator}
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
              <Tabs>
                <Tab heading="Dashboard">
                  <HomeContent token={this.props.token}/>
                </Tab>
                <Tab heading="Option">
                  <SettingsContent token={this.props.token}/>
                </Tab>
              </Tabs>
            </Content>
          </Drawer>
        </Container>
      </NativeRouter>
    );
  }
}
