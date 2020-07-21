var LCD = require('lcdi2c');
var moment = require('moment');
var weather = require('weather-js');

var lcd = new LCD(1, 0x27, 20, 4);

lcd.on();
moment.locale('es');
const NAME = 'Abdiel'
const CITY = 'Ciudad de Mexico, MX'

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
    return capitalizeFirstLetter(moment(Date.now()).format('dddd DD/MM/YYYY'));
}
function getHour() {
    return moment(Date.now()).format('h:mm a');
}
async function getCurrentWeather() {

    var w = await weather.find({ search: CITY, degreeType: 'C' }, function (err, result) {

        if (err) {
            reject(err);
        };
        var weather = {
            currentTemp: result[0].current.termperature,
            skyCode: result[0].current.skycode
        }

        return `Temp: ${weather.currentTemp}, ${weather.skyCode}`
    });


}
var prevDate = getDate()
var prevHour = getHour()
var prevSalutation = getSalutation()
var prevWeather = getCurrentWeather()
function initScreen() {
    lcd.clear();
    lcd.println(prevSalutation, 1);
    lcd.println(prevDate, 2);
    lcd.println(prevHour, 3);
    lcd.println(prevWeather, 4);
}
initScreen();
setInterval(() => {
    var actualSalutation = getSalutation();
    var actualDate = getDate();
    var actualHour = getHour();
    if (prevSalutation != actualSalutation) {
        lcd.println(actualSalutation, 1);
        prevSalutation = actualSalutation;
    }
    if (prevDate != actualDate) {
        lcd.println(actualDate, 2);
        prevDate = actualDate;
    }
    if (prevHour != actualHour) {
        lcd.println(actualHour, 3);
        prevHour = actualHour;
    }
}, 1000);
setInterval(() => {
    var actualWeather = getCurrentWeather();
    
    if (prevWeather != actualWeather) {
        lcd.println(getWeather(), 4);
        prevWeather = actualWeather;
    }
}, 1800000);