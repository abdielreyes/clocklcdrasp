var LCD = require('lcdi2c');
var moment = require('moment');
var weather = require('weather-js');
const COLS = 20;
const ROWS = 4;
var lcd = new LCD(1, 0x27, COLS, ROWS);

lcd.on();
moment.locale('es');
const NAME = 'Abdiel'
const CITY = 'Ciudad de Mexico, MX'

function clearLine(line) {
    lcd.println(" ".repeat(COLS), line);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function getSalutation() {
    const currentHour = (moment(Date.now())).format("HH");
    if (currentHour == 0 || currentHour < 12) return `Buenos dias ${NAME}!`
    else if (currentHour <= 19) return `Buenas tardes ${NAME}!`
    else return `Buenas noches ${NAME}!`
}
function getDate() {
    return capitalizeFirstLetter(moment(Date.now()).format('dddd, DD-MM-YYYY'));
}
function getHour() {
    return moment(Date.now()).format('h:mm a');
}
function getCurrentWeather() {
    return new Promise((resolve, reject) => {
        weather.find({ search: CITY, degreeType: 'C' }, function (err, result) {
            if (err) {
                resolve('Error al obtener clima')
            };

            var weather = {
                currentTemp: result[0].current.temperature,
                skyText: result[0].current.skytext
            }

            resolve(`Temp: ${weather.currentTemp}, ${weather.skyText}`)
        });
    })
}
var prevDate;
var prevHour;
var prevSalutation;
var prevWeather;
async function initScreen() {
    prevDate = getDate()
    prevHour = getHour()
    prevSalutation = getSalutation()
    prevWeather = await getCurrentWeather()
    lcd.clear();
    lcd.println(prevSalutation, 1);
    lcd.println(prevDate, 2);
    lcd.println(prevHour, 3);
    lcd.println(prevWeather, 4);
}
initScreen();

function printClock() {
    var actualSalutation = getSalutation();
    var actualDate = getDate();
    var actualHour = getHour();
    if (prevSalutation != actualSalutation) {
        clearLine(1);
        lcd.println(actualSalutation, 1);
        prevSalutation = actualSalutation;
    }
    if (prevDate != actualDate) {
        clearLine(2);
        lcd.println(actualDate, 2);
        prevDate = actualDate;
    }
    if (prevHour != actualHour) {
        clearLine(3);
        lcd.println(actualHour, 3);
        prevHour = actualHour;
    }
}
async function printWeather() {
    var actualWeather = await getCurrentWeather();
    console.log(actualWeather);
    if (prevWeather != actualWeather) {
        clearLine(4)
        lcd.println(actualWeather, 4);
        prevWeather = actualWeather;
    }
}

setInterval(() => {
    printClock();
}, 1000);
setInterval(() => {
    printWeather();
}, 5000);