//*********************************************************************************************************
//rfid global + function
//*********************************************************************************************************
/* Typical pin layout used:
 * -----------------------------------------------------------------------------------------
 *             MFRC522      Arduino       Arduino   Arduino    Arduino          Arduino
 *             Reader/PCD   Uno           Mega      Nano v3    Leonardo/Micro   Pro Micro
 * Signal      Pin          Pin           Pin       Pin        Pin              Pin
 * -----------------------------------------------------------------------------------------
 * RST/Reset   RST          9             49         D9         RESET/ICSP-5     RST
 * SPI SS      SDA(SS)      10            53        D10        10               10
 * SPI MOSI    MOSI         11 / ICSP-4   51        D11        ICSP-4           16
 * SPI MISO    MISO         12 / ICSP-1   50        D12        ICSP-1           14
 * SPI SCK     SCK          13 / ICSP-3   52        D13        ICSP-3           15
 *
 */

#include <SPI.h>
#include <MFRC522.h>

#define RST_PIN         49           // Configurable, see typical pin layout above
#define SS_PIN          53          // Configurable, see typical pin layout above

byte buffer[18];
char target[] = {0x07 ,0x56 ,0x73 ,0x65 ,0x47 ,0x88 ,0x04 ,0x00 ,0x85 ,0x00 ,0xB4 ,0x2E ,0xF0 ,0xBB ,0x6A ,0xA8 };

MFRC522 mfrc522(SS_PIN, RST_PIN);  

int lockState=0;

#define NR_KNOWN_KEYS   8

byte knownKeys[NR_KNOWN_KEYS][MFRC522::MF_KEY_SIZE] =  {
    {0xff, 0xff, 0xff, 0xff, 0xff, 0xff}, // FF FF FF FF FF FF = factory default
    {0xa0, 0xa1, 0xa2, 0xa3, 0xa4, 0xa5}, // A0 A1 A2 A3 A4 A5
    {0xb0, 0xb1, 0xb2, 0xb3, 0xb4, 0xb5}, // B0 B1 B2 B3 B4 B5
    {0x4d, 0x3a, 0x99, 0xc3, 0x51, 0xdd}, // 4D 3A 99 C3 51 DD
    {0x1a, 0x98, 0x2c, 0x7e, 0x45, 0x9a}, // 1A 98 2C 7E 45 9A
    {0xd3, 0xf7, 0xd3, 0xf7, 0xd3, 0xf7}, // D3 F7 D3 F7 D3 F7
    {0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff}, // AA BB CC DD EE FF
    {0x00, 0x00, 0x00, 0x00, 0x00, 0x00}  // 00 00 00 00 00 00
};

void dump_byte_array(byte *buffer, byte bufferSize) {
    for (byte i = 0; i < bufferSize; i++) {
        Serial.print(buffer[i] < 0x10 ? " 0" : " ");
        Serial.print(buffer[i], HEX);
    }
}


boolean try_key(MFRC522::MIFARE_Key *key)
{
    boolean result = false;
    byte block = 0;
    byte status;
    
    
    status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, block, key, &(mfrc522.uid));
    if (status != MFRC522::STATUS_OK) {
        return false;
    }

    // Read block
    byte byteCount = sizeof(buffer);
    status = mfrc522.MIFARE_Read(block, buffer, &byteCount);
    if (status != MFRC522::STATUS_OK) {
      
    }
    else {
        // Successful read
        result = true;
        //dump_byte_array((*key).keyByte, MFRC522::MF_KEY_SIZE);
        // Dump block data
        //Serial.print("Block "); Serial.print(block); Serial.print(":");
        //dump_byte_array(buffer, 16);
    }

    mfrc522.PICC_HaltA();       // Halt PICC
    mfrc522.PCD_StopCrypto1();  // Stop encryption on PCD
    return result;
}

//*********************************************************************************************************
//end rfid global + function
//*********************************************************************************************************


//*********************************************************************************************************
//ir sensor global 
//*********************************************************************************************************
#include <IRremote.h>
int RECV_PIN = 15;
IRrecv irrecv(RECV_PIN);
decode_results results;
int irFlag=0;
int bulbState=0;
int fanState=0;//speed
int fanSwitchState=0;//fan on/off
//*********************************************************************************************************
//end ir sensor global 
//*********************************************************************************************************


//*********************************************************************************************************
//ultrasonic range sensor global + function
//*********************************************************************************************************
int thisisNeeded=0;
int waterState=0;
int pump=0;
#define trigPin 31
#define echoPin 33
#define lowLevel 0
#define highLevel 100
#define pumpRelayPin 35

double getValue(int per)
{
return (((double) 100-per)*.17)+7;
}

