const fs = require('fs');
const path = require('path');

const selectorList = {
    forceSelect: true,
    selector: {
        id: 'versionList',
        controlType: 'sap.m.List'
    }
};

before(() => {
    const selectorCookieAccept = {
        selector: {
            id: '__button4',
            controlType: 'sap.m.Button'
        }
    };
    const buttonCookieAccept = browser.asControl(selectorCookieAccept);
    buttonCookieAccept.firePress();
});

describe('basics', () => {
    const selectorDownloadButton = {
        selector: {
            id: 'readMoreButton',
            controlType: 'sap.m.Button',
            viewName: 'sap.ui.documentation.sdk.view.Welcome'
        }
    };

    const selectorVersionButton = {
        selector: {
            id: 'changeVersionButton',
            controlType: 'sap.m.Button',
            viewName: 'sap.ui.documentation.sdk.view.App'
        }
    };

    it('should have the right title', () => {
        const title = browser.getTitle();
        expect(title).toEqual('Home - Demo Kit - SAPUI5 SDK');
    });

    it('should find a ui5 control by id', () => {
        const controlDownloadButton = browser.asControl(selectorDownloadButton);
        expect(controlDownloadButton.getText()).toEqual('Download');
    });

    it('should click a ui5 button (version selector) by id', () => {
        // open the version select dialog
        const controlVersionButton = browser.asControl(selectorVersionButton);
        controlVersionButton.firePress();

        // check for visibility
        expect(browser.asControl(selectorList).getVisible()).toBeTruthy();

        browser.keys('Escape'); // close popup
    });
});

describe('locate ui5 control via regex', () => {
    /**
     * click the version list button to open a popup on the sdk site
     * then close it via "esc" key
     * @param {String|RegExp} idRegex
     */
    function _assert(idRegex) {
        const selector = {
            forceSelect: true, // make sure we're retrieving from scratch
            selector: {
                id: idRegex
            }
        };
        browser.asControl(selector).firePress();
        expect(browser.asControl(selectorList).getVisible()).toBeTruthy();

        browser.keys('Escape'); // close popup
    }
    it('plain regex /.../', () => {
        return _assert(/.*changeVersionButton$/);
    });

    it('plain regex + flags /.../gmi', () => {
        return _assert(/.*changeVersionButton$/gim);
    });
    it('new RegEx(/.../flags)', () => {
        return _assert(new RegExp(/.*changeVersionButton$/));
    });

    it('new RegEx(/.../flags)', () => {
        return _assert(new RegExp(/.*changeVersionButton$/gi));
    });

    it('new RegEx("string")', () => {
        return _assert(new RegExp('.*changeVersionButton$'));
    });

    it('new RegEx("string", "flags")', () => {
        return _assert(new RegExp('.*changeVersionButton$', 'gmi'));
    });
});

describe('screenshots', () => {
    it('should validate screenshots capability', () => {
        browser.screenshot('ui5-sdk-page');
        const screenShotPath = path.join('wdio-ui5-service', 'test', 'report', 'screenshots');
        const screenshots = fs.readdirSync(screenShotPath);
        const ours = screenshots.find((shot) => shot.match(/.*ui5-sdk-page.*/));
        expect(ours).toMatch(/.*ui5-sdk-page.*/);
    });
});
