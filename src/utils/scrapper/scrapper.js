const puppeteer = require('puppeteer');
const { scrapePage } = require('./scrapePage');

const scrapper = async (url, array) => {
  const browser = await puppeteer.launch({ headless: false }); //lanzo el navegador
  const page = await browser.newPage(); //abro una nueva pagina
  await page.goto(url); //voy a la url
  try {
    await page.click('button.fc-cta-do-not-consent'); //no usen mis datos!
  } catch (error) {
    return;
  }
  await scrapePage(page, browser, array); //esta función tiene la lógica que recorre la página y obtiene los datos
  await browser.close(); //cierro el navegador
  return array;
};

module.exports = { scrapper };
