#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>

//////////////////////
// WiFi Definitions //
//////////////////////
const char WiFiSSID[] = "008BE4";
const char WiFiPSK[] = "6BULACC393199";

/////////////////////
// Pin Definitions //
/////////////////////
const int LED_PIN = LED_BUILTIN; // Thing's onboard, green LED
const int ANALOG_PIN = A0; // The only analog pin on the Thing
const int MOIST_PIN = D2; // Digital pin to be read
const int THERM_PIN = D1; // Digital pin to be read
const int PHOTO_PIN = D0; // Digital pin to be read

WiFiServer server(80);

void setup() 
{
  initHardware();
  connectWiFi();
  server.begin();
  setupMDNS();
}

void test_server() 
{
  // Check if a client has connected
  WiFiClient client = server.available();
  if (!client) {
    return;
  }

  // Read the first line of the request
  String req = client.readStringUntil('\r');
  Serial.println(req);
  client.flush();

  // Match the request
  int val = -1; // We'll use 'val' to keep track of both the
                // request type (read/set) and value if set.
  if (req.indexOf("/led/0") != -1)
    val = 0; // Will write LED low
  else if (req.indexOf("/led/1") != -1)
    val = 1; // Will write LED high
  else if (req.indexOf("/read/temp") != -1)
    val = 2; // Will print pin reads
   else if (req.indexOf("/read/photo") != -1)
    val = 3; // Will print pin reads
  // Otherwise request will be invalid. We'll say as much in HTML
  Serial.println(val);
  // Set GPIO5 according to the request

  client.flush();
  // Prepare the response. Start with the common header:
  String s = "HTTP/1.1 200 OK\r\n";
  s += "Content-Type: text/html\r\n\r\n";
  s += "<!DOCTYPE HTML>\r\n<html>\r\n";
  if (val == 0)
  {
    digitalWrite(LED_PIN, HIGH);
    s += "LED is now off ";
  }
  else if (val == 1)
  {
    digitalWrite(LED_PIN, LOW);
    s += "LED is now on ";
  }
  else if (val == 2)
  { 
    digitalWrite(THERM_PIN, HIGH);
    delay(50);
    s += "Temp Pin = ";
    s += String(analogRead(ANALOG_PIN)*3.3/1024);
    s += "<br>"; // Go to the next line.
    digitalWrite(THERM_PIN, LOW);
  }
  else if (val == 3)
  { 
    digitalWrite(PHOTO_PIN, HIGH);
    delay(50);
    s += "Photo Pin = ";
    s += String(analogRead(ANALOG_PIN)*3.3/1024);
    s += "<br>"; // Go to the next line.
    digitalWrite(PHOTO_PIN, LOW);
  }
  else
  {
    s += "Invalid Request.<br> Try /led/1, /led/0, or /read.";
  }
  s += "</html>\n";

  // Send the response to the client
  client.print(s);
  delay(1);
  Serial.println("Client disonnected");

  // The client will actually be disconnected 
  // when the function returns and 'client' object is detroyed
}

void connectWiFi()
{
  byte ledStatus = LOW;
  Serial.println();
  Serial.println("Connecting to: " + String(WiFiSSID));
  // Set WiFi mode to station (as opposed to AP or AP_STA)
  WiFi.mode(WIFI_STA);

  // WiFI.begin([ssid], [passkey]) initiates a WiFI connection
  // to the stated [ssid], using the [passkey] as a WPA, WPA2,
  // or WEP passphrase.
  WiFi.begin(WiFiSSID, WiFiPSK);

  // Use the WiFi.status() function to check if the ESP8266
  // is connected to a WiFi network.
  while (WiFi.status() != WL_CONNECTED)
  {
    // Blink the LED
    digitalWrite(LED_PIN, ledStatus); // Write LED high/low
    ledStatus = (ledStatus == HIGH) ? LOW : HIGH;

    // Delays allow the ESP8266 to perform critical tasks
    // defined outside of the sketch. These tasks include
    // setting up, and maintaining, a WiFi connection.
    delay(100);
    // Potentially infinite loops are generally dangerous.
    // Add delays -- allowing the processor to perform other
    // tasks -- wherever possible.
  }
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void setupMDNS()
{
  // Call MDNS.begin(<domain>) to set up mDNS to point to
  // "<domain>.local"
  
  if (!MDNS.begin("sandbox")) 
  {
    Serial.println("Error setting up MDNS responder!");
//    while(1) { 
//      delay(1000);
//    }
  }
  Serial.println("mDNS responder started");

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
void loop(){
  String package = create_package();
    Serial.println(package);
    delay(1000);
}
