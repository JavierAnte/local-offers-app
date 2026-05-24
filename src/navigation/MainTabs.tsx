import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FeedStack from './FeedStack';
import CreateOfferScreen from '../screens/create-offer/CreateOfferScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import type { MainTabParamList } from '../types';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator<MainTabParamList>();

function CenterTabButton({ onPress, children }: BottomTabBarButtonProps) {
  return (
    <TouchableOpacity onPress={onPress ?? undefined} style={styles.centerButton} activeOpacity={0.85}>
      <View style={styles.centerButtonInner}>{children}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  centerButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          borderTopColor: colors.border,
          height: 60 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
        },
      }}
    >
      <Tab.Screen
        name="FeedTab"
        component={FeedStack}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CreateOffer"
        component={CreateOfferScreen}
        options={{
          tabBarLabel: 'Publicar',
          tabBarIcon: () => <Ionicons name="add" size={28} color={colors.white} />,
          tabBarButton: (props) => <CenterTabButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
