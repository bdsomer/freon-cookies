const cookie = require('cookie');

module.exports = function(req, res, next) {
	Object.defineProperty(req, 'cookies', {
		get: function() {
			if (this.___cookies) {
				return this.___cookies;
			} else {
				// Set req.cookies to a parsed version of req.headers.cookie, if a cookie exists. If a cookie doesn't exist, make it an empty object

				this.___cookies = this.headers.cookie ? cookie.parse(req.headers.cookie) : { };

				// Return the parsed cookies

				return this.___cookies;
			}
		}
	});

	res.cookies = { };

	res.addCookie = function(name, value, options) {

		// Add this cookie to the res.cookies property

		this.cookies[name] = {
			'value' : value,
			'options' : options
		};
	};

	res.addCookies = function(...cookies) {

		// Call res.addCookie on each element

		cookies.forEach(cookie => this.addCookie(cookie.name, cookie.value, cookie.options));
	};

	res.removeCookie = function(name) {

		// Remove this cookie from the res.cookies property

		this.cookies[name] = undefined;
	};

	res.removeCookies = function(...names) {

		// Call res.removeCookie on each element

		names.forEach(name => this.removeCookie(name));
	};

	res.deleteCookie = function(name) {

		// Make the cookie expired

		this.addCookie(name, '', {
			'expires' : new Date(0)
		});
	};

	res.deleteCookies = function(...names) {

		// Call res.deleteCookie on each element

		names.forEach(name => this.deleteCookie(name));
	};

	// Make sure to initalize the 'Set-Cookie' header on res.writeHead

	const _writeHead = res.writeHead;

	res.writeHead = function(...args) {

		// Serialize the cookies

		var cookieArray = Object.entries(this.cookies).map(([cookieName, cookieInfo]) => {

			// Make sure this cookie has not been deleted

			if (cookieInfo) {

				// If it has not been, serialize it

				return cookie.serialize(cookieName, cookieInfo.value, cookieInfo.options);
			}
		}).filter(element => {

			// Remove all 'undefined' cookies

			if (element) return true;
		});

		// Set the 'Set-Cookie' header

		this.setHeader('Set-Cookie', cookieArray);

		// Call the default 'writeHead' method

		_writeHead.call(this, ...args);
	};

	next();
};