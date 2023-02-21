const express = require("express");
const path = require("path");
const request = require('request');
const localStorage = require("localStorage");
const getWeatherIcon = require("../utils/IconCodeFinder");
const bgOnWeather = require("../utils/bgOnWeather");
const countryCode = require("../data/countryCode");
let API_key = "8e44efb0ae84f237a5d93f5f4d629433";


const router = express.Router();


router.get("/", async (req, res) => {
    let lat, lon, name, country = "";
    console.log(localStorage.getItem("weatherHome"));
    if (localStorage.getItem("weatherHome")) {
        let saveddata = localStorage.getItem("weatherHome");
        saveddata = JSON.parse(saveddata);
        lat = saveddata.lat;
        lon = saveddata.lon;
        name = saveddata.name;
        country = saveddata.country;

    }
    else {
        // Kolkata
        lat = "22.5414185";
        lon = "88.35769124388872";
        name = "Kolkata";
        state = "West Bengal";
        country = "IN"
    }
    let cur_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_key}`
    console.log(name);
    await request(cur_url, function (error, response, body) {
        // console.log(url);
        let data = JSON.parse(body);
        let icon = getWeatherIcon(data.weather[0].id);
        let fullcountry = countryCode.find(c => c.code == country);
        fullcountry = fullcountry.name;
        if (!fullcountry) {
            fullcountry = country;
        }
        filtered = {
            temp: data.main.temp,
            hum: data.main.humidity,
            tmax: data.main.temp_max,
            tmin: data.main.temp_min,
            wind: data.wind.speed,
            des: data.weather[0].description,
            cloud: data.clouds.all,
            icon: icon,
            name: name,
            country: country,
            fullcountry: fullcountry,
            bg: bgOnWeather(data.weather[0].id)
        }
        for_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_key}`
        request(for_url, function (error, response, body) {
            let data = JSON.parse(body);
            // console.log(data);
            let forcust = [];
            let currentdt = new Date();
            const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const monthlist = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let hour = currentdt.getHours();
            let minute = currentdt.getMinutes();
            let day = weekday[currentdt.getDay()];
            let month = monthlist[currentdt.getMonth()];
            dorn = "AM"
            if (hour > 12) {
                dorn = "PM"
                hour = hour - 12;
            }
            else if (hour == 12 && minute > 0) {
                dorn = "PM"
            }
            if (hour < 10) {
                hour = "0" + hour;
            }
            if (minute < 10) {
                minute = "0" + minute;
            }

            let cdatetime = `${day}, ${month} ${currentdt.getDate()}, ${currentdt.getFullYear()}, ${hour}:${minute}${dorn}`;




            let nextday = true;


            data.list.forEach(result => {
                let dtstamp = new Date(result.dt * 1000);
                dtstamp = new Date(dtstamp + " UTC");
                let hour = dtstamp.getHours();
                let minute = dtstamp.getMinutes();
                dorn = "AM"
                if (hour > 12) {
                    dorn = "PM"
                    hour = hour - 12;
                }
                else if (hour == 12 && minute > 0) {
                    dorn = "PM"
                }
                if (hour < 10) {
                    hour = "0" + hour;
                }
                if (minute < 10) {
                    minute = "0" + minute;
                }

                // console.log(currentdt.getDate(), dtstamp.getDate());
                if (nextday) {
                    if (currentdt.getDate() + 1 >= dtstamp.getDate()) {
                        let hour = dtstamp.getHours();
                        let minute = dtstamp.getMinutes();
                        dorn = "AM"
                        if (hour > 12) {
                            dorn = "PM"
                            hour = hour - 12;
                        }
                        else if (hour == 12 && minute > 0) {
                            dorn = "PM"
                        }
                        if (hour < 10) {
                            hour = "0" + hour;
                        }
                        if (minute < 10) {
                            minute = "0" + minute;
                        }
                        tempres = {
                            time: hour + ":" + minute + dorn,
                            icon: getWeatherIcon(result.weather[0].id),
                            temp: result.main.temp
                        }
                        forcust.push(tempres);
                    }
                }
            });

            // console.log(forcust);
            res.render("home", {
                layout: "main",
                Title: "Home",
                data: filtered,
                forcast: forcust,
                datetime: cdatetime
            })
        });
    })

})




