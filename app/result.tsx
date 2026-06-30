import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const cardResults = {
  STAR: {
    name: "The Star（星）",
    keyword: "希望・癒し・再生",
    image: require("../assets/images/star_card.png"),
    meaning:
      "星は、希望・癒し・再生を表すカードです。\n\n今はまだ不安や迷いが残っていたとしても、少しずつ心が回復し、未来へ向かう光が見え始めています。焦らなくても大丈夫です。あなたの歩く道には、新しい可能性が待っています。",
    personalMessage:
      "あなたはこれまで、たくさんのことを頑張ってきました。今は自分を責めるよりも、少しだけ心を休ませる時間が必要です。\n\nこの本があなたの心を優しく照らし、前へ進む力を届けてくれますように。",
    shortMessage: "焦らなくても大丈夫。\n光はもう、あなたの近くにあります。",
  },

  SUN: {
    name: "The Sun（太陽）",
    keyword: "成功・喜び・前向き",
    image: require("../assets/images/sun_card.png"),
    meaning:
      "太陽は、成功・前向き・喜びを表すカード。\n\n今のあなたは、自分らしく進むことで運が味方してくれます。自信を持って一歩踏み出すことで、新しい出会いやチャンスが自然と訪れるでしょう。",
    personalMessage:
      "あなたが積み重ねてきた努力は、少しずつ実を結び始めています。迷ったときは、自分の気持ちに素直になってください。\n\nこの本が、あなたの未来をさらに明るく照らしてくれるはずです。",
    shortMessage: "あなたの努力は、\n少しずつ光になり始めています。",
  },

  MOON: {
    name: "The Moon（月）",
    keyword: "感情・不安・直感",
    image: require("../assets/images/moon_card.png"),
    meaning:
      "月は、不安・迷い・直感を表すカードです。\n\n今はまだ答えが見えなくても大丈夫です。焦らず、自分の心の声に耳を傾けることで、本当に進むべき道が見えてきます。",
    personalMessage:
      "今感じている迷いや不安は、決して無駄ではありません。あなた自身を知るための大切な時間です。\n\nこの本が、心を少し軽くし、新しい視点を届けてくれるでしょう。",
    shortMessage: "迷いの中にも、\nあなたを導く声があります。",
  },

  HERMIT: {
    name: "The Hermit（隠者）",
    keyword: "内省・知恵",
    image: require("../assets/images/hermit_card.png"),
    meaning:
      "隠者は、内省・知恵・成長を表すカードです。\n\n今は外へ答えを求めるより、自分自身と向き合う時間が大切です。静かな時間の中で、あなたに必要な気づきが生まれるでしょう。",
    personalMessage:
      "周りと比べる必要はありません。あなたの歩幅で、一歩ずつ進めば十分です。\n\nこの本が、あなたの心に寄り添い、新しい気づきを与えてくれるはずです。",
    shortMessage: "静かな時間の中に、\n本当の答えが隠れています。",
  },

  WHEEL: {
    name: "Wheel of Fortune（運命の輪）",
    keyword: "転機・運命",
    image: require("../assets/images/wheel_of_fortune_card.png"),
    meaning:
      "運命の輪は、転機・変化・新しい流れを表すカード。\n\n人生は今、新しいステージへ進もうとしています。変化を恐れず受け入れることで、大きな可能性が広がっていくでしょう。",
    personalMessage:
      "偶然の出来事にも意味があります。今目の前にあるチャンスを大切にしてください。\n\nこの本が、新しい一歩を踏み出す勇気を与えてくれるでしょう。",
    shortMessage: "今の変化は、\n新しい未来への入り口です。",
  },

  TEMPERANCE: {
    name: "Temperance（節制）",
    keyword: "調和・バランス",
    image: require("../assets/images/temperance_card.png"),
    meaning:
      "節制は、調和・癒し・バランスを表すカード。\n\n頑張り続けるだけではなく、心と体を整えることも大切な時間です。ゆっくりと積み重ねることで、理想の未来へ近づいていきます。",
    personalMessage:
      "無理をしなくても、あなたは十分頑張っています。少し肩の力を抜いて、自分を大切にしてください。\n\nこの本が、穏やかな時間と優しい気持ちを届けてくれることを願っています。",
    shortMessage: "少し力を抜くことで、\n心はまた整っていきます。",
  },
};

type CardKey = keyof typeof cardResults;

const floatingStars = [
  { left: "12%", top: "12%", size: 18, delay: 0 },
  { left: "78%", top: "16%", size: 12, delay: 300 },
  { left: "64%", top: "28%", size: 20, delay: 700 },
  { left: "18%", top: "36%", size: 10, delay: 1000 },
  { left: "84%", top: "46%", size: 16, delay: 1300 },
  { left: "10%", top: "58%", size: 22, delay: 500 },
  { left: "72%", top: "66%", size: 11, delay: 900 },
  { left: "28%", top: "78%", size: 14, delay: 1500 },
  { left: "86%", top: "84%", size: 18, delay: 1800 },
];

