import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  async function handleRegister() {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres');
      return;
    }
    try {
      setLoading(true);
      await signUp(name, email, password, phone);
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Voltar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.titleArea}>
          <Text style={styles.title}>CRIAR CONTA</Text>
          <Text style={styles.subtitle}>Junte-se à nossa barbearia</Text>
        </View>

        <View style={styles.form}>
          {[
            { label: 'NOME COMPLETO', value: name, setter: setName, placeholder: 'Seu nome', secure: false, keyboard: 'default' },
            { label: 'EMAIL', value: email, setter: setEmail, placeholder: 'seu@email.com', secure: false, keyboard: 'email-address' },
            { label: 'TELEFONE (OPCIONAL)', value: phone, setter: setPhone, placeholder: '(00) 00000-0000', secure: false, keyboard: 'phone-pad' },
            { label: 'SENHA', value: password, setter: setPassword, placeholder: '••••••••', secure: true, keyboard: 'default' },
            { label: 'CONFIRMAR SENHA', value: confirmPassword, setter: setConfirmPassword, placeholder: '••••••••', secure: true, keyboard: 'default' },
          ].map((field) => (
            <View key={field.label} style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>{field.label}</Text>
              <TextInput
                style={styles.input}
                placeholder={field.placeholder}
                placeholderTextColor="#555"
                value={field.value}
                onChangeText={field.setter}
                secureTextEntry={field.secure}
                keyboardType={field.keyboard as any}
                autoCapitalize={field.keyboard === 'email-address' ? 'none' : 'words'}
              />
            </View>
          ))}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'CRIANDO...' : 'CADASTRAR'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>
              Já tem conta? <Text style={styles.linkTextBold}>Faça login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  scroll: { flexGrow: 1, paddingBottom: 40 },
  topBar: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 10 },
  backBtn: { color: '#C9A84C', fontSize: 16 },
  titleArea: { alignItems: 'center', paddingVertical: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#C9A84C', letterSpacing: 4 },
  subtitle: { fontSize: 13, color: '#888', marginTop: 6, letterSpacing: 1 },
  form: {
    backgroundColor: '#16213e',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 28,
  },
  inputWrapper: { marginBottom: 18 },
  inputLabel: { fontSize: 11, color: '#C9A84C', fontWeight: 'bold', letterSpacing: 2, marginBottom: 8 },
  input: {
    backgroundColor: '#0f3460',
    color: '#fff',
    padding: 16,
    borderRadius: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#1e4a7a',
  },
  button: {
    backgroundColor: '#C9A84C',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#C9A84C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#1a1a2e', fontSize: 15, fontWeight: 'bold', letterSpacing: 2 },
  linkButton: { marginTop: 24, alignItems: 'center' },
  linkText: { color: '#888', fontSize: 14 },
  linkTextBold: { color: '#C9A84C', fontWeight: 'bold' },
});
