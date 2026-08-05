---
title: "Como testear graphQL"
---

# Como testear graphQL

Extensión graphQL Raider
Para saber la versión de graphql en uso y ver cosas que probar según la versión -> https://github.com/dolevf/graphw00f
Si la introspección está habilitada -> https://github.com/APIs-guru/graphql-voyager
Visualizador -> [nathanrandal.com/graphql-visualizer/](http://nathanrandal.com/graphql-visualizer/)

Hacemos una instrospection query:

```json
{"query": "query IntrospectionQuery{__schema{queryType{name}mutationType{name}subscriptionType{name}types{...FullType}directives{name description locations args{...InputValue}}}}fragment FullType on __Type{kind name description fields(includeDeprecated:true){name description args{...InputValue}type{...TypeRef}isDeprecated deprecationReason}inputFields{...InputValue}interfaces{...TypeRef}enumValues(includeDeprecated:true){name description isDeprecated deprecationReason}possibleTypes{...TypeRef}}fragment InputValue on __InputValue{name description type{...TypeRef}defaultValue}fragment TypeRef on __Type{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name}}}}}}}}"}
```

El output se le pasa a **inQL**
