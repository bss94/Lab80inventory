import {promises as fs} from 'fs';
import crypto from 'crypto';
import {Category, CategoryWithoutId, DataBase, Item, ItemWithoutId, Place, PlaceWithoutId} from './types';

const filename = './db.json';
let data: DataBase = {
  places: [],
  categories: [],
  items: []
};

const fileDb = {
  async init() {
    try {
      const fileContents = await fs.readFile(filename);
      data = JSON.parse(fileContents.toString());
    } catch (e) {
      data = {
        places: [],
        categories: [],
        items: []
      };
    }
  },
  async getCategories() {
    return data.categories;
  },
  async addCategory(item: CategoryWithoutId) {
    const id = crypto.randomUUID();
    const newCategory: Category = {id, ...item};
    data.categories.push(newCategory);
    await this.save();
    return newCategory;
  },
  async removeCategory(id: string) {
    const index = data.categories.findIndex(el => el.id === id);
    if (index > -1) {
      data.categories.splice(index, 1);
      await this.save();
    } else {
      return index;
    }
  },
  async putCategory(id: string, index: number, category: CategoryWithoutId) {
    data.categories[index] = {id, ...category};
    await this.save();
    return data.categories[index];
  },

  async getItems() {
    return data.items;
  },
  async addItem(item: ItemWithoutId) {
    const id = crypto.randomUUID();
    const newItem: Item = {id, ...item};
    data.items.push(newItem);
    await this.save();
    return newItem;
  },
  async removeItem(id: string) {
    const index = data.items.findIndex(el => el.id === id);
    if (index > -1) {
      data.items.splice(index, 1);
      await this.save();
    }
    return index;
  },
  async putItem(id: string, index: number, item: ItemWithoutId) {
    data.items[index] = {id, ...item};
    await this.save();
    return data.items[index];

  },


  async getPlaces() {
    return data.places;
  },
  async addPlace(item: PlaceWithoutId) {
    const id = crypto.randomUUID();
    const newPlace: Place = {id, ...item};
    data.places.push(newPlace);
    await this.save();
    return newPlace;
  },
  async removePlace(id: string) {
    const index = data.places.findIndex(el => el.id === id);
    if (index > -1) {
      data.places.splice(index, 1);
      await this.save();
    }
    return index;
  },
  async putPlace(id: string, index: number, place: PlaceWithoutId) {
    data.places[index] = {id, ...place};
    await this.save();
    return data.places[index];
  },
  async save() {
    return fs.writeFile(filename, JSON.stringify(data, null, 2));
  }
};

export default fileDb;