function FloatingStar({ left, top, size, delay }: any) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 1],
  });

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.3],
  });

  return (
    <Animated.Text
      pointerEvents="none"
      style={[
        styles.floatingStar,
        {
          left,
          top,
          fontSize: size,
          opacity,
          transform: [{ scale }],
        },
      ]}
    >
      ✦
    </Animated.Text>
  );
}

export default function ResultScreen() {
  const { card } = useLocalSearchParams();
  const [showDetail, setShowDetail] = useState(false);

  const cardKey =
    typeof card === "string" && card in cardResults
      ? (card as CardKey)
      : "STAR";

  const result = cardResults[cardKey];

  const splitName = result.name.split("（");
  const enName = splitName[0].toUpperCase();
  const jpName = splitName[1]?.replace("）", "") || "";

  const entranceAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const detailAnim = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;

  const floatY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const shineX = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-140, 320],
  });

  const runEntrance = () => {
    entranceAnim.setValue(0);

    Animated.timing(entranceAnim, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    runEntrance();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.timing(shineAnim, {
        toValue: 1,
        duration: 2200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const handleBack = () => {
    if (showDetail) {
      setShowDetail(false);
      shineAnim.setValue(0);
      runEntrance();
    } else {
      router.back();
    }
  };

  const handleShowDetail = () => {
    detailAnim.setValue(0);
    setShowDetail(true);

    Animated.timing(detailAnim, {
      toValue: 1,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  return (
    <ImageBackground
      source={require("../assets/images/tarot-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {floatingStars.map((star, index) => (
          <FloatingStar key={index} {...star} />
        ))}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          {showDetail ? (
            <Animated.View
              style={[
                styles.detailWrapper,
                {
                  opacity: detailAnim,
                  transform: [
                    {
                      translateY: detailAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [26, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.topStar}>✦</Text>
              <Text style={styles.detailEnTitle}>{enName}</Text>
              <Text style={styles.detailJpTitle}>{jpName}</Text>

              <View style={styles.keywordPill}>
                <Text style={styles.keyword}>{result.keyword}</Text>
              </View>

              <View style={styles.goldLineBox}>
                <View style={styles.line} />
                <Text style={styles.lineStar}>✦</Text>
                <View style={styles.line} />
              </View>

              <View style={styles.detailCard}>
                <Text style={styles.number}>01</Text>
                <Text style={styles.sectionTitle}>カードの意味</Text>
                <Text style={styles.detailText}>{result.meaning}</Text>

                <View style={styles.divider} />
                <Text style={styles.number}>02</Text>
                <Text style={styles.sectionTitle}>あなたへのメッセージ</Text>
                <Text style={styles.detailText}>{result.personalMessage}</Text>
              </View>
              <TouchableOpacity
                style={styles.backTextButton}
                onPress={() => {
                  setShowDetail(false);
                  shineAnim.setValue(0);
                  runEntrance();
                }}
              >
                <Text style={styles.backText}>← 結果画面へ戻る</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <Animated.View
              style={[
                styles.mainWrapper,
                {
                  opacity: entranceAnim,
                  transform: [
                    {
                      translateY: entranceAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.topStar}>✦</Text>

              <Text style={styles.enTitle}>{enName}</Text>
              <Text style={styles.jpTitle}>{jpName}</Text>

              <View style={styles.goldLineBox}>
                <View style={styles.line} />
                <Text style={styles.lineStar}>✦</Text>
                <View style={styles.line} />
              </View>

              <Animated.View
                style={[
                  styles.cardFrame,
                  {
                    transform: [{ translateY: floatY }],
                  },
                ]}
              >
                <View style={styles.cardGlow} />
                <Image
                  source={result.image}
                  style={styles.cardImage}
                  resizeMode="contain"
                />
              </Animated.View>

              <View style={styles.keywordPill}>
                <Text style={styles.keyword}>{result.keyword}</Text>
              </View>

              <View style={styles.messageBox}>
                <Text style={styles.messageLabel}>
                  今日あなたに届いたメッセージ
                </Text>
                <Text style={styles.messageText}>
                  「{result.shortMessage}」
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.nextButton}
                onPress={() =>
                  router.push({
                    pathname: "/book-result",
                    params: { card: cardKey },
                  })
                }
              >
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.buttonShine,
                    {
                      transform: [{ translateX: shineX }, { rotate: "18deg" }],
                    },
                  ]}
                />

                <Text style={styles.nextButtonStar}>✦</Text>
                <Text style={styles.nextButtonText}>運命の一冊を見る</Text>
                <Text style={styles.nextButtonStar}>✦</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.detailButton}
                onPress={handleShowDetail}
              >
                <Text style={styles.detailButtonText}>カードの意味を見る</Text>
                <Text style={styles.detailArrow}>→</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </ScrollView>
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
    backgroundColor: "rgba(8, 4, 19, 0.78)",
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 82,
    paddingBottom: 56,
    alignItems: "center",
  },

  floatingStar: {
    position: "absolute",
    color: "#FFD76A",
  },
  backTextButton: {
    marginTop: 42,
    marginBottom: 60,
  },

  backText: {
    color: "#FFD76A",
    fontSize: 16,
    letterSpacing: 1.5,
  },
  mainWrapper: {
    width: "100%",
    alignItems: "center",
  },

  topStar: {
    color: "#FFD76A",
    fontSize: 28,
    marginBottom: 18,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },

  enTitle: {
    color: "#FFF5DA",
    fontSize: 34,
    letterSpacing: 5,
    textAlign: "center",
    textShadowColor: "rgba(255,215,106,0.7)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },

  jpTitle: {
    color: "rgba(255, 215, 106, 0.9)",
    fontSize: 18,
    marginTop: 8,
    textAlign: "center",
    letterSpacing: 2,
  },

  goldLineBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 24,
    marginBottom: 26,
  },

  line: {
    width: 82,
    height: 1,
    backgroundColor: "rgba(255, 215, 106, 0.45)",
  },

  lineStar: {
    color: "#FFD76A",
    fontSize: 18,
  },

  cardFrame: {
    width: 218,
    height: 334,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },

  cardGlow: {
    position: "absolute",
    width: 230,
    height: 330,
    borderRadius: 28,
    backgroundColor: "rgba(255, 215, 106, 0.08)",
    shadowColor: "#FFD76A",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 30,
    elevation: 16,
  },

  cardImage: {
    width: 202,
    height: 318,
  },

  keywordPill: {
    paddingVertical: 9,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: "rgba(255, 215, 106, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 106, 0.36)",
  },

  keyword: {
    color: "#FFE9A8",
    fontSize: 15,
    letterSpacing: 1.8,
    textAlign: "center",
  },

  messageBox: {
    width: "100%",
    marginTop: 30,
    paddingVertical: 26,
    paddingHorizontal: 22,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(255, 215, 106, 0.3)",
    alignItems: "center",
  },

  messageLabel: {
    color: "rgba(255, 215, 106, 0.78)",
    fontSize: 13,
    letterSpacing: 2,
    marginBottom: 16,
  },

  messageText: {
    color: "#FFF5DA",
    fontSize: 18,
    lineHeight: 32,
    textAlign: "center",
    letterSpacing: 1,
  },

  nextButton: {
    width: "100%",
    maxWidth: 320,
    height: 72,
    borderRadius: 999,
    marginTop: 34,
    overflow: "hidden",
    backgroundColor: "rgba(77, 35, 122, 0.9)",
    borderWidth: 1.6,
    borderColor: "#FFD76A",
    shadowColor: "#FFD76A",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.72,
    shadowRadius: 22,
    elevation: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 26,
  },

  buttonShine: {
    position: "absolute",
    left: 0,
    top: -30,
    width: 52,
    height: 140,
    backgroundColor: "rgba(255,255,255,0.24)",
  },

  nextButtonText: {
    color: "#FFF5DA",
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: 2,
    textAlign: "center",
    textShadowColor: "rgba(255, 215, 106, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  nextButtonStar: {
    color: "#FFD76A",
    fontSize: 22,
    textShadowColor: "#FFD76A",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },

  detailButton: {
    width: "100%",
    maxWidth: 320,
    height: 54,
    marginTop: 18,
    borderBottomWidth: 1,
    borderColor: "rgba(255, 215, 106, 0.36)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },

  detailButtonText: {
    color: "#FFE6A3",
    fontSize: 15,
    letterSpacing: 1.6,
  },

  detailArrow: {
    color: "#FFD76A",
    fontSize: 22,
  },

  detailWrapper: {
    width: "100%",
    alignItems: "center",
  },

  detailEnTitle: {
    color: "#FFF5DA",
    fontSize: 30,
    letterSpacing: 5,
    textAlign: "center",
  },

  detailJpTitle: {
    color: "#FFD76A",
    fontSize: 18,
    marginTop: 8,
    marginBottom: 18,
    letterSpacing: 2,
  },

  detailCard: {
    width: "100%",
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 30,
    backgroundColor: "rgba(22, 12, 42, 0.76)",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 106, 0.34)",
  },

  number: {
    color: "rgba(255, 215, 106, 0.45)",
    fontSize: 12,
    letterSpacing: 4,
    textAlign: "center",
    marginBottom: 8,
  },

  sectionTitle: {
    color: "#FFD76A",
    fontSize: 19,
    marginBottom: 18,
    textAlign: "center",
    letterSpacing: 1.5,
  },

  detailText: {
    color: "rgba(255, 245, 218, 0.92)",
    fontSize: 15,
    lineHeight: 28,
    textAlign: "center",
  },

  divider: {
    width: 150,
    height: 1,
    backgroundColor: "rgba(255, 215, 106, 0.38)",
    marginTop: 36,
    marginBottom: 32,
    alignSelf: "center",
  },
});
