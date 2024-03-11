Notas:

- Este proyecto se construye sobre la BBDD del proyecto anterior, con algunos cambios mínimos: apliqué las correcciones que se me indicaron y cambié algunas cosas del modelo Boardgame, ya que contaba con más información a partir del scrapping`.
- Las funciones de scraping están en la carpeta 'scrapper':
  - scrapper.js contiene la función global que abre el browser y una nueva página y navega hacia el sitio indicado, llama a la función scrapePage, y cuando concluye cierra el browser y devuelve el array completo con todos los datos.
  - scrapePage.js contiene la función específica que recorre la página web y recoge los datos en un array. Limité la longitud a 200 datos (2 páginas completas) para que se vea la función de navegación pero no demore tanto
- El archivo boardgames.seed.js ejecuta scrapper, y sube el array a la BBDD
