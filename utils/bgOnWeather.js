function bgOnWeather(code) {
    let bg = ""
    let catagory = Math.floor(code / 100)
    let imgid = Math.floor(Math.random() * 2);
    if (imgid == 0) {
        imgid = "";
    }
    if (code == 800) {
        // clear
        bg = "clear";
    }
    else if (catagory == 8) {
        // cloud
        bg = "cloud"
    }
    else if (catagory == 7) {
        // atmosphere
        bg = "cloud"
    }
    else if (catagory == 6) {
        // snow
        bg = "snow"
    }
    else if (catagory == 5) {
        // rain
        bg = "rain"
    }
    else if (catagory == 3) {
        // rain
        bg = "rain"
    }
    else if (catagory == 2) {
        //thunder
        bg = "thunder"
    }
    // bg = "rain"
    bg += imgid;

    return bg;
}

module.exports = bgOnWeather;