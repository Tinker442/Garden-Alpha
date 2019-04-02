void setup() {
  // put your setup code here, to run once:
  pinMode(9, OUTPUT);
}

void loop() {
   unsigned long int time = 120UL * 1000UL; //milliseconds to water
  
  digitalWrite(9, HIGH);
  delay(time);
  digitalWrite(9, LOW);
  delay(259200000UL);

}
