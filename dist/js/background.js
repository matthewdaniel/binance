webpackJsonp([1],{

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmail = (addr) => __awaiter(this, void 0, void 0, function* () {
    const current = (yield exports.fetch('email-addresses')) || [];
    return exports.persist('email-addresses', current.filter(x => x.address.indexOf(addr) === -1));
});
exports.flagConfirmed = (address) => __awaiter(this, void 0, void 0, function* () {
    let emails = yield exports.listEmails();
    emails = emails.map(e => {
        if (address != e.address)
            return e;
        return {
            address: e.address,
            confirmLink: e.confirmLink,
            confirmed: true,
        };
    });
    yield exports.persist('email-addresses', emails);
});
exports.tagEmailLink = (address, link) => __awaiter(this, void 0, void 0, function* () {
    let emails = yield exports.listEmails();
    emails = emails.map(e => {
        if (address != e.address)
            return e;
        return {
            address: e.address,
            confirmLink: link
        };
    });
    yield exports.persist('email-addresses', emails);
});
exports.addEmail = (email) => __awaiter(this, void 0, void 0, function* () {
    let emails = (yield exports.listEmails()) || [];
    emails.push(email);
    yield exports.persist('email-addresses', emails);
});
exports.listEmails = () => __awaiter(this, void 0, void 0, function* () {
    return (yield exports.fetch('email-addresses', []));
});
exports.getEmail = (account) => __awaiter(this, void 0, void 0, function* () {
    let emails = yield exports.listEmails();
    return emails.find(x => x.address.indexOf(account) === 0);
});
exports.persist = (key, value) => chrome.storage.sync.set({
    [key]: JSON.stringify(value)
});
exports.fetch = (key, defaultVal = false) => new Promise(resolve => {
    chrome.storage.sync.get({ [key]: JSON.stringify(defaultVal) }, res => resolve(JSON.parse(res[key])));
});
exports.apemail = (fn, args = {}) => `http://api.guerrillamail.com/ajax.php?site=guerrillamail.com&ip=127.0.0.1&agent=Mozilla_foo_bar&f=${fn}&` + Object.keys(args).map(k => `${k}=${args[k]}`).join('&');


/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __webpack_require__(1);
let fillForms = (formFill) => {
    Object.keys(formFill || {}).map(k => {
        if (k.indexOf('#') !== -1) {
            var el = document.getElementById(k.split('#')[1]);
            if (!el)
                return;
            if (formFill[k] == 'checked') {
                el.checked = true;
            }
            else {
                el.value = formFill[k];
            }
        }
        else if (k.indexOf('.') != -1) {
        }
        else {
            var el = document.getElementById(k);
            if (!el)
                return;
            el.value = formFill[k];
        }
    });
};
let showDeposit = () => setTimeout(() => {
    var button = document.getElementsByClassName('btn-deposit')[0];
    var event = new MouseEvent('click', { bubbles: true });
    button.dispatchEvent(event);
}, 1500);
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => __awaiter(this, void 0, void 0, function* () {
    if (changeInfo.status != 'complete')
        return;
    const formFill = yield helpers_1.fetch('form-fill', {});
    chrome.tabs.executeScript({
        code: `(${fillForms.toString()})(${JSON.stringify(formFill)}); (${showDeposit.toString()})()`
    });
}));
let pat = new RegExp('a href=\"(.+?)\"');
setInterval(() => __awaiter(this, void 0, void 0, function* () {
    // let emails = (await fetch('email-addresses')) as iMail[] || [];
    // for (var email of emails) {
    //     await $.get(apemail('set_email_user', { seq: 1, email_user: email.address.split('@')[0] } )).promise();
    //     let res = await $.get(apemail('get_email_list', {offset: 0}), {dataType: "json"})
    //     res.list.map(async x => {
    //     let mail = await $.get(apemail('fetch_email', {email_id: x.mail_id})).promise();
    //     if (!mail.mail_body.toLowerCase().indexOf('binance')) return; // not the mail we're looking for
    //     let matches = mail.mail_body.match(pat);;
    //     if (matches.length < 2) return;
    //     tagEmailLink(email.address, matches[1]);
    //     });
    // }
    // emails.forEach(async email => {
    //     // this might have a race condition if new mail is requested while we 
    //     // are updating this email stuff
    //     // alert('start');
    //     // let res = await $.get(`${apemail}&f=fetch_email&email_id=${email}`).promise();
    //     alert(JSON.stringify(res));
    // })
}), 5000);


/***/ })

},[9]);