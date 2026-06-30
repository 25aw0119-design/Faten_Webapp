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

const COLORS = {
  text: "rgba(248,247,255,0.95)",
  text2: "rgba(226,223,255,0.82)",
  text3: "rgba(198,192,255,0.65)",
  glow: "rgba(170,145,255,0.22)",
  glowStrong: "rgba(190,170,255,0.35)",
  border: "rgba(195,175,255,0.28)",
  line: "rgba(188,174,255,0.25)",
  star: "#ECE6FF",
  mistBlue: "rgba(105,155,255,0.16)",
  mistPurple: "rgba(178,120,255,0.16)",
};

const tarotCardsByType = {
  healing: ["STAR", "TEMPERANCE", "SUN"],
  reflection: ["MOON", "HERMIT", "STAR"],
  hope: ["SUN", "STAR", "TEMPERANCE"],
  adventure: ["SUN", "WHEEL", "MOON"],
  change: ["WHEEL", "MOON", "HERMIT"],
};

const tarotCards = {
  STAR: {
    name: "THE STAR",
    keyword: "癒し・希望",
    image: require("../assets/images/star_card.png"),
  },
  SUN: {
    name: "THE SUN",
    keyword: "前向き・喜び",
    image: require("../assets/images/sun_card.png"),
  },
  MOON: {
    name: "THE MOON",
    keyword: "不安・感情",
    image: require("../assets/images/moon_card.png"),
  },
  HERMIT: {
    name: "THE HERMIT",
    keyword: "内省・静けさ",
    image: require("../assets/images/hermit_card.png"),
  },
  WHEEL: {
    name: "WHEEL OF FORTUNE",
    keyword: "変化・運命",
    image: require("../assets/images/wheel_of_fortune_card.png"),
  },
  TEMPERANCE: {
    name: "TEMPERANCE",
    keyword: "調和・バランス",
    image: require("../assets/images/temperance_card.png"),
  },
};



type ResultType = "healing" | "reflection" | "hope" | "adventure" | "change";
type CardKey = keyof typeof tarotCards;

const STAR_DATA = [
  { top: 70, left: 35, size: 10, delay: 0 },
  { top: 120, left: 320, size: 13, delay: 400 },
  { top: 190, left: 60, size: 8, delay: 800 },
  { top: 260, left: 335, size: 10, delay: 1200 },
  { top: 350, left: 38, size: 14, delay: 1600 },
  { top: 470, left: 320, size: 9, delay: 2000 },
  { top: 585, left: 70, size: 12, delay: 2400 },
  { top: 675, left: 290, size: 10, delay: 2800 },
];

const DUST_DATA = [
  { top: 170, left: 90, delay: 0 },
  { top: 230, left: 270, delay: 400 },
  { top: 310, left: 55, delay: 800 },
  { top: 380, left: 330, delay: 1200 },
  { top: 470, left: 120, delay: 1600 },
  { top: 540, left: 260, delay: 2000 },
  { top: 635, left: 45, delay: 2400 },
  { top: 690, left: 315, delay: 2800 },
];

