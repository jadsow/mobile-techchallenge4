import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { jwtDecode } from "jwt-decode";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreateAluno"
>;

export default function CreateAlunoScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [token, setToken] = useState<string | null>(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("access_token");
      if (!storedToken) {
        navigation.replace("Login");
        return;
      }

      const decoded: any = jwtDecode(storedToken);
      if (decoded.role !== "professor") {
        Alert.alert("Acesso negado", "Apenas professores podem criar alunos.");
        navigation.goBack();
        return;
      }

      setToken(storedToken);
    };

    fetchToken();
  }, []);

  const handleSubmit = async () => {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch("http://10.0.2.2:3010/alunos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar aluno.");
      }

      Alert.alert("Sucesso", "Aluno criado com sucesso!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar o aluno.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Aluno</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <Button title="Cadastrar" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
});
