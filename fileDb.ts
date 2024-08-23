import {promises as fs} from 'fs';
import crypto from 'crypto';
import {Category, CategoryWithoutId, DataBase, Item, ItemWithoutId, Place, PlaceWithoutId} from './types';


const filename = './db.json';
let data: DataBase = {
  places:[],
  categories:[],
  items:[]
};

const fileDb = {
  async init() {
    try {
      const fileContents = await fs.readFile(filename);
      data = JSON.parse(fileContents.toString());
    } catch (e) {
      data = {
        places:[],
        categories:[],
        items:[]
      };
    }
  },
  async getItems() {
      return data.items;
  },
  async getCategories() {
    return data.categories;
  },
  async getPlaces() {
    return data.places;
  },

  async addItem(item: ItemWithoutId) {
    const id = crypto.randomUUID();
    const newItem:Item = {id, ...item};
    data.items.push(newItem);
    await this.save();
    return newItem;
  },

  async addCategory(item: CategoryWithoutId) {
    const id = crypto.randomUUID();
    const newCategory:Category = {id, ...item};
    data.categories.push(newCategory);
    await this.save();
    return newCategory;
  },

  async addPlace(item: PlaceWithoutId) {
    const id = crypto.randomUUID();
    const newPlace:Place = {id, ...item};
    data.places.push(newPlace);
    await this.save();
    return newPlace;
  },

  async removeItem(id: string,target:string) {
    if(target==='places'){
      const index = data.places.findIndex(el => el.id === id);
      if (index > -1) {
        data.places.splice(index, 1);
      }
    }else if(target === 'categories'){
      const index = data.categories.findIndex(el => el.id === id);
      if (index > -1) {
        data.categories.splice(index, 1);
      }
    }else {
      const index = data.items.findIndex(el => el.id === id);
      if (index > -1) {
        data.items.splice(index, 1);
      }
    }
    await this.save();
  },
  async putItem(id: string,target:string) {

////////////////
  },

  async save() {
    return fs.writeFile(filename, JSON.stringify(data, null, 2));
  }
};

export default fileDb;