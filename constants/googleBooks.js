const GOOGLE_BOOKS_API_KEY = "AIzaSyB6n2qfYYgzXFbHC3jS_HK7XjSRruluAig";

export async function fetchBook(keyword) {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      keyword
    )}&langRestrict=ja&maxResults=1&key=${GOOGLE_BOOKS_API_KEY}`
  );

  const data = await response.json();
  const item = data.items?.[0];

  if (!item) return null;

  return {
    title: item.volumeInfo.title,
    author: item.volumeInfo.authors?.join("、") || "著者不明",
    description: item.volumeInfo.description || "説明なし",
    image: item.volumeInfo.imageLinks?.thumbnail || null,
  };
}