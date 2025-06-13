import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { jwtDecode } from "jwt-decode";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "AlunosList"
>;

type Aluno = {
  _id: string;
  nome: string;
  email: string;
};

export default function AlunosListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [token, setToken] = useState<string | null>(null);

  // Função para buscar alunos
  const fetchAlunos = useCallback(async () => {
    const storedToken = await AsyncStorage.getItem("access_token");

    if (!storedToken) {
      navigation.replace("Login");
      return;
    }

    const decoded: any = jwtDecode(storedToken);
    if (decoded.role !== "professor") {
      Alert.alert("Acesso negado", "Apenas professores podem ver os alunos.");
      navigation.goBack();
      return;
    }

    setToken(storedToken);

    try {
      const response = await fetch("http://10.0.2.2:3010/alunos", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao buscar alunos");

      const data = await response.json();
      setAlunos(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os alunos.");
    }
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchAlunos();
    }, [fetchAlunos])
  );

  const handleDelete = async (id: string) => {
    Alert.alert("Confirmar", "Deseja realmente excluir este aluno?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            if (!token) {
              Alert.alert("Erro", "Token inválido");
              return;
            }
            const response = await fetch(`http://10.0.2.2:3010/alunos/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (!response.ok) throw new Error("Erro ao deletar aluno");

            setAlunos((prev) => prev.filter((a) => a._id !== id));
            Alert.alert("Sucesso", "Aluno excluído com sucesso.");
          } catch (error) {
            Alert.alert("Erro", "Falha ao excluir aluno.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Alunos</Text>
      <Button
        title="Cadastrar Novo Aluno"
        onPress={() => navigation.navigate("CreateAluno")}
      />
      <FlatList
        data={alunos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate("EditAluno", {
                    alunoId: item._id,
                    nome: item.nome,
                    email: item.email,
                  })
                }
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item._id)}
              >
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  nome: { fontWeight: "bold", fontSize: 16 },
  email: { color: "#666" },
  buttons: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  editButton: {
    backgroundColor: "#007bff",
    padding: 6,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 6,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
