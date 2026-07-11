import fs from 'fs';
import pdfParse from 'pdf-parse';

/**
 * Extracts raw text from a PDF file.
 * @param {string} filePath - Path to the PDF file.
 * @returns {Promise<string>} - Extracted text.
 */
export const extractTextFromPDF = async (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error('File does not exist');
  }

  const dataBuffer = fs.readFileSync(filePath);
  const options = {
    // Optional customizations for pdf-parse can go here
  };
  
  const parsedData = await pdfParse(dataBuffer, options);
  return parsedData.text;
};
