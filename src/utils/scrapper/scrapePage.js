const puppeteer = require('puppeteer');
const scrapePage = async (page, browser, listOfGames) => {
  const arrayGames = await page.$$('div#collection tr#row_'); //cada fila de la tabla representa un juego. Las recojo en un array que voy a recorrer para tomar los datos.

  for (const game of arrayGames) {
    // Los datos title, releaseYear, rating, y price se encuentran en la tabla. Los tomo directamente. Adicionalmente, almaceno la url con la info detallada del juego
    let [title, gameUrl] = await game.$eval(
      '.collection_objectname a',
      (el) => [el.textContent, el.href]
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
    //El resto de datos (img, minPlayers, y maxPlayers) hay que buscarlos en la descripción detallada de cada juego
    const findDetails = async (url) => {
      let newPage = await browser.newPage();
      await newPage.goto(url);
      let minPlayers = await newPage.$eval('span [ng-if="min > 0"]', (el) =>
        Number(el.textContent)
      );
      let maxPlayers = await newPage.$eval(
        '[itemprop="numberOfPlayers"] [itemprop="maxValue"]',
        (el) => el.content
      );
      //Para conseguir la imagenen en tamaño completo hay que dar todavía un paso más...
      let imgLink = await newPage.$eval(
        'div.game-header-image a',
        (el) => el.href
      );
      await newPage.goto(imgLink);
      let img = await newPage.$eval('div.image-nav img', (img) => img.src);
      await newPage.close();
      return { img, minPlayers, maxPlayers };
    };
    let details = await findDetails(gameUrl);

    let gameData = {};
    if (price) {
      gameData = {
        title,
        releaseYear,
        rating,
        price,
        ...details
      };
    } else {
      gameData = {
        title,
        releaseYear,
        rating,
        ...details
      };
    }
    listOfGames.push(gameData);
  }

  await page.$eval('a[title="next page"]', (el) => el.click());
  await page.waitForNavigation();
  if (listOfGames.length <= 100) {
    await scrapePage(page, browser, listOfGames);
  }
};

module.exports = { scrapePage };
