import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionsRepositoryDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.transactions.reduce((total, current) => {
      let result = total;
      if (current.type === 'income') {
        result = total + current.value;
      }

      return result;
    }, 0);

    const outcome = this.transactions.reduce((total, current) => {
      let result = total;

      if (current.type === 'outcome') {
        result = total + current.value;
      }

      return result;
    }, 0);

    const total = income - outcome;

    return { income, outcome, total };
  }

  public create({
    title,
    value,
    type,
  }: TransactionsRepositoryDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
