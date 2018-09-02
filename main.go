package main

import (
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
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

	http.ListenAndServe(":8792", nil)

	log.Fatal("Failed to run HMRCMD")
}

func icomParseCmdAndWriteToPort(serialPort string, icomCmd string) bool {
	icomCmds := strings.Split(icomCmd, " ")
	byteCmd := strings.Join(icomCmds, "")

	data, err := hex.DecodeString(byteCmd)
	if err != nil {
		panic(err)
	}

	options := serial.OpenOptions{
		PortName:        serialPort,
		BaudRate:        9600,
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
	if r.Method != http.MethodPost {
		http.Error(w, "this endpoint only supports POST requests", 405)
		return
	}

	decoder := json.NewDecoder(r.Body)

	var incoming struct {
		SerialPort  string
		IcomCommand string
	}

	err := decoder.Decode(&incoming)
	if err != nil {
		http.Error(w, "failed to parse incoming JSON", 1000)
		return
	}

	success := icomParseCmdAndWriteToPort(
		incoming.SerialPort,
		incoming.IcomCommand,
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
