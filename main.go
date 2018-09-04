package main

import (
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os/exec"
	"runtime"
	"strconv"
	"strings"
	"time"

	"github.com/gobuffalo/packr"
	"github.com/jacobsa/go-serial/serial"
)

func main() {
	box := packr.NewBox("build")

	http.Handle("/", http.FileServer(box))
	http.HandleFunc("/api/v1/icom-cmd", icomGrabPortAndCommand)

	fmt.Println("HMRCMD is now running on: http://localhost:8792")

	localhost := "http://localhost:8792"

	switch runtime.GOOS {
	case "darwin":
		exec.Command("open", localhost).Run()

		break
	case "windows":
		exec.Command("cmd.exe", "/C", "start "+localhost).Run()

		break
	default:
		cmd := exec.Command("xdg-open", localhost)

		cmd.Run()

		break
	}

	http.ListenAndServe(":8792", nil)

	log.Fatal("Failed to run HMRCMD")
}

func setupResponse(w *http.ResponseWriter, req *http.Request) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

func icomParseCmdAndWriteToPort(
	serialPort string,
	icomCmd string,
	baudRate string,
) bool {
	icomCmds := strings.Split(icomCmd, " ")
	byteCmd := strings.Join(icomCmds, "")

	baudInt, err := strconv.ParseInt(baudRate, 10, 32)

	if err != nil {
		panic(err)
	}

	data, err := hex.DecodeString(byteCmd)
	if err != nil {
		panic(err)
	}

	options := serial.OpenOptions{
		PortName:        serialPort,
		BaudRate:        uint(baudInt),
		DataBits:        8,
		StopBits:        1,
		MinimumReadSize: 4,
	}

	port, err := serial.Open(options)
	if err != nil {
		log.Fatalf("serial.Open: %v", err)

		return false
	}

	// sleep 100ms for radio to accept payload
	time.Sleep(100 * time.Millisecond)

	// have port close once code block is done (aka last sleep)
	defer port.Close()

	_, err = port.Write(data)
	if err != nil {
		log.Fatalf("port.Write: %v", err)

		return false
	}

	// sleep 100ms prior to closing port for radio to run cmd
	time.Sleep(100 * time.Millisecond)

	return true
}

func icomGrabPortAndCommand(w http.ResponseWriter, r *http.Request) {
	setupResponse(&w, r)
	if (*r).Method == "OPTIONS" {
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "this endpoint only supports POST requests", 405)
		return
	}

	decoder := json.NewDecoder(r.Body)

	var incoming struct {
		SerialPort  string
		IcomCommand string
		BaudRate    string
	}

	err := decoder.Decode(&incoming)
	if err != nil {
		http.Error(w, "failed to parse incoming JSON", 1000)
		return
	}

	success := icomParseCmdAndWriteToPort(
		incoming.SerialPort,
		incoming.IcomCommand,
		incoming.BaudRate,
	)

	if !success {
		http.Error(w, "failed to send command to radio", 1000)
	}

	outgoing, err := json.Marshal(incoming)
	if err != nil {
		http.Error(w, "failed to stringify outgoing JSON", 1000)
	}

	w.Write(outgoing)
}
