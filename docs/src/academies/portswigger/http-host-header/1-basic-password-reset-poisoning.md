---
title: "1 - Basic password reset poisoning"
---

# 1 - Basic password reset poisoning

## How to construct a password reset poisoning attack

If the URL that is sent to the user is dynamically generated based on controllable input, such as the Host header, it may be possible to construct a password reset poisoning attack as follows:

1. The attacker obtains the victim's email address or username, as required, and submits a password reset request on their behalf. When submitting the form, they intercept the resulting HTTP request and modify the Host header so that it points to a domain that they control. For this example, we'll use `evil-user.net`.
2. The victim receives a genuine password reset email directly from the website. This seems to contain an ordinary link to reset their password and, crucially, contains a valid password reset token that is associated with their account. However, the domain name in the URL points to the attacker's server:

`https://evil-user.net/reset?token=0a1b2c3d4e5f6g7h8i9j`
3. If the victim clicks this link (or it is fetched in some other way, for example, by an antivirus scanner) the password reset token will be delivered to the attacker's server.
4. The attacker can now visit the real URL for the vulnerable website and supply the victim's stolen token via the corresponding parameter. They will then be able to reset the user's password to whatever they like and subsequently log in to their account.


Cambiamos la cabecera host de la petición por nuestro dominio  del exploit server, cuando la víctima clique nos llega lo siguiente : 

`10.0.4.72       2024-11-21 18:23:38 +0000 "GET /forgot-password?temp-forgot-password-token=jgzq496oxk077jcaa624cr9gdbysxopn HTTP/1.1" 404 "user-agent: Mozilla/5.0 (Victim) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"`

Accedemos al dominio real /forgot-password?temp-forgot-password-token=jgzq496oxk077jcaa624cr9gdbysxopn y cambiamos la contraseña de carlos