double getPercentage(double x)
{
double y=(x-6)/11;
return (double) (1-y)*100;
}
//*********************************************************************************************************
//end ultrasonic range sensor global + function
//*********************************************************************************************************



//*********************************************************************************************************
//light sensor global
//*********************************************************************************************************
#include <Wire.h>
#include <BH1750FVI.h>
BH1750FVI LightSensor;
int pwm_pin=3,pwm_duty_cycle=127;
int luxSet=250;
//*********************************************************************************************************
//end light sensor global
//*********************************************************************************************************


#define smokeAnalogPin A3

//*********************************************************************************************************
//dht11 global
//*********************************************************************************************************
#include "DHT.h"
#define DHTPIN 4     
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);
float tempState=0;
int humidityState=0;
//*********************************************************************************************************
//end dht11 global
//*********************************************************************************************************



//*********************************************************************************************************
//ds1032 rtc global
//*********************************************************************************************************
#define DS1302_SCLK_PIN   5    // Arduino pin for the Serial Clock
#define DS1302_IO_PIN     6    // Arduino pin for the Data I/O
#define DS1302_CE_PIN     7    // Arduino pin for the Chip Enable

#define bcd2bin(h,l)    (((h)*10) + (l))
#define bin2bcd_h(x)   ((x)/10)
#define bin2bcd_l(x)    ((x)%10)


// Register names.
// Since the highest bit is always '1', 
// the registers start at 0x80
// If the register is read, the lowest bit should be '1'.
#define DS1302_SECONDS           0x80
#define DS1302_MINUTES           0x82
#define DS1302_HOURS             0x84
#define DS1302_DATE              0x86
#define DS1302_MONTH             0x88
#define DS1302_DAY               0x8A
#define DS1302_YEAR              0x8C
#define DS1302_ENABLE            0x8E
#define DS1302_TRICKLE           0x90
#define DS1302_CLOCK_BURST       0xBE
#define DS1302_CLOCK_BURST_WRITE 0xBE
#define DS1302_CLOCK_BURST_READ  0xBF
#define DS1302_RAMSTART          0xC0
#define DS1302_RAMEND            0xFC
#define DS1302_RAM_BURST         0xFE
#define DS1302_RAM_BURST_WRITE   0xFE
#define DS1302_RAM_BURST_READ    0xFF



// Defines for the bits, to be able to change 
// between bit number and binary definition.
// By using the bit number, using the DS1302 
// is like programming an AVR microcontroller.
// But instead of using "(1<<X)", or "_BV(X)", 
// the Arduino "bit(X)" is used.
#define DS1302_D0 0
#define DS1302_D1 1
#define DS1302_D2 2
#define DS1302_D3 3
#define DS1302_D4 4
#define DS1302_D5 5
#define DS1302_D6 6
#define DS1302_D7 7


// Bit for reading (bit in address)
#define DS1302_READBIT DS1302_D0 // READBIT=1: read instruction

// Bit for clock (0) or ram (1) area, 
// called R/C-bit (bit in address)
#define DS1302_RC DS1302_D6

// Seconds Register
#define DS1302_CH DS1302_D7   // 1 = Clock Halt, 0 = start

// Hour Register
#define DS1302_AM_PM DS1302_D5 // 0 = AM, 1 = PM
#define DS1302_12_24 DS1302_D7 // 0 = 24 hour, 1 = 12 hour

// Enable Register
#define DS1302_WP DS1302_D7   // 1 = Write Protect, 0 = enabled

// Trickle Register
#define DS1302_ROUT0 DS1302_D0
#define DS1302_ROUT1 DS1302_D1
#define DS1302_DS0   DS1302_D2
#define DS1302_DS1   DS1302_D2
#define DS1302_TCS0  DS1302_D4
#define DS1302_TCS1  DS1302_D5
#define DS1302_TCS2  DS1302_D6
#define DS1302_TCS3  DS1302_D7


