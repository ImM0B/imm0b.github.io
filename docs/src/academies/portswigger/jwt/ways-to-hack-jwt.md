---
title: "Ways to Hack JWT"
---

# Ways to Hack JWT

1. ==Change Id==
2. ==Change algorithm to none/NONE/nOnE and send it without the signature==
3. ==Bruteforce the secret, using the original JWT whithout changes== : 
`hashcat -a 0 -m 16500 <YOUR-JWT> /path/to/jwt.secrets.list`
Wordlist : 
**/usr/share/SecLists/Passwords/jwt.secrets.list**
**/usr/share/SecLists/Passwords/scraped-JWT-secrets.txt**
https://portswigger.net/web-security/jwt/lab-jwt-authentication-bypass-via-weak-signing-key
Para luego firmar el token usar :  https://jwt.io/
4. ==Add embedded Header== in attack, change the name to administrator and click sign. Doing this we are sending to the server our public key, the server will use it to validate the token.
5.  ==Via kid header path traversal== : The `kid` (Key ID) parameter in a JWT header indicates which key the server should use for signature verification. By setting `kid` to a path traversal value like `../../../../../../dev/null`, we direct the server to look for a verification key in an invalid location. Since `/dev/null` is empty, the server fails to retrieve a key. Additionally, we generate a symmetric key with a null byte (`AA==` in Base64) and use this key to sign the token. Due to improper key handling, the server may accept the token despite the invalid key, allowing unauthorized access.


6. ==Jku header injection== : Gives the public key with a external link using "jku" header
Exploit server -> craft response with this body (alternative -> using a python server)
{ "keys": 
\[
	\{
    &lt;JWT copied as public key>
	}
]
}
change kid & sub , then click sign in with the RSA generated before.
