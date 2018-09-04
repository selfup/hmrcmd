# HMRCMD

Ham Radio Command Center :pray:

![](https://user-images.githubusercontent.com/9837366/45041314-984cff80-b02d-11e8-97f7-1fbbeb2899d1.png)

Portable executable webserver/client that can be run on Windows/MacOS/Linux.

RESTful WebServer in Go that talks to radios via serial port calls.

Frontend is in [Hyperapp](https://github.com/hyperapp/hyperapp)

### Supported Radios

Currently ICOM is the main development focus.

However you can input any SERIAL_PORT/BAUD_RATE/HEX you like, so technically anything (like sending hex to an arduino)!

### Releases/Executables

Please check the releases page: https://github.com/selfup/hmrcmd/releases

### Downloading/Installing/Running HMRCMD

Go to the releases page: https://github.com/selfup/hmrcmd/releases

1. Windows, download the latest `.exe` release
1. MacOS, download the latest `darwin-` release
1. Linux, download the latest `linux-` release

Once downloaded:

1. Windows:
    1. Double click the `exe`
    1. Warning Protected Screen click -> More Info -> Allow
    1. Firewall -> Allow
    1. Done!

1. MacOS/Linux execute the file via the commandline: `./path/to/latest/release`

It will auto open a browser window and be ready to run :tada:

### API

1. ICOM Endpoint

    * Url: `http://localhost:8792`
    * Route: `/api/v1/icom-cmd`
    * Method: `POST`
    * Body (JSON): `{SerialPort: '', IcomCommand: '', BaudRate: ''}`
    * Example payload: `{SerialPort: 'COM3', IcomCommand: 'FE FE 94 E0 26 00 05 00 01 FD', BaudRate: '9600'}`

:smile:

### Development Guidelines

Please read the `CODE_OF_CONDUCT.md` file :pray:

I use [VSCode](https://code.visualstudio.com/) with three extensions for this project:

1. [Powershell](https://marketplace.visualstudio.com/items?itemName=ms-vscode.PowerShell)
1. [Editorconfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
1. [Go Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.Go)

Please fork the project and make a Pull Request (PR) to contribute!

### Development Deps

1. [Golang](https://golang.org)
1. [Node](https://nodejs.org)
1. [go-serial](https://github.com/jacobsa/go-serial/serial)
1. [packr](https://github.com/gobuffalo/packr)

If on macOS: `go get golang.org/x/sys/unix` :thinking:

Install go-serial: `go get github.com/jacobsa/go-serial/serial`

Install packr: `go get -u github.com/gobuffalo/packr/...`

Install JS deps: `npm i`

### Run the frontend

`npm start`

**Caveats**

Can make API calls when running the go server but you have to kill and reload the go server for new backend functionality.

### Run the backend

To make calls to the radio while using the frontend:

`go run main.go`

To test API calls without using the frontend there are scripts!

**Windows**

`./scripts/post.cmd.ps1`

**MacOS / Linux**

`./scripts/post.cmd.sh`

**Caveats**

Cannot update frontend while testing API calls. Frontend must be compiled via `packr` to ensure that the go server serves the files correctly which ensures that [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) is not a problem.

### Compile into a binary release

**Windows**

`./scripts/release.ps1`

**MacOS / Linux**

`./scripts/release.sh`

### Virtual Ports and Observing Calls Without Hardware

**Windows**

1. [RealTerm](https://sourceforge.net/projects/realterm/)
1. [com0com](https://sourceforge.net/projects/com0com/)

**Observing commands on Windows**

Create a virtual port pair with com0com and then connect to one of the port pairs with RealTerm.

Set baudrate to 9600 and on the display tab set to either hex [with space] or binary (up to you)

Now make sure to send the commands to the other end of the pair!

Example:

1. com0com pair: COM12 - COM13
1. RealTerm listen to: COM12
1. SerialPort for HEX command: COM13

***

**MacOS/Linux**

1. [socat](http://www.dest-unreach.org/socat/doc/socat.html)
1. [screen](https://www.gnu.org/software/screen)

**MacOS**

Install socat `brew install socat` or install the binary yourself.

**Linux (Ubuntu)**

Install socat `sudo apt install socat` or install the binary yourself.

**Observing commands on MacOS/Linux**

_Ok this gets interesting_

In a terminal/pane/tab can either run:

1. `socat -d -d pty,raw,echo=0 pty,raw,echo=0`
1. `./scripts/virtual.pair.sh`

You will see output like so

```
2018/07/29 09:43:54 socat[20004] N PTY is /dev/ttys007
2018/07/29 09:43:54 socat[20004] N PTY is /dev/ttys008
2018/07/29 09:43:54 socat[20004] N starting data transfer loop with FDs [5,5] and [7,7]
```

Now you will want to pick on of the tty pairs and cat the hexdump in another terminal/pane/tab:

`cat /dev/ttys007 | hexdump`

**Now when you make an API call make sure to use the other port in the pair.**

Once you send the message to 008, you will see the hexdump from 007!

It seems you have to make two calls to see it... :thinking:

Do not be discouraged! :smile:

Example screenshot:

<img width="1121" alt="screen shot 2018-07-29 at 10 17 32 am" src="https://user-images.githubusercontent.com/9837366/43367815-a7c21806-9318-11e8-8b12-da22f85b9118.png">

### Reading Materials

1. [HEX to BIN table](http://vlsm-calc.net/decbinhex.php)
1. [CI-V Reference Manual](http://www.icomamerica.com/en/support/kb/article.aspx?ArticleNumber=63AE624429)
1. [ICOM IC-7610 Reference Manual](http://www.icomamerica.com/en/downloads/default.aspx?Category=661)
1. [Old CT-17 Reference Manual with BASIC code blocks](http://www.icom.co.jp/world/support/download/manual/pdf/CT-17.pdf)
1. [Decimal Array to Binary `$port.Write/3`](https://social.technet.microsoft.com/Forums/office/en-US/c0cad62d-5e6d-47de-97a6-406f50025d7f/sendingreading-hex-data-to-a-serial-port-in-powershell?forum=winserverpowershell)
1. [System.IO.Ports.SerialPort.Write .NET API](https://msdn.microsoft.com/en-us/library/System.IO.Ports.SerialPort.Write.aspx)

**CI-V Manual Message Format Snippet**

![basic-message-format-icom](https://user-images.githubusercontent.com/9837366/43176722-9fef0936-8f8a-11e8-8ab1-22e65ffe0977.PNG)
