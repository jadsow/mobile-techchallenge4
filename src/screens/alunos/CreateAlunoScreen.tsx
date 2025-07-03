import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { jwtDecode } from "jwt-decode";
import { LoadingButton } from "../../components/LoadingButton";
import { toastError, toastSuccess } from "../../helpers/toast";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreateAluno"
>;

export default function CreateAlunoScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
        toastError("Acesso negado", "Apenas professores podem criar alunos.");
        return navigation.goBack();
      }

      setToken(storedToken);
    };

    fetchToken();
  }, []);

  const handleSubmit = async () => {
    if (!nome || !email || !senha) {
      return toastError("Erro", "Preencha todos os campos.");
    }

    try {
      setLoading(true);

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

      toastSuccess("Sucesso", "Aluno criado com sucesso!");
      navigation.goBack();
    } catch (error) {
      toastError("Erro", "Não foi possível criar o aluno.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white px-4 pt-6 pb-10"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="bg-yellow-50 border border-gray-200 rounded-md p-3 mb-5">
        <Text className="italic text-sm text-gray-700">
          Preencha os dados do aluno corretamente. Um email válido e uma senha
          segura são obrigatórios.
        </Text>
      </View>

      <TextInput
        className="border border-gray-300 rounded-lg p-3 bg-gray-50 mb-4 focus:border-fiap-primary"
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        className="border border-gray-300 rounded-lg p-3 bg-gray-50 mb-4 focus:border-fiap-primary"
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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
        className="bg-fiap-primary rounded-lg p-4 items-center mt-2"
        text="Cadastrar"
        onPress={handleSubmit}
      />
    </ScrollView>
  );
}
