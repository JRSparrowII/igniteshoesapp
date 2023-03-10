import { useTheme } from 'native-base';
import { useEffect, useState } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import OneSignal, { NotificationReceivedEvent, OSNotification }  from 'react-native-onesignal';
import { Notification } from '../components/Notification';
// import * as Linking from 'expo-linking'
import { AppRoutes } from './app.routes';

const linking = {
  prefixes: ['igniteshoesapp://', 'com.rocketseat.igniteshoes://', 'exp+igniteshoesapp://'], //Se consegue isso com schema list
  config:{
    screens:{
      details:{
        path:'details/:productId',
        parse:{
          productId: (productId:string) => productId
        }
      }
    }
  }
}

export function Routes() {
  const { colors } = useTheme();
  const [notification, setNotification] = useState<OSNotification>();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  // const deepLinking = Linking.createURL('details', {
  //   queryParams: {productId: '7'}
  // }) // MOSTRA O ID DO PRODUTO QUANDO O APP ESTA EM 2 PLANO

  useEffect(() => {
    const unsubscribe = OneSignal
    .setNotificationWillShowInForegroundHandler((notificationReceivedEvent: NotificationReceivedEvent) =>{
      const response = notificationReceivedEvent.getNotification();
      setNotification(response);
    })

    return () => unsubscribe;

  },[])

  return (
    <NavigationContainer theme={theme} linking={linking}>
      <AppRoutes />

      { 
        notification?.title && //Outra forma de FAZER UM IF (Se ele existir, entao exiba isso)
        <Notification
          data={notification}
          onClose={() => setNotification(undefined)}
        />
      }

    </NavigationContainer>
  );
}