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
import api from '../../services/api';

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: string;
  client: { name: string; phone?: string };
  barber: { name: string };
  service: { name: string; price: number };
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Pendente',   color: '#F59E0B' },
  confirmed: { label: 'Confirmado', color: '#10B981' },
  completed: { label: 'Concluído',  color: '#6B7280' },
  cancelled: { label: 'Cancelado',  color: '#EF4444' },
};

const FILTERS = ['Todos', 'Pendente', 'Confirmado', 'Concluído', 'Cancelado'];
const FILTER_STATUS: Record<string, string> = {
  'Pendente': 'pending',
  'Confirmado': 'confirmed',
  'Concluído': 'completed',
  'Cancelado': 'cancelled',
};

export default function AdminAppointmentsScreen({ navigation }: any) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filtered, setFiltered] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Todos');

  useEffect(() => { loadAppointments(); }, []);

  useEffect(() => {
    if (activeFilter === 'Todos') {
      setFiltered(appointments);
    } else {
      setFiltered(appointments.filter(a => a.status === FILTER_STATUS[activeFilter]));
    }
  }, [activeFilter, appointments]);

  async function loadAppointments() {
    try {
      const res = await api.get('/appointments/admin/all');
      setAppointments(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      loadAppointments();
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o status');
    }
  }

  function showStatusOptions(item: Appointment) {
    const options = Object.entries(STATUS_MAP)
      .filter(([key]) => key !== item.status)
      .map(([key, val]) => ({
        text: val.label,
        onPress: () => updateStatus(item.id, key),
      }));

    Alert.alert('Alterar Status', `Agendamento de ${item.client?.name}`, [
      ...options,
      { text: 'Cancelar', style: 'cancel' as const },
    ]);
  }

  function renderItem({ item }: { item: Appointment }) {
    const status = STATUS_MAP[item.status] || { label: item.status, color: '#999' };
    return (
      <View style={styles.card}>
        <View style={[styles.statusBar, { backgroundColor: status.color }]} />
        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            <Text style={styles.clientName}>{item.client?.name}</Text>
            <TouchableOpacity
              style={[styles.badge, { borderColor: status.color }]}
              onPress={() => showStatusOptions(item)}
            >
              <Text style={[styles.badgeText, { color: status.color }]}>{status.label} ▾</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.infoText}>✂️ {item.service?.name} · R$ {item.service?.price}</Text>
          <Text style={styles.infoText}>💈 {item.barber?.name}</Text>
          <Text style={styles.dateText}>
            📅 {new Date(item.date).toLocaleDateString('pt-BR')} às {item.time?.slice(0, 5)}
          </Text>
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Agendamentos</Text>
          <Text style={styles.headerSub}>{filtered.length} resultado(s)</Text>
        </View>
      </View>

      {/* FILTROS */}
      <View style={styles.filtersWrapper}>
        <FlatList
          horizontal
          data={FILTERS}
          keyExtractor={(i) => i}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterBtn, activeFilter === item && styles.filterBtnActive]}
              onPress={() => setActiveFilter(item)}
            >
              <Text style={[styles.filterText, activeFilter === item && styles.filterTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshing={false}
        onRefresh={loadAppointments}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>Nenhum agendamento</Text>
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
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#0f3460',
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  backBtnText: { color: '#C9A84C', fontSize: 20, fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 12, color: '#888', marginTop: 2 },
  filtersWrapper: { backgroundColor: '#16213e', borderBottomWidth: 1, borderBottomColor: '#0f3460' },
  filters: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  filterBtn: {
    paddingHorizontal: 16, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1, borderColor: '#0f3460',
    backgroundColor: '#1a1a2e',
  },
  filterBtnActive: { backgroundColor: '#C9A84C', borderColor: '#C9A84C' },
  filterText: { color: '#888', fontSize: 13 },
  filterTextActive: { color: '#1a1a2e', fontWeight: 'bold' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  statusBar: { width: 4 },
  cardBody: { flex: 1, padding: 14 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  clientName: { fontSize: 16, fontWeight: 'bold', color: '#fff', flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, marginLeft: 8 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  infoText: { fontSize: 13, color: '#888', marginBottom: 3 },
  dateText: { fontSize: 12, color: '#666', marginTop: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { color: '#555', fontSize: 15 },
});
