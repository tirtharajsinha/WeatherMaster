const weatherIcons = require('../data/icon');

function getWeatherIcon(code) {
    var icon = weatherIcons[code].icon;
    // If we are not in the ranges mentioned above, add a day/night prefix.
    if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
        icon = 'day-' + icon;
    }


    return "wi-" + icon;

}

module.exports = getWeatherIcon;