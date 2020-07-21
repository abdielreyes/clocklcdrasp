var LCD = require('lcdi2c');
var moment = require('moment');
var lcd = new LCD(1, 0x27, 20, 4);

lcd.off();
moment.locale('es');

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function getSalutation() {
    const currentHour = (moment(Date.now())).format("HH");
    if (currentHour == 0 || currentHour < 12) return "Buenos dias!"
    else if (currentHour <= 19) return "Buenas tardes!"
    else return "Buenas noches!"
}
function getDate(){
    return capitalizeFirstLetter(moment(Date.now()).format('dddd, DD MMMM yyyy'));
}
function getHour(){
    return moment(Date.now()).format('h:mm a');
}
var prevDate=getDate()
var prevHour=getHour()
var prevSalutation=getSalutation()
function initScreen() {
    lcd.clear();
    lcd.println(getSalutation(), 1);
    lcd.println(fecha, 2);
    lcd.println(hora, 3);
    lcd.println('                    ', 4);
}
initScreen();
setInterval(() => {
    if(prevSalutation != getSalutation()){
        lcd.println(getSalutation(), 1);
    }
    if(prevDate != getDate()){
        lcd.println(getDate(), 2);
    }
    if(prevHour != getHour()){
        lcd.println(getHour(), 3);
    }
}, 1000);