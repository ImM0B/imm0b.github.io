---
title: "Introspection"
---

# Introspection

En GraphQL, la introspección es una capacidad que permite consultar el esquema de la API para obtener información sobre los tipos y las operaciones disponibles. Es especialmente útil para herramientas como clientes GraphQL y generadores de documentación, ya que permite descubrir qué datos están disponibles en la API sin necesidad de documentación externa.

Aquí tienes un ejemplo de consulta de introspección básica en GraphQL:

```graphql
{
  __schema {
    types {
      name
      kind
      fields {
        name
        type {
          name
          kind
        }
      }
    }
  }
}
```

### Explicación

1. `__schema`: Este es el campo principal que devuelve información sobre el esquema completo.
2. `types`: Devuelve todos los tipos disponibles en el esquema, como `Query`, `Mutation`, y cualquier otro tipo personalizado.
3. `name`: Es el nombre de cada tipo.
4. `kind`: Indica el tipo de entidad en el esquema, como `OBJECT`, `SCALAR`, `INTERFACE`, etc.
5. `fields`: Lista los campos disponibles en cada tipo. Cada campo tiene:
   - `name`: El nombre del campo.
   - `type`: El tipo de dato del campo.

### Ejemplo de respuesta

El resultado de esta consulta puede verse algo así:

```json
{
  "data": {
    "__schema": {
      "types": [
        {
          "name": "Query",
          "kind": "OBJECT",
          "fields": [
            {
              "name": "user",
              "type": {
                "name": "User",
                "kind": "OBJECT"
              }
            },
            {
              "name": "posts",
              "type": {
                "name": "Post",
                "kind": "OBJECT"
              }
            }
          ]
        },
        {
          "name": "User",
          "kind": "OBJECT",
          "fields": [
            {
              "name": "id",
              "type": {
                "name": "ID",
                "kind": "SCALAR"
              }
            },
            {
              "name": "name",
              "type": {
                "name": "String",
                "kind": "SCALAR"
              }
            }
          ]
        }
      ]
    }
  }
}
```
