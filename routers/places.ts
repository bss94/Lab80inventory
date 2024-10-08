import express from 'express';
import fileDb from '../fileDb';
import {PlaceWithoutId} from '../types';

const placesRouter = express.Router();

placesRouter.get('/', async (req, res) => {
  const places = await fileDb.getPlaces();
  const resPlaces = places.map(el => ({id: el.id, title: el.title}));
  return res.send(resPlaces);
});

placesRouter.get('/:id', async (req, res) => {
  const places = await fileDb.getPlaces();
  const place = places.find(place => place.id === req.params.id);
  if (!place) {
    return res.status(404).send('Place not found.');
  } else {
    return res.status(200).send(place);
  }
});

placesRouter.post('/', async (req, res) => {
  if (!req.body.title) {
    return res.status(400).send('Title are required');
  }
  const place: PlaceWithoutId = {
    title: req.body.title,
    description: req.body.description ? req.body.description : '',
  };
  const savedPlace = await fileDb.addPlace(place);
  return res.send(savedPlace);
});

placesRouter.delete('/:id', async (req, res) => {
  const items = await fileDb.getItems();
  const itemsWithCurrentPlace = items.filter(item => item.placeId === req.params.id);
  if (itemsWithCurrentPlace.length > 0) {
    return res.status(400).send('Cant delete place, place use on items!');
  } else {
    const removeResponse = await fileDb.removePlace(req.params.id);
    if (removeResponse) {
      return res.status(404).send('Place not found.cant delete place');
    }
    return res.status(200).send('Place delete successfully.');
  }
});

placesRouter.put('/:id', async (req, res) => {
  if (!req.body.title && !req.body.description) {
    return res.status(400).send('Cant update place! No data to Update');
  }
  const places = await fileDb.getPlaces();
  const index = places.findIndex(place => place.id === req.params.id);
  if (index > -1) {
    const newPlace: PlaceWithoutId = {
      title: req.body.title ? req.body.title : places[index].title,
      description: req.body.description ? req.body.description : places[index].description,
    };
    const putPlace = await fileDb.putPlace(req.params.id, index, newPlace);
    return res.status(200).send(putPlace);
  } else {
    return res.status(404).send('Place not found.cant update place');
  }
});

export default placesRouter;