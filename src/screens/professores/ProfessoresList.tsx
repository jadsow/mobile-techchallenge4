import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  sub: string;
};
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProfessoresList"
>;

type Professor = {
  _id: string;
  nome: string;
  email: string;
};

export default function ProfessoresListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [token, setToken] = useState<string | null>(null);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const init = async () => {
        const storedToken = await AsyncStorage.getItem("access_token");
        if (!storedToken) {
          navigation.replace("Login");
          return;
        }
        setToken(storedToken);
        fetchProfessores(storedToken);
      };
      init();
    }, [])
  );

  const fetchProfessores = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await fetch("http://10.0.2.2:3010/professores", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) throw new Error("Erro ao buscar professores");
      const data = await response.json();
      setProfessores(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os professores");
      setProfessores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    navigation.navigate("EditProfessor", { professorId: id });
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Confirmação", "Deseja realmente excluir este professor?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          if (!token) return;

          try {
            const decoded: DecodedToken = jwtDecode(token);

            console.log("Decoded Token:", decoded);
            console.log("Deleting ID:", id);

            const response = await fetch(
              `http://10.0.2.2:3010/professores/${id}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!response.ok) throw new Error("Erro ao excluir");

            Alert.alert("Sucesso", "Professor excluído");

            if (decoded.sub === id) {
              await AsyncStorage.removeItem("access_token");
              navigation.replace("Login");
              return;
            } else {
              fetchProfessores(token);
            }
          } catch (error) {
            Alert.alert("Erro", "Falha ao excluir professor");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Professores Cadastrados</Text>

      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          data={professores}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.professorCard}>
              <View>
                <Text style={styles.name}>{item.nome}</Text>
                <Text>{item.email}</Text>
              </View>
              <View style={styles.actions}>
                <Button title="Editar" onPress={() => handleEdit(item._id)} />
                <Button
                  title="Excluir"
                  color="red"
                  onPress={() => handleDelete(item._id)}
                />
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.createButtonBottom}
        onPress={() => navigation.navigate("CreateProfessor")}
      >
        <Text style={styles.createButtonText}>+ Criar Professor</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  professorCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  name: { fontWeight: "bold", fontSize: 16 },
  actions: { flexDirection: "row", gap: 8 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  createButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  createButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  createButtonBottom: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
});
