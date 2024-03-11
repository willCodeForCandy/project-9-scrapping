const fs = require('fs');

const write = (array) => {
  const object = { results: array };
  fs.writeFile('games.json', JSON.stringify(object), () => {
    console.log('Archivo escrito');
  });
};

module.exports = { write };
