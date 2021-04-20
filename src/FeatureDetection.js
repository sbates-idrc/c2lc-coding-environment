// @flow
import type {SpeechRecognition, AudioContext} from './types';

// Light type definition for the parts of the global window object we use.
type NavigatorSubset = {
    bluetooth?: EventTarget & {
        requestDevice: () => {}
    }
}
// Light type definition for the parts of the global navigator object we use.
type WindowSubset = {
    webkitSpeechRecognition?: SpeechRecognition,
    AudioContext?: AudioContext,
    webkitAudioContext?: AudioContext
}

function bluetoothApiIsAvailable(): boolean {
    return !!((navigator: NavigatorSubset).bluetooth);
}

function speechRecognitionApiIsAvailable(): boolean {
    return !!((window: WindowSubset).webkitSpeechRecognition);
}

function webAudioApiIsAvailable(): boolean {
    return !!(window.AudioContext || window.webkitAudioContext);
}

export { bluetoothApiIsAvailable, speechRecognitionApiIsAvailable, webAudioApiIsAvailable };
