$params = @{
    "SerialPort" = "COM3";
    "IcomCommand" = "FE FE 94 E0 26 00 05 00 01 FD";
}

Invoke-WebRequest `
  -UseBasicParsing `
  -Uri http://localhost:8792 `
  -Method POST `
  -Body ($params|ConvertTo-Json) `
  -ContentType "application/json"
