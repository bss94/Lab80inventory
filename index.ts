import express from 'express';
import fileDb from './fileDb';
import cors from 'cors';
import config from './config';
import categoriesRouter from './routers/categories';

const app = express();
const port = 8000;

app.use(cors(config.corsOptions));
app.use(express.json());
app.use(express.static('public'));
app.use('/categories', categoriesRouter);
//app.use('/places', placesRouter);
//app.use('/items', itemsRouter);

const run = async () => {
  await fileDb.init();

  app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
  });
};

run().catch(console.error);

