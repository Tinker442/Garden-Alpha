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

void setup() {
  Serial.begin(115200);
  Serial.println(F("\n\r* * * ESP BOOT * * *"));
  Serial.println(F("WiFi begin!"));
  WiFi.mode(WIFI_STA);
  WiFi.begin("008BE4", "6BULACC393199");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println(F("\n\rWiFi connected!"));
}

void getpr24h() {
  std::unique_ptr<BearSSL::WiFiClientSecure>client(new BearSSL::WiFiClientSecure);
  client->setInsecure();
  HTTPClient https;

  if (https.begin(*client, "https://garden-alpha.firebaseapp.com/hello")) {  // HTTPS
    Serial.println("[HTTPS] GET...");
    int httpCode = https.GET();

    // httpCode will be negative on error
    if (httpCode > 0) {
      // HTTP header has been send and Server response header has been handled
      Serial.printf("[HTTPS] GET... code: %d\n", httpCode);
      // file found at server?
      if (httpCode == HTTP_CODE_OK) {
        String payload = https.getString();
        Serial.println(String("[HTTPS] Received payload: ") + payload);
      }
    } else {
      Serial.printf("[HTTPS] GET... failed, error: %s\n\r", https.errorToString(httpCode).c_str());
    }

    https.end();
  } else {
    Serial.printf("[HTTPS] Unable to connect\n\r");
  }
}

void loop() {
  getpr24h();
  Serial.println("Wait 20s before next round to not get banned on API server...");
  delay(20000);
}
