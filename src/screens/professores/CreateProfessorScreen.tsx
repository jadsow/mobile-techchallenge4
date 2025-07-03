import React, { useState } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { toastError, toastSuccess } from "../../helpers/toast";
import { LoadingButton } from "../../components/LoadingButton";
import { useNavigation } from "@react-navigation/native";

export default function CreateProfessorScreen() {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "CreateProfessor">
    >();

  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async () => {
    if (!nome || !email || !senha) {
      return toastError("Preencha todos os campos");
    }

    try {
      setLoading(true);

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

      toastSuccess("Sucesso", "Professor cadastrado com sucesso!");
      navigation.goBack();
    } catch (err) {
      toastError("Não foi possível cadastrar o professor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white px-4 pt-6 pb-10"
    >
      <View className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-5">
        <Text className="italic text-sm text-gray-700">
          Preencha os dados do professor com atenção. O e-mail e a senha serão
          utilizados para login posteriormente.
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
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="border border-gray-300 rounded-lg p-3 bg-gray-50 mb-6 focus:border-fiap-primary"
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
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
