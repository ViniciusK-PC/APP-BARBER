import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Barbershop {
  id: string;
  name: string;
  address: string;
  phone: string;
  openTime: string;
  closeTime: string;
}

export default function HomeScreen({ navigation }: any) {
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadBarbershops();
  }, []);

  async function loadBarbershops() {
    try {
      const response = await api.get('/barbershops');
      setBarbershops(response.data);
    } catch (error) {
      console.error('Erro ao carregar barbearias:', error);
    } finally {
      setLoading(false);
    }
  }

  function renderBarbershop({ item }: { item: Barbershop }) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('BarbershopDetail', { barbershop: item })}
        activeOpacity={0.85}
      >
        <View style={styles.cardAccent} />
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardAddress}>📍 {item.address}</Text>
          {item.phone ? <Text style={styles.cardPhone}>📞 {item.phone}</Text> : null}
          <View style={styles.cardFooter}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.openTime?.slice(0, 5)} - {item.closeTime?.slice(0, 5)}
              </Text>
            </View>
            <Text style={styles.cardArrow}>→</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C9A84C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={styles.headerTitle}>Escolha sua barbearia</Text>
        </View>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>

      <FlatList
        data={barbershops}
        keyExtractor={(item) => item.id}
        renderItem={renderBarbershop}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>✂️</Text>
            <Text style={styles.emptyText}>Nenhuma barbearia disponível</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' },
  header: {
    backgroundColor: '#16213e',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  greeting: { fontSize: 14, color: '#888', marginBottom: 4 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#C9A84C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: '#1a1a2e' },
  list: { padding: 16, paddingTop: 20 },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#0f3460',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardAccent: {
    width: 5,
    backgroundColor: '#C9A84C',
  },
  cardBody: { flex: 1, padding: 16 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  cardAddress: { fontSize: 13, color: '#888', marginBottom: 4 },
  cardPhone: { fontSize: 13, color: '#888', marginBottom: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  badge: {
    backgroundColor: '#0f3460',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C9A84C',
  },
  badgeText: { color: '#C9A84C', fontSize: 12, fontWeight: '600' },
  cardArrow: { color: '#C9A84C', fontSize: 20, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 50, marginBottom: 16 },
  emptyText: { fontSize: 16, color: '#555' },
});