router.get("/weather/:country/:name/:lat/:lon", (req, res) => {
    console.log(req.params.lat)
    console.log(req.params.lon);
    console.log(req.params.name);
    console.log(req.params.country);

    let defaultlatlon = [22.5414185, 88.35769124388872]; //Kolkata
    let name = req.params.name;
    let country = req.params.country;
    let lat = req.params.lat;
    let lon = req.params.lon;
    let cur_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_key}`
    request(cur_url, function (error, response, body) {
        // console.log(url);
        let data = JSON.parse(body);
        let icon = getWeatherIcon(data.weather[0].id);
        let fullcountry = countryCode.find(c => c.code == country);
        fullcountry = fullcountry.name;
        if (!fullcountry) {
            fullcountry = country;
        }
        // console.log(fullcountry);
        filtered = {
            temp: data.main.temp,
            hum: data.main.humidity,
            tmax: data.main.temp_max,
            tmin: data.main.temp_min,
            wind: data.wind.speed,
            des: data.weather[0].description,
            cloud: data.clouds.all,
            icon: icon,
            name: name,
            country: country,
            lat: lat,
            lon: lon,
            bg: bgOnWeather(data.weather[0].id),
            fullcountry: fullcountry
        }
        for_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_key}`
        request(for_url, function (error, response, body) {
            let data = JSON.parse(body);
            // console.log(data);
            let forcust = [];
            let currentdt = new Date();
            const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const monthlist = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let hour = currentdt.getHours();
            let minute = currentdt.getMinutes();
            let day = weekday[currentdt.getDay()];
            let month = monthlist[currentdt.getMonth()];
            dorn = "AM"
            if (hour > 12) {
                dorn = "PM"
                hour = hour - 12;
            }
            else if (hour == 12 && minute > 0) {
                dorn = "PM"
            }
            if (hour < 10) {
                hour = "0" + hour;
            }
            if (minute < 10) {
                minute = "0" + minute;
            }

            let cdatetime = `${day}, ${month} ${currentdt.getDate()}, ${currentdt.getFullYear()}, ${hour}:${minute}${dorn}`;




            let nextday = true;


            data.list.forEach(result => {
                let dtstamp = new Date(result.dt * 1000);
                dtstamp = new Date(dtstamp + " UTC");
                let hour = dtstamp.getHours();
                let minute = dtstamp.getMinutes();
                dorn = "AM"
                if (hour > 12) {
                    dorn = "PM"
                    hour = hour - 12;
                }
                else if (hour == 12 && minute > 0) {
                    dorn = "PM"
                }
                if (hour < 10) {
                    hour = "0" + hour;
                }
                if (minute < 10) {
                    minute = "0" + minute;
                }

                // console.log(currentdt.getDate(), dtstamp.getDate());
                if (nextday) {
                    if (currentdt.getDate() + 1 >= dtstamp.getDate()) {
                        let hour = dtstamp.getHours();
                        let minute = dtstamp.getMinutes();
                        dorn = "AM"
                        if (hour > 12) {
                            dorn = "PM"
                            hour = hour - 12;
                        }
                        else if (hour == 12 && minute > 0) {
                            dorn = "PM"
                        }
                        if (hour < 10) {
                            hour = "0" + hour;
                        }
                        if (minute < 10) {
                            minute = "0" + minute;
                        }
                        tempres = {
                            time: hour + ":" + minute + dorn,
                            icon: getWeatherIcon(result.weather[0].id),
                            temp: result.main.temp
                        }
                        forcust.push(tempres);
                    }
                }
            });
            // console.log(forcust);
            res.render("home", {
                layout: "main",
                Title: "Home",
                data: filtered,
                forcast: forcust,
                datetime: cdatetime,
                save: true
            })
        });
    })
})

router.get("/api/:city", (req, res) => {
    console.log(req.params.city)
    let url = `http://api.openweathermap.org/geo/1.0/direct?q=${req.params.city}&limit=5&appid=${API_key}`
    request(url, function (error, response, body) {
        data = JSON.parse(body);
        result = []
        data.forEach(location => {
            let state = "";
            if (location.state) {
                state = location.state;
            }
            tempdata = {
                name: location.name,
                state: state,
                country: location.country,
                lat: location.lat,
                lon: location.lon
            }
            result.push(tempdata);
        });
        res.send(result);
    });
})

router.get("/save/:country/:name/:lat/:lon", (req, res) => {
    localStorage.setItem("weatherHome", JSON.stringify(
        {
            name: req.params.name,
            country: req.params.country,
            lat: req.params.lat,
            lon: req.params.lon
        }
    ));
    console.log(localStorage.getItem("weatherHome"));
    res.send({ "status": 200 });
});


module.exports = router;