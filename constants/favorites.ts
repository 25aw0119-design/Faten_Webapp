import AsyncStorage from "@react-native-async-storage/async-storage";

export type FavoriteBook = {
  title: string;
  author: string;
  description: string;
  image: string | null;
  tags?: string[];
};

const KEY = "favoriteBooks";

export async function saveFavorite(book: FavoriteBook) {
  const data = await AsyncStorage.getItem(KEY);
  const favorites: FavoriteBook[] = data ? JSON.parse(data) : [];

  const exists = favorites.some((item) => item.title === book.title);

  if (!exists) {
    const newFavorites = [book, ...favorites];
    await AsyncStorage.setItem(KEY, JSON.stringify(newFavorites));
  }
}

export async function getFavorites() {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export async function removeFavorite(title: string) {
  const data = await AsyncStorage.getItem(KEY);
  const favorites: FavoriteBook[] = data ? JSON.parse(data) : [];

  const newFavorites = favorites.filter((item) => item.title !== title);

  await AsyncStorage.setItem(KEY, JSON.stringify(newFavorites));
}

export async function isFavorite(title: string) {
  const data = await AsyncStorage.getItem(KEY);
  const favorites: FavoriteBook[] = data ? JSON.parse(data) : [];

  return favorites.some((item) => item.title === title);
}

export async function toggleFavorite(book: FavoriteBook) {
  const data = await AsyncStorage.getItem(KEY);
  const favorites: FavoriteBook[] = data ? JSON.parse(data) : [];

  const exists = favorites.some((item) => item.title === book.title);

  let newFavorites: FavoriteBook[];

  if (exists) {
    newFavorites = favorites.filter((item) => item.title !== book.title);
  } else {
    newFavorites = [book, ...favorites];
  }

  await AsyncStorage.setItem(KEY, JSON.stringify(newFavorites));

  return !exists;
}