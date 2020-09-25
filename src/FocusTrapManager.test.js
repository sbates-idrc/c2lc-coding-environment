// @flow

import FocusTrapManager from './FocusTrapManager';

function checkFocusTrapProps(
    focusTrapManager: FocusTrapManager,
    active: boolean,
    trapCloseHandler: () => void,
    elementSelectors: Array<string>,
    returnElementSelector: ?string) {
        expect(focusTrapManager).toHaveProperty('active', active);
        expect(focusTrapManager).toHaveProperty('elementSelectors', elementSelectors);
        expect(focusTrapManager).toHaveProperty('onFocusTrapClosed');
        expect(focusTrapManager).toHaveProperty('returnElementSelector', returnElementSelector);
}

function mockSetFocusTrap(focusTrapManager, elementSelectors, returnElementSelector) {
    focusTrapManager.setFocusTrap(()=>{}, elementSelectors, returnElementSelector);
    return focusTrapManager;
}

describe('FocusManagerProperty', () => {
    let focusTrapManager;
    beforeEach(() => {
        focusTrapManager = new FocusTrapManager();
    });

    test('Checking default values', () => {
        expect.assertions(4);
        checkFocusTrapProps(focusTrapManager, false, ()=>{}, [], null);
    })

    test.each([
        [[], null],
        [[], 'returnSelector'],
        [['selector1'], null],
        [['selector1'], 'returnSelector'],
        [['selector1', 'selector2', 'selector3'], null],
        [['selector1', 'selector2', 'selector3'], 'returnSelector']
    ])('setFocusTrap and unsetFocusTrap',
        (elementSelectors, returnSelector) => {
            expect.assertions(8);
            focusTrapManager = mockSetFocusTrap(focusTrapManager, elementSelectors, returnSelector);
            checkFocusTrapProps(focusTrapManager, true, ()=>{}, elementSelectors, returnSelector);
            focusTrapManager.unsetFocusTrap();
            checkFocusTrapProps(focusTrapManager, false, ()=>{}, [], null);
        }
    );
});