// Structure for the first 8 registers.
// These 8 bytes can be read at once with 
// the 'clock burst' command.
// Note that this structure contains an anonymous union.
// It might cause a problem on other compilers.
typedef struct ds1302_struct
{
  uint8_t Seconds:4;      // low decimal digit 0-9
  uint8_t Seconds10:3;    // high decimal digit 0-5
  uint8_t CH:1;           // CH = Clock Halt
  uint8_t Minutes:4;
  uint8_t Minutes10:3;
  uint8_t reserved1:1;
  union
  {
    struct
    {
      uint8_t Hour:4;
      uint8_t Hour10:2;
      uint8_t reserved2:1;
      uint8_t hour_12_24:1; // 0 for 24 hour format
    } h24;
    struct
    {
      uint8_t Hour:4;
      uint8_t Hour10:1;
      uint8_t AM_PM:1;      // 0 for AM, 1 for PM
      uint8_t reserved2:1;
      uint8_t hour_12_24:1; // 1 for 12 hour format
    } h12;
  };
  uint8_t Date:4;           // Day of month, 1 = first day
  uint8_t Date10:2;
  uint8_t reserved3:2;
  uint8_t Month:4;          // Month, 1 = January
  uint8_t Month10:1;
  uint8_t reserved4:3;
  uint8_t Day:3;            // Day of week, 1 = first day (any day)
  uint8_t reserved5:5;
  uint8_t Year:4;           // Year, 0 = year 2000
  uint8_t Year10:4;
  uint8_t reserved6:7;
  uint8_t WP:1;             // WP = Write Protect
};
//*********************************************************************************************************
//end ds1032 rtc global
//*********************************************************************************************************


//*********************************************************************************************************
//motion sensor global
//*********************************************************************************************************
int pirPin = 8;    //the digital pin connected to the PIR sensor's output
int ledPin = 13;
int motion=0;
//*********************************************************************************************************
//end motion sensor global
//*********************************************************************************************************



//*********************************************************************************************************
//mq2 smoke sensor global
//*********************************************************************************************************
int smokeState=0;
long smokeTime=0;
#define         MQ_PIN                       (3)     //define which analog input channel you are going to use
#define         RL_VALUE                     (5)     //define the load resistance on the board, in kilo ohms
#define         RO_CLEAN_AIR_FACTOR          (9.83)  //RO_CLEAR_AIR_FACTOR=(Sensor resistance in clean air)/RO,
                                                     //which is derived from the chart in datasheet
 
//Software Related Macros************************************/
#define         CALIBARAION_SAMPLE_TIMES     (50)    //define how many samples you are going to take in the calibration phase
#define         CALIBRATION_SAMPLE_INTERVAL  (500)   //define the time interval(in milisecond) between each samples in the   value=500
                                                     //cablibration phase
#define         READ_SAMPLE_INTERVAL         (50)    //define how many samples you are going to take in normal operation
#define         READ_SAMPLE_TIMES            (5)     //define the time interal(in milisecond) between each samples in 
                                                     //normal operation
 
//Application Related Macros**********************************/
#define         GAS_LPG                      (0)
#define         GAS_CO                       (1)
#define         GAS_SMOKE                    (2)
 
//Globals***********************************************/
float           LPGCurve[3]  =  {2.3,0.21,-0.47};   //two points are taken from the curve. 
                                                    //with these two points, a line is formed which is "approximately equivalent"
                                                    //to the original curve. 
                                                    //data format:{ x, y, slope}; point1: (lg200, 0.21), point2: (lg10000, -0.59) 
float           COCurve[3]  =  {2.3,0.72,-0.34};    //two points are taken from the curve. 
                                                    //with these two points, a line is formed which is "approximately equivalent" 
                                                    //to the original curve.
                                                    //data format:{ x, y, slope}; point1: (lg200, 0.72), point2: (lg10000,  0.15) 
float           SmokeCurve[3] ={2.3,0.53,-0.44};    //two points are taken from the curve. 
                                                    //with these two points, a line is formed which is "approximately equivalent" 
                                                    //to the original curve.
                                                    //data format:{ x, y, slope}; point1: (lg200, 0.53), point2: (lg10000,  -0.22)                                                     
float           Ro           =  10;                 //Ro is initialized to 10 kilo ohms




//*********************************************************************************************************
//end mq2 smoke sensor global
//*********************************************************************************************************


float val = 0;


int calibrationTime = 15;//30        
long unsigned int lowIn;         
long unsigned int pause = 5000;  

boolean lockLow = true;
boolean takeLowTime;  



