const fs = require('fs');

const fileExists = filepath => new Promise((resolve, reject) => {
  try {
    fs.stat(filepath, (error, stats) => {
      if (error) {
        reject(error);
      } else if (stats.isFile()) {
        resolve(filepath);
      } else {
        reject(new Error(`${filepath} is not a file`));
      }
    });
  } catch (error) {
    reject(error);
  }
});

module.exports = { fileExists };
