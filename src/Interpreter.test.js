// @flow

import ActionsHandler from './ActionsHandler';
import { App } from './App';
import Interpreter from './Interpreter';
import ProgramSequence from './ProgramSequence';
import type { IntlShape } from 'react-intl';
import SceneDimensions from './SceneDimensions';
import type { AudioManager, BlockName } from './types';

jest.mock('./ActionsHandler');
jest.mock('./App');

function createInterpreter() {
    // $FlowFixMe: Jest mock API
    App.mockClear();
    // $FlowFixMe: Jest mock API
    ActionsHandler.mockClear();

    const appMock = new App();
    appMock.advanceProgramCounter.mockImplementation((callback) => {callback()});

    // We are mocking the ActionsHandler so we don't need to provide
    // real dependencies to the constructor. 'null' arguments are cast
    // to satisfy Flow.
    const actionsHandlerMock = new ActionsHandler(
        ((null: any): App),
        ((null: any): AudioManager),
        ((null: any): SceneDimensions),
        ((null: any): IntlShape)
    );

    actionsHandlerMock.doAction.mockImplementation((action: BlockName) => {
        // Mock ActionsHandler behaviour to test handling of different
        // Promise results
        switch(action) {
            case 'left180':
                return Promise.reject(new Error('error'));
            case 'right180':
                return Promise.resolve('movementBlocked');
            default:
                return Promise.resolve('success');
        }
    });

    const interpreter = new Interpreter(1000, appMock, actionsHandlerMock);

    return {
        interpreter,
        appMock,
        actionsHandlerMock
    };
}

test('Stepping an empty program leaves the program counter at 0', (done) => {
    const { interpreter, appMock } = createInterpreter();
    interpreter.step(new ProgramSequence([], 0, 0, new Map())).then((result) => {
        expect(result).toBe("success");
        expect(appMock.advanceProgramCounter.mock.calls.length).toBe(0);
        done();
    });
});

test('Step a program with one successful action', (done) => {
    const { interpreter, appMock, actionsHandlerMock } = createInterpreter();

    const program = [{block: 'forward1'}];

    interpreter.step(new ProgramSequence(program, 0, 0, new Map())).then((result) => {
        expect(result).toBe("success");
        expect(appMock.advanceProgramCounter.mock.calls.length).toBe(1);
        expect(actionsHandlerMock.doAction.mock.calls.length).toBe(1);
        expect(actionsHandlerMock.doAction.mock.calls[0][0]).toBe('forward1');
        expect(actionsHandlerMock.doAction.mock.calls[0][1]).toBe(1000);
        // Test step at end of program
        interpreter.step(new ProgramSequence(program, 1, 0, new Map())).then((result) => {
            expect(result).toBe("success");
            expect(appMock.advanceProgramCounter.mock.calls.length).toBe(1);
            expect(actionsHandlerMock.doAction.mock.calls.length).toBe(1);
            done();
        });
    });
});

test('Step a program with two successful actions', (done) => {
    const { interpreter, appMock, actionsHandlerMock } = createInterpreter();

    const program = [{block: 'forward1'}, {block: 'forward2'}];

    interpreter.step(new ProgramSequence(program, 0, 0, new Map())).then((result) => {
        expect(result).toBe("success");
        expect(appMock.advanceProgramCounter.mock.calls.length).toBe(1);
        expect(actionsHandlerMock.doAction.mock.calls.length).toBe(1);
        expect(actionsHandlerMock.doAction.mock.calls[0][0]).toBe('forward1');
        expect(actionsHandlerMock.doAction.mock.calls[0][1]).toBe(1000);
        interpreter.step(new ProgramSequence(program, 1, 0, new Map())).then((result) => {
            expect(result).toBe("success");
            expect(appMock.advanceProgramCounter.mock.calls.length).toBe(2);
            expect(actionsHandlerMock.doAction.mock.calls.length).toBe(2);
            expect(actionsHandlerMock.doAction.mock.calls[1][0]).toBe('forward2');
            expect(actionsHandlerMock.doAction.mock.calls[1][1]).toBe(1000);
            // Test step at end of program
            interpreter.step(new ProgramSequence(program, 2, 0, new Map())).then((result) => {
                expect(result).toBe("success");
                expect(appMock.advanceProgramCounter.mock.calls.length).toBe(2);
                expect(actionsHandlerMock.doAction.mock.calls.length).toBe(2);
                done();
            });
        });
    });
});

