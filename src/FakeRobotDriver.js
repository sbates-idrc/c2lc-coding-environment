// @flow

import type { RobotDriver } from './types';

export default class FakeRobotDriver implements RobotDriver {
    // eslint-disable-next-line no-unused-vars
    connect(onDisconnected: () => void): Promise<void> {
        return Promise.resolve();
    }

    fakeCommandImpl(): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    }

    forward(): Promise<void> {
        console.log("FakeRobot: Forward");
        return this.fakeCommandImpl();
    }

    left(): Promise<void> {
        console.log("FakeRobot: Left");
        return this.fakeCommandImpl();
    }

    right(): Promise<void> {
        console.log("FakeRobot: Right");
        return this.fakeCommandImpl();
    }
}
