import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  TouchableOpacity, Alert, TextInput, Modal, StatusBar,
} from 'react-native';
import api from '../../services/api';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
}

export default function AdminServicesScreen({ navigation }: any) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadServices(); }, []);

  async function loadServices() {
    try {
      const res = await api.get('/services');
      setServices(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setName(''); setDescription(''); setPrice(''); setDuration('');
    setModalVisible(true);
  }

  function openEdit(service: Service) {
    setEditing(service);
    setName(service.name);
    setDescription(service.description);
    setPrice(String(service.price));
    setDuration(String(service.duration));
    setModalVisible(true);
  }

  async function handleSave() {
    if (!name.trim() || !price || !duration) {
      Alert.alert('Atenção', 'Preencha nome, preço e duração');
      return;
    }
    try {
      setSaving(true);
      const data = {
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
      };
      if (editing) {
        await api.put(`/services/${editing.id}`, data);
      } else {
        const res = await api.get('/barbershops');
        const barbershopId = res.data[0]?.id;
        await api.post('/services', { ...data, barbershopId });
      }
      setModalVisible(false);
      loadServices();
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.error || 'Não foi possível salvar');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(service: Service) {
    try {
      await api.put(`/services/${service.id}`, { isActive: !service.isActive });
      loadServices();
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar');
    }
  }

  function renderItem({ item }: { item: Service }) {
    return (
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <View style={[styles.activeBar, { backgroundColor: item.isActive ? '#10B981' : '#EF4444' }]} />
        </View>
        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardPrice}>R$ {item.price}</Text>
          </View>
          {item.description ? <Text style={styles.cardDesc}>{item.description}</Text> : null}
          <Text style={styles.cardDuration}>⏱ {item.duration} minutos</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)}>
            <Text style={styles.editBtnText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, { borderColor: item.isActive ? '#EF4444' : '#10B981' }]}
            onPress={() => handleToggle(item)}
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
        <Text style={styles.headerTitle}>Serviços</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openCreate}>
          <Text style={styles.addBtnText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onRefresh={loadServices}
        refreshing={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>✂️</Text>
            <Text style={styles.emptyText}>Nenhum serviço cadastrado</Text>
          </View>
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editing ? 'Editar Serviço' : 'Novo Serviço'}</Text>

            <Text style={styles.inputLabel}>NOME *</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ex: Corte + Barba" placeholderTextColor="#555" />

            <Text style={styles.inputLabel}>DESCRIÇÃO</Text>
            <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Descrição do serviço" placeholderTextColor="#555" />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.inputLabel}>PREÇO (R$) *</Text>
                <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="0.00" placeholderTextColor="#555" keyboardType="decimal-pad" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>DURAÇÃO (min) *</Text>
                <TextInput style={styles.input} value={duration} onChangeText={setDuration} placeholder="30" placeholderTextColor="#555" keyboardType="number-pad" />
              </View>
            </View>

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
    backgroundColor: '#16213e', borderRadius: 14, marginBottom: 12,
    flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: '#0f3460',
  },
  cardLeft: { width: 4 },
  activeBar: { flex: 1 },
  cardBody: { flex: 1, padding: 14 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardName: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  cardPrice: { fontSize: 18, fontWeight: 'bold', color: '#C9A84C' },
  cardDesc: { fontSize: 13, color: '#888', marginBottom: 4 },
  cardDuration: { fontSize: 12, color: '#666' },
  cardActions: { padding: 12, justifyContent: 'center', alignItems: 'center', gap: 8 },
  editBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#0f3460', justifyContent: 'center', alignItems: 'center' },
  editBtnText: { fontSize: 16 },
  toggleBtn: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { color: '#555', fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: '#000000aa', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#16213e', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, paddingBottom: 50 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 24 },
  inputLabel: { fontSize: 11, color: '#C9A84C', fontWeight: 'bold', letterSpacing: 2, marginBottom: 8 },
  input: { backgroundColor: '#0f3460', color: '#fff', padding: 14, borderRadius: 12, fontSize: 15, marginBottom: 16, borderWidth: 1, borderColor: '#1e4a7a' },
  row: { flexDirection: 'row' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelModalBtn: { flex: 1, borderWidth: 1, borderColor: '#555', borderRadius: 12, padding: 14, alignItems: 'center' },
  cancelModalText: { color: '#888', fontWeight: '600' },
  saveBtn: { flex: 1, backgroundColor: '#C9A84C', borderRadius: 12, padding: 14, alignItems: 'center' },
  saveBtnText: { color: '#1a1a2e', fontWeight: 'bold', fontSize: 15 },
});
