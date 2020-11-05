import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import CreateCategoryService from '../services/CreateCategoryService';

const transactionRouter = Router();

transactionRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find({
    relations: ['category'],
  });
  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionRouter.post('/', async (request, response) => {
  const { title, value, type, category: categoryTitle } = request.body;
  const createTransaction = new CreateTransactionService();

  const createCategory = new CreateCategoryService();
  const category = await createCategory.execute({ title: categoryTitle });

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();
  await deleteTransaction.execute(id);

  return response.send();
});

export default transactionRouter;
