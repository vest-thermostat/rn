import React, { Component, PropTypes } from 'react'
import { StyleSheet, AsyncStorage } from 'react-native'
import { Text, View } from 'react-native-animatable';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Content, Toast } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Chart from 'react-native-chart';
import axios from 'axios';

import LineGauge from 'react-native-line-gauge';

export default class HomeContent extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
  }

  constructor (props) {
    super(props);

    this.state = {
      current: 0,
      data: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.getLast = this.getLast.bind(this);
  }

  httpGet () {
    return new Promise((resolve) => {
      axios.get('http://vest.tperale.be/weather/own/', {
        headers: {
          'Authorization': 'Token ' + this.props.token,
        },
      }).then(r => {
        if (r.data.results.length) {
          const data = r.data.results.reverse();
          const current = data[data.length - 1].current_temperature;
          resolve(this.setState({ current: current, data : data }));
        } else {
          resolve(this.setState({ current: 22, data : [] }));
        }
      }).catch(e => {
        if (e.response) {
          console.error(e.response.data);
        } else {
          console.error('Error', e.message);
        }
      });
    });
  }

  componentDidMount () {
    this.httpGet();

    this.ws = new WebSocket('ws://vest.tperale.be/ws/weather/');

    this.ws.onopen = () => {
      Toast.show({
        text: 'Connexion établie',
        position: 'bottom',
        buttonText: 'Ok',
        duration: 1000,
      });
    };

    this.ws.onmessage = e => {
        const json = JSON.parse(e.data);
        if (json.created && json.temperature && json.humidity) {
            json.created = json.created;
            let newWeathers = this.state.data.concat([json]);
            if (this.state.data.length < 100) {
                newWeathers.splice(0, 1);
            }
            this.setState({ data: newWeathers })
        }
    };
    this.ws.onerror = e => Toast.show({
      text: e.message,
      position: 'bottom',
      buttonText: 'Ok'
    })
    this.ws.onclose = e => Toast.show({
      text: `${e.code}: ${e.reason}`,
      position: 'bottom',
      buttonText: 'Ok'
    })

  }

  getLast () {
    const { data } = this.state;
    return data ? data[data.length - 1] : [];
  }

  handleChange (value) {
    const self = this;
    console.info(value);
    this.setState({ current: value });
    setTimeout(() => {
      if (self.state.current != value) {
        return;
      }

      AsyncStorage.getItem('token', (err, token) => {
        axios.post('http://vest.tperale.be/weather/set/', {
          temperature: value, 
        }, {
          headers: {
            'Authorization': 'Token ' + token,
          },
        }).then(r => {
          self.setState({ current: r.data.temperature });
        }).catch(e => {
          if (e.response) {
            console.error(e.response.data);
          } else {
            console.error('Error', e.message);
          }
        });
      });
    }, 2000);
  }

  createData () {
    return this.state.data.map(x => {
      return [Date.parse(x.created), x.temperature]
    });
  }

  renderCharts () {
    const data = this.createData();

    if (data.length) {
      const last = this.state.data[data.length - 1]
      return (
        <View>
          <Chart
            style={styles.chart}
            data={data}
            showGrid={false}
            showXAxisLabels={false}
            type="line"
          />
          <View style={styles.separatorContainer}/>
          <Grid>
            <Col>
              <AnimatedCircularProgress
                size={150}
                width={10}
                fill={last.temperature}
                tintColor="#00e0ff"
                backgroundColor="#3d5875"
              >
                {
                  (fill) => (
                    <Text style={styles.points}>
                      { last.temperature } °C
                    </Text>
                  )
                }
              </AnimatedCircularProgress>
            </Col>
            <Col>
              <AnimatedCircularProgress
                size={150}
                width={10}
                fill={last.humidity}
                tintColor="#00e0ff"
                backgroundColor="#3d5875"
              >
                {
                  (fill) => (
                    <Text style={styles.points}>
                      { last.humidity } %
                    </Text>
                  )
                }
              </AnimatedCircularProgress>
            </Col>
          </Grid>
        </View>
      );
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.separatorContainer} animation={'zoomIn'} delay={300} duration={300}>
          <View style={styles.separatorLine} />                                    
          <Text style={styles.separatorOr}>Temperature en ce moment</Text>
          <View style={styles.separatorLine} />                                    
        </View>
        <View style={styles.separatorContainer} animation={'zoomIn'} delay={300} duration={300}>
          {this.renderCharts()}
        </View>
        <View style={styles.separatorContainer} animation={'zoomIn'} delay={300} duration={300}>
          <View style={styles.separatorLine} />                                    
          <Text style={styles.separatorOr}>Changer la temperature</Text>
          <View style={styles.separatorLine} />                                    
        </View>
        <Text style={styles.separatorOr}>{String(this.state.current) + ' °C'}</Text>
        <LineGauge 
          min={15} 
          max={30} 
          value={this.state.current}
          onChange={this.handleChange.bind(this)}
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
  points: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 57,
    width: 150,
    textAlign: 'center',
    color: '#7591af',
    fontSize: 25,
    fontWeight: "100"
  },
  button: {
    backgroundColor: '#1976D2',
    margin: 20
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  chart: {
    //width: '90%',
    width: 320,
    height: 100,
  },
  separatorContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 20
  },
  separatorLine: {                                                                 
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    height: StyleSheet.hairlineWidth,
    borderColor: '#9B9FA4'
  },
  separatorOr: {
    color: '#9B9FA4',
    marginHorizontal: 8
  },
})
