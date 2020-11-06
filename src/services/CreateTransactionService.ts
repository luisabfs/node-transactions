import { getCustomRepository } from 'typeorm';

import CreateCategoryService from './CreateCategoryService';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  categoryTitle: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    categoryTitle,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (!title) throw new AppError('Title is required');
    if (!value) throw new AppError('Value is required');
    if (!type) throw new AppError('Type is required');
    if (!categoryTitle) throw new AppError('Category is required');

    if (typeof value !== 'number')
      throw new AppError('Value must be a number.');

    const balance = await transactionsRepository.getBalance();
    switch (type) {
      case 'income':
        break;
      case 'outcome':
        if (balance.total < value) throw new AppError('Insufficient funds.');
        break;
      default:
        throw new AppError("Type must be 'outcome' or 'income'.");
    }

    const createCategory = new CreateCategoryService();
    const category = await createCategory.execute({ title: categoryTitle });

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
