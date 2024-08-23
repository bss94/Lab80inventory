import express from 'express';
import fileDb from '../fileDb';
import {CategoryWithoutId} from '../types';

const categoriesRouter = express.Router();

categoriesRouter.get('/', async (req, res) => {
  const categories = await fileDb.getCategories();
  const resCategories = categories.map(el => ({id: el.id, title: el.title}))
  return res.send(resCategories);
});

categoriesRouter.get('/:id', async (req, res) => {
  const categories = await fileDb.getCategories();
  const category = categories.find(category => category.id === req.params.id);
  if (!category) {
    return res.status(404).send('Category not found.');
  } else {
    return res.status(200).send(category);
  }
});

categoriesRouter.post('/', async (req, res) => {
  if (!req.body.title) {
    return res.status(400).send('Title are required');
  }
  const category: CategoryWithoutId = {
    title: req.body.title,
    description: req.body.description ? req.body.description : '',
  };
  const savedCategory = await fileDb.addCategory(category);
  return res.send(savedCategory);
});

categoriesRouter.delete('/:id', async (req, res) => {
  const items = await fileDb.getItems();
  const itemsWithCurrentCategory = items.filter(item => item.categoryId === req.params.id);
  if (itemsWithCurrentCategory.length > 0) {
    return res.status(400).send('Cant delete category, category use on items!');
  }else {
    await fileDb.removeItem(req.params.id,'categories');
  }
})


export default categoriesRouter;