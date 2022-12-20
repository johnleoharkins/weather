import React, {useEffect, useState} from "react";
import {ACCUWEATHER_KEY, OPEN_WEATHER_MAP_KEY} from "../App";
import {geocodeByAddress, getLatLng} from "react-google-places-autocomplete";

import classes from './HourlyWeather.module.css'

const HourlyWeather = ({ value }) => {
    const [hourlyWeather, setHourlyWeather] = useState(null)

    useEffect(() => {
        if(value !== null) {
            const hw = getLatLon(value.label).then((r) => getLocationKey(r.lat, r.lng)).then((locKey) => getHourlyWeatherData(locKey))
        }

    }, [value])

    const getLocationKey = async (lat, lon) => {
        const endpoint = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?q=${lat},${lon}&apikey=${ACCUWEATHER_KEY}`
        const res = await fetch(endpoint, {method: 'GET'}).then((res) => res.json()).then((data) => data.Key)
        return res
    }
    const getHourlyWeatherData = async (locKey) => {
        const endpoint = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locKey}?apikey=${ACCUWEATHER_KEY}`
        const res = await fetch(endpoint, {method: 'GET'}).then((res) => res.json())
        // console.log("Hourly...", res)
        setHourlyWeather(res)
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

    const hourlyForecast = () => {
        let currDate = new Date()
        let currHour = currDate.getHours()
        // console.log(currHour)
        return hourlyWeather.map((data) => {
            let date = new Date(data.EpochDateTime * 1000)
            let hour = date.getHours()
            // console.log(date, hour)
            let icon = data.WeatherIcon.toString()
            if (icon < 10) {
                icon = '0' + icon
            }
            icon = icon + '-s.png'
            // console.log(icon)
            if(hour === currHour + 1){
                hour = 'Now'
            }
            else if(hour >= 12){
                hour = (hour -12).toString() + 'pm'
            }else{
                hour = hour.toString() + 'am'
            }
            return (
                <div key={`hourly-${data.EpochDateTime}`} className={classes.hourlyWeather}>
                    <span>{hour === currHour + 1 ? 'Now' : hour}</span>

                    <img className={classes.hourlyIcon} src={`/static/${icon}`} alt={'hourly weather icon'} />

                    <span>{data.Temperature.Value}&deg;</span>
                </div>
            )
        })
    }

    return (
        <div className={classes.hourlyWeather__container}>
            {hourlyWeather !== null && hourlyForecast()}
        </div>
    )
}

export default HourlyWeather