
import './App.css';
import {useEffect, useState} from "react";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import CurrentWeather from "./components/CurrentWeather";
import HourlyWeather from "./components/HourlyWeather";
import React from "react";
import FiveDayWeather from "./components/FiveDayWeather";

export const OPEN_WEATHER_MAP_KEY = process.env.OPEN_WEATHER_MAP_KEY
export const ACCUWEATHER_KEY = process.env.ACCUWEATHER_KEY

const ph = {
    "label": "Florence, Metropolitan City of Florence, Italy"
}

function App() {
  const [value, setValue] = useState(null);


  return (
    <div className="App">
      <GooglePlacesAutocomplete
          selectProps={{
            value,
            onChange: setValue,
          }}
      />
        {value !== null && (
            <React.Fragment>
                <CurrentWeather value={value} />
                <HourlyWeather value={value} />
                <FiveDayWeather value={value} />
            </React.Fragment>


        ) }

    </div>
  );
}

export default App;
