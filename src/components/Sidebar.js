import React, { Component, StyleSheet } from 'react';
import { connect } from 'react-redux';
import { Content, Text, List, ListItem } from 'native-base';


export default class SideBar extends Component {
  static propTypes = {
    logout: React.PropTypes.func,
  }

  render() {
    const styles = {
      sidebar: {
        flex: 1,
        padding: 10,
        paddingRight: 0,
        paddingTop: 30,
        backgroundColor: '#fff',
      },
    };

    return (
      <Content style={styles.sidebar} >
        <ListItem button>
          <Text>Accueil</Text>
        </ListItem>
        <ListItem button onPress={this.props.logout} >
          <Text>Se déconnecter</Text>
        </ListItem>
      </Content>
    );
  }
}


