const express = require("express");
const exphbs = require('express-handlebars');
const path = require("path");
const RequestInfo = require("./middleware/requestinfo")
var bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000


// App init and setup
const app = express();
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.disable('etag');


// Middlewares
app.use(RequestInfo);
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "static")));
app.use("/", require(path.join(__dirname, "routes/weather.js")));




app.listen(PORT, () => {
    console.log("+------------------+");
    console.log("|   WeatherMaster  |");
    console.log("+------------------+");
    console.log(`Weather app listening on port ${PORT}`);
    console.log(`Application started at http://127.0.0.1:${PORT}`);
});
