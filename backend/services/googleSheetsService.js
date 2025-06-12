import { GoogleSpreadsheet } from 'google-spreadsheet';
import { readFile } from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis'; // Import google from googleapis

// Get the directory name
const __dirname = dirname(fileURLToPath(import.meta.url));

class GoogleSheetsService {
  constructor(sheetId) {
    if (!sheetId) {
      throw new Error('🔴 Google Sheet ID is required.');
    }
    this.doc = new GoogleSpreadsheet(sheetId);
    this.sheet = null; // Initialize sheet to null
  }

  /**
   * @static
   * @async
   * @description Creates a new GoogleSheetsService instance and initializes it.
   * @param {string} sheetId - The ID of the Google Sheet.
   * @returns {Promise<GoogleSheetsService>} - The initialized GoogleSheetsService instance.
   * @throws {Error} - If the Google Sheet ID is missing or if there is an error during initialization.
   */
  static async create(sheetId) {
    const service = new GoogleSheetsService(sheetId);
    await service.init();
    return service;
  }

  /**
   * @async
   * @description Initializes the Google Sheets service by authenticating and loading sheet information.
   * @returns {Promise<GoogleSheetsService>} - The initialized GoogleSheetsService instance.
   * @throws {Error} - If there is an error during authentication or loading sheet information.
   */
  async init() {
    try {
      const serviceAccountPath = new URL('../config/service-account.json', import.meta.url);
      const serviceAccountCredentials = JSON.parse(await readFile(serviceAccountPath));

      // Use google-auth-library to authenticate
      const auth = new google.auth.GoogleAuth({
        credentials: serviceAccountCredentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      // Get the OAuth2 client
      const authClient = await auth.getClient();

      // Authenticate the document with the OAuth2 client
      await this.doc.useOAuth2Client(authClient);

      // Load the document info (worksheets, etc.)
      await this.doc.loadInfo();

      // Get the first sheet (or modify to get a specific sheet)
      this.sheet = this.doc.sheetsByIndex[0];
      console.log('✅ Google Sheets initialized successfully');
      return this;
    } catch (error) {
      console.error('🔴 Failed to init Google Sheets:', error);
      throw new Error(`🔴 Failed to init Google Sheets: ${error.message}`); // Re-throw the error to be handled by the caller
    }
  }

  /**
   * @async
   * @description Adds a new row to the Google Sheet with the provided data.
   * @param {object} data - The data to add to the sheet.
   * @param {string} data.customer_name - The name of the customer.
   * @param {string} data.phone - The phone number of the customer.
   * @param {string} data.delivery_date - The delivery date.
   * @throws {Error} - If the Google Sheet is not initialized or if there is an error adding the data.
   */
  async addQueue(data) {
    if (!this.sheet) {
      throw new Error('🔴 Google Sheets not initialized. Call init() first.');
    }
    try {
      // Add a row with the provided data
      await this.sheet.addRow({
        'ชื่อลูกค้า': data.customer_name,
        'เบอร์โทร': data.phone,
        'สถานะล่าสุด': 'รับเข้า',
        'กำหนดส่ง': data.delivery_date,
      });
      console.log('✅ Data added to Google Sheets successfully');
    } catch (error) {
      console.error('🔴 Failed to add data to Google Sheets:', error, 'Data:', data);
      throw new Error(`🔴 Failed to add data to Google Sheets: ${error.message}`); // Re-throw the error to be handled by the caller
    }
  }
}

export default GoogleSheetsService;
