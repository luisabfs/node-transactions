import fs from 'fs';
import csv from 'csv-parse';
import path from 'path';

import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

const transactions: Array<Transaction> = [];
let count = 0;

class ImportTransactionsService {
  public async execute(filename: string): Promise<Array<Transaction>> {
    fs.createReadStream(path.join(uploadConfig.directory, filename))
      .pipe(csv())
      .on('data', async row => {
        // eslint-disable-next-line no-plusplus
        count++;

        if (count > 1) {
          const createTransaction = new CreateTransactionService();

          await createTransaction.execute({
            title: row[0],
            type: row[1],
            value: +row[2],
            categoryTitle: row[3],
          });
          transactions.push(row);
        }
      })
      .on('end', async () => console.table(transactions));

    // const createTransaction = new CreateTransactionService();
    // console.log('out', transactions);
    // transactions.map(
    //   async (row): Promise<Array<Transaction>> => {
    // const transaction = await createTransaction.execute({
    //   title: row[0],
    //   type: row[1],
    //   value: +row[2],
    //   categoryTitle: row[3],
    // });
    //   },
    // );

    return transactions;
  }
}

export default ImportTransactionsService;