test('Stepping on a "movementBlocked" action does not advance the program counter', (done) => {
    const { interpreter, appMock, actionsHandlerMock } = createInterpreter();

    const program = [{block: 'right180'}];

    interpreter.step(new ProgramSequence(program, 0, 0, new Map())).then((result) => {
        expect(result).toBe("movementBlocked");
        expect(appMock.advanceProgramCounter.mock.calls.length).toBe(0);
        expect(actionsHandlerMock.doAction.mock.calls.length).toBe(1);
        expect(actionsHandlerMock.doAction.mock.calls[0][0]).toBe('right180');
        expect(actionsHandlerMock.doAction.mock.calls[0][1]).toBe(1000);
        done();
    });
});

test('Step on a startLoop block of an empty loop', (done) => {
    expect.assertions(2);
    const { interpreter, appMock } = createInterpreter();

    const program = [
        {block: 'startLoop', iterations: 2, label: 'A'},
        {block: 'endLoop', label: 'A'}
    ];

    interpreter.step(new ProgramSequence(program, 0, 1, new Map([[ 'A', 2 ]]))).then((result) => {
        expect(result).toBe("success");
        expect(appMock.advanceProgramCounter.mock.calls.length).toBe(1);
        done();
    });
});

test('Step on a startLoop block of a non-empty loop', (done) => {
    expect.assertions(2);
    const { interpreter, appMock } = createInterpreter();

    const program = [
        {block: 'startLoop', iterations: 2, label: 'A'},
        {block: 'forward1'},
        {block: 'endLoop', label: 'A'}
    ];

    interpreter.step(new ProgramSequence(program, 0, 1, new Map([[ 'A', 2 ]]))).then((result) => {
        expect(result).toBe("success");
        expect(appMock.advanceProgramCounter.mock.calls.length).toBe(1);
        done();
    });
});

test('Step on an endLoop block', (done) => {
    expect.assertions(2);
    const { interpreter, appMock } = createInterpreter();

    const program = [
        {block: 'startLoop', iterations: 2, label: 'A'},
        {block: 'endLoop', label: 'A'}
    ];

    interpreter.step(new ProgramSequence(program, 1, 1, new Map([[ 'A', 2 ]]))).then((result) => {
        expect(result).toBe("success");
        expect(appMock.advanceProgramCounter.mock.calls.length).toBe(1);
        done();
    });
});

test('Step a program with an action that rejects', () => {
    const { interpreter } = createInterpreter();
    // We have mocked 'left180' to reject with an error
    return expect(interpreter.step(new ProgramSequence([{block: 'left180'}], 0, 0, new Map())))
        .rejects.toThrow('error');
});

test('Do an action without a program', (done) => {
    const { interpreter, appMock, actionsHandlerMock } = createInterpreter();

    interpreter.doAction({block: 'forward1'}).then(() => {
        expect(appMock.advanceProgramCounter.mock.calls.length).toBe(0);
        expect(actionsHandlerMock.doAction.mock.calls.length).toBe(1);
        expect(actionsHandlerMock.doAction.mock.calls[0][0]).toBe('forward1');
        expect(actionsHandlerMock.doAction.mock.calls[0][1]).toBe(1000);
        done();
    });
});

test('Do an action with a program', (done) => {
    const { interpreter, appMock, actionsHandlerMock } = createInterpreter();

    // Do an action independently of the program
    interpreter.doAction({block: 'forward1'}).then(() => {
        expect(appMock.advanceProgramCounter.mock.calls.length).toBe(0);
        expect(actionsHandlerMock.doAction.mock.calls.length).toBe(1);
        expect(actionsHandlerMock.doAction.mock.calls[0][0]).toBe('forward1');
        expect(actionsHandlerMock.doAction.mock.calls[0][1]).toBe(1000);
        // Then step the program
        interpreter.step(new ProgramSequence([{block: 'forward2'}], 0, 0, new Map())).then((result) => {
            expect(result).toBe("success");
            expect(appMock.advanceProgramCounter.mock.calls.length).toBe(1);
            expect(actionsHandlerMock.doAction.mock.calls.length).toBe(2);
            expect(actionsHandlerMock.doAction.mock.calls[1][0]).toBe('forward2');
            expect(actionsHandlerMock.doAction.mock.calls[1][1]).toBe(1000);
            done();
        });
    });
});

