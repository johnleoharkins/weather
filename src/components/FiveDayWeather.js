import React, {useEffect, useState} from "react";
import {ACCUWEATHER_KEY} from "../App";
import {geocodeByAddress, getLatLng} from "react-google-places-autocomplete";

import classes from './FiveDayWeather.module.css'
const FiveDayWeather = ({ value }) => {
    const [fiveDayWeather, setFiveDayWeather] = useState(null)

    useEffect(() => {
        if(value !== null) {
            const hw = getLatLon(value.label).then((r) => getLocationKey(r.lat, r.lng)).then((locKey) => getTenDayWeatherData(locKey))
        }

    }, [value])

    const getLocationKey = async (lat, lon) => {
        const endpoint = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?q=${lat},${lon}&apikey=${ACCUWEATHER_KEY}`
        const res = await fetch(endpoint, {method: 'GET'}).then((res) => res.json()).then((data) => data.Key)
        return res
    }
    const getTenDayWeatherData = async (locKey) => {
        const endpoint = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locKey}?apikey=${ACCUWEATHER_KEY}`
        const res = await fetch(endpoint, {method: 'GET'}).then((res) => res.json())
        console.log("ten day...", res.DailyForecasts)
        setFiveDayWeather(res.DailyForecasts)
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

    const FiveDayForecast = () => {
        let currDate = new Date()
        let currDay = currDate.getDay()
        return fiveDayWeather.map((data) => {
            let day = new Date(data.EpochDate * 1000).getDay()
            if(currDay === day){
                day = 'Today'
            }else if(day === 1){
                day = 'Mon'
            }else if(day === 2){
                day = 'Tue'
            }else if(day === 3){
                day = 'Wed'
            }else if(day === 4){
                day = 'Thu'
            }else if(day === 5){
                day = 'Fri'
            }else if(day === 6){
                day = 'Sat'
            }else if(day === 7){
                day = 'Sun'
            }

            let icon = data.Day.Icon.toString()
            if (icon < 10) {
                icon = '0' + icon
            }
            icon = icon + '-s.png'
            // console.log(icon)

            return (
                <tr className={classes.fiveDayWeather} key={`five-${data.EpochDate}`}>
                    <td><span>{day}</span></td>
                    <td><img className={classes.icon} src={`/static/${icon}`} /></td>
                    <td><span>{data.Temperature.Maximum.Value}&deg;</span></td>
                    <td><span>{data.Temperature.Minimum.Value}&deg;</span></td>

                </tr>
            )

        })

    }


    return(
        <table className={classes.fiveDayWeather__container}>
            <thead>
            <tr>
                <th colSpan={2}>Five Day</th>
                <th>High</th>
                <th>Low</th>
            </tr>
            </thead>
            <tbody>

            {fiveDayWeather !== null && FiveDayForecast() }
            </tbody>

        </table>
    )
}

export default FiveDayWeather