import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import booksByCard from "../constants/booksByCard";
import { isFavorite, toggleFavorite } from "../constants/favorites";
import { fetchBook } from "../constants/googleBooks";

type Book = {
  title: string;
  author: string;
  description: string;
  image: string | null;
  tags?: string[];
};

const cardMap: { [key: string]: string } = {
  星: "STAR",
  太陽: "SUN",
  月: "MOON",
  隠者: "HERMIT",
  運命の輪: "WHEEL",
  節制: "TEMPERANCE",
  愚者: "FOOL",
  STAR: "STAR",
  SUN: "SUN",
  MOON: "MOON",
  HERMIT: "HERMIT",
  WHEEL: "WHEEL",
  TEMPERANCE: "TEMPERANCE",
  FOOL: "FOOL",
};

export default function BookResultScreen() {
  const { card } = useLocalSearchParams();
  const selectedCard = Array.isArray(card) ? card[0] : card;

  const apiCard = selectedCard
    ? cardMap[String(selectedCard).trim()] ||
      String(selectedCard).trim().toUpperCase()
    : "";

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const mainBook = books[0];
  const otherBooks = books.slice(1);

  useEffect(() => {
    if (!apiCard) {
      setError("カード情報が見つかりませんでした。");
      setLoading(false);
      return;
    }

    const bookKeywords = booksByCard[apiCard as keyof typeof booksByCard];

    if (!bookKeywords) {
      setError("本のデータが見つかりませんでした。");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    Promise.all(
      bookKeywords.map(async (book) => {
        const apiBook = await fetchBook(book.keyword);
        return apiBook || book.fallback;
      })
    )
      .then((results) => {
        setBooks(results);
      })
      .catch(() => {
        setBooks(bookKeywords.map((book) => book.fallback));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiCard]);

  useFocusEffect(
    useCallback(() => {
      async function checkSaved() {
        if (!mainBook) return;

        const result = await isFavorite(mainBook.title);
        setSaved(result);
      }

      checkSaved();
    }, [mainBook])
  );

const handleSaveFavorite = async () => {
  if (!mainBook) return;

  const newSaved = await toggleFavorite(mainBook);
  setSaved(newSaved);
};

  return (
    <ImageBackground
      source={require("../assets/images/tarot-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#F4D9A7" />
            </TouchableOpacity>



            <View style={styles.dummyBox} />
          </View>

          <Text style={styles.title}>おすすめの一冊</Text>
          <Text style={styles.subTitle}>あなたのカードが導いた本</Text>

          <View style={styles.starLine}>
            <View style={styles.line} />
            <Text style={styles.star}>✦</Text>
            <View style={styles.line} />
          </View>

          {loading && <Text style={styles.statusText}>本を探しています...</Text>}

          {!loading && error !== "" && (
            <Text style={styles.statusText}>{error}</Text>
          )}

          {!loading && !error && mainBook && (
            <>
              <View style={styles.mainCard}>
                <View style={styles.badge}>
                  <Text style={styles.badgeSmall}>おすすめ</Text>
                  <Text style={styles.badgeBig}>No.1</Text>
                </View>

                <View style={styles.bookImageWrap}>
                  {mainBook.image ? (
                    <Image
                      source={{ uri: mainBook.image }}
                      style={styles.mainBookImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.mainNoImageBox}>
                      <Text style={styles.noImageText}>No Image</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.bookTitle}>{mainBook.title}</Text>
                <Text style={styles.author}>著者：{mainBook.author}</Text>

                <Text numberOfLines={4} style={styles.description}>
                  {mainBook.description}
                </Text>

                <View style={styles.textBox}>
                  <Text style={styles.sectionTitle}>なぜこの本？</Text>
                  <Text style={styles.sectionText}>
                    あなたが選んだカードの雰囲気に合わせて、今の心にそっと寄り添う一冊を選びました。
                  </Text>

                  <View style={styles.divider} />

                  <Text style={styles.sectionTitle}>あらすじ</Text>
                  <Text numberOfLines={5} style={styles.sectionText}>
                    {mainBook.description}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.likeButton, saved && styles.likeButtonSaved]}
                  onPress={handleSaveFavorite}
                >
                  <Ionicons
                    name={saved ? "heart" : "heart-outline"}
                    size={22}
                    color={saved ? "#E8C989" : "#281536"}
                  />

                  <Text style={[styles.likeText, saved && styles.likeTextSaved]}>
                    {saved ? "保存済み" : "気になる本にする"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.otherHeader}>
                <View style={styles.line} />
                <Text style={styles.otherTitle}>他のおすすめ</Text>
                <View style={styles.line} />
              </View>

              <View style={styles.otherBooks}>
                {otherBooks.slice(0, 3).map((book, index) => (
                  <View key={`${book.title}-${index}`} style={styles.smallCard}>
                    {book.image ? (
                      <Image
                        source={{ uri: book.image }}
                        style={styles.smallBookImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.smallNoImageBox}>
                        <Text style={styles.smallNoImageText}>No Image</Text>
                      </View>
                    )}

                    <Text numberOfLines={2} style={styles.smallTitle}>
                      {book.title}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </ScrollView>

        <View style={styles.bottomNav}>
          <TouchableOpacity onPress={() => router.push("/")}>
            <Ionicons name="home-outline" size={28} color="#F4D9A7" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/favorites")}>
            <Ionicons name="heart" size={28} color="#F4D9A7" />
          </TouchableOpacity>

          <TouchableOpacity>
            <Ionicons name="person-outline" size={28} color="#F4D9A7" />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(8, 5, 24, 0.58)",
  },

  container: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "rgba(244,217,167,0.5)",
    backgroundColor: "rgba(255,255,255,0.06)",
    justifyContent: "center",
    alignItems: "center",
  },



  dummyBox: {
    width: 42,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 27,
    textAlign: "center",
    letterSpacing: 4,
    marginBottom: 8,
  },

  subTitle: {
    color: "#D8D1E8",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 16,
  },

  starLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },

  line: {
    width: 86,
    height: 1,
    backgroundColor: "rgba(232,201,137,0.45)",
  },

  star: {
    color: "#E8C989",
    fontSize: 22,
    marginHorizontal: 12,
  },

  statusText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
  },

  mainCard: {
    position: "relative",
    backgroundColor: "rgba(20, 17, 48, 0.86)",
    borderRadius: 34,
    borderWidth: 1,
    borderColor: "rgba(232,201,137,0.85)",
    paddingTop: 34,
    paddingHorizontal: 22,
    paddingBottom: 28,
    marginBottom: 34,
  },

  badge: {
    position: "absolute",
    top: -20,
    left: 22,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#0B0822",
    borderWidth: 1,
    borderColor: "#E8C989",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  badgeSmall: {
    color: "#E8C989",
    fontSize: 11,
  },

  badgeBig: {
    color: "#FFFFFF",
    fontSize: 17,
    marginTop: 2,
  },

  bookImageWrap: {
    alignSelf: "center",
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(232,201,137,0.28)",
    marginBottom: 20,
  },

  mainBookImage: {
    width: 145,
    height: 215,
    borderRadius: 8,
  },

  mainNoImageBox: {
    width: 145,
    height: 215,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  noImageText: {
    color: "#D8D5E8",
    fontSize: 13,
  },

  bookTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "600",
    lineHeight: 30,
    textAlign: "center",
    marginBottom: 8,
  },

  author: {
    color: "#D8D1E8",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 18,
  },

  description: {
    color: "#F4F0FF",
    fontSize: 13,
    lineHeight: 23,
    marginBottom: 22,
  },

  textBox: {
    borderWidth: 1,
    borderColor: "rgba(232,201,137,0.5)",
    borderRadius: 24,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  sectionTitle: {
    color: "#E8C989",
    fontSize: 15,
    marginBottom: 7,
    fontWeight: "600",
  },

  sectionText: {
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 23,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginVertical: 16,
  },

  likeButton: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 24,
    borderRadius: 999,
    paddingHorizontal: 28,
    paddingVertical: 14,
    backgroundColor: "#E8C989",
  },

  likeButtonSaved: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "#E8C989",
  },

  likeText: {
    color: "#281536",
    fontSize: 14,
    fontWeight: "700",
  },

  likeTextSaved: {
    color: "#E8C989",
  },

  otherHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  otherTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    marginHorizontal: 12,
    letterSpacing: 1,
  },

  otherBooks: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  smallCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(232,201,137,0.22)",
  },

  smallBookImage: {
    width: 88,
    height: 128,
    borderRadius: 8,
    marginBottom: 8,
  },

  smallNoImageBox: {
    width: 88,
    height: 128,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  smallNoImageText: {
    color: "#D8D5E8",
    fontSize: 10,
  },

  smallTitle: {
    color: "#FFFFFF",
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },

  bottomNav: {
    position: "absolute",
    bottom: 18,
    left: 24,
    right: 24,
    height: 66,
    borderRadius: 33,
    backgroundColor: "rgba(8,8,34,0.95)",
    borderWidth: 1,
    borderColor: "rgba(232,201,137,0.35)",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});