void setup() {
  int baud=19200;
  Serial.begin (baud);
  Serial1.begin (baud);
  
  
//*********************************************************************************************************
//rfid setup
//*********************************************************************************************************    
  SPI.begin();                // Init SPI bus
  mfrc522.PCD_Init();         // Init MFRC522 card
//*********************************************************************************************************
//end rfid setup
//*********************************************************************************************************    
 
  
//*********************************************************************************************************
//ir sensor setup
//*********************************************************************************************************  
  irrecv.enableIRIn(); // Start the receiver
//*********************************************************************************************************
//ir sensor setup
//*********************************************************************************************************  


//*********************************************************************************************************
//ultrasonic range sensor setup
//*********************************************************************************************************  
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(pumpRelayPin, OUTPUT);  
//*********************************************************************************************************
//end ultrasonic range sensor setup
//*********************************************************************************************************  


  
//*********************************************************************************************************
//light sensor setup
//*********************************************************************************************************
  LightSensor.begin();
  LightSensor.SetAddress(Device_Address_H);
  LightSensor.SetMode(Continuous_H_resolution_Mode);
//*********************************************************************************************************
//end light sensor setup
//*********************************************************************************************************



//*********************************************************************************************************
//dht11 setup
//*********************************************************************************************************
  dht.begin();
//*********************************************************************************************************
//end dht11 setup
//*********************************************************************************************************

  
//*********************************************************************************************************
//mq2 smoke sensor setup
//*********************************************************************************************************
  pinMode(A3, INPUT);
  Serial.print("Calibrating mq2...\n");                
  Ro = MQCalibration(MQ_PIN);                       //Calibrating the sensor. Please make sure the sensor is in clean air 
                                                    //when you perform the calibration                    
  Serial.print("Calibration is done...\n"); 
  Serial.print("Ro=");
  Serial.print(Ro);
  Serial.print("kohm");
  Serial.print("\n");
  
//*********************************************************************************************************
//end mq2 smoke sensor setup
//*********************************************************************************************************
 
 
//*********************************************************************************************************
//motion sensor setup
//********************************************************************************************************* 
  pinMode(pirPin, INPUT);
  pinMode(ledPin, OUTPUT);
  digitalWrite(pirPin, LOW);
//*********************************************************************************************************
//end motion sensor setup
//********************************************************************************************************* 
 
 
//*********************************************************************************************************
//ultrasonic range sensor setup
//********************************************************************************************************* 
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
//*********************************************************************************************************
//end ultrasonic range sensor setup
//********************************************************************************************************* 


//*********************************************************************************************************
//ds1302 rtc setup
//*********************************************************************************************************  
  ds1302_struct rtc;
  Serial.println(F("DS1302 Real Time Clock"));
  Serial.println(F("Version 2, March 2013"));


  // Start by clearing the Write Protect bit
  // Otherwise the clock data cannot be written
  // The whole register is written, 
  // but the WP-bit is the only bit in that register.
  DS1302_write (DS1302_ENABLE, 0);

  // Disable Trickle Charger.
  DS1302_write (DS1302_TRICKLE, 0x00);

// Remove the next define, 
// after the right date and time are set.
//#define SET_DATE_TIME_JUST_ONCE
#ifdef SET_DATE_TIME_JUST_ONCE  

  // Fill these variables with the date and time.
  int seconds, minutes, hours, dayofweek, dayofmonth, month, year;

  // Example for april 15, 2013, 10:08, monday is 2nd day of Week.
  // Set your own time and date in these variables.
  seconds    = 50;
  minutes    = 53;
  hours      = 12;
  dayofweek  = 2;  // Day of week, any day can be first, counts 1...7
  dayofmonth = 18; // Day of month, 1...31
  month      = 11;  // month 1...12
  year       = 2014;

  // Set a time and date
  // This also clears the CH (Clock Halt) bit, 
  // to start the clock.

  // Fill the structure with zeros to make 
  // any unused bits zero
  memset ((char *) &rtc, 0, sizeof(rtc));

  rtc.Seconds    = bin2bcd_l( seconds);
  rtc.Seconds10  = bin2bcd_h( seconds);
  rtc.CH         = 0;      // 1 for Clock Halt, 0 to run;
  rtc.Minutes    = bin2bcd_l( minutes);
  rtc.Minutes10  = bin2bcd_h( minutes);
  // To use the 12 hour format,
  // use it like these four lines:
  //    rtc.h12.Hour   = bin2bcd_l( hours);
  //    rtc.h12.Hour10 = bin2bcd_h( hours);
  //    rtc.h12.AM_PM  = 0;     // AM = 0
  //    rtc.h12.hour_12_24 = 1; // 1 for 24 hour format
  rtc.h24.Hour   = bin2bcd_l( hours);
  rtc.h24.Hour10 = bin2bcd_h( hours);
  rtc.h24.hour_12_24 = 0; // 0 for 24 hour format
  rtc.Date       = bin2bcd_l( dayofmonth);
  rtc.Date10     = bin2bcd_h( dayofmonth);
  rtc.Month      = bin2bcd_l( month);
  rtc.Month10    = bin2bcd_h( month);
  rtc.Day        = dayofweek;
  rtc.Year       = bin2bcd_l( year - 2000);
  rtc.Year10     = bin2bcd_h( year - 2000);
  rtc.WP = 0;  

  // Write all clock data at once (burst mode).
  DS1302_clock_burst_write( (uint8_t *) &rtc);
#endif
//*********************************************************************************************************
//end ds1302 rtc setup
//********************************************************************************************************* 
 
}

