---
title: "BoardLight"
---

# BoardLight

```bash
ffuf -u http://10.10.11.11 -H "Host: FUZZ.board.htb" -w /opt/SecLists/Discovery/DNS/subdomains-top1million-20000.txt -mc all -ac
```

```
admin \ admin
```

Dolibarr RCE

[Security Advisory: Dolibarr 17.0.0 PHP Code Injection (CVE-2023-30253) - Swascan](https://www.swascan.com/security-advisory-dolibarr-17-0-0/)

Credenciales de configuración del servidor :

```
/var/www/html/crm.board.htb/htdocs/conf/conf.php
```

Probamos contra los usuarios :

```bash
sshpass -p 'serverfun2$2023!!' ssh larissa@board.htb
```

SetUID binaries -> enlightenment

[GitHub - MaherAzzouzi/CVE-2022-37706-LPE-exploit: A reliable exploit + write-up to elevate privileges to root. (Tested on Ubuntu 22.04)](https://github.com/MaherAzzouzi/CVE-2022-37706-LPE-exploit)
