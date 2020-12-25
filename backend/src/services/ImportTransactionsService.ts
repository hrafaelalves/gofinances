import { getCustomRepository, getRepository, In } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface CSVTransacation{
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(csvTransactionPath: string): Promise<Transaction[]> {
    const transactionRepository = getCustomRepository(TransactionsRepository)
    const categoriesRepository = getRepository(Category);

    const contactsReadStream = fs.createReadStream(csvTransactionPath);

    const parsers = csvParse({
      from_line: 2,
    });

    const parseCSV = contactsReadStream.pipe(parsers);

    const transactions: CSVTransacation[] = [];
    const categories: string[] = [];

    // Book Insert
    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) => cell.trim());

      if(!title || !type || !value) return;

      categories.push(category);

      transactions.push({
        title,
        type,
        value,
        category
      });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories)
      }
    });

    const existentCategoriesTitles = existentCategories.map((category: Category) => category.title)

    const addCategoryTitles = categories
    .filter(category => !existentCategoriesTitles.includes(category))
    .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(title => ({
        title,
      }))
    );

    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existentCategories];

    const createdTransactions = transactionRepository.create(
      transactions.map(transaction => (
        {
          title: transaction.title,
          type: transaction.type,
          value: transaction.value,
          category: finalCategories.find(category => category.title === transaction.category)
        }
      ))
    )

    await transactionRepository.save(createdTransactions);

    await fs.promises.unlink(csvTransactionPath);

    return createdTransactions;
  }
}

export default ImportTransactionsService;