function TwinkleStar({ top, left, size, delay }: any) {
  const opacity = useRef(new Animated.Value(0.2)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1.8,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.18,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.Text
      style={[
        styles.starParticle,
        {
          top,
          left,
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

function DustParticle({ top, left, delay }: any) {
  const move = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(move, {
            toValue: 1,
            duration: 4200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.75,
            duration: 2100,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(move, {
            toValue: 0,
            duration: 4200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.18,
            duration: 2100,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  const translateY = move.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -22],
  });

  const translateX = move.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 12],
  });

  return (
    <Animated.View
      style={[
        styles.dust,
        {
          top,
          left,
          opacity,
          transform: [{ translateY }, { translateX }],
        },
      ]}
    />
  );
}

function FloatingCard({
  cardKey,
  index,
  resultType,
  selectedCard,
  setSelectedCard,
  main = false,
}: {
  cardKey: CardKey;
  index: number;
  resultType: string;
  selectedCard: string | null;
  setSelectedCard: (card: string) => void;
  main?: boolean;
}) {
  const card = tarotCards[cardKey];

  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const ringAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(index * 350),
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(ringAnim, {
        toValue: 1,
        duration: 18000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const isOtherSelected = selectedCard && selectedCard !== cardKey;
const handlePress = () => {
  if (selectedCard === cardKey) {
    router.push({
      pathname: "/result",
      params: {
        card: cardKey,
        type: resultType || "healing",
      },
    });
    return;
  }

  setSelectedCard(cardKey);

  Animated.sequence([
    Animated.timing(pressAnim, {
      toValue: 1.12,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }),
    Animated.timing(pressAnim, {
      toValue: 1.04,
      duration: 160,
      useNativeDriver: true,
    }),
  ]).start();
};
  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, main ? -14 : -10],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.38, 0.9],
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.18],
  });

  const ringRotate = ringAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const cardW = main ? 150 : 126;
  const cardH = main ? 240 : 202;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
      <Animated.View
        style={[
          styles.cardWrap,
          main && styles.mainCardWrap,
          {
            opacity: isOtherSelected ? 0.25 : 1,
            transform: [
              { translateY },
              { scale: pressAnim },
              { rotate: main ? "0deg" : index === 1 ? "-6deg" : "6deg" },
            ],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.cardOuterGlow,
            main && styles.mainOuterGlow,
            {
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.magicRing,
            main && styles.mainMagicRing,
            {
              transform: [{ rotate: ringRotate }],
            },
          ]}
        >
          <View style={styles.ringLine} />
          <View style={[styles.ringLine, { transform: [{ rotate: "90deg" }] }]} />
          <Text style={styles.ringStarTop}>✦</Text>
          <Text style={styles.ringStarBottom}>✧</Text>
        </Animated.View>

        <View style={styles.cardLightBase} />

        <View style={styles.cardFrame}>
          <Image
            source={card.image}
            style={{ width: cardW, height: cardH }}
            resizeMode="contain"
          />
        </View>

        <Text style={[styles.cardName, main && styles.mainCardName]}>
          {card.name}
        </Text>
        <Text style={styles.keyword}>{card.keyword}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function TarotScreen() {
  const { type } = useLocalSearchParams();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const resultType = Array.isArray(type) ? type[0] : type;

  const cards =
    resultType && tarotCardsByType[resultType as ResultType]
      ? tarotCardsByType[resultType as ResultType]
      : tarotCardsByType.healing;

      const centerStarAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.parallel([
        Animated.timing(centerStarAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(centerStarAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ])
  ).start();
}, []);


const centerStarScale = centerStarAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [1, 1.35],
});

const centerStarOpacity = centerStarAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [0.45, 1],
});

