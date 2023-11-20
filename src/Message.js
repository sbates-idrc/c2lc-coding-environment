// @flow

// Model object for messages to the user

export default class Message {
    text: string;
    dismissed: boolean;

    constructor(text: string, dismissed: ?boolean) {
        this.text = text;
        this.dismissed = !!(dismissed);
    }

    dismiss() {
        return new Message(this.text, true);
    }
};
