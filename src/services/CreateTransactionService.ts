import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: Category;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (!title) throw Error('Title is required');
    if (!value) throw Error('Value is required');
    if (!type) throw Error('Type is required');
    if (!category) throw Error('Category is required');

    if (typeof value !== 'number') throw Error('Value must be a number.');

    const balance = await transactionsRepository.getBalance();
    switch (type) {
      case 'income':
        break;
      case 'outcome':
        if (balance.total < value) throw Error('Insufficient funds.');
        break;
      default:
        throw Error("Type must be 'outcome' or 'income'.");
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: category.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
