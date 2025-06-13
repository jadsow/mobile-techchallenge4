import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "CreateProfessor">;

export default function CreateProfessorScreen({ navigation }: Props) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async () => {
    if (!nome || !email || !senha) {
      Alert.alert("Preencha todos os campos");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("access_token");

      const res = await fetch("http://10.0.2.2:3010/professores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
          role: "professor",
        }),
      });

      if (!res.ok) {
        throw new Error("Erro ao cadastrar professor");
      }

      Alert.alert("Sucesso", "Professor cadastrado com sucesso!");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Não foi possível cadastrar o professor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Professor</Text>

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
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <Button title="Cadastrar" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
});
