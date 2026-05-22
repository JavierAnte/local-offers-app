import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import FeedScreen from '../screens/feed/FeedScreen';
import OfferDetailScreen from '../screens/offer/OfferDetailScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import type { FeedStackParamList } from '../types';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<FeedStackParamList>();

export default function FeedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitle: '',
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.text },
      }}
    >
      <Stack.Screen
        name="Feed"
        component={FeedScreen}
        options={({
          navigation,
        }: {
          navigation: NativeStackNavigationProp<FeedStackParamList, 'Feed'>;
        }) => ({
          title: 'Ofertas cercanas',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <Ionicons name="notifications-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="OfferDetail"
        component={OfferDetailScreen}
        options={{ title: 'Detalle' }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Notificaciones' }}
      />
    </Stack.Navigator>
  );
}
