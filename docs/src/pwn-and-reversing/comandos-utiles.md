---
title: "Comandos útiles"
---


# Reconocimiento del binario

Ver checks de seguridad
```bash
checksec binario
```

Ver librerías dinámicas que usa
```bash
ldd binario
```

# Calcular offset

```
pwn cyclic 200
```

```bash
run <<< $(python3  -c "print('aaaabaaacaaadaaaeaaafaaagaaahaaaiaaajaaakaaalaaamaaanaaaoaaapaaaqaaaraaasaaataaauaaavaaawaaaxaaayaaa', end='')")
```

```bash
pwn cyclic -l 0x616161706161616f
```

# Desensamblar un binario

Al completo
```bash
objdump -M intel -d binario 
```

Una función en específico
```bash
objdump -M intel -d binario --disassemble=función
```

# Buscar gadgets

```bash
ropper --file binario
```

# Mapa de memoria del binario

```bash
readelf -S binario
```

# Buscar funciones interesantes

```bash
objdump -M intel -d binario | grep read
```

```bash
objdump -M intel -d binario | grep gets
```

# Para poder arrastrar ventanas en gdb y ver más grande el tmux

```
ctrl + b 
: set -g mouse on
```

# ASLR ACTIVADO?

```bash
cat /proc/sys/kernel/randomize_va_space
```

# Para encontrar cadenas legibles dentro de los binarios

```bash
strings binary
```

```bash
strings -e l binary
```
