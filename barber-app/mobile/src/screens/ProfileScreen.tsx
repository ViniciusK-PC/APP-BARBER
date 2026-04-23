import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  function handleLogout() {
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', onPress: signOut, style: 'destructive' },
    ]);
  }

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      {/* AVATAR */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {user?.role === 'admin' ? '👑 Administrador' : '👤 Cliente'}
          </Text>
        </View>
      </View>

      {/* INFO */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>✉️</Text>
          <View>
            <Text style={styles.infoLabel}>EMAIL</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>🔑</Text>
          <View>
            <Text style={styles.infoLabel}>TIPO DE CONTA</Text>
            <Text style={styles.infoValue}>
              {user?.role === 'admin' ? 'Administrador' : 'Cliente'}
            </Text>
          </View>
        </View>
      </View>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: {
    backgroundColor: '#16213e',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  avatarSection: { alignItems: 'center', paddingVertical: 36 },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#C9A84C',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#C9A84C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  avatarText: { fontSize: 34, fontWeight: 'bold', color: '#1a1a2e' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  roleBadge: {
    backgroundColor: '#C9A84C22',
    borderWidth: 1,
    borderColor: '#C9A84C',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 20,
  },
  roleText: { color: '#C9A84C', fontSize: 13, fontWeight: '600' },
  infoSection: {
    backgroundColor: '#16213e',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  infoIcon: { fontSize: 22, marginRight: 16 },
  infoLabel: { fontSize: 11, color: '#C9A84C', fontWeight: 'bold', letterSpacing: 1, marginBottom: 3 },
  infoValue: { fontSize: 15, color: '#fff' },
  divider: { height: 1, backgroundColor: '#0f3460', marginVertical: 8 },
  logoutBtn: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#EF444422',
    borderWidth: 1,
    borderColor: '#EF4444',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutText: { color: '#EF4444', fontSize: 15, fontWeight: 'bold' },
});
