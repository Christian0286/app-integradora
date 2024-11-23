
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import styles from '../styles/loginStyles'; // Importamos los estilos desde el archivo separado

interface Props {
  onLogin: () => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Aquí validas el login
    if (email === 'Christian@gmail.com' && password === 'Christian123') {
      onLogin(); // Si las credenciales son correctas, se llama la función onLogin
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.loginTitle}>Iniciar sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </Pressable>
    </View>
  );
};

export default Login;