void loop() {
 
//*********************************************************************************************************
// rfid loop
//********************************************************************************************************* 
  
// Look for new cards
    mfrc522.PICC_IsNewCardPresent();
    
    // Select one of the cards
    mfrc522.PICC_ReadCardSerial();
    
    // Try the known default keys
    MFRC522::MIFARE_Key key;
    for (byte k = 0; k < NR_KNOWN_KEYS; k++) {
        // Copy the known key into the MIFARE_Key structure
        for (byte i = 0; i < MFRC522::MF_KEY_SIZE; i++) {
            key.keyByte[i] = knownKeys[k][i];
        }

        lockState=0;

        // Try the key
        if (try_key(&key)) {
      
            if (memcmp(buffer, target, sizeof(target))==0){
               Serial.println("Acces granted"); 
               lockState=1;
                                                           }
                                          
            else
               Serial.println("Acces denied"); 
                                                 
            break;
        }
    }  
  
//*********************************************************************************************************
//end rfid loop
//********************************************************************************************************* 
 
 
//*********************************************************************************************************
//ir sensor loop
//********************************************************************************************************* 
  
  bulbState=0;//clear for next flag raisal
  fanSwitchState=0;
  fanState=0;

  if (irrecv.decode(&results)) {
    Serial.println(results.value, HEX);
    
    if(results.value==33441975){
      if(irFlag){
      digitalWrite(pwm_pin,LOW);
      irFlag=0;
                  }
      else{
      digitalWrite(pwm_pin,HIGH);
      irFlag=1;
            }
                              }//end if
                              
      else if(results.value==33454215)
       bulbState=1;
      
      else if(results.value==33444015)
       fanSwitchState=1;
             
      else if(results.value==33435855)
       fanState=1;
       
       else if(results.value==33423615)
       fanState=-1;
              

    irrecv.resume(); // Receive the next value
  }
  
  
//*********************************************************************************************************
//end ir sensor loop
//********************************************************************************************************* 


//*********************************************************************************************************
//ultra sonic sensor loop
//*********************************************************************************************************    

  long duration;
  double distance;
  digitalWrite(trigPin, LOW);  
  delayMicroseconds(2); 
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10); 
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  distance = (duration/2) / 29.1;
  Serial.print(distance);
  Serial.println(" cm");
  
  if(distance>=17){
    digitalWrite(pumpRelayPin, HIGH);    
    pump=1;  
}
  else if(distance<=6){
    digitalWrite(pumpRelayPin, LOW); 
    pump=0;  
}   

  waterState=getPercentage(distance);

//*********************************************************************************************************
//end ultra sonic sensor loop
//*********************************************************************************************************    


  
//*********************************************************************************************************
//light sensor loop
//*********************************************************************************************************    
  uint16_t luxState = LightSensor.GetLightIntensity();// Get Lux value
  Serial.print("Light: ");
  Serial.print(luxState);
  Serial.println(" lux");
  
  
  if(luxState>luxSet && irFlag){//if lux is greater than luxSet 
     if(pwm_duty_cycle!=0)
     pwm_duty_cycle=pwm_duty_cycle-1;   //decrease pwm duty cycle
     analogWrite(pwm_pin,pwm_duty_cycle );//set pwm duty cycle

   }
   
   else if(luxState<luxSet && irFlag){          //if lux is less than luxSet 
     if(pwm_duty_cycle!=255)
     pwm_duty_cycle=pwm_duty_cycle+1;   //increase pwm duty cycle
     analogWrite(pwm_pin,pwm_duty_cycle );//set pwm duty cycle

   }
     
//*********************************************************************************************************
//end light sensor loop
//*********************************************************************************************************    


//*********************************************************************************************************
//dht11 loop
//*********************************************************************************************************   
  float h = dht.readHumidity();
  humidityState=h;
  // Read temperature as Celsius
  float t = dht.readTemperature();
  tempState=t;
  // Read temperature as Fahrenheit
  float f = dht.readTemperature(true);

  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t) || isnan(f)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Compute heat index
  // Must send in temp in Fahrenheit!
  float hi = dht.computeHeatIndex(f, h);

  Serial.print("Humidity: "); 
  Serial.print(h);
  Serial.print(" %\t");
  Serial.print("Temperature: "); 
  Serial.print(t);
  Serial.print(" *C ");
  Serial.print(f);
  Serial.print(" *F\t");
  Serial.print("Heat index: ");
  Serial.print(hi);
  Serial.println(" *F");
  
