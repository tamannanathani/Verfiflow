import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverMessage, setServerMessage] = useState(null);

  const handleRegister = async () => {
    setError(null);
    if (!email || !password) {
      setError('Email and password are required');
      Alert.alert('Error', 'Email and password are required');
      return;
    }

    setLoading(true);
    try {
      const payload = { name, email, password, phone };
      const resp = await authService.register(payload);

      // resp expected shape: { user, token }
      const { token, user } = resp;
      setServerMessage('Registration successful');
      if (!token) throw new Error('No token returned from server');

      // Save token and consider the user logged in
      await AsyncStorage.setItem('token', token);

      Alert.alert('Registered', `Welcome ${user?.name ?? user?.email ?? ''}`);

      // Navigate back to Login or to a protected screen (here we go back to Login)
      navigation.navigate('Login');
      return user;
    } catch (err) {
      // show server messages in UI as well
      const respMsg = err?.response?.data?.message;
      if (respMsg) setServerMessage(respMsg);
      console.error('Register error', err?.response?.data ?? err.message ?? err);
      const msg = err?.response?.data?.message ?? err.message ?? 'Registration failed';
      setError(msg);
      Alert.alert('Registration failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>

      <TextInput
        style={styles.input}
        placeholder="Full name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Phone (optional)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {serverMessage ? <Text style={styles.serverMessage}>{serverMessage}</Text> : null}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Register'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    color: '#0f172a',
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 7,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 7,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  link: {
    textAlign: 'center',
    marginTop: 14,
    color: '#0f172a',
    fontSize: 15,
  },
  serverMessage: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#064e3b',
    fontSize: 14,
  },
});

export default RegisterScreen;
