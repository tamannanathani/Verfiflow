import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const resp = await authService.login(email, password);
      // resp expected shape: { user, token }
      const { token, user } = resp;
      if (!token) throw new Error('No token returned from server');

      // save jwt for later authenticated requests
      await AsyncStorage.setItem('token', token);

      // Keep this simple — return/log user or navigate on success
      console.log('Login success:', user);
      Alert.alert('Success', `Welcome ${user?.name ?? user?.email ?? ''}`);
      return user;
    } catch (err) {
      console.error('Login error', err?.response?.data ?? err.message ?? err);
      const msg = err?.response?.data?.message ?? err.message ?? 'Login failed';
      setError(msg);
      Alert.alert('Login failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blue Carbon Registry</Text>
      <Text style={styles.subtitle}>Field Data Collection</Text>

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
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Dont have an account? Register</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1e40af',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 25,
    color: '#64748b',
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
    backgroundColor: '#1e40af',
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
    color: '#1e40af',
    fontSize: 15,
  },
});

export default LoginScreen;