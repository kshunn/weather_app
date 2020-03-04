import React from 'react';
import {Alert} from 'react-native';
import Loading from './Loading';
import Weather from './Weather';
import * as Location from 'expo-location';
import axios from 'axios';
import * as Font from 'expo-font';

const API_KEY = "af0adfd7b8a79dbdd3e2553a1d66be71";

export default class extends React.Component {
  state ={
    isLoading: true,
    isFontLoading: true
  };
  getFont = async() => {
    await Font.loadAsync({
      'montserrat-regular': require('./assets/fonts/Montserrat-Regular.ttf'),
      'montserrat-medium': require('./assets/fonts/Montserrat-Medium.ttf'),
      'montserrat-bold': require('./assets/fonts/Montserrat-Bold.ttf')
    });
    this.setState({isFontLoading: false});
  }
  getWeather = async(latitude, longitude) => {
    const {
      data: {
         main: { temp }, 
         weather 
      } 
    } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
    );
    this.setState({isLoading: false, condition: weather[0].main, temp});
  };
  getLocation = async() => {
    try{
      await Location.requestPermissionsAsync();
      const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync();
      this.getWeather(latitude, longitude);
    } catch(error){
      Alert.alert("Can't find you", "So sad");
    }
  };
  componentDidMount(){
    this.getLocation();
    this.getFont();
  }
  render(){
    const {isLoading, isFontLoading, temp, condition} = this.state;
    return (isLoading || isFontLoading) ? <Loading /> : <Weather temp={Math.round(temp)} condition={condition}/>;
  }
}

