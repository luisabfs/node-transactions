import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type, category }: Request): Transaction {
    if (!title) throw Error('Title is required');
    if (!value) throw Error('Value is required');
    if (!type) throw Error('Type is required');

    if (typeof value !== 'number') throw Error('Value must be a number.');

    const balance = this.transactionsRepository.getBalance();
    switch (type) {
      case 'income':
        break;
      case 'outcome':
        if (balance.total < value) throw Error('Insufficient funds.');
        break;
      default:
        throw Error("Type must be 'outcome' or 'income'.");
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
      category,
    });

    return transaction;
  }
}

export default CreateTransactionService;
