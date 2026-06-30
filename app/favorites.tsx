import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  FavoriteBook,
  getFavorites,
  removeFavorite,
} from "../constants/favorites";

export default function FavoritesScreen() {
  const [books, setBooks] = useState<FavoriteBook[]>([]);

  const loadFavorites = async () => {
    const list = await getFavorites();
    setBooks(list);
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

const handleRemove = async (title: string) => {
  await removeFavorite(title);
  loadFavorites();
};

  return (
    <ImageBackground
      source={require("../assets/images/tarot-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#F4D9A7" />
          </TouchableOpacity>

          <Text style={styles.topText}>FAVORITES</Text>

          <View style={styles.dummyBox} />
        </View>

        <Text style={styles.title}>気になる本</Text>
        <Text style={styles.subTitle}>保存した本のリスト</Text>

        {books.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="heart-outline" size={52} color="#E8C989" />
            <Text style={styles.emptyText}>まだ保存した本がありません</Text>
            <Text style={styles.emptySubText}>
              結果ページで「気になる本にする」を押すと、ここに保存されます。
            </Text>
          </View>
        ) : (
          <FlatList
            data={books}
            keyExtractor={(item) => item.title}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.bookCard}>
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.bookImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.noImageBox}>
                    <Text style={styles.noImageText}>No Image</Text>
                  </View>
                )}

                <View style={styles.bookInfo}>
                  <Text numberOfLines={2} style={styles.bookTitle}>
                    {item.title}
                  </Text>

                  <Text numberOfLines={1} style={styles.author}>
                    著者：{item.author}
                  </Text>

                  <Text numberOfLines={3} style={styles.description}>
                    {item.description}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleRemove(item.title)}
                >
                  <Ionicons name="trash-outline" size={22} color="#E8C989" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        <View style={styles.bottomNav}>
          <TouchableOpacity onPress={() => router.push("/")}>
            <Ionicons name="home-outline" size={28} color="#F4D9A7" />
          </TouchableOpacity>

          <TouchableOpacity>
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
    backgroundColor: "rgba(8, 5, 24, 0.64)",
    paddingTop: 48,
    paddingHorizontal: 20,
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

  topText: {
    color: "#E8C989",
    fontSize: 12,
    letterSpacing: 3,
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
    marginBottom: 28,
  },

  list: {
    paddingBottom: 110,
  },

  bookCard: {
    flexDirection: "row",
    backgroundColor: "rgba(20, 17, 48, 0.86)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(232,201,137,0.45)",
    padding: 14,
    marginBottom: 16,
    alignItems: "center",
  },

  bookImage: {
    width: 78,
    height: 112,
    borderRadius: 8,
    marginRight: 14,
  },

  noImageBox: {
    width: 78,
    height: 112,
    borderRadius: 8,
    marginRight: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  noImageText: {
    color: "#D8D5E8",
    fontSize: 10,
  },

  bookInfo: {
    flex: 1,
  },

  bookTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
    marginBottom: 6,
  },

  author: {
    color: "#D8D1E8",
    fontSize: 12,
    marginBottom: 8,
  },

  description: {
    color: "#F4F0FF",
    fontSize: 12,
    lineHeight: 19,
  },

  deleteButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "rgba(232,201,137,0.35)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  emptyBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 26,
    paddingBottom: 120,
  },

  emptyText: {
    color: "#FFFFFF",
    fontSize: 18,
    marginTop: 18,
    marginBottom: 8,
  },

  emptySubText: {
    color: "#D8D1E8",
    fontSize: 13,
    lineHeight: 22,
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