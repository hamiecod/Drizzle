require("dotenv").config();
const http = require("http");
const fs = require("fs");
var requests = require("requests");
const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/src', express.static('src'));

const homeFile = fs.readFileSync(path.join(__dirname, "home.html"), "utf-8");

function replaceVal(tempVal, orgVal, res) {
  if (orgVal.main == undefined) {
    res.redirect('/404');
  } else {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

    return temperature;
  }
}

app.get('/404', (req,res)=>{
  res.sendFile('404.html',{ root: "C:\\Users\\abc\\Documents\\Web-Development\\projects\\Drizzle\\src"});
});

app.get("/", (req, res) => {
  requests(
    `http://api.openweathermap.org/data/2.5/weather?q=Mohali&units=metric&appid=${process.env.APIKEY}`
  )
    .on("data", (chunk) => {
      const objdata = JSON.parse(chunk);
      const arrData = [objdata];
      const realTimeData = arrData
        .map((val) => replaceVal(homeFile, val))
        .join("");
      res.write(realTimeData);
    })
    .on("end", (err) => {
      // if (err) return console.log("connection closed due to errors", err);
      res.end();
    });
});

app.post("/", (req, res) => {
  city = req.body.search;
  requests(
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.APIKEY}`
  )
    .on("data", (chunk) => {
      const objdata = JSON.parse(chunk);
      const realTimeData = arrData
        .map((val) => replaceVal(homeFile, val))
        .join("");
      res.write(realTimeData);
    })
    .on("end", (err) => {
      // if (err) return console.log("connection closed due to errors", err);
      res.end();
    });
});

var host = "127.0.0.1";
var port = 8000;

app.listen(port, host);
