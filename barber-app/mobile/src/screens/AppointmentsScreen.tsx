import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import api from '../services/api';

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: string;
  barber: { name: string };
  service: { name: string; price: number };
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Pendente',   color: '#F59E0B' },
  confirmed: { label: 'Confirmado', color: '#10B981' },
  completed: { label: 'Concluído',  color: '#6B7280' },
  cancelled: { label: 'Cancelado',  color: '#EF4444' },
};

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadAppointments(); }, []);

  async function loadAppointments() {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function handleCancel(id: string) {
    Alert.alert('Cancelar', 'Deseja cancelar este agendamento?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim, cancelar',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.put(`/appointments/${id}/status`, { status: 'cancelled' });
            loadAppointments();
          } catch {
            Alert.alert('Erro', 'Não foi possível cancelar');
          }
        },
      },
    ]);
  }

  function renderItem({ item }: { item: Appointment }) {
    const status = STATUS_MAP[item.status] || { label: item.status, color: '#999' };
    const dateFormatted = new Date(item.date).toLocaleDateString('pt-BR', {
      weekday: 'short', day: '2-digit', month: 'short',
    });

    return (
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <View style={[styles.statusBar, { backgroundColor: status.color }]} />
        </View>
        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            <Text style={styles.cardService}>{item.service.name}</Text>
            <View style={[styles.badge, { backgroundColor: status.color + '22', borderColor: status.color }]}>
              <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
            </View>
          </View>
          <Text style={styles.cardBarber}>💈 {item.barber.name}</Text>
          <View style={styles.cardBottom}>
            <Text style={styles.cardDate}>📅 {dateFormatted} às {item.time?.slice(0, 5)}</Text>
            <Text style={styles.cardPrice}>R$ {item.service.price}</Text>
          </View>
          {item.status === 'pending' && (
            <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(item.id)}>
              <Text style={styles.cancelBtnText}>Cancelar agendamento</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
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
        <Text style={styles.headerTitle}>Meus Agendamentos</Text>
        <Text style={styles.headerSub}>{appointments.length} agendamento(s)</Text>
      </View>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={() => { setRefreshing(true); loadAppointments(); }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>Nenhum agendamento ainda</Text>
            <Text style={styles.emptyHint}>Vá em Início e agende um horário</Text>
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
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 13, color: '#888', marginTop: 4 },
  list: { padding: 16, paddingTop: 20 },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    marginBottom: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  cardLeft: { width: 5 },
  statusBar: { flex: 1 },
  cardBody: { flex: 1, padding: 16 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardService: { fontSize: 16, fontWeight: 'bold', color: '#fff', flex: 1 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    marginLeft: 8,
  },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  cardBarber: { fontSize: 13, color: '#888', marginBottom: 10 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardDate: { fontSize: 13, color: '#aaa' },
  cardPrice: { fontSize: 18, fontWeight: 'bold', color: '#C9A84C' },
  cancelBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelBtnText: { color: '#EF4444', fontSize: 13, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 50, marginBottom: 16 },
  emptyText: { fontSize: 18, color: '#fff', fontWeight: 'bold', marginBottom: 8 },
  emptyHint: { fontSize: 14, color: '#555' },
});
