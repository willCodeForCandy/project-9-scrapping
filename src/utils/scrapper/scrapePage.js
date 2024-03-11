const puppeteer = require('puppeteer');
const scrapePage = async (page, listOfGames) => {
  const arrayGames = await page.$$('div#collection tr#row_'); //cada fila de la tabla representa un juego. Las recojo en un array que voy a recorrer para tomar los datos.

  for (const game of arrayGames) {
    // Los datos title, releaseYear, rating, y price se encuentran en la tabla. Los tomo directamente
    let title = await game.$eval(
      '.collection_objectname a',
      (el) => el.textContent
    );
    let releaseYear = await game.$eval(
      '.collection_objectname span.smallerfont',
      (el) => Number(el.textContent.replace(/\(|\)/g, ''))
    );
    let rating = await game.$eval('td.collection_bggrating', (el) =>
      Number(el.textContent.trim())
    );
    let price;
    //Puede no figurar un precio en el listado, por lo que debemos controlar ese error
    try {
      price = await game.$eval('td.collection_shop span', (el) =>
        Number(el.textContent.slice(1))
      );
    } catch (error) {
      price = null;
    }
    //la imagen del listado principal es muy pequeña. Hay que ir a buscar la imagen en tamaño completo a la página con los datos completos del juego
    let img = await game.$eval('.collection_thumbnail img', (el) => el.src);

    let gameData = {};
    if (price) {
      gameData = {
        title,
        releaseYear,
        img,
        rating,
        price
      };
    } else {
      gameData = {
        title,
        releaseYear,
        rating,
        img
      };
    }
    listOfGames.push(gameData);
  }

  await page.$eval('a[title="next page"]', (el) => el.click());
  await page.waitForNavigation();
  if (listOfGames.length < 250) {
    await scrapePage(page, listOfGames);
  }
};

module.exports = { scrapePage };
