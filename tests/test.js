const freonCookies = require('../index.js'),
assert = require('assert'),
cookie = require('cookie'),
tl = require('testlite');

const testRes = () => {
	const res = { };
	freonCookies({ }, res, () => { });
	return res;
}, testForCookie = (res, cookieName, cookieValue, cookieOptions) => {
	const testCookieObject = { };
	testCookieObject[cookieName] = {
		'value' : cookieValue,
		'options' : cookieOptions
	};
	assert.deepEqual(res.cookies[cookieName], testCookieObject[cookieName]);
};

tl('Request Object', {
	'cookies' : {
		'should be parsed' : () => {
			const req = {
				'headers' : {
					'cookie' : [cookie.serialize('foo', 'bar'), cookie.serialize('key', 'val')].join(';')
				}
			};
			freonCookies(req, { }, () => { });
			assert.deepStrictEqual(req.cookies, {
				'foo' : 'bar',
				'key' : 'val'
			});
		}
	}
});

tl('Response Object', {
	'cookies' : {
		'should be an object' : () => {
			assert.ok(typeof testRes().cookies === 'object', 'typeof res.cookies !== \'object\'');
		}
	}, 'addCookie()' : {
		'should modify the cookies opject property' : () => {
			const res = testRes();
			const cookieName = 'foo';
			const cookieValue = 'bar';
			const cookieOptions = {
				'httpOnly' : true
			};
			res.addCookie(cookieName, cookieValue, cookieOptions);
			testForCookie(res, 'foo', 'bar', cookieOptions);
		}
	}, 'addCookies()' : {
		'should modify the cookies object properly' : () => {
			const res = testRes();
			res.addCookies({
				'name' : 'asdf',
				'value' : 'fdsa'
			}, {
				'name' : 'test',
				'value' : 'tset'
			});
			testForCookie(res, 'asdf', 'fdsa');
			testForCookie(res, 'test', 'tset');
		}
	}, 'removeCookie()' : {
		'should stop a cookie from being sent' : () => {
			const res = testRes();
			const cookieName = '123';
			const cookieValue = '321';
			res.addCookie(cookieName, cookieValue);
			res.removeCookie(cookieName);
			assert.strictEqual(res.cookies[cookieName], undefined);
		}
	}, 'removeCookies()' : {
		'should stop multiple cookies from being sent' : () => {
			const res = testRes();
			res.addCookies({
				'name' : '456',
				'value' : '654'
			}, {
				'name' : '789',
				'value' : '987'
			});
			res.removeCookies('456', '789');
			assert.strictEqual(res.cookies['456'], undefined);
			assert.strictEqual(res.cookies['789'], undefined);
		}
	}, 'deleteCookie()' : {
		'should create an expired cookie' : () => {
			const res = testRes();
			const cookieValue = 'someCookieValue';
			res.deleteCookie(cookieValue);
			testForCookie(res, cookieValue, '', {
				'expires' : new Date(0)
			});
		}
	}, 'deleteCookies()' : {
		'should create multiple expired cookies' : () => {
			const res = testRes();
			const cookieValues = ['anotherCookieValue', 'asjdfi2037b*(&)B@0d0s(B@)(@B)@(B'];
			res.deleteCookies(...cookieValues);
			for (let i = 0; i < cookieValues.length; i++) {
				testForCookie(res, cookieValues[i], '', {
					'expires' : new Date(0)
				});
			}
		}
	}
});

tl.test();