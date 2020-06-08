import React from 'react';
import { StatusBar } from 'react-native';
import { AppLoading } from 'expo'; //mostra uma bolinha de carregamento do app

import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu';

import Routes from './src/routes';

export default function App() {
  // primeiro meu app vai carregar as fontes
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold
  });

  // se as fontes nao carregarem, ele vai retornar o AppLoading e somente quando as fontes carregarem o app abre
  if(!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <>
      <StatusBar barStyle='dark-content' backgroundColor='transparent' translucent />
      <Routes />
    </>
  );
}
