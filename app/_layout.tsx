import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="diagnosis" />
      <Stack.Screen name="tarot" />
      <Stack.Screen name="result" />
      <Stack.Screen name="book-result" />
    </Stack>
  );
}