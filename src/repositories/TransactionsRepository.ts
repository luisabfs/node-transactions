import { EntityRepository, Repository } from 'typeorm';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const income = transactions.reduce((total, current) => {
      let result = total;
      if (current.type === 'income') {
        result = total + +current.value;
      }

      return result;
    }, 0);

    const outcome = transactions.reduce((total, current) => {
      let result = total;

      if (current.type === 'outcome') {
        result = total + +current.value;
      }

      return result;
    }, 0);

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
