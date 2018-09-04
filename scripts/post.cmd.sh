curl -v \
  -X POST \
  -d '{
    "SerialPort": "/dev/ttys008",
    "IcomCommand": "FE FE 94 E0 26 00 05 00 01 FD",
    "BaudRate": "9600"
  }' \
  http://localhost:8792/api/v1/icom-cmd
