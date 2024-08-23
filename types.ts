export interface Item {
  id: string;
  categoryId: string;
  placeId: string;
  title: string;
  description: string;
  photo: string | null;
  date: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
}

export interface Place {
  id: string;
  title: string;
  description: string;
}

export type ItemWithoutId = Omit<Item, 'id'>;
export type CategoryWithoutId = Omit<Category, 'id'>;
export type PlaceWithoutId = Omit<Place, 'id'>;

export interface DataBase {
  places: Place[];
  categories: Category[];
  items: Item[];
}