import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { jwtDecode } from "jwt-decode";
import Icon from "react-native-vector-icons/Feather";
import { toastError, toastSuccess } from "../../helpers/toast";

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
      toastError("Acesso negado", "Apenas professores podem ver os alunos.");
      return navigation.goBack();
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
      toastError("Erro", "Não foi possível carregar os alunos.");
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
              return toastError("Erro", "Token inválido");
            }
            const response = await fetch(`http://10.0.2.2:3010/alunos/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (!response.ok) throw new Error("Erro ao deletar aluno");

            setAlunos((prev) => prev.filter((a) => a._id !== id));
            toastSuccess("Sucesso", "Aluno excluído com sucesso.");
          } catch (error) {
            toastError("Erro", "Falha ao excluir aluno.");
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 px-4 py-6 bg-white">
      <FlatList
        data={alunos}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View className="bg-gray-100 p-4 rounded-lg mb-3">
            <Text className="text-lg text-fiap-primary font-semibold">
              {item.nome}
            </Text>
            <Text className="text-gray-600">{item.email}</Text>

            <View className="flex-row w-full justify-between mt-4 gap-2">
              <TouchableOpacity
                className="flex-row items-center border border-blue-300 rounded-md px-3 py-2"
                onPress={() =>
                  navigation.navigate("EditAluno", {
                    alunoId: item._id,
                    nome: item.nome,
                    email: item.email,
                  })
                }
              >
                <Icon name="edit-2" size={16} color="#3B82F6" />
                <Text className="text-blue-500 font-semibold ml-2">Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center border border-red-300 rounded-md px-3 py-2"
                onPress={() => handleDelete(item._id)}
              >
                <Icon name="trash-2" size={16} color="#DC2626" />
                <Text className="text-red-600 font-semibold ml-2">Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("CreateAluno")}
        className="flex-row absolute bottom-6 right-6 bg-fiap-primary p-4 rounded-full items-center gap-2"
        style={styles.fabButtonShadow}
      >
        <Icon name="plus" size={24} color="white" />
        <Text className="text-white font-bold text-base">Novo aluno</Text>
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
