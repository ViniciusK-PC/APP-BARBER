import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface Stats {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalBarbers: number;
  totalServices: number;
  totalClients: number;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: string;
  client: { name: string };
  barber: { name: string };
  service: { name: string; price: number };
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Pendente',   color: '#F59E0B' },
  confirmed: { label: 'Confirmado', color: '#10B981' },
  completed: { label: 'Concluído',  color: '#6B7280' },
  cancelled: { label: 'Cancelado',  color: '#EF4444' },
};

export default function AdminDashboardScreen({ navigation }: any) {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [statsRes, appointmentsRes] = await Promise.all([
        api.get('/appointments/admin/stats'),
        api.get('/appointments/admin/all?limit=5'),
      ]);
      setStats(statsRes.data);
      setRecentAppointments(appointmentsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.greeting}>Bem-vindo, {user?.name?.split(' ')[0]} 👑</Text>
          <Text style={styles.headerTitle}>Painel Admin</Text>
        </View>
        <View style={styles.crownBadge}>
          <Text style={styles.crownText}>ADMIN</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* STATS GRID */}
        <Text style={styles.sectionTitle}>📊 Resumo Geral</Text>
        <View style={styles.statsGrid}>
          <StatCard label="Total" value={stats?.totalAppointments ?? 0} icon="📋" color="#C9A84C" />
          <StatCard label="Pendentes" value={stats?.pendingAppointments ?? 0} icon="⏳" color="#F59E0B" />
          <StatCard label="Confirmados" value={stats?.confirmedAppointments ?? 0} icon="✅" color="#10B981" />
          <StatCard label="Concluídos" value={stats?.completedAppointments ?? 0} icon="🏁" color="#6B7280" />
          <StatCard label="Cancelados" value={stats?.cancelledAppointments ?? 0} icon="❌" color="#EF4444" />
          <StatCard label="Barbeiros" value={stats?.totalBarbers ?? 0} icon="💈" color="#8B5CF6" />
        </View>

        {/* MENU RÁPIDO */}
        <Text style={styles.sectionTitle}>⚡ Gerenciar</Text>
        <View style={styles.menuGrid}>
          <MenuCard
            icon="📅"
            label="Agendamentos"
            desc="Ver e gerenciar todos"
            onPress={() => navigation.navigate('AdminAppointments')}
          />
          <MenuCard
            icon="💈"
            label="Barbeiros"
            desc="Cadastrar e editar"
            onPress={() => navigation.navigate('AdminBarbers')}
          />
          <MenuCard
            icon="✂️"
            label="Serviços"
            desc="Preços e duração"
            onPress={() => navigation.navigate('AdminServices')}
          />
          <MenuCard
            icon="🏪"
            label="Barbearia"
            desc="Dados e horários"
            onPress={() => navigation.navigate('AdminBarbershop')}
          />
        </View>

        {/* AGENDAMENTOS RECENTES */}
        <Text style={styles.sectionTitle}>🕐 Agendamentos Recentes</Text>
        {recentAppointments.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum agendamento ainda</Text>
        ) : (
          recentAppointments.map((item) => {
            const status = STATUS_MAP[item.status] || { label: item.status, color: '#999' };
            return (
              <View key={item.id} style={styles.appointmentCard}>
                <View style={[styles.statusBar, { backgroundColor: status.color }]} />
                <View style={styles.appointmentBody}>
                  <View style={styles.appointmentTop}>
                    <Text style={styles.appointmentClient}>{item.client?.name}</Text>
                    <View style={[styles.badge, { borderColor: status.color }]}>
                      <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
                    </View>
                  </View>
                  <Text style={styles.appointmentInfo}>✂️ {item.service?.name} · 💈 {item.barber?.name}</Text>
                  <Text style={styles.appointmentDate}>
                    📅 {new Date(item.date).toLocaleDateString('pt-BR')} às {item.time?.slice(0, 5)}
                  </Text>
                </View>
              </View>
            );
          })
        )}

        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={() => navigation.navigate('AdminAppointments')}
        >
          <Text style={styles.viewAllText}>Ver todos os agendamentos →</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value, icon, color }: any) {
  return (
    <View style={[styles.statCard, { borderColor: color + '44' }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MenuCard({ icon, label, desc, onPress }: any) {
  return (
    <TouchableOpacity style={styles.menuCard} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={styles.menuLabel}>{label}</Text>
      <Text style={styles.menuDesc}>{desc}</Text>
    </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  greeting: { fontSize: 13, color: '#888', marginBottom: 4 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  crownBadge: {
    backgroundColor: '#C9A84C22',
    borderWidth: 1,
    borderColor: '#C9A84C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  crownText: { color: '#C9A84C', fontSize: 11, fontWeight: 'bold', letterSpacing: 2 },
  scroll: { padding: 20 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#C9A84C', marginBottom: 14, marginTop: 8, letterSpacing: 1 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  statCard: {
    backgroundColor: '#16213e',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    width: '30%',
    flex: 1,
    minWidth: '28%',
    borderWidth: 1,
  },
  statIcon: { fontSize: 22, marginBottom: 6 },
  statValue: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2, textAlign: 'center' },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  menuCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 18,
    width: '47%',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  menuIcon: { fontSize: 28, marginBottom: 10 },
  menuLabel: { fontSize: 15, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  menuDesc: { fontSize: 12, color: '#666' },
  appointmentCard: {
    backgroundColor: '#16213e',
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  statusBar: { width: 4 },
  appointmentBody: { flex: 1, padding: 14 },
  appointmentTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  appointmentClient: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  appointmentInfo: { fontSize: 13, color: '#888', marginBottom: 4 },
  appointmentDate: { fontSize: 12, color: '#666' },
  viewAllBtn: {
    borderWidth: 1,
    borderColor: '#C9A84C',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  viewAllText: { color: '#C9A84C', fontWeight: '600', fontSize: 14 },
  emptyText: { color: '#555', textAlign: 'center', marginVertical: 20 },
});
