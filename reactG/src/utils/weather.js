import axios from "axios";
import { config } from "../assets/config";
async function getPosition() {
  try {
    const city = await axios({
      url: config.geoAPI,
      params: { key: config.GaodeKey },
      method: "get",
    });
    if (city.data.adcode.length === 0) {
      return "350100";
    } else {
      return city.data.adcode;
    }
  } catch (err) {
    console.error(err);
    return "350100";
  }
}
export async function getLocationID() {
  const adcode = await getPosition();
  try {
    const locationID = await axios({
      url: config.locationIDAPI,
      params: { key: config.HeFengKey, location: adcode },
      method: "get",
    });
    return locationID.data.location[0].id;
  } catch (err) {
    console.error(err);
    return "101230101";
  }
}

export async function getLiveWeather() {
  const locationID = await getLocationID();
  try {
    const liveWeather = await axios({
      url: config.liveWeatherAPI,
      params: { key: config.HeFengKey, location: locationID },
      method: "get",
    });
    return {
      temp: liveWeather.data.now.temp,
      feelsLike: liveWeather.data.now.feelsLike,
      icon: liveWeather.data.now.icon,
      text: liveWeather.data.now.text,
      fxLink: liveWeather.data.fxLink,
    };
  } catch (err) {
    console.error(err);
    return {
      temp: "Nan",
      feelsLike: "Nan",
      icon: "qweather",
      text: "Nan",
      fxLink: "https://www.qweather.com/weather/fuzhou-101230101.html",
    };
  }
}

export async function getForcastWeather() {
  const locationID = await getLocationID();
  try {
    const forcastWeather = await axios({
      url: config.forcastWeatherAPI,
      params: { key: config.HeFengKey, location: locationID },
      method: "get",
      responseType: "json",
    });
    return forcastWeather.data.hourly.map((weather, _) => {
      const data = new Date(weather.fxTime).getHours();
      return {
        temp: weather.temp,
        icon: weather.icon,
        text: weather.text,
        pop: weather.pop,
        time: data,
      };
    });
  } catch (err) {
    console.error(err);
    const errorArray = new Array(24);
    const time = new Date().getHours();
    return errorArray.map((_, index) => {
      return {
        temp: "Nan",
        icon: "qweather",
        text: "Nan",
        pop: "Nan",
        time: time + index + 1,
      };
    });
  }
}
