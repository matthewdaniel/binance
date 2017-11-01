webpackJsonp([0],[
/* 0 */,
/* 1 */
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
/* 2 */
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
const $ = __webpack_require__(0);
const uuid = __webpack_require__(3);
const helpers_1 = __webpack_require__(1);
let count = 0;
let init = () => __awaiter(this, void 0, void 0, function* () {
    let emails = (yield helpers_1.fetch('email-addresses')) || [];
    $('#emails-list').html('');
    emails.forEach(email => {
        const li = $(`<li style="display: flex; width: 100%" id="email-${email.address.split('@')[0]}" data-id="${email.address.split('@')[0]}">
        <span><i class="delete-email fa fa-trash" style="cursor: pointer; color: darkred" /></span>
        <span>${email.address.split('@')[0]}</span>
        ${!email.confirmed && email.confirmLink ? `<span><button class="btn btn-sm btn-outline-primary confirm-btn">Confirm</botton></span>` : ''}
        ${email.confirmed ? `<span><button class="login-btn btn btn-sm btn-outline-primary">Login</botton></span>` : ''}
        
      </li>`);
        $('#emails-list').append(li);
    });
});
$((_) => __awaiter(this, void 0, void 0, function* () {
    init();
    $('.delete-email').click(({ target }) => {
        const account = $(target).closest('li').data('id');
        helpers_1.deleteEmail(account);
        $(`#email-${account}`).remove();
    });
    // chrome.tabs.query(queryInfo, tabs => {
    //   $('#url').text(tabs[0].url);
    //   $('#time').text(moment().format('YYYY-MM-DD HH:mm:ss'));
    // });
    $(document).on('click', '.login-btn', ({ target }) => __awaiter(this, void 0, void 0, function* () {
        let account = $(target).closest('li').data('id');
        chrome.cookies.getAll({ domain: '.binance.com' }, (cs) => __awaiter(this, void 0, void 0, function* () {
            var clearPs = cs.map(c => new Promise(resolve => chrome.cookies.remove({ "url": 'https://www.binance.com', "name": c.name }, resolve)));
            yield Promise.all(clearPs);
            helpers_1.persist('form-fill', {
                '#email': account + '@guerrillamail.com',
                '#pwd': 'Password123',
            });
            chrome.tabs.create({ active: true, selected: true, url: 'https://www.binance.com/userCenter/depositWithdraw.html' });
        }));
    }));
    $('#add-email').click(() => __awaiter(this, void 0, void 0, function* () {
        // const ePromise = await $.get(apemail('get_email_address')).promise();
        // $.get(apemail('forget_me'));
        const email = 'abc' + uuid().toString().substring(0, 20) + '@guerrillamail.com';
        // Log out existing user
        chrome.cookies.getAll({ domain: '.binance.com' }, (cs) => __awaiter(this, void 0, void 0, function* () {
            var clearPs = cs.map(c => new Promise(resolve => chrome.cookies.remove({ "url": 'https://www.binance.com', "name": c.name }, resolve)));
            yield Promise.all(clearPs);
            helpers_1.addEmail({ address: email });
            helpers_1.persist('form-fill', {
                '#email': email,
                '#regiterPassword': 'Password123',
                '#regiterRepeatPassword': 'Password123',
                '#agreement': 'checked',
            });
            chrome.tabs.create({ active: true, selected: true, url: 'https://www.binance.com/register.html' });
        }));
    }));
    //  let eRes = await ePromise;
    //  addEmail({address: eRes.email_addr})
    let pat = new RegExp('a href=\"(.+?)\"');
    $(document).on('click', '.confirm-btn', ({ target }) => __awaiter(this, void 0, void 0, function* () {
        let account = $(target).closest('li').data('id');
        let email = yield helpers_1.getEmail(account);
        if (!email.confirmLink)
            return;
        chrome.cookies.getAll({ domain: '.binance.com' }, (cs) => __awaiter(this, void 0, void 0, function* () {
            var clearPs = cs.map(c => new Promise(resolve => chrome.cookies.remove({ "url": 'https://www.binance.com', "name": c.name }, resolve)));
            yield Promise.all(clearPs);
            helpers_1.flagConfirmed(email.address);
            chrome.tabs.create({ active: true, selected: true, url: email.confirmLink });
        }));
    }));
    $('#reload').click(() => __awaiter(this, void 0, void 0, function* () {
        $('#reload').addClass('reloading');
        let emails = (yield helpers_1.fetch('email-addresses')) || [];
        let promises = emails.map((email) => __awaiter(this, void 0, void 0, function* () {
            if (email.confirmLink)
                return;
            yield $.get(helpers_1.apemail('set_email_user', { email_user: email.address })).promise();
            let res = yield $.get(helpers_1.apemail('get_email_list', { offset: 0 }), { dataType: "json" });
            res.list.map((x) => __awaiter(this, void 0, void 0, function* () {
                let mail = yield $.get(helpers_1.apemail('fetch_email', { email_id: x.mail_id })).promise();
                if (mail.mail_body.toLowerCase().indexOf('binance') == -1)
                    return; // not the mail we're looking for
                let matches = mail.mail_body.match(pat);
                ;
                if (matches.length < 2)
                    return;
                helpers_1.tagEmailLink(email.address, matches[1]);
            }));
        }));
        yield Promise.all(promises);
        yield init();
        $('#reload').removeClass('reloading');
    }));
}));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(4);
var bytesToUuid = __webpack_require__(6);

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

// random #'s we need to init node and clockseq
var _seedBytes = rng();

// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
var _nodeId = [
  _seedBytes[0] | 0x01,
  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
];

// Per 4.2.2, randomize (14 bit) clockseq
var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

// Previous uuid creation time
var _lastMSecs = 0, _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};

  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  var node = options.node || _nodeId;
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;

var crypto = global.crypto || global.msCrypto; // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef
  rng = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

module.exports = rng;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;


/***/ })
],[2]);