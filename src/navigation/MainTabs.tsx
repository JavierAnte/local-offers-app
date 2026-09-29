import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FeedStack from './FeedStack';
import CreateOfferScreen from '../screens/create-offer/CreateOfferScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { useAuthStore } from '../store/authStore';
import type { MainTabParamList } from '../types';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator<MainTabParamList>();

function CenterTabButton({ onPress, onLongPress, accessibilityState }: BottomTabBarButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress ?? undefined}
      onLongPress={onLongPress ?? undefined}
      style={styles.centerButton}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel="Publicar oferta"
      accessibilityState={accessibilityState}
    >
      <View style={styles.publishPill}>
        <Text style={styles.publishPlus}>+</Text>
        <Text style={styles.publishLabel}>Publicar</Text>
      </View>
    </TouchableOpacity>
  );
}

// Doubles as the login-state indicator: signed-in users see their initial in
// a filled circle instead of the generic outline icon, tinted by the tab's
// active/inactive color like the other tab icons.
function ProfileTabIcon({ color, size }: { color: string; size: number }) {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated && user) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: colors.white, fontSize: size * 0.55, fontWeight: '700' }}>
          {user.name[0]?.toUpperCase()}
        </Text>
      </View>
    );
  }

  return <Ionicons name="person-outline" size={size} color={color} />;
}

const styles = StyleSheet.create({
  centerButton: {
    top: -16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  publishPill: {
    width: 112,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 9,
    elevation: 8,
  },
  publishPlus: {
    color: colors.white,
    fontSize: 27,
    lineHeight: 28,
    fontWeight: '700',
    marginTop: -2,
  },
  publishLabel: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
  },
});

export default function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
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
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('FeedTab', {
              screen: 'Feed',
              params: { resetFiltersKey: Date.now() },
            });
          },
        })}
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
          tabBarButton: (props) => <CenterTabButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => <ProfileTabIcon color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
