package main

import (
	"encoding/hex"
	"log"
	"strings"
	"time"

	"github.com/jacobsa/go-serial/serial"
)

func main() {
	parseCmdAndWriteToPort("COM3", "FE FE 94 E0 26 00 05 00 01 FD")
}

func parseCmdAndWriteToPort(serialPort string, icomCmd string) {
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
	}

	// sleep 50ms for radio to accept payload
	time.Sleep(50 * time.Millisecond)

	// have port close once code block is done (aka last sleep)
	defer port.Close()

	_, err = port.Write(data)
	if err != nil {
		log.Fatalf("port.Write: %v", err)
	}

	// sleep 50ms prior to closing port for radio to run cmd
	time.Sleep(50 * time.Millisecond)
}
