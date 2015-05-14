import serial
import time
serial_port = serial.Serial(port="/dev/ttyO4", baudrate=19200)
word = ""
wordArray = []
while True:
    while True:
        data = serial_port.read()
        
        if data == ";":
            break
        elif data == " ":
            wordArray.append(word)
            word = ""
        else:
            word += data

    for fileAndContent in wordArray:
        two = fileAndContent.split('=')
        file = two[0]
        content = two[1]
        if file == "bulbState" or file == "fanState" or file == "fanSwitchState" or file == "humidityState" or file == "lockState" or file == "luxState" or file == "motionState" or file == "smokeState" or file == "tapState" or file == "tempState" or file == "waterState":
            if file == "bulbState":
                if content == "1":
                    f = open('txt/bulbState.txt','r')
                    value = int(f.read())
                    f.close()
                    
                    f = open('txt/bulbState.txt','w')
                    inverseValue = 1-value
                    print inverseValue
                    f.write(str(inverseValue))
                    f.close()
                else:
                    pass
            elif file == "lockState":
                if content == "1":
                    f = open('txt/lockState.txt','r')
                    value = int(f.read())
                    f.close()
                                
                    f = open('txt/lockState.txt','w')
                    inverseValue = 1-value
                    print inverseValue
                    f.write(str(inverseValue))
                    f.close()
                else:
                    pass
            elif file == "fanState":
                if content == "1":
                    f = open('txt/fanState.txt','r')
                    value = int(f.read())
                    f.close()
                    
                    f = open('txt/fanState.txt','w')
                    inverseValue = value+1
                    print inverseValue
                    f.write(str(inverseValue))
                    f.close()
                elif content == "-1":
                    f = open('txt/fanState.txt','r')
                    value = int(f.read())
                    f.close()
                    
                    f = open('txt/fanState.txt','w')
                    inverseValue = value-1
                    print inverseValue
                    f.write(str(inverseValue))
                    f.close()
                else:
                    pass
            elif file == "fanSwitchState":
                if content == "1":
                    f = open('txt/fanSwitchState.txt','r')
                    value = int(f.read())
                    f.close()
                    
                    f = open('txt/fanSwitchState.txt','w')
                    inverseValue = 1-value
                    print inverseValue
                    f.write(str(inverseValue))
                    f.close()
                else:
                    pass
            elif file == "smokeState":
                if content == "1":
                    f = open('txt/smokeState.txt','r')
                    value = int(f.read())
                    f.close()
                        
                    f = open('txt/smokeState.txt','w')
                    inverseValue = 1
                    print inverseValue
                    f.write(str(inverseValue))
                    f.close()
                else:
                    pass
            else:
                f = open('txt/'+file+'.txt','w')
                f.write(content)
                f.close()
            if file == "motionState":
                if content == "1":
                    f = open('txt/bulbState.txt','w')
                    inverseValue = 1
                    print inverseValue
                    f.write(str(inverseValue))
                    f.close()
        print fileAndContent
    wordArray = []
    print "\n"