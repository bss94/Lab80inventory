import express from 'express';
import fileDb from '../fileDb';
import placesRouter from './places';
import {imagesUpload} from '../multer';
import {ItemWithoutId} from '../types';

const itemsRouter = express.Router();

itemsRouter.get('/', async (req, res) => {
  const items = await fileDb.getItems();
  const resItems = items.map(el => ({id: el.id, title: el.title}));
  return res.send(resItems);
});

itemsRouter.get('/:id', async (req, res) => {
  const items = await fileDb.getItems();
  const item = items.find(item => item.id === req.params.id);
  if (!item) {
    return res.status(404).send('item not found.');
  } else {
    return res.status(200).send(item);
  }
});

itemsRouter.post('/', imagesUpload.single('image'), async (req, res) => {
  if (!req.body.title || !req.body.categoryId || !req.body.placeId) {
    return res.status(400).send('Title, placeId and categoryId are required!');
  } else if (req.body.date && isNaN(new Date(req.body.date).getDate())) {
    return res.status(400).send('Date should be a valid date');
  } else {
    const item: ItemWithoutId = {
      categoryId: req.body.categoryId,
      placeId: req.body.placeId,
      title: req.body.title,
      description: req.body.description ? req.body.description : '',
      photo: req.file ? req.file.filename : null,
      date: req.body.date ? req.body.date : new Date().toISOString(),
    };
    const savedItem = await fileDb.addItem(item);
    return res.send(savedItem);
  }
});

itemsRouter.delete('/:id', async (req, res) => {
  const removeResponse = await fileDb.removeItem(req.params.id);
  if (removeResponse) {
    return res.status(404).send('Item not found.cant delete Item');
  }
  return res.status(200).send('Item delete successfully.');
});

itemsRouter.put('/:id', imagesUpload.single('image'), async (req, res) => {
  if (!req.body.title && !req.body.categoryId && !req.body.placeId && !req.body.description && !req.body.photo && !req.body.date) {
    return res.status(400).send({error: 'No data to Update'});
  }
  if (req.body.date && isNaN(new Date(req.body.date).getDate())) {
    return res.status(400).send('Date should be a valid date');
  } else {
    const items = await fileDb.getItems();
    const index = items.findIndex(el => el.id === req.params.id);
    if (index > -1) {
      const item: ItemWithoutId = {
        categoryId: req.body.categoryId ? req.body.categoryId : items[index].categoryId,
        placeId: req.body.placeId ? req.body.placeId : items[index].placeId,
        title: req.body.title ? req.body.title : items[index].title,
        description: req.body.description ? req.body.description : items[index].description,
        photo: req.file ? req.file.filename : items[index].photo,
        date: req.body.date ? req.body.date : new Date().toISOString(),
      };
      const savedItem = await fileDb.putItem(req.params.id, index, item);
      return res.send(savedItem);
    } else {
      return res.status(404).send('Item not found.');
    }
  }
});

export default itemsRouter;
