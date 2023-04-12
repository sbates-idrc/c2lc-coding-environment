// @flow

function makeBlurEvent(currentTarget: HTMLElement): {preventDefault: Function, currentTarget: HTMLElement} {
    return {
        preventDefault: () => {},
        currentTarget
    };
}

function makeChangeEvent(currentTarget: HTMLElement): {preventDefault: Function, currentTarget: HTMLElement} {
    return {
        preventDefault: () => {},
        currentTarget
    };
}

type MakeKeyDownEventReturnType = {
    preventDefault: Function,
    currentTarget: HTMLElement,
    key: string
};

function makeKeyDownEvent(currentTarget: HTMLElement, key: string): MakeKeyDownEventReturnType {
    return {
        preventDefault: () => {},
        currentTarget,
        key
    };
}

function makeTestDiv(): HTMLElement {
    const div = document.createElement('div');
    // $FlowFixMe: document.body may be null, no need to handle
    document.body.appendChild(div);
    return div;
}

export { makeBlurEvent, makeChangeEvent, makeKeyDownEvent, makeTestDiv };
