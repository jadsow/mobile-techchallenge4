import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { LoadingButton } from "../../components/LoadingButton";
import { RootStackParamList } from "../../navigation/types";
import { toastError, toastSuccess } from "../../helpers/toast";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState<"aluno" | "professor">(
    "aluno"
  );

  const handleLogin = async () => {
    setLoading(true);
    const endpoint =
      tipoUsuario === "professor"
        ? "http://10.0.2.2:3010/auth/login-professor"
        : "http://10.0.2.2:3010/auth/login";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) throw new Error("Credenciais inválidas");

      const data = await response.json();
      await AsyncStorage.setItem("access_token", data.access_token);
      toastSuccess("Sucesso", "Login realizado com sucesso!");
      navigation.replace("Home");
    } catch (error: any) {
      toastError("Erro", error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const isAluno = tipoUsuario === "aluno";
  const isProfessor = tipoUsuario === "professor";

  return (
    <View className="flex-1 justify-center px-4 bg-white">
      <Text className="color-fiap-primary text-3xl text-center mb-6 font-semibold">
        Blog Educacional
      </Text>

      <TextInput
        className="bg-gray-100 rounded-md p-4 mb-4 border border-gray-200"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="bg-gray-100 rounded-md p-4 mb-4 border border-gray-200"
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <Text className="color-fiap-secondary text-base mb-2 text-center font-medium">
        Tipo de usuário:
      </Text>

      <View className="flex-row self-center space-x-3 mb-6 bg-fiap-gray rounded-full">
        <TouchableOpacity
          className={`flex-1 px-5 py-3 rounded-full ${
            isAluno ? "bg-fiap-secondary" : "bg-fiap-gray"
          }`}
          onPress={() => setTipoUsuario("aluno")}
        >
          <Text
            className={`text-center text-base font-medium ${
              isAluno ? "text-white" : "text-gray-100"
            }`}
          >
            Aluno
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 px-5 py-3 rounded-full ${
            isProfessor ? "bg-fiap-secondary" : "bg-fiap-gray"
          }`}
          onPress={() => setTipoUsuario("professor")}
        >
          <Text
            className={`text-center font-medium ${
              isProfessor ? "text-white" : "text-gray-100"
            }`}
          >
            Professor
          </Text>
        </TouchableOpacity>
      </View>

      <LoadingButton
        className="bg-fiap-primary rounded-lg p-4 items-center mt-4"
        text="Entrar"
        loading={loading}
        onPress={handleLogin}
      />

      <LoadingButton
        className="border-fiap-primary border-[1px] rounded-lg p-4 items-center mt-3"
        text="Registra-se"
        textProps={{ className: "color-fiap-primary font-semibold" }}
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
}
