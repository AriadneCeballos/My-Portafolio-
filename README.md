# Portafolio de Ariadne Ceballos

Pagina de portafolio en un solo archivo HTML (con CSS y JavaScript incluidos).

## Como abrirlo en VS Code
1. Descomprime esta carpeta.
2. En VS Code: File > Open Folder y elige la carpeta `portafolio-vscode`.
3. Abre `index.html`.
4. Para ver la pagina en vivo instala la extension "Live Server" y da clic en "Go Live" (abajo a la derecha).

## Estructura
- `index.html` — toda la pagina (textos en espanol en el HTML; la traduccion al ingles esta en el diccionario `T` al final del archivo, dentro de la etiqueta script).
- `foto-ariadne.jpg` — tu foto de la seccion "Sobre mi".
- `img/` — imagenes de las tarjetas de proyectos.

## Para editar
- Textos: busca el texto en `index.html` y cambialo; haz el mismo cambio en el diccionario en ingles (busca la misma frase en ingles) para que el boton de idioma siga funcionando.
- Precios: estan en la seccion "Paquetes y precios" del HTML y en el diccionario.
- Fotos de proyectos: reemplaza los archivos dentro de `img/` manteniendo el mismo nombre.

## Pendientes
- Las resenas son textos de muestra: reemplazarlas por resenas reales de clientes.
- Cuando quieras publicarlo gratis (GitHub Pages o Netlify), sube el contenido de esta carpeta tal cual.


## Demos de proyectos
Las tarjetas de la sección Proyectos abren demos locales incluidas en `proyectos/`:
- `proyectos/brasa-miel/` — cafetería.
- `proyectos/alameda-centro-medico/` — clínica (demo front-end; citas guardadas solo en el navegador).
- `proyectos/lumen-dashboard/` — dashboard financiero de demostración.

Para publicar el portafolio en GitHub Pages, conserva la carpeta `proyectos/` dentro del mismo repositorio. Las tarjetas ya apuntan a esas rutas relativas.