test('Do an action that rejects with an Error', () => {
    const { interpreter } = createInterpreter();
    // We have mocked 'left180' to reject with an error
    return expect(
        interpreter.doAction({block: 'left180'})
    ).rejects.toThrow('error');
});

test('startRun() Promise is rejected on the first error', (done) => {
    const { interpreter, appMock, actionsHandlerMock } = createInterpreter();

    appMock.getRunningState.mockImplementation(() => {return 'running'});
    // We have mocked 'left180' to reject with an error
    appMock.getProgramSequence.mockImplementationOnce(() => {
        return new ProgramSequence([{block: 'left180'}, {block: 'forward1'}], 0, 0, new Map());
    });

    interpreter.startRun().catch((error) => {
        expect(appMock.advanceProgramCounter.mock.calls.length).toBe(0);
        expect(actionsHandlerMock.doAction.mock.calls.length).toBe(1);
        expect(actionsHandlerMock.doAction.mock.calls[0][0]).toBe('left180');
        expect(actionsHandlerMock.doAction.mock.calls[0][1]).toBe(1000);
        expect(error.message).toBe('error');
        done();
    });
});

test('Run a program with one action from beginning to end without an error', (done) => {
    const { interpreter, appMock, actionsHandlerMock } = createInterpreter();

    const program = [{block: 'forward1'}];

    appMock.getRunningState.mockImplementation(() => {return 'running'});
    appMock.getProgramSequence.mockImplementationOnce(() => {
        return new ProgramSequence(program, 0, 0, new Map())
    });
    appMock.getProgramSequence.mockImplementationOnce(() => {
        return new ProgramSequence(program, 1, 0, new Map())
    });

    interpreter.startRun().then(() => {
        expect(appMock.advanceProgramCounter.mock.calls.length).toBe(1);
        expect(appMock.setRunningStateForInterpreter.mock.calls.length).toBe(1);
        expect(appMock.setRunningStateForInterpreter.mock.calls[0][0]).toBe('stopped');
        expect(actionsHandlerMock.doAction.mock.calls.length).toBe(1);
        expect(actionsHandlerMock.doAction.mock.calls[0][0]).toBe('forward1');
        expect(actionsHandlerMock.doAction.mock.calls[0][1]).toBe(1000);
        done();
    });
});

test('Run a program with three actions from beginning to end without an error', (done) => {
    const { interpreter, appMock, actionsHandlerMock } = createInterpreter();

    const program = [{block: 'forward1'}, {block: 'forward2'}, {block: 'forward3'}];

    appMock.getRunningState.mockImplementation(() => {return 'running'});
    appMock.getProgramSequence.mockImplementationOnce(() => {
        return new ProgramSequence(program, 0, 0, new Map())
    });
    appMock.getProgramSequence.mockImplementationOnce(() => {
        return new ProgramSequence(program, 1, 0, new Map())
    });
    appMock.getProgramSequence.mockImplementationOnce(() => {
        return new ProgramSequence(program, 2, 0, new Map())
    });
    appMock.getProgramSequence.mockImplementationOnce(() => {
        return new ProgramSequence(program, 3, 0, new Map())
    });

    interpreter.startRun().then(() => {
        expect(appMock.advanceProgramCounter.mock.calls.length).toBe(3);
        expect(appMock.setRunningStateForInterpreter.mock.calls.length).toBe(1);
        expect(appMock.setRunningStateForInterpreter.mock.calls[0][0]).toBe('stopped');
        expect(actionsHandlerMock.doAction.mock.calls.length).toBe(3);
        expect(actionsHandlerMock.doAction.mock.calls[0][0]).toBe('forward1');
        expect(actionsHandlerMock.doAction.mock.calls[0][1]).toBe(1000);
        expect(actionsHandlerMock.doAction.mock.calls[1][0]).toBe('forward2');
        expect(actionsHandlerMock.doAction.mock.calls[1][1]).toBe(1000);
        expect(actionsHandlerMock.doAction.mock.calls[2][0]).toBe('forward3');
        expect(actionsHandlerMock.doAction.mock.calls[2][1]).toBe(1000);
        done();
    });
});

