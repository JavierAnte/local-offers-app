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

function CenterTabButton({ onPress, children }: BottomTabBarButtonProps) {
  return (
    <TouchableOpacity onPress={onPress ?? undefined} style={styles.centerButton} activeOpacity={0.82}>
      <View style={styles.centerButtonRing}>
        <View style={styles.centerButtonInner}>{children}</View>
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
    top: -22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButtonRing: {
    borderRadius: 34,
    padding: 3,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 10,
  },
  centerButtonInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
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
          tabBarIcon: () => <Ionicons name="add" size={32} color={colors.white} />,
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
