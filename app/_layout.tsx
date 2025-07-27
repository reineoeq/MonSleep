// import { CoinProvider } from '@/app/CoinContext';
// import { auth } from '@/config/firebase';
// import { Redirect, Slot } from 'expo-router';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { ActivityIndicator, View } from 'react-native';

// export default function RootLayout() {
//   const [user, loading] = useAuthState(auth);

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   if (!user) {
//     return <Redirect href="/login" />;
//   }

//   return (
//     <CoinProvider>
//       <Slot />
//     </CoinProvider>
//   );
// }

import CoinProvider from '@/app/CoinContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import 'abort-controller/polyfill';
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
    <CoinProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </CoinProvider>
  );
}