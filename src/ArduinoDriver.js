// @flow

import type { RobotDriver } from './types';

// UUIDs from the Arduino example: ArduinoBLE / Peripheral / LED
const arduinoLedServiceUuid = '19b10000-e8f2-537e-4f6c-d104768a1214';
const arduinoLedSwitchCharacteristicUuid = '19b10001-e8f2-537e-4f6c-d104768a1214';
const arduinoLedSwitchCharacteristicUuid2 = '19b10002-e8f2-537e-4f6c-d104768a1214';

export default class ArduinoDriver implements RobotDriver {
    switchCharacteristic: any;
	arduinoValueRecieved: ?number;
	arduinoCommandQueue: any;
	constructor () {
		this.arduinoValueRecieved = 1;
		this.arduinoCommandQueue = [];
	}

    connect(onDisconnected: () => void): Promise<void> {
        return new Promise((resolve, reject) => {
            (navigator: any).bluetooth.requestDevice({
                filters: [{ services: [arduinoLedServiceUuid] }]
            }).then((device) => {
                device.addEventListener('gattserverdisconnected', onDisconnected);
                return device.gatt.connect();
            }).then((server) => {
                return server.getPrimaryService(arduinoLedServiceUuid);
            }).then((service) => {
                return Promise.all(
					[
						service.getCharacteristic(arduinoLedSwitchCharacteristicUuid),
						service.getCharacteristic(arduinoLedSwitchCharacteristicUuid2)
					]
				);
            }).then((characteristic) => {
                this.switchCharacteristic = {
					servo1:characteristic[0],
					servo2:characteristic[1]
				};
				this.switchCharacteristic.servo2.addEventListener('characteristicvaluechanged',this.handleNotifications);
				this.switchCharacteristic.servo2.startNotifications().then(
					console.log('Notification')
				);
				resolve();
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

	setSwitch(bytes: Array<number>): Promise<void> {
		return new Promise((resolve,reject)=>{
			if (this.arduinoValueRecieved === 1){
				// Current implementation throws away a command when there's a command in the queue
				// because it is ignoring the execuion of command that just recieved. Move the if condition and
				// its content inside of the handleNotifications
				if (this.arduinoCommandQueue.length > 0){
					const queuedByte = this.arduinoCommandQueue.shift();
					this.switchCharacteristic.servo1.writeValueWithResponse(new Uint8Array(queuedByte)).then(()=>{
						console.log("resolved");
						this.arduinoValueRecieved = 0;
					}).catch((e)=>{
						console.log(e);
					});
					resolve();
				}
				else{
					this.switchCharacteristic.servo1.writeValueWithResponse(new Uint8Array(bytes)).then(()=>{
						console.log("resolved");
						this.arduinoValueRecieved = 0;
					}).catch((e)=>{
						console.log(e);
					});
					resolve();
				}
			}
			else {
				this.arduinoCommandQueue.push(bytes);
				resolve();
			}
		});
    }
	setSwitch2(bytes: Array<number>): Promise<void> {
        return new Promise((resolve, reject) => {
            this.switchCharacteristic.servo2.writeValueWithResponse(new Uint8Array(bytes));
            resolve();
        });
    }

    forward(): Promise<void> {
		return this.setSwitch([0x01]);
    }

    left(): Promise<void> {
        return this.setSwitch([0x03]);
    }

    right(): Promise<void> {
        return this.setSwitch([0x02]);
    }

	handleNotifications() {
		this.arduinoValueRecieved = 1;
	}
}