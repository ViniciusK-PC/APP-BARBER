import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import api from '../services/api';

export default function BookingScreen({ route, navigation }: any) {
  const { barbershop, barber, service } = route.params;
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (selectedDate) loadAvailableSlots();
  }, [selectedDate]);

  async function loadAvailableSlots() {
    try {
      setLoading(true);
      setSelectedTime('');
      const response = await api.get('/appointments/available-slots', {
        params: { barberId: barber.id, date: selectedDate },
      });
      setAvailableSlots(response.data.availableSlots);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Atenção', 'Selecione uma data e horário');
      return;
    }
    try {
      setConfirming(true);
      await api.post('/appointments', {
        barberId: barber.id,
        serviceId: service.id,
        date: selectedDate,
        time: selectedTime,
      });
      Alert.alert('✅ Agendado!', 'Seu horário foi reservado com sucesso.', [
        { text: 'Ver agendamentos', onPress: () => navigation.navigate('AppTabs', { screen: 'Appointments' }) },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.error || 'Não foi possível agendar');
    } finally {
      setConfirming(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agendar Horário</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* RESUMO */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>RESUMO</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Barbearia</Text>
            <Text style={styles.summaryValue}>{barbershop.name}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Barbeiro</Text>
            <Text style={styles.summaryValue}>{barber.name}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Serviço</Text>
            <Text style={styles.summaryValue}>{service.name}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Valor</Text>
            <Text style={styles.summaryPrice}>R$ {service.price}</Text>
          </View>
        </View>

        {/* CALENDÁRIO */}
        <Text style={styles.sectionTitle}>📅 Selecione a data</Text>
        <View style={styles.calendarWrapper}>
          <Calendar
            onDayPress={(day: any) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: '#C9A84C' },
            }}
            minDate={format(new Date(), 'yyyy-MM-dd')}
            theme={{
              backgroundColor: '#16213e',
              calendarBackground: '#16213e',
              textSectionTitleColor: '#C9A84C',
              selectedDayBackgroundColor: '#C9A84C',
              selectedDayTextColor: '#1a1a2e',
              todayTextColor: '#C9A84C',
              dayTextColor: '#fff',
              textDisabledColor: '#444',
              arrowColor: '#C9A84C',
              monthTextColor: '#fff',
              indicatorColor: '#C9A84C',
            }}
          />
        </View>

        {/* HORÁRIOS */}
        {selectedDate && (
          <>
            <Text style={styles.sectionTitle}>⏰ Horários disponíveis</Text>
            {loading ? (
              <ActivityIndicator size="small" color="#C9A84C" style={{ marginVertical: 20 }} />
            ) : availableSlots.length === 0 ? (
              <Text style={styles.noSlots}>Nenhum horário disponível nesta data</Text>
            ) : (
              <View style={styles.slotsGrid}>
                {availableSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot}
                    style={[styles.slot, selectedTime === slot && styles.slotSelected]}
                    onPress={() => setSelectedTime(slot)}
                  >
                    <Text style={[styles.slotText, selectedTime === slot && styles.slotTextSelected]}>
                      {slot}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        {/* BOTÃO CONFIRMAR */}
        {selectedDate && selectedTime && (
          <TouchableOpacity
            style={[styles.confirmBtn, confirming && styles.confirmBtnDisabled]}
            onPress={handleConfirm}
            disabled={confirming}
          >
            <Text style={styles.confirmBtnText}>
              {confirming ? 'CONFIRMANDO...' : 'CONFIRMAR AGENDAMENTO'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: {
    backgroundColor: '#16213e',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0f3460',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  backBtnText: { color: '#C9A84C', fontSize: 20, fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  scroll: { padding: 20 },
  summaryCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#C9A84C',
  },
  summaryTitle: { fontSize: 11, color: '#C9A84C', fontWeight: 'bold', letterSpacing: 2, marginBottom: 14 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  summaryLabel: { fontSize: 14, color: '#888' },
  summaryValue: { fontSize: 14, color: '#fff', fontWeight: '600' },
  summaryPrice: { fontSize: 18, color: '#C9A84C', fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#0f3460' },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#C9A84C', marginBottom: 14, letterSpacing: 1 },
  calendarWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  noSlots: { color: '#555', textAlign: 'center', marginVertical: 20, fontSize: 14 },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  slot: {
    backgroundColor: '#16213e',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  slotSelected: { backgroundColor: '#C9A84C', borderColor: '#C9A84C' },
  slotText: { fontSize: 14, color: '#aaa' },
  slotTextSelected: { color: '#1a1a2e', fontWeight: 'bold' },
  confirmBtn: {
    backgroundColor: '#C9A84C',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#C9A84C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  confirmBtnDisabled: { opacity: 0.6 },
  confirmBtnText: { color: '#1a1a2e', fontSize: 15, fontWeight: 'bold', letterSpacing: 1 },
});
