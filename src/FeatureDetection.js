// @flow
import type {SpeechRecognition} from './types';

// Light type definition for the parts of the global window object we use.
type NavigatorSubset = {
    bluetooth?: EventTarget & {
        requestDevice: () => {}
    }
}
// Light type definition for the parts of the global navigator object we use.
type WindowSubset = {
    webkitSpeechRecognition?: SpeechRecognition
}

function bluetoothApiIsAvailable(): boolean {
    return !!((navigator: NavigatorSubset).bluetooth);
}

function speechRecognitionApiIsAvailable(): boolean {
    return !!((window: WindowSubset).webkitSpeechRecognition);
}

export { bluetoothApiIsAvailable, speechRecognitionApiIsAvailable };
