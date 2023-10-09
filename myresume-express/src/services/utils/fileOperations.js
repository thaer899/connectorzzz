
const fs = require('fs').promises;


async function getDataFromFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading file:", error.message);
    throw error;
  }
}


module.exports = {
  getDataFromFile,
};