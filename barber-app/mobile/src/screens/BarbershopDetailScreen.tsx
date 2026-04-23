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
import api from '../services/api';

interface Barber {
  id: string;
  name: string;
  phone: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export default function BarbershopDetailScreen({ route, navigation }: any) {
  const { barbershop } = route.params;
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [b, s] = await Promise.all([
        api.get(`/barbers?barbershopId=${barbershop.id}`),
        api.get(`/services?barbershopId=${barbershop.id}`),
      ]);
      setBarbers(b.data);
      setServices(s.data);
      if (s.data.length > 0) setSelectedService(s.data[0]);
    } catch (error) {
      console.error(error);
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{barbershop.name}</Text>
          <Text style={styles.headerSub}>📍 {barbershop.address}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* SERVIÇOS */}
        <Text style={styles.sectionTitle}>✂️ Serviços</Text>
        {services.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={[styles.serviceCard, selectedService?.id === service.id && styles.serviceCardSelected]}
            onPress={() => setSelectedService(service)}
            activeOpacity={0.8}
          >
            <View style={styles.serviceLeft}>
              <Text style={[styles.serviceName, selectedService?.id === service.id && styles.serviceNameSelected]}>
                {service.name}
              </Text>
              <Text style={styles.serviceDesc}>{service.description}</Text>
              <Text style={styles.serviceDuration}>⏱ {service.duration} min</Text>
            </View>
            <View style={styles.serviceRight}>
              <Text style={[styles.servicePrice, selectedService?.id === service.id && styles.servicePriceSelected]}>
                R$ {service.price}
              </Text>
              {selectedService?.id === service.id && (
                <View style={styles.selectedDot} />
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* BARBEIROS */}
        <Text style={styles.sectionTitle}>💈 Escolha o Barbeiro</Text>
        {barbers.map((barber) => (
          <View key={barber.id} style={styles.barberCard}>
            <View style={styles.barberAvatar}>
              <Text style={styles.barberAvatarText}>{barber.name.charAt(0)}</Text>
            </View>
            <View style={styles.barberInfo}>
              <Text style={styles.barberName}>{barber.name}</Text>
              {barber.phone ? <Text style={styles.barberPhone}>📞 {barber.phone}</Text> : null}
            </View>
            <TouchableOpacity
              style={[styles.bookBtn, !selectedService && styles.bookBtnDisabled]}
              onPress={() => {
                if (!selectedService) return;
                navigation.navigate('Booking', { barbershop, barber, service: selectedService });
              }}
              disabled={!selectedService}
            >
              <Text style={styles.bookBtnText}>Agendar</Text>
            </TouchableOpacity>
          </View>
        ))}

        {!selectedService && (
          <Text style={styles.hint}>Selecione um serviço para agendar</Text>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 12, color: '#888', marginTop: 3 },
  scroll: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#C9A84C', marginTop: 10, marginBottom: 14, letterSpacing: 1 },
  serviceCard: {
    backgroundColor: '#16213e',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  serviceCardSelected: {
    borderColor: '#C9A84C',
    backgroundColor: '#1e3a5f',
  },
  serviceLeft: { flex: 1 },
  serviceName: { fontSize: 16, fontWeight: 'bold', color: '#ccc' },
  serviceNameSelected: { color: '#fff' },
  serviceDesc: { fontSize: 13, color: '#666', marginTop: 3 },
  serviceDuration: { fontSize: 12, color: '#888', marginTop: 5 },
  serviceRight: { alignItems: 'flex-end' },
  servicePrice: { fontSize: 20, fontWeight: 'bold', color: '#888' },
  servicePriceSelected: { color: '#C9A84C' },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C9A84C',
    marginTop: 6,
  },
  barberCard: {
    backgroundColor: '#16213e',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  barberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#C9A84C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  barberAvatarText: { fontSize: 20, fontWeight: 'bold', color: '#1a1a2e' },
  barberInfo: { flex: 1 },
  barberName: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  barberPhone: { fontSize: 13, color: '#888', marginTop: 3 },
  bookBtn: {
    backgroundColor: '#C9A84C',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#C9A84C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  bookBtnDisabled: { backgroundColor: '#333', shadowOpacity: 0 },
  bookBtnText: { color: '#1a1a2e', fontWeight: 'bold', fontSize: 13 },
  hint: { textAlign: 'center', color: '#555', fontSize: 13, marginTop: 10 },
});
