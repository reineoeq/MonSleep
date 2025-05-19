import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    BryndanWrite: require ('../assets/fonts/Bryndan_Write.ttf')
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  const CustomText: any = Text;
  const CustomTextInput: any = TextInput;

  if (CustomText.defaultProps == null) CustomText.defaultProps = {};
  if (CustomTextInput.defaultProps == null) CustomTextInput.defaultProps = {};

  CustomText.defaultProps.style = { fontFamily: 'BryndanWrite' };
  CustomTextInput.defaultProps.style = { fontFamily: 'BryndanWrite' };


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