//*********************************************************************************************************
//end dht11 loop
//********************************************************************************************************* 
 
 
//*********************************************************************************************************
//smoke sensor loop
//********************************************************************************************************* 
   Serial.print("LPG:"); 
   int lpg=MQGetGasPercentage(MQRead(MQ_PIN)/Ro,GAS_LPG);
   Serial.print(lpg);
   Serial.print( "ppm" );
   Serial.print("    ");   
   Serial.print("CO:");
   int co=MQGetGasPercentage(MQRead(MQ_PIN)/Ro,GAS_CO) ; 
   Serial.print(co);
   Serial.print( "ppm" );
   Serial.print("    ");   
   Serial.print("SMOKE:"); 
   int smok=MQGetGasPercentage(MQRead(MQ_PIN)/Ro,GAS_SMOKE);
   Serial.print(smok);
   Serial.print( "ppm" );
   Serial.print("\n");  
   
   smokeState=0;
   long timeDiff=millis()-smokeTime;
   Serial.print("Time Diff:");
   Serial.println(timeDiff);
   //if((lpg>5 || co>5 || smok>5) && timeDiff >= 30000){
   if((lpg>3 || co>3 || smok>3) && timeDiff >= 12000){
   smokeTime=millis();
   smokeState=1;
                                                  }
//*********************************************************************************************************
//end smoke sensor loop
//********************************************************************************************************* 


//*********************************************************************************************************
//motion sensor loop
//*********************************************************************************************************   
  
     motion=0;//clear the motion flag

     if(digitalRead(pirPin) == HIGH){
     digitalWrite(ledPin, HIGH);   //the led visualizes the sensors output pin state
     if(lockLow){  
     //makes sure we wait for a transition to LOW before any further output is made:
     motion=1;//clear the motion flag
     lockLow = false;  
     Serial.println("motion detected");
     //delay(50);
     }         
     takeLowTime = true;
     }
    
     if(digitalRead(pirPin) == LOW){       
     digitalWrite(ledPin, LOW);  //the led visualizes the sensors output pin state
     lockLow = true; 
     //delay(50);
     }
//*********************************************************************************************************
//end motion sensor loop
//*********************************************************************************************************   
 

//*********************************************************************************************************
//ds1302 rtc loop
//*********************************************************************************************************   
   /*    
  ds1302_struct rtc;
  char buffer[80];     // the code uses 70 characters.

  // Read all clock data at once (burst mode).
  DS1302_clock_burst_read( (uint8_t *) &rtc);

  sprintf( buffer, "Time = %02d:%02d:%02d, ", \
    bcd2bin( rtc.h24.Hour10, rtc.h24.Hour), \
    bcd2bin( rtc.Minutes10, rtc.Minutes), \
    bcd2bin( rtc.Seconds10, rtc.Seconds));
  Serial.print(buffer);

  sprintf(buffer, "Date(day of month) = %d, Month = %d, " \
    "Day(day of week) = %d, Year = %d", \
    bcd2bin( rtc.Date10, rtc.Date), \
    bcd2bin( rtc.Month10, rtc.Month), \
    rtc.Day, \
    2000 + bcd2bin( rtc.Year10, rtc.Year));
  Serial.println( buffer);
*/
//*********************************************************************************************************
//end ds1302 rtc loop
//*********************************************************************************************************  

 
//*********************************************************************************************************
//send data to BBB loop
//*********************************************************************************************************  
  char temp[150];
  Serial.println();
  Serial.println();
  if(waterState>100)waterState=100;
  else if(waterState<0)waterState=0;
  
  sprintf( temp, "bulbState=%d fanState=%d fanSwitchState=%d humidityState=%d lockState=%d luxState=%d motionState=%d smokeState=%d tapState=%d tempState=%d waterState=%d ;"
  ,bulbState,fanState,fanSwitchState,humidityState,lockState,luxState,motion,smokeState,pump,(int) tempState,waterState);
  Serial.println(temp); 
  Serial.println();
  Serial.println();
  Serial1.print(temp);
//*********************************************************************************************************
//end send data to BBB loop
//*********************************************************************************************************  
  //delay(300);

}//end main loop



// --------------------------------------------------------
// DS1302_clock_burst_read
//
// This function reads 8 bytes clock data in burst mode
// from the DS1302.
//
// This function may be called as the first function, 
// also the pinMode is set.
//
void DS1302_clock_burst_read( uint8_t *p)
{
  int i;

  _DS1302_start();

  // Instead of the address, 
  // the CLOCK_BURST_READ command is issued
  // the I/O-line is released for the data
  _DS1302_togglewrite( DS1302_CLOCK_BURST_READ, true);  

  for( i=0; i<8; i++)
  {
    *p++ = _DS1302_toggleread();
  }
  _DS1302_stop();
}


