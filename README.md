# freon-cookies
Freon plugin to parse and serialize cookies

Installation:
```
npm install freon-cookies
```

Usage:
```javascript
// ... create a Freon application ...

app.plugin(require('freon-cookies'));
```

## Properties added to the request object
- `cookies: { String : String }` - the cookies sent by the client, parsed

## Properties added to the response object
- `cookies: { String : String }` - the cookies that are to be sent to the client
- `addCookie: Function` - adds a cookie to be sent
	- `name: String` - the name of the cookie to be sent
	- `value: String` - the value of the cookie to be sent
	- `options: Object` - cookie options. For more information, see [this](https://github.com/jshttp/cookie#options)
- `removeCookie: Function` - prevents a cookie from being sent to the client
	- `name: String` - the name of the cookie to remove
- `removeCookies: Function` - prevents cookies from being sent to the client
	- `names: ...String` - the names of the cookies to remove
- `deleteCookie: Function` - deletes a cookie from the client
	- `name: String` - the name of the cookie to delete
- `deleteCookies: Function` - deletes cookies from the client
	- `names: ...String` - the names of the cookies to delete