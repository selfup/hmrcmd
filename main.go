package main

import (
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/jacobsa/go-serial/serial"
)

func main() {
	http.HandleFunc("/", grabPortAndCommand)
	http.ListenAndServe(":8792", nil)
}

func parseCmdAndWriteToPort(serialPort string, icomCmd string) bool {
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

	// sleep 50ms for radio to accept payload
	time.Sleep(50 * time.Millisecond)

	// have port close once code block is done (aka last sleep)
	defer port.Close()

	_, err = port.Write(data)
	if err != nil {
		log.Fatalf("port.Write: %v", err)

		return false
	}

	// sleep 50ms prior to closing port for radio to run cmd
	time.Sleep(50 * time.Millisecond)

	return true
}

func grabPortAndCommand(
	w http.ResponseWriter,
	r *http.Request,
) {
	if r.Method != http.MethodPost {
		http.Error(w, "this endpoint only supports POST requests", 405)
		return
	}

	decoder := json.NewDecoder(r.Body)

	fmt.Println(r.Body)

	var incoming struct {
		SerialPort  string
		IcomCommand string
	}

	err := decoder.Decode(&incoming)
	if err != nil {
		http.Error(w, "failed to parse incoming JSON", 500)
		return
	}

	success := parseCmdAndWriteToPort(
		incoming.SerialPort,
		incoming.IcomCommand,
	)

	if !success {
		http.Error(w, "failed to send command to radio", 500)
	}

	outgoing, err := json.Marshal(incoming)
	if err != nil {
		http.Error(w, "failed to stringify outgoing JSON", 500)
	}

	w.Write(outgoing)
}
