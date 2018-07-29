$serialPort = "COM3"
$icomCommand = "FE FE 94 E0 26 00 05 00 01 FD"

$params = @{
    "SerialPort" = $serialPort;
    "IcomCommand" = $icomCommand;
}

Invoke-WebRequest `
  -UseBasicParsing `
  -Uri http://localhost:8792/api/v1/icom-cmd `
  -Method POST `
  -Body ($params|ConvertTo-Json) `
  -ContentType "application/json"
