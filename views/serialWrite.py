import serial
import time
serial_port = serial.Serial(port="/dev/ttyO4", baudrate=9600, timeout=100)
while True:
    serial_port.write("Hey!")