test('Do not continue through program if runningState changes to stopped', (done) => {
    const { interpreter, appMock, actionsHandlerMock } = createInterpreter();

    appMock.getRunningState.mockImplementationOnce(() => {return 'running'});
    appMock.getRunningState.mockImplementationOnce(() => {return 'stopped'});

    appMock.getProgramSequence.mockImplementationOnce(() => {
        return new ProgramSequence([{block: 'forward1'}, {block: 'forward2'}], 0, 0, new Map())
    });

    interpreter.startRun().then(() => {
        expect(appMock.advanceProgramCounter.mock.calls.length).toBe(1);
        expect(actionsHandlerMock.doAction.mock.calls.length).toBe(1);
        expect(actionsHandlerMock.doAction.mock.calls[0][0]).toBe('forward1');
        expect(actionsHandlerMock.doAction.mock.calls[0][1]).toBe(1000);
        done();
    });
});

test('Run stops on a "movementBlocked" action', (done) => {
    const { interpreter, appMock, actionsHandlerMock } = createInterpreter();

    const program = [{block: 'right180'}];

    appMock.getRunningState.mockImplementation(() => {return 'running'});
    appMock.getProgramSequence.mockImplementation(() => {
        return new ProgramSequence(program, 0, 0, new Map())
    });

    interpreter.startRun().then(() => {
        expect(appMock.advanceProgramCounter.mock.calls.length).toBe(0);
        expect(appMock.setRunningStateForInterpreter.mock.calls.length).toBe(1);
        expect(appMock.setRunningStateForInterpreter.mock.calls[0][0]).toBe('stopped');
        expect(actionsHandlerMock.doAction.mock.calls.length).toBe(1);
        expect(actionsHandlerMock.doAction.mock.calls[0][0]).toBe('right180');
        expect(actionsHandlerMock.doAction.mock.calls[0][1]).toBe(1000);
        done();
    });
});

test('Should initialize stepTime value from constructor and update on setStepTime', () => {
    expect.assertions(2);
    const { interpreter } = createInterpreter();
    expect(interpreter.stepTimeMs).toBe(1000);

    const newStepTimeValue = 2000;
    interpreter.setStepTime(newStepTimeValue);
    expect(interpreter.stepTimeMs).toBe(newStepTimeValue);
});

test('ActionsHandler.doAction() is called with the step time specified in the Interpreter property', () => {
    const { interpreter, actionsHandlerMock } = createInterpreter();

    interpreter.doAction({block: 'forward1'});
    expect(actionsHandlerMock.doAction.mock.calls.length).toBe(1);
    expect(actionsHandlerMock.doAction.mock.calls[0][0]).toBe('forward1');
    expect(actionsHandlerMock.doAction.mock.calls[0][1]).toBe(1000);

    const newStepTimeValue = 2000;
    interpreter.setStepTime(newStepTimeValue);
    expect(interpreter.stepTimeMs).toBe(newStepTimeValue);
    interpreter.doAction({block: 'forward1'});
    expect(actionsHandlerMock.doAction.mock.calls.length).toBe(2);
    expect(actionsHandlerMock.doAction.mock.calls[1][0]).toBe('forward1');
    expect(actionsHandlerMock.doAction.mock.calls[1][1]).toBe(newStepTimeValue);
});

test('ContinueRun will not continue, when continueRunActive property of Interpreter is set to true, ', (done) => {
    const { interpreter, appMock } = createInterpreter();
    interpreter.continueRunActive = true;
    interpreter.startRun().then(() => {
        expect(appMock.getRunningState.mock.calls.length).toBe(0);
        done();
    })
});

test('When runningState is pauseRequested, call setRunningStateForInterpreter in App', (done) => {
    const { interpreter, appMock } = createInterpreter();
    appMock.getRunningState.mockImplementationOnce(() => {return 'pauseRequested'});
    interpreter.startRun().then(() => {
        expect(appMock.setRunningStateForInterpreter.mock.calls.length).toBe(1);
        expect(appMock.setRunningStateForInterpreter.mock.calls[0][0]).toBe('paused');
        done();
    });
});

test('When runningState is stopRequested, call setRunningStateForInterpreter in App', (done) => {
    const { interpreter, appMock } = createInterpreter();
    appMock.getRunningState.mockImplementationOnce(() => {return 'stopRequested'});
    interpreter.startRun().then(() => {
        expect(appMock.setRunningStateForInterpreter.mock.calls.length).toBe(1);
        expect(appMock.setRunningStateForInterpreter.mock.calls[0][0]).toBe('stopped');
        done();
    });
});
