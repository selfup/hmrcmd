# ICOM CMD GO

RESTful WebServer in Go that talks to ICOM radios via serial port calls.

### Executable

No release yet. Will post a release soon :tada:

### Development

1. [Golang](https://golang.org/doc/install)
2. `github.com/jacobsa/go-serial/serial`

Install Go.

Install the library: `go get github.com/jacobsa/go-serial/serial`

### Run the server

`go run main.go`

### API

1. Root Endpoint

    * Url: `http://localhost:8792`
    * Route: `/`
    * Method: `POST`
    * Body (JSON): `{SerialPort: '', IcomCommand: ''}`
    * Example payload: `{SerialPort: 'COM3', IcomCommand: 'FE FE 94 E0 26 00 05 00 01 FD'}`
