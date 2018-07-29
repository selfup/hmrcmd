# HMRCMD

Ham Radio Command Center :pray: 

RESTful WebServer in Go that talks to radios via serial port calls.

Frontend comming soon!

### Supported Target

Currently ICOM is the main development focus.

Kenwood is potentially next on the list!

### Executable

No release yet. Will post a release soon :tada:

### API

1. ICOM Endpoint

    * Url: `http://localhost:8792`
    * Route: `/api/v1/icom-cmd`
    * Method: `POST`
    * Body (JSON): `{SerialPort: '', IcomCommand: ''}`
    * Example payload: `{SerialPort: 'COM3', IcomCommand: 'FE FE 94 E0 26 00 05 00 01 FD'}`

### Development

1. [Golang Installation Page](https://golang.org/doc/install)
2. [go-serial](https://github.com/jacobsa/go-serial/serial)
3. [packr](https://github.com/gobuffalo/packr)

Install Go.

Install the library: `go get github.com/jacobsa/go-serial/serial`

### Run the server

`go run main.go`

### Development Guidelines

Please read the `CODE_OF_CONDUCT.md` file :pray:

I use [VSCode](https://code.visualstudio.com/) with three extensions for this project:

1. [Powershell](https://marketplace.visualstudio.com/items?itemName=ms-vscode.PowerShell)
1. [Editorconfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
1. [Go Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.Go)

Please fork the project and make a Pull Request (PR) to contribute!

### Reading Materials

1. [HEX to BIN table](http://vlsm-calc.net/decbinhex.php)
1. [CI-V Reference Manual](http://www.icomamerica.com/en/support/kb/article.aspx?ArticleNumber=63AE624429)
1. [ICOM IC-7610 Reference Manual](http://www.icomamerica.com/en/downloads/default.aspx?Category=661)
1. [Old CT-17 Reference Manual with BASIC code blocks](http://www.icom.co.jp/world/support/download/manual/pdf/CT-17.pdf)
1. [Decimal Array to Binary `$port.Write/3`](https://social.technet.microsoft.com/Forums/office/en-US/c0cad62d-5e6d-47de-97a6-406f50025d7f/sendingreading-hex-data-to-a-serial-port-in-powershell?forum=winserverpowershell)
1. [System.IO.Ports.SerialPort.Write .NET API](https://msdn.microsoft.com/en-us/library/System.IO.Ports.SerialPort.Write.aspx)

**CI-V Manual Message Format Snippet**

![basic-message-format-icom](https://user-images.githubusercontent.com/9837366/43176722-9fef0936-8f8a-11e8-8ab1-22e65ffe0977.PNG)
