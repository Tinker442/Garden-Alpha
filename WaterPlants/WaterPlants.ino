/*
    This sketch establishes a TCP connection to a "quote of the day" service.
    It sends a "hello" message, and then prints received data.
*/

#ifndef STASSID
#define STASSID "008BE4"
#define STAPSK  "6BULACC393199"
#endif

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecureBearSSL.h>

const int ANALOG_PIN = A0; // The only analog pin on the Thing
const int MOIST_PIN = D2; // Digital pin to be read
const int THERM_PIN = D1; // Digital pin to be read
const int PHOTO_PIN = D0; // Digital pin to be read

void setup() {

  initHardware();
  Serial.println(F("\n\r* * * ESP BOOT * * *"));
  Serial.println(F("WiFi begin!"));
  WiFi.mode(WIFI_STA);
  WiFi.begin(STASSID, STAPSK);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println(F("\n\rWiFi connected!"));
}

void test() {
  std::unique_ptr<BearSSL::WiFiClientSecure>client(new BearSSL::WiFiClientSecure);
  client->setInsecure();
  HTTPClient https;

  if (https.begin(*client, "http://httpbin.org/post")) {  // HTTPS //"https://garden-alpha.firebaseapp.com/hello"
    Serial.println("[HTTPS] POST...");
    https.addHeader("Content-Type", "text/plain");
    
    String package = create_package();
    Serial.println(package);
    int httpCode = https.POST(package);

    // httpCode will be negative on error
    if (httpCode > 0) {
      // HTTP header has been send and Server response header has been handled
      Serial.printf("[HTTPS] POST... code: %d\n", httpCode);
      // file found at server?
      if (httpCode == HTTP_CODE_OK) {
        String payload = https.getString();
        Serial.println(String("[HTTPS] Received payload: ") + payload);
      }
    } else {
      Serial.printf("[HTTPS] POST... failed, error: %s\n\r", https.errorToString(httpCode).c_str());
    }

    https.end();
  } else {
    Serial.printf("[HTTPS] Unable to connect\n\r");
  }
}
void initHardware()
{
  Serial.begin(115200);
  pinMode(THERM_PIN, OUTPUT);
  pinMode(PHOTO_PIN, OUTPUT);
  pinMode(MOIST_PIN, OUTPUT);
  // Don't need to set ANALOG_PIN as input, 
  // that's all it can be.
}
String create_package(){

  String s = "{";

  digitalWrite(THERM_PIN, HIGH);
  delay(50);
  s += "\"therm\":";
  s += String(get_resistance());
  s += ","; 
  digitalWrite(THERM_PIN, LOW);
  delay(50);
  
  digitalWrite(PHOTO_PIN, HIGH);
  delay(50);
  s += "\"photo\":";
  s += String(get_linear_photo(get_resistance(), 60.0,1.0));
  s += ","; 
  digitalWrite(PHOTO_PIN, LOW);
  delay(50);
  
  digitalWrite(MOIST_PIN, HIGH);
  delay(50);
  s += "\"moist\":";
  s += String(get_resistance());
  digitalWrite(MOIST_PIN, LOW);


  s+="}";
  return s;
}

//returns resistance of sensor in units of k-ohm
float get_resistance(){
  
  return 10.0*(1024.0/analogRead(ANALOG_PIN)-1);
  
}

//max and min resistance are calibration points. They are values we see at very bright and very dark
float get_linear_photo(float photo_resistance, float max_resistance, float min_resistance){
  float b = log(max_resistance);
  float m = log(min_resistance/max_resistance)/100;
  
  return (log(photo_resistance)-b)/m;
}

float get_linear_therm(float therm_resistance, float ref1, float temp1, float ref2, float temp2){
  float m = (temp2 - temp1) / (ref2 - ref1);
  float b = temp2 - m*ref1;
  
  return m*therm_resistance + b;
}

void loop() {
  test();
  delay(20000);
}
