var LCD = require('lcdi2c');
var moment = require('moment');
var weather = require('weather-js');
const COLS = 20;
const ROWS = 4;
var lcd = new LCD(1, 0x27, COLS, ROWS);

lcd.on();
moment.locale('es');
const NAME = 'Abdiel'
const CITY = 'Mexico City, MX'
var prevDate;
var prevHour;
var prevSalutation;
var prevWeather;

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
            var res = result[0];
            
            var weather = {
                currentTemp: res.current.temperature,
                skyText: res.current.skytext
            }
            resolve(`Temp: ${weather.currentTemp}, ${weather.skyText}`)
        });
    })
}
function lcdErrorHandler( err ) {
    console.log( 'Unable to print to LCD display on bus 1 at address 0x27',err );
    //Disable further processing if application calls this recursively.
};
async function initScreen() {
    prevDate = getDate()
    prevHour = getHour()
    prevSalutation = getSalutation()
    prevWeather = await getCurrentWeather()
    lcd.clear(); if( lcd.error )lcdErrorHandler( lcd.error );
    lcd.println(prevSalutation, 1);if( lcd.error )lcdErrorHandler( lcd.error );
    lcd.println(prevDate, 2);if( lcd.error )lcdErrorHandler( lcd.error );
    lcd.println(prevHour, 3);if( lcd.error )lcdErrorHandler( lcd.error );
    lcd.println(prevWeather, 4);if( lcd.error )lcdErrorHandler( lcd.error );
}

function printClock() {
    var actualSalutation = getSalutation();
    var actualDate = getDate();
    var actualHour = getHour();
    if (prevSalutation != actualSalutation) {
        clearLine(1);
        lcd.println(actualSalutation, 1);if( lcd.error )lcdErrorHandler( lcd.error );
        prevSalutation = actualSalutation;
    }
    if (prevDate != actualDate) {
        clearLine(2);
        lcd.println(actualDate, 2);if( lcd.error )lcdErrorHandler( lcd.error );
        prevDate = actualDate;
    }
    if (prevHour != actualHour) {
        clearLine(3);
        lcd.println(actualHour, 3);if( lcd.error )lcdErrorHandler( lcd.error );
        prevHour = actualHour;
    }

}
async function printWeather() {
    var actualWeather = await getCurrentWeather()
    if (prevWeather != actualWeather) {
        clearLine(4)
        lcd.println(actualWeather, 4);if( lcd.error )lcdErrorHandler( lcd.error );
        prevWeather = actualWeather;
    }
}
initScreen();
setInterval(() => {
    printClock();
}, 1000);
setInterval(() => {
    printWeather();
}, 5000);