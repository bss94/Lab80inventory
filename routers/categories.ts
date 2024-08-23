import express from 'express';
import fileDb from '../fileDb';
import {CategoryWithoutId} from '../types';

const categoriesRouter = express.Router();

categoriesRouter.get('/', async (req, res) => {
  const categories = await fileDb.getCategories();
  const resCategories = categories.map(el => ({id: el.id, title: el.title}));
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
  } else {
    const removeResponse = await fileDb.removeCategory(req.params.id);
    if (removeResponse) {
      return res.status(404).send('Category not found. Cant delete category');
    }
    return res.status(200).send('Category delete successfully.');
  }
});

categoriesRouter.put('/:id', async (req, res) => {
  if (!req.body.title && !req.body.description) {
    return res.status(400).send('Cant put category! No data to update');
  }
  const categories = await fileDb.getCategories();
  const index = categories.findIndex(el => el.id === req.params.id);
  if (index > -1) {
    const category: CategoryWithoutId = {
      title: req.body.title ? req.body.title : categories[index].title,
      description: req.body.description ? req.body.description : categories[index].description,
    };
    const putCategory = await fileDb.putCategory(req.params.id, index, category);
    return res.send(putCategory);
  } else {
    return res.status(404).send('Cant put category! Category not found');
  }
});

export default categoriesRouter;