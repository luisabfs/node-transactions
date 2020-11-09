import fs from 'fs';
import csv from 'csv-parse';
import path from 'path';

import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

const transactions: Array<Transaction> = [];

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  categoryTitle: string;
}

class ImportTransactionsService {
  public async execute(filename: string): Promise<Array<Transaction>> {
    const csvData = (await this.getData(filename)) as Array<Request>;

    const createTransaction = new CreateTransactionService();

    // eslint-disable-next-line no-restricted-syntax
    for (const csvRow of csvData) {
      // eslint-disable-next-line no-await-in-loop
      const transaction = await createTransaction.execute(csvRow);
      transactions.push(transaction);
    }

    return transactions;
  }

  private async getData(filename: string): Promise<unknown> {
    const csvData: Array<Request> = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(path.join(uploadConfig.directory, filename))
        .on('error', error => {
          console.error(error);
          reject(error);
        })
        .pipe(csv({ fromLine: 2 }))
        .on('data', async row => {
          const [title, type, value, categoryTitle] = row;
          csvData.push({ title, type, value, categoryTitle });
        })
        .on('end', async () => resolve(csvData));
    });
  }
}

export default ImportTransactionsService;
