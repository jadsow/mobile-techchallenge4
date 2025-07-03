import React, { useEffect, useState } from "react";
import { Text, TextInput, Alert, ScrollView } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoadingButton } from "../../components/LoadingButton";
import { toastError, toastSuccess } from "../../helpers/toast";

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
        toastError("Não encontrado", "Erro ao buscar dados do professor.");
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
      return toastError("Erro", "Por favor, insira um email válido.");
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

      toastSuccess("Sucesso", "Professor atualizado.");
      navigation.goBack();
    } catch (err) {
      toastError("Erro", "Não foi possível atualizar.");
    }
  };

  const handleDelete = async () => {
    Alert.alert("Confirmação", "Deseja realmente excluir este professor?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
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

            toastSuccess("Removido", "Professor deletado com sucesso.");
            navigation.goBack();
          } catch (err) {
            toastError("Erro", "Erro ao deletar professor.");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white px-4 pt-6 pb-10"
    >
      <Text className="text-2xl font-bold text-start mb-4 color-fiap-primary">
        Editar Professor
      </Text>

      <Text className="font-semibold mb-2">Nome</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-3 bg-gray-50 mb-4 focus:border-fiap-primary"
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o nome"
      />

      <Text className="font-semibold mb-2">E-mail</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-3 bg-gray-50 mb-6 focus:border-fiap-primary"
        value={email}
        onChangeText={setEmail}
        placeholder="Digite o e-mail"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <LoadingButton
        text="Salvar Alterações"
        onPress={handleSave}
        className="bg-fiap-primary rounded-lg p-4 items-center"
      />

      <LoadingButton
        text="Excluir Professor"
        onPress={handleDelete}
        loading={false}
        className="bg-fiap-primary/20 border border-fiap-secondary rounded-lg p-4 items-center mt-4"
        textProps={{ className: "text-fiap-secondary font-semibold" }}
      />
    </ScrollView>
  );
}
