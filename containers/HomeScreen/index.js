import React, { Component } from 'react';
import { NativeRouter, Route } from 'react-router-native'
import { Container, Header, Title, Content, Drawer, Button, Left, Right, Body, Icon } from 'native-base';
import SideBar from '../../components/Sidebar';

import HomeContent from './content';
import ScanContent from './scan';

export default class HomeScreen extends Component {
    static propTypes = {
      logout: React.PropTypes.func,    
    }

    closeDrawer = () => {
      this._drawer._root.close()
    };

    openDrawer = () => {
      this._drawer._root.open()
    };

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
                            <Route path="/" component={HomeContent}/>
                        </Content>
                    </Drawer>
                </Container>
            </NativeRouter>
        );
    }
}
