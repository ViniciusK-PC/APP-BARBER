import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';

// Cliente
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import BarbershopDetailScreen from '../screens/BarbershopDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Admin
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminAppointmentsScreen from '../screens/admin/AdminAppointmentsScreen';
import AdminBarbersScreen from '../screens/admin/AdminBarbersScreen';
import AdminServicesScreen from '../screens/admin/AdminServicesScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_BAR_STYLE = {
  backgroundColor: '#16213e',
  borderTopColor: '#0f3460',
  borderTopWidth: 1,
  height: 65,
  paddingBottom: 10,
  paddingTop: 8,
};

const TAB_LABEL_STYLE = { fontSize: 11, fontWeight: '600' as const };

// ─── TAB CLIENTE ────────────────────────────────────────────────
function ClientTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#C9A84C',
        tabBarInactiveTintColor: '#555',
        tabBarStyle: TAB_BAR_STYLE,
        tabBarLabelStyle: TAB_LABEL_STYLE,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Início', tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text> }}
      />
      <Tab.Screen
        name="Appointments"
        component={AppointmentsScreen}
        options={{ tabBarLabel: 'Agendamentos', tabBarIcon: () => <Text style={{ fontSize: 20 }}>📅</Text> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Perfil', tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text> }}
      />
    </Tab.Navigator>
  );
}

// ─── TAB ADMIN ──────────────────────────────────────────────────
function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#C9A84C',
        tabBarInactiveTintColor: '#555',
        tabBarStyle: TAB_BAR_STYLE,
        tabBarLabelStyle: TAB_LABEL_STYLE,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboardScreen}
        options={{ tabBarLabel: 'Dashboard', tabBarIcon: () => <Text style={{ fontSize: 20 }}>📊</Text> }}
      />
      <Tab.Screen
        name="AdminAppointments"
        component={AdminAppointmentsScreen}
        options={{ tabBarLabel: 'Agendamentos', tabBarIcon: () => <Text style={{ fontSize: 20 }}>📅</Text> }}
      />
      <Tab.Screen
        name="AdminBarbers"
        component={AdminBarbersScreen}
        options={{ tabBarLabel: 'Barbeiros', tabBarIcon: () => <Text style={{ fontSize: 20 }}>💈</Text> }}
      />
      <Tab.Screen
        name="AdminServices"
        component={AdminServicesScreen}
        options={{ tabBarLabel: 'Serviços', tabBarIcon: () => <Text style={{ fontSize: 20 }}>✂️</Text> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Perfil', tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text> }}
      />
    </Tab.Navigator>
  );
}

// ─── ROTAS PRINCIPAIS ───────────────────────────────────────────
export default function Routes() {
  const { user, loading } = useAuth();

  if (loading) return null;

  const isAdmin = user?.role === 'admin';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : isAdmin ? (
        <>
          <Stack.Screen name="AppTabs" component={AdminTabs} />
        </>
      ) : (
        <>
          <Stack.Screen name="AppTabs" component={ClientTabs} />
          <Stack.Screen name="BarbershopDetail" component={BarbershopDetailScreen} />
          <Stack.Screen name="Booking" component={BookingScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
