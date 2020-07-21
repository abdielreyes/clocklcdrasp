var LCD = require('lcdi2c');
const COLS = 20;
const ROWS = 4;
var lcd = new LCD(1, 0x27, COLS, ROWS);


lcd.on();
lcd.clear();
lcd.println("hi form line 1",1);

lcd.println("hi form line 2",2);
lcd.println("hi form line 3",3);
lcd.println("hi form line 4",4);