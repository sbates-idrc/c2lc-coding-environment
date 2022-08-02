// @flow

import type { RobotDriver } from './types';

// UUIDs from the Arduino example: ArduinoBLE / Peripheral / LED
const arduinoLedServiceUuid = '19b10000-e8f2-537e-4f6c-d104768a1214';
const arduinoLedSwitchCharacteristicUuid = '19b10001-e8f2-537e-4f6c-d104768a1214';
const arduinoLedSwitchCharacteristicUuid2 = '19b10002-e8f2-537e-4f6c-d104768a1214';

export default class ArduinoDriver implements RobotDriver {
    switchCharacteristic: any;
	codingEnvironmentSpeed: number;
	constructor (codingEnvironmentSpeed) {
		switch(codingEnvironmentSpeed){
			case(250):this.codingEnvironmentSpeed = 0x01;
			break;
			case(500):this.codingEnvironmentSpeed = 0x02;
			break;
			case(1000):this.codingEnvironmentSpeed = 0x04;
			break;
			case(1500):this.codingEnvironmentSpeed = 0x06;
			break;
			case(2000):this.codingEnvironmentSpeed = 0x08;
			break;
		}
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
						[service.getCharacteristic(arduinoLedSwitchCharacteristicUuid),
						service.getCharacteristic(arduinoLedSwitchCharacteristicUuid2)]);
            }).then((characteristic) => {
                this.switchCharacteristic = {
				servo1:characteristic[0],
				servo2:characteristic[1]
				}
                resolve();
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    setSwitch(bytes: Array<number>): Promise<void> {
        return new Promise((resolve, reject) => {
            this.switchCharacteristic.servo1.writeValue(new Uint8Array(bytes));
            resolve();
        });
    }
	setSwitch2(bytes: Array<number>): Promise<void> {
        return new Promise((resolve, reject) => {
            this.switchCharacteristic.servo2.writeValue(new Uint8Array(bytes));
            resolve();
        });
    }

    forward(): Promise<void> {
        return Promise.all([this.setSwitch2([this.codingEnvironmentSpeed]),this.setSwitch([0x01])])
    }

    left(): Promise<void> {
        return Promise.all([this.setSwitch2([this.codingEnvironmentSpeed]),this.setSwitch([0x03])])
    }

    right(): Promise<void> {
        return Promise.all([this.setSwitch2([this.codingEnvironmentSpeed]),this.setSwitch([0x02])]);
    }
}
