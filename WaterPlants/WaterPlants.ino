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

  if (https.begin(*client, "https://garden-alpha.firebaseapp.com/hello")) {  // HTTPS
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

  String s = "[{";

  digitalWrite(THERM_PIN, HIGH);
  delay(50);
  s += "\"therm\":";
  s += String((analogRead(ANALOG_PIN)*1.0/1024),4);
  s += ","; 
  digitalWrite(THERM_PIN, LOW);
  delay(50);
  
  digitalWrite(PHOTO_PIN, HIGH);
  delay(50);
  s += "\"photo\":";
  s += String((analogRead(ANALOG_PIN)*1.0/1024),4);
  s += ","; 
  digitalWrite(PHOTO_PIN, LOW);
  delay(50);
  
  digitalWrite(MOIST_PIN, HIGH);
  delay(50);
  s += "\"moist\":";
  s += String((analogRead(ANALOG_PIN)*1.0/1024),4);
  digitalWrite(MOIST_PIN, LOW);


  s+="}]";
  return s;
}

void loop() {
  test();
  delay(20000);
}
