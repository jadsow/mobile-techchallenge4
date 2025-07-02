import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Platform, Text, TextInput, View } from "react-native";
import { LoadingButton } from "../../components/LoadingButton";
import { RegisterScreenNavigationProp } from "../../navigation/types";
import { toastError, toastSuccess } from "../../helpers/toast";

type Props = {
  navigation: RegisterScreenNavigationProp;
};

export default function RegisterScreen({ navigation }: Props) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState<"professor" | "aluno">(
    "aluno"
  );
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      return toastError("Erro", "Preencha todos os campos.");
    }

    if (!isValidEmail(email)) {
      return toastError("Erro", "Por favor, insira um email válido.");
    }

    if (senha !== confirmarSenha) {
      return toastError("Erro", "As senhas não coincidem.");
    }

    const payload: any = { nome, email, senha };
    if (tipoUsuario === "professor") payload.role = "professor";

    const endpoint =
      tipoUsuario === "professor"
        ? "http://10.0.2.2:3010/professores"
        : "http://10.0.2.2:3010/alunos";

    try {
      setLoading(true);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro no cadastro.");
      }

      toastSuccess("Sucesso", "Usuário registrado com sucesso!");

      navigation.navigate("Login");
    } catch (error: any) {
      toastError("Erro", error.message || "Erro ao registrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-4 bg-white">
      <Text className="text-3xl font-semibold text-center mb-6 color-fiap-primary">
        Cadastro
      </Text>

      <TextInput
        className="bg-gray-100 rounded-md p-4 mb-4 border border-gray-200 focus:border-fiap-primary"
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        className="bg-gray-100 rounded-md p-4 mb-4 border border-gray-200 focus:border-fiap-primary"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="bg-gray-100 rounded-md p-4 mb-4 border border-gray-200 focus:border-fiap-primary"
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TextInput
        className="bg-gray-100 rounded-md p-4 mb-4 border border-gray-200 focus:border-fiap-primary"
        placeholder="Confirmar Senha"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      <Text className="text-base font-medium color-fiap-secondary mb-2">
        Tipo de usuário:
      </Text>

      <View
        className={`rounded-md border border-gray-200 mb-6 ${
          Platform.OS === "android" ? "overflow-hidden" : ""
        }`}
      >
        <Picker
          selectedValue={tipoUsuario}
          onValueChange={(itemValue) => setTipoUsuario(itemValue)}
          style={{ backgroundColor: "#f3f4f6" }}
          dropdownIconColor="#374151"
        >
          <Picker.Item label="Aluno" value="aluno" />
          <Picker.Item label="Professor" value="professor" />
        </Picker>
      </View>

      <LoadingButton
        className="bg-fiap-primary rounded-lg p-4 items-center mt-2"
        text="Registrar"
        loading={loading}
        onPress={handleRegister}
      />

      <LoadingButton
        className="border-fiap-primary border-[1px] rounded-lg p-4 items-center mt-3"
        text="Voltar ao Login"
        textProps={{ className: "color-fiap-primary font-semibold" }}
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
}
