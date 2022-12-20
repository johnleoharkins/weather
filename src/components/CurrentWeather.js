import {useEffect, useState} from "react";
import {geocodeByAddress, getLatLng} from "react-google-places-autocomplete";
import {OPEN_WEATHER_MAP_KEY} from "../App";
import classes from './CurrentWeather.module.css'
import React from "react";
const CurrentWeather = ({ value }) => {
    const [currWeather, setCurrWeather] = useState(null)


    useEffect(() => {
        if(value !== null) {
            const cw = getLatLon(value.label).then((r) => getCurrentWeatherData(r.lat, r.lng))
        }

    }, [value])

    const getCurrentWeatherData = async (lat, lon) => {
        const endpoint = `https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_MAP_KEY}`
        const res = await fetch(endpoint, { method: 'GET' }).then((res) => res.json())
        // console.log("current weather...", res)
        setCurrWeather({ 'temp': res.main.temp, 'temp_max': res.main.temp_max, 'temp_min': res.main.temp_min, 'desc': res.weather[0].description, 'wind_speed': res.wind.speed, 'wind_deg': res.wind.deg })
        return res
    }

    const getLatLon = (val) => {
        return geocodeByAddress(val)
            .then(results => getLatLng(results[0]))
            .then(({ lat, lng }) => {
                // console.log('Successfully got latitude and longitude', { lat, lng })
                return {lat, lng}
            });
    }

    const currentWeather = () => {
        return(
            <div className={classes.currentWeather__container}>
                <div className={classes.cityLabel}>
                    <span>{value.label.split(',')[0]}</span>
                </div>
                <div className={classes.currentTemp}>
                    <span>{currWeather.temp}&deg;</span>
                </div>
                <div className={classes.currentWeatherInfo}>
                    <span>{currWeather.desc}</span>
                    <div className={classes.currentWeatherHighLow}>
                        <span>H:{currWeather.temp_max}&deg;</span>
                        <span>L:{currWeather.temp_min}&deg;</span>
                    </div>
                </div>
            </div>
        )
    }

    return(
        <React.Fragment>
            {currWeather !== null && currentWeather() }
        </React.Fragment>

    )
}

export default CurrentWeather;