// --------------------------------------------------------
// DS1302_clock_burst_write
//
// This function writes 8 bytes clock data in burst mode
// to the DS1302.
//
// This function may be called as the first function, 
// also the pinMode is set.
//
void DS1302_clock_burst_write( uint8_t *p)
{
  int i;

  _DS1302_start();

  // Instead of the address, 
  // the CLOCK_BURST_WRITE command is issued.
  // the I/O-line is not released
  _DS1302_togglewrite( DS1302_CLOCK_BURST_WRITE, false);  

  for( i=0; i<8; i++)
  {
    // the I/O-line is not released
    _DS1302_togglewrite( *p++, false);  
  }
  _DS1302_stop();
}


// --------------------------------------------------------
// DS1302_read
//
// This function reads a byte from the DS1302 
// (clock or ram).
//
// The address could be like "0x80" or "0x81", 
// the lowest bit is set anyway.
//
// This function may be called as the first function, 
// also the pinMode is set.
//
uint8_t DS1302_read(int address)
{
  uint8_t data;

  // set lowest bit (read bit) in address
  bitSet( address, DS1302_READBIT);  

  _DS1302_start();
  // the I/O-line is released for the data
  _DS1302_togglewrite( address, true);  
  data = _DS1302_toggleread();
  _DS1302_stop();

  return (data);
}


// --------------------------------------------------------
// DS1302_write
//
// This function writes a byte to the DS1302 (clock or ram).
//
// The address could be like "0x80" or "0x81", 
// the lowest bit is cleared anyway.
//
// This function may be called as the first function, 
// also the pinMode is set.
//
void DS1302_write( int address, uint8_t data)
{
  // clear lowest bit (read bit) in address
  bitClear( address, DS1302_READBIT);   

  _DS1302_start();
  // don't release the I/O-line
  _DS1302_togglewrite( address, false); 
  // don't release the I/O-line
  _DS1302_togglewrite( data, false); 
  _DS1302_stop();  
}


// --------------------------------------------------------
// _DS1302_start
//
// A helper function to setup the start condition.
//
// An 'init' function is not used.
// But now the pinMode is set every time.
// That's not a big deal, and it's valid.
// At startup, the pins of the Arduino are high impedance.
// Since the DS1302 has pull-down resistors, 
// the signals are low (inactive) until the DS1302 is used.
void _DS1302_start( void)
{
  digitalWrite( DS1302_CE_PIN, LOW); // default, not enabled
  pinMode( DS1302_CE_PIN, OUTPUT);  

  digitalWrite( DS1302_SCLK_PIN, LOW); // default, clock low
  pinMode( DS1302_SCLK_PIN, OUTPUT);

  pinMode( DS1302_IO_PIN, OUTPUT);

  digitalWrite( DS1302_CE_PIN, HIGH); // start the session
  delayMicroseconds( 4);           // tCC = 4us
}


// --------------------------------------------------------
// _DS1302_stop
//
// A helper function to finish the communication.
//
void _DS1302_stop(void)
{
  // Set CE low
  digitalWrite( DS1302_CE_PIN, LOW);

  delayMicroseconds( 4);           // tCWH = 4us
}


// --------------------------------------------------------
// _DS1302_toggleread
//
// A helper function for reading a byte with bit toggle
//
// This function assumes that the SCLK is still high.
//
uint8_t _DS1302_toggleread( void)
{
  uint8_t i, data;

  data = 0;
  for( i = 0; i <= 7; i++)
  {
    // Issue a clock pulse for the next databit.
    // If the 'togglewrite' function was used before 
    // this function, the SCLK is already high.
    digitalWrite( DS1302_SCLK_PIN, HIGH);
    delayMicroseconds( 1);

    // Clock down, data is ready after some time.
    digitalWrite( DS1302_SCLK_PIN, LOW);
    delayMicroseconds( 1);        // tCL=1000ns, tCDD=800ns

    // read bit, and set it in place in 'data' variable
    bitWrite( data, i, digitalRead( DS1302_IO_PIN)); 
  }
  return( data);
}


// --------------------------------------------------------
// _DS1302_togglewrite
//
// A helper function for writing a byte with bit toggle
//
// The 'release' parameter is for a read after this write.
// It will release the I/O-line and will keep the SCLK high.
//
void _DS1302_togglewrite( uint8_t data, uint8_t release)
{
  int i;

  for( i = 0; i <= 7; i++)
  { 
    // set a bit of the data on the I/O-line
    digitalWrite( DS1302_IO_PIN, bitRead(data, i));  
    delayMicroseconds( 1);     // tDC = 200ns

    // clock up, data is read by DS1302
    digitalWrite( DS1302_SCLK_PIN, HIGH);     
    delayMicroseconds( 1);     // tCH = 1000ns, tCDH = 800ns

    if( release && i == 7)
    {
      // If this write is followed by a read, 
      // the I/O-line should be released after 
      // the last bit, before the clock line is made low.
      // This is according the datasheet.
      // I have seen other programs that don't release 
      // the I/O-line at this moment,
      // and that could cause a shortcut spike 
      // on the I/O-line.
      pinMode( DS1302_IO_PIN, INPUT);

      // For Arduino 1.0.3, removing the pull-up is no longer needed.
      // Setting the pin as 'INPUT' will already remove the pull-up.
      // digitalWrite (DS1302_IO, LOW); // remove any pull-up  
    }
    else
    {
      digitalWrite( DS1302_SCLK_PIN, LOW);
      delayMicroseconds( 1);       // tCL=1000ns, tCDD=800ns
    }
  }
}


