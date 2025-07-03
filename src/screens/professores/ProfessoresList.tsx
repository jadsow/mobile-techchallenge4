import React, { useState } from "react";
import {
  View,
  Text,
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

import Icon from "react-native-vector-icons/Feather";
import { toastError, toastSuccess } from "../../helpers/toast";

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
      toastError("Erro", "Não foi possível carregar os professores");
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

            toastSuccess("Sucesso", "Professor excluído");

            if (decoded.sub === id) {
              await AsyncStorage.removeItem("access_token");
              navigation.replace("Login");
              return;
            } else {
              fetchProfessores(token);
            }
          } catch (error) {
            toastError("Erro", "Falha ao excluir professor");
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 px-4 py-5 bg-white">
      {loading ? (
        <Text className="text-center text-gray-500">Carregando...</Text>
      ) : (
        <FlatList
          data={professores}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
          renderItem={({ item }) => (
            <View className="flex-col justify-between items-start bg-gray-100 p-4 rounded-lg mb-3">
              <View className="flex-1 pr-2">
                <Text className="text-fiap-secondary font-bold text-lg">
                  {item.nome}
                </Text>
                <Text className="text-gray-700">{item.email}</Text>
              </View>

              <View className="flex-row w-full justify-between mt-4 gap-2">
                <TouchableOpacity
                  className="flex-row items-center border border-blue-300 rounded-md px-3 py-2"
                  onPress={() => handleEdit(item._id)}
                >
                  <Icon name="edit-2" size={16} color="#3B82F6" />
                  <Text className="text-blue-500 font-semibold ml-2">
                    Editar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-row items-center border border-red-300 rounded-md px-3 py-2"
                  onPress={() => handleDelete(item._id)}
                >
                  <Icon name="trash-2" size={16} color="#DC2626" />
                  <Text className="text-red-600 font-semibold ml-2">
                    Excluir
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        className="flex-row absolute bottom-6 right-6 bg-fiap-primary p-4 rounded-full items-center gap-2"
        style={styles.fabButtonShadow}
        onPress={() => navigation.navigate("CreateProfessor")}
      >
        <Icon name="plus" size={24} color="white" />
        <Text className="text-white font-bold text-base">Novo Professor</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fabButtonShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 6,
  },
});
