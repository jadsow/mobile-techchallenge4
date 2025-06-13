import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

type EditProfessorRouteProp = RouteProp<RootStackParamList, "EditProfessor">;

export default function EditProfessorScreen() {
  const navigation = useNavigation();
  const route = useRoute<EditProfessorRouteProp>();
  const { professorId } = route.params;

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchProfessor = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        const res = await fetch(
          `http://10.0.2.2:3010/professores/${professorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setNome(data.nome);
        setEmail(data.email);
      } catch (err) {
        Alert.alert("Erro ao buscar dados do professor.");
      }
    };

    fetchProfessor();
  }, [professorId]);

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSave = async () => {
    if (!isValidEmail(email)) {
      Alert.alert("Erro", "Por favor, insira um email válido.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("access_token");
      const res = await fetch(
        `http://10.0.2.2:3010/professores/${professorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nome, email }),
        }
      );

      if (!res.ok) throw new Error();

      Alert.alert("Sucesso", "Professor atualizado.");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Erro", "Não foi possível atualizar.");
    }
  };

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const res = await fetch(
        `http://10.0.2.2:3010/professores/${professorId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error();

      Alert.alert("Removido", "Professor deletado com sucesso.");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Erro", "Erro ao deletar professor.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

      <Button title="Salvar Alterações" onPress={handleSave} />
      <View style={{ marginVertical: 10 }} />
      <Button title="Excluir Professor" color="red" onPress={handleDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { marginBottom: 4, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 12,
    padding: 8,
  },
});
