---
title: "2 - Host header authentication bypass"
---

# 2 - Host header authentication bypass

For fairly obvious reasons, it is common for websites to restrict access to certain functionality to internal users only. However, some websites' access control features make flawed assumptions that allow you to bypass these restrictions by making simple modifications to the Host header. This can expose an increased attack surface for other exploits.

1. Send the `GET /` request that received a 200 response to Burp Repeater. Notice that you can change the Host header to an arbitrary value and still successfully access the home page.
2. Browse to `/robots.txt` and observe that there is an admin panel at `/admin`.
3. Try and browse to `/admin`. You do not have access, but notice the error message, which reveals that the panel can be accessed by local users.
4. Send the `GET /admin` request to Burp Repeater.
5. In Burp Repeater, change the Host header to `localhost` and send the request. Observe that you have now successfully accessed the admin panel, which provides the option to delete different users.