const centerStarRotate = centerStarAnim.interpolate({
  inputRange: [0, 1],
  outputRange: ["0deg", "18deg"],
});

  return (
    <ImageBackground
      source={require("../assets/images/tarot-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
     
   

        {STAR_DATA.map((star, i) => (
          <TwinkleStar key={`star-${i}`} {...star} />
        ))}

        {DUST_DATA.map((dust, i) => (
          <DustParticle key={`dust-${i}`} {...dust} />
        ))}

        <View style={styles.cornerTL} />
        <View style={styles.cornerTR} />
        <View style={styles.cornerBL} />
        <View style={styles.cornerBR} />

        <ScrollView contentContainerStyle={styles.container}>


          <Text style={styles.title}> 直感で惹かれる一枚を選ぶと、</Text>
          <Text style={styles.title}> 今のあなたに寄り添う物語へ進みます。</Text>

          <View style={styles.lineArea}>
            <View style={styles.moonLine} />
            <Animated.Text
  style={[
    styles.centerStar,
    {
      opacity: centerStarOpacity,
      transform: [
        { scale: centerStarScale },
        { rotate: centerStarRotate },
      ],
    },
  ]}
>
  ✦
</Animated.Text>
            <View style={styles.moonLine} />
          </View>

      
          <View style={styles.cardArea}>
            <FloatingCard
              cardKey={cards[0] as CardKey}
              index={0}
              resultType={resultType || "healing"}
              selectedCard={selectedCard}
              setSelectedCard={setSelectedCard}
              main
            />

            <View style={styles.bottomRow}>
              <FloatingCard
                cardKey={cards[1] as CardKey}
                index={1}
                resultType={resultType || "healing"}
                selectedCard={selectedCard}
                setSelectedCard={setSelectedCard}
              />

              <FloatingCard
                cardKey={cards[2] as CardKey}
                index={2}
                resultType={resultType || "healing"}
                selectedCard={selectedCard}
                setSelectedCard={setSelectedCard}
              />
            </View>
          </View>

          <Text style={styles.hint}>✦ {selectedCard ? "もう一度タップして決定" : "カードをタップして選択"} ✦</Text>
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
    backgroundColor: "rgba(5, 4, 18, 0.58)",
    overflow: "hidden",
  },


  container: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 72,
    alignItems: "center",
  },

  starParticle: {
    position: "absolute",
    color: COLORS.star,
    zIndex: 5,
  },

  dust: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 99,
    backgroundColor: "rgba(236,230,255,0.9)",
    zIndex: 4,
  },

  cornerTL: {
    position: "absolute",
    top: 18,
    left: 18,
    width: 52,
    height: 52,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: COLORS.border,
  },

  cornerTR: {
    position: "absolute",
    top: 18,
    right: 18,
    width: 52,
    height: 52,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.border,
  },

  cornerBL: {
    position: "absolute",
    bottom: 18,
    left: 18,
    width: 52,
    height: 52,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: COLORS.border,
  },

  cornerBR: {
    position: "absolute",
    bottom: 18,
    right: 18,
    width: 52,
    height: 52,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.border,
  },



  title: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
    lineHeight: 19,
    textShadowColor: "rgba(188,174,255,0.65)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 22,
  },

  lineArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 20,
    marginBottom: 18,
  },

  moonLine: {
    width: 82,
    height: 1,
    backgroundColor: COLORS.line,
  },

  centerStar: {
    color:  "rgba(255, 245, 171, 0.8)",
    fontSize: 25,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },

  description: {
    color: COLORS.text2,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 26,
  },

  cardArea: {
    width: "100%",
    alignItems: "center",
  },

  bottomRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  cardWrap: {
    width: 150,
    alignItems: "center",
    position: "relative",
  },

  mainCardWrap: {
    width: 180,
  },

  cardOuterGlow: {
    position: "absolute",
    top: 14,
    width: 150,
    height: 210,
    borderRadius: 40,
   backgroundColor: "rgba(105,155,255,0.18)",
  },

  mainOuterGlow: {
    top: 8,
    width: 185,
    height: 260,
backgroundColor: "rgba(105,155,255,0.18)",
  },

  magicRing: {
    position: "absolute",
    top: 80,
    width: 138,
    height: 64,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  mainMagicRing: {
    top: 96,
    width: 190,
    height: 86,
  },

  ringLine: {
    position: "absolute",
    width: 120,
    height: 1,
    backgroundColor: COLORS.line,
  },

  ringStarTop: {
    position: "absolute",
    top: -12,
    color: COLORS.star,
    fontSize: 13,
  },

  ringStarBottom: {
    position: "absolute",
    bottom: -12,
    color: COLORS.text3,
    fontSize: 12,
  },

  cardLightBase: {
    position: "absolute",
    bottom: 54,
    width: 150,
    height: 36,
    borderRadius: 999,
    backgroundColor: "rgba(170,145,255,0.16)",
  },

  cardFrame: {
    padding: 6,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.055)",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#BCAEFF",
    shadowOpacity: 0.75,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },

  cardName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
    letterSpacing: 1.4,
  },

  mainCardName: {
    fontSize: 16,
  },

  keyword: {
    color: COLORS.text2,
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },

  hint: {
    color: "rgb(255, 214, 163)",
    fontSize: 12,
    letterSpacing: 4,
    marginTop: 34,
  },
});