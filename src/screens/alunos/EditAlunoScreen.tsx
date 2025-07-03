import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { LoadingButton } from "../../components/LoadingButton";
import { toastError, toastSuccess } from "../../helpers/toast";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "EditAluno"
>;

type RouteParams = {
  alunoId: string;
  nome: string;
  email: string;
};

export default function EditAlunoScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const {
    alunoId,
    nome: nomeInicial,
    email: emailInicial,
  } = route.params as RouteParams;

  const [nome, setNome] = useState(nomeInicial);
  const [email, setEmail] = useState(emailInicial);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // se só usar params, não precisa carregar
  const [senha, setSenha] = useState("");

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("access_token");
      if (!storedToken) {
        return navigation.replace("Login");
      }

      const decoded: any = jwtDecode(storedToken);

      if (decoded.role !== "professor") {
        toastError("Acesso negado", "Apenas professores podem editar alunos.");
        return navigation.goBack();
      }

      setToken(storedToken);
    };

    getToken();
  }, []);

  const handleSalvar = async () => {
    if (!nome || !email) {
      return toastError("Erro", "Preencha todos os campos.");
    }
    try {
      setLoading(true);

      if (!token) {
        return toastError("Erro", "Token inválido");
      }

      const response = await fetch(`http://10.0.2.2:3010/alunos/${alunoId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar");

      toastSuccess("Sucesso", "Aluno atualizado com sucesso.");
      navigation.goBack();
    } catch (error) {
      toastError("Erro", "Não foi possível atualizar o aluno.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white px-4 pt-6 pb-10"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <Text className="text-2xl font-bold text-center text-fiap-primary mb-6">
        Editar Aluno
      </Text>

      <TextInput
        className="border border-gray-300 rounded-lg p-3 bg-gray-50 mb-4 focus:border-fiap-primary"
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        className="border border-gray-300 rounded-lg p-3 bg-gray-50 mb-4 focus:border-fiap-primary"
        placeholder="Email"
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        className="border border-gray-300 rounded-lg p-3 bg-gray-50 mb-4 focus:border-fiap-primary"
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <LoadingButton
        loading={loading}
        text="Salvar"
        onPress={handleSalvar}
        className="bg-fiap-primary rounded-lg p-4 items-center mt-2"
      />
    </ScrollView>
  );
}