//*********************************************************************************************************
//mq2 smoke sensor functions
//*********************************************************************************************************
 
/****************** MQResistanceCalculation ****************************************
Input:   raw_adc - raw value read from adc, which represents the voltage
Output:  the calculated sensor resistance
Remarks: The sensor and the load resistor forms a voltage divider. Given the voltage
         across the load resistor and its resistance, the resistance of the sensor
         could be derived.
************************************************************************************/ 
float MQResistanceCalculation(int raw_adc)
{
  return ( ((float)RL_VALUE*(1023-raw_adc)/raw_adc));
}
 
/***************************** MQCalibration ****************************************
Input:   mq_pin - analog channel
Output:  Ro of the sensor
Remarks: This function assumes that the sensor is in clean air. It use  
         MQResistanceCalculation to calculates the sensor resistance in clean air 
         and then divides it with RO_CLEAN_AIR_FACTOR. RO_CLEAN_AIR_FACTOR is about 
         10, which differs slightly between different sensors.
************************************************************************************/ 
float MQCalibration(int mq_pin)
{
  int i;
  float val=0;
 
  for (i=0;i<CALIBARAION_SAMPLE_TIMES;i++) {            //take multiple samples
    val += MQResistanceCalculation(analogRead(mq_pin));
    delay(CALIBRATION_SAMPLE_INTERVAL);
  }
  val = val/CALIBARAION_SAMPLE_TIMES;                   //calculate the average value
 
  val = val/RO_CLEAN_AIR_FACTOR;                        //divided by RO_CLEAN_AIR_FACTOR yields the Ro 
                                                        //according to the chart in the datasheet 
 
  return val; 
}
/*****************************  MQRead *********************************************
Input:   mq_pin - analog channel
Output:  Rs of the sensor
Remarks: This function use MQResistanceCalculation to caculate the sensor resistenc (Rs).
         The Rs changes as the sensor is in the different consentration of the target
         gas. The sample times and the time interval between samples could be configured
         by changing the definition of the macros.
************************************************************************************/ 
float MQRead(int mq_pin)
{
  int i;
  float rs=0;
 
  for (i=0;i<READ_SAMPLE_TIMES;i++) {
    rs += MQResistanceCalculation(analogRead(mq_pin));
    delay(READ_SAMPLE_INTERVAL);
  }
 
  rs = rs/READ_SAMPLE_TIMES;
 
  return rs;  
}
 
/*****************************  MQGetGasPercentage **********************************
Input:   rs_ro_ratio - Rs divided by Ro
         gas_id      - target gas type
Output:  ppm of the target gas
Remarks: This function passes different curves to the MQGetPercentage function which 
         calculates the ppm (parts per million) of the target gas.
************************************************************************************/ 
int MQGetGasPercentage(float rs_ro_ratio, int gas_id)
{
  if ( gas_id == GAS_LPG ) {
     return MQGetPercentage(rs_ro_ratio,LPGCurve);
  } else if ( gas_id == GAS_CO ) {
     return MQGetPercentage(rs_ro_ratio,COCurve);
  } else if ( gas_id == GAS_SMOKE ) {
     return MQGetPercentage(rs_ro_ratio,SmokeCurve);
  }    
 
  return 0;
}
 
/*****************************  MQGetPercentage **********************************
Input:   rs_ro_ratio - Rs divided by Ro
         pcurve      - pointer to the curve of the target gas
Output:  ppm of the target gas
Remarks: By using the slope and a point of the line. The x(logarithmic value of ppm) 
         of the line could be derived if y(rs_ro_ratio) is provided. As it is a 
         logarithmic coordinate, power of 10 is used to convert the result to non-logarithmic 
         value.
************************************************************************************/ 
int  MQGetPercentage(float rs_ro_ratio, float *pcurve)
{
  return (pow(10,( ((log(rs_ro_ratio)-pcurve[1])/pcurve[2]) + pcurve[0])));
}

//*********************************************************************************************************
//end mq2 smoke sensor functions
//*********************************************************************************************************

