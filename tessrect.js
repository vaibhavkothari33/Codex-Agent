// const Tesseract = require('tesseract.js');
import Tesseract from 'tesseract.js';
Tesseract.recognize(
  './image.png',
  'eng',
  { logger: m => console.log(m) }
).then(({ data: { text } }) => {
  console.log('Extracted Text:', text);
  // You can add code here to update index.js or generate files based on text
}); 