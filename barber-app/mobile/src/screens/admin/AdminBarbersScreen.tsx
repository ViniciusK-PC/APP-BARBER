import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  TouchableOpacity, Alert, TextInput, Modal, StatusBar, ScrollView,
} from 'react-native';
import api from '../../services/api';

interface Barber {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
}

export default function AdminBarbersScreen({ navigation }: any) {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Barber | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadBarbers(); }, []);

  async function loadBarbers() {
    try {
      const res = await api.get('/barbers');
      setBarbers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setName(''); setEmail(''); setPhone('');
    setModalVisible(true);
  }

  function openEdit(barber: Barber) {
    setEditing(barber);
    setName(barber.name); setEmail(barber.email); setPhone(barber.phone);
    setModalVisible(true);
  }

  async function handleSave() {
    if (!name.trim()) { Alert.alert('Atenção', 'Nome é obrigatório'); return; }
    try {
      setSaving(true);
      if (editing) {
        await api.put(`/barbers/${editing.id}`, { name, email, phone });
      } else {
        const res = await api.get('/barbershops');
        const barbershopId = res.data[0]?.id;
        await api.post('/barbers', { name, email, phone, barbershopId });
      }
      setModalVisible(false);
      loadBarbers();
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.error || 'Não foi possível salvar');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(barber: Barber) {
    try {
      await api.put(`/barbers/${barber.id}`, { isActive: !barber.isActive });
      loadBarbers();
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar');
    }
  }

  function renderItem({ item }: { item: Barber }) {
    return (
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.name}</Text>
          {item.email ? <Text style={styles.cardSub}>✉️ {item.email}</Text> : null}
          {item.phone ? <Text style={styles.cardSub}>📞 {item.phone}</Text> : null}
          <View style={[styles.activeBadge, { borderColor: item.isActive ? '#10B981' : '#EF4444' }]}>
            <Text style={[styles.activeText, { color: item.isActive ? '#10B981' : '#EF4444' }]}>
              {item.isActive ? '● Ativo' : '● Inativo'}
            </Text>
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)}>
            <Text style={styles.editBtnText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, { borderColor: item.isActive ? '#EF4444' : '#10B981' }]}
            onPress={() => handleToggleActive(item)}
          >
            <Text style={{ color: item.isActive ? '#EF4444' : '#10B981', fontSize: 11, fontWeight: 'bold' }}>
              {item.isActive ? 'Desativar' : 'Ativar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#C9A84C" /></View>;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Barbeiros</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openCreate}>
          <Text style={styles.addBtnText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={barbers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onRefresh={loadBarbers}
        refreshing={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💈</Text>
            <Text style={styles.emptyText}>Nenhum barbeiro cadastrado</Text>
          </View>
        }
      />

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editing ? 'Editar Barbeiro' : 'Novo Barbeiro'}</Text>

            <Text style={styles.inputLabel}>NOME *</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nome do barbeiro" placeholderTextColor="#555" />

            <Text style={styles.inputLabel}>EMAIL</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="email@exemplo.com" placeholderTextColor="#555" keyboardType="email-address" autoCapitalize="none" />

            <Text style={styles.inputLabel}>TELEFONE</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="(00) 00000-0000" placeholderTextColor="#555" keyboardType="phone-pad" />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelModalBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelModalText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
                <Text style={styles.saveBtnText}>{saving ? 'Salvando...' : 'Salvar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' },
  header: {
    backgroundColor: '#16213e', paddingTop: 60, paddingBottom: 16,
    paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: '#0f3460',
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0f3460', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  backBtnText: { color: '#C9A84C', fontSize: 20, fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', flex: 1 },
  addBtn: { backgroundColor: '#C9A84C', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  addBtnText: { color: '#1a1a2e', fontWeight: 'bold', fontSize: 13 },
  list: { padding: 16 },
  card: {
    backgroundColor: '#16213e', borderRadius: 14, padding: 16, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#0f3460',
  },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#C9A84C', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  avatarText: { fontSize: 22, fontWeight: 'bold', color: '#1a1a2e' },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 3 },
  cardSub: { fontSize: 12, color: '#888', marginBottom: 2 },
  activeBadge: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 4 },
  activeText: { fontSize: 11, fontWeight: 'bold' },
  cardActions: { alignItems: 'flex-end', gap: 8 },
  editBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#0f3460', justifyContent: 'center', alignItems: 'center' },
  editBtnText: { fontSize: 16 },
  toggleBtn: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { color: '#555', fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: '#000000aa', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#16213e', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, paddingBottom: 50 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 24 },
  inputLabel: { fontSize: 11, color: '#C9A84C', fontWeight: 'bold', letterSpacing: 2, marginBottom: 8 },
  input: { backgroundColor: '#0f3460', color: '#fff', padding: 14, borderRadius: 12, fontSize: 15, marginBottom: 16, borderWidth: 1, borderColor: '#1e4a7a' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelModalBtn: { flex: 1, borderWidth: 1, borderColor: '#555', borderRadius: 12, padding: 14, alignItems: 'center' },
  cancelModalText: { color: '#888', fontWeight: '600' },
  saveBtn: { flex: 1, backgroundColor: '#C9A84C', borderRadius: 12, padding: 14, alignItems: 'center' },
  saveBtnText: { color: '#1a1a2e', fontWeight: 'bold', fontSize: 15 },
});
