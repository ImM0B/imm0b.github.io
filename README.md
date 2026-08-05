# M0B Notes

Portfolio y notas técnicas de Darío Pérez (M0B), publicadas con la misma pila
que [The Hacker Recipes](https://www.thehacker.recipes): **VitePress 1.x** con
el tema por defecto extendido. Tema forzado a **AMOLED black**.

El contenido se genera desde la bóveda de Obsidian Digital Garden, que se lee
en **modo solo lectura**: el importador nunca escribe fuera de este repositorio.

## Uso

```bash
npm install          # una vez
npm run import       # bóveda Obsidian -> docs/src (regenera todo)
npm run docs:dev     # servidor de desarrollo
npm run docs:build   # sitio estático en docs/.vitepress/dist
npm run docs:preview # sirve el build
```

Ruta de la bóveda por defecto:

```
/home/m0b/Insync/darperbal@gmail.com/Google Drive/Obsidian/Obsidian Digital-Garden
```

Se puede cambiar sin tocar el código:

```bash
node scripts/import-garden.mjs --vault /otra/ruta
```

## Estructura

```
docs/
  .vitepress/
    config.mts            configuración del sitio (lee navigation.json)
    navigation.json       nav + sidebar, GENERADO por el importador
    plugins/              markdown-it: alertas GitHub, YouTube, nº de línea, v-pre inline
    theme/
      index.ts            extiende el tema por defecto (sidebar custom + medium-zoom)
      custom.css          base de estilos
      amoled.css          paleta negro puro
      components/
        CustomSidebarItem.vue
  src/                    GENERADO: notas convertidas
    public/images/        GENERADO: adjuntos copiados
scripts/
  import-garden.mjs       conversor Obsidian -> VitePress
```

> `docs/src/` y `docs/.vitepress/navigation.json` se **borran y regeneran** en
> cada `npm run import`. No edites nada ahí: edita las notas en Obsidian.

## Qué hace el importador

- Slugifica carpetas y notas quitando emoji (`☁️ Cloud Pentest` → `/cloud-pentest/`),
  conservando el nombre con emoji como texto de la barra lateral.
- Resuelve wikilinks de Obsidian (`[[Nota]]`, `[[Nota|alias]]`, `[[Nota#Sección]]`)
  con la misma lógica de "enlace corto" que Obsidian: ruta exacta, luego nombre
  único, luego el candidato más cercano a la nota que enlaza.
- Convierte embeds: `![[img.png|400]]` → `<img width="400">`, `![[cv.pdf]]` →
  visor embebido + enlace de descarga, `![[Otra nota]]` → enlace.
- Copia los adjuntos de `📷/` a `docs/src/public/images/` con nombres slugificados.
- Genera un `index.md` para cada carpeta que no tenga uno.
- Deja intactos los bloques de código, así que `[[ -z "$x" ]]` en bash no se
  convierte en wikilink.
- Neutraliza los payloads XSS de las notas (`<img src=1 onerror=print()>`,
  `{{ ... }}`, etiquetas sin cerrar) para que Vue y Vite no fallen al compilar.

## Créditos

Ver [CREDITS.md](CREDITS.md).
