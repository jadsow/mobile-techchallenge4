import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { RegisterScreenNavigationProp } from "../../navigation/types";

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

  // Função para validar email
  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Erro", "Por favor, insira um email válido.");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    const payload: any = {
      nome,
      email,
      senha,
    };

    if (tipoUsuario === "professor") {
      payload.role = "professor";
    }

    const endpoint =
      tipoUsuario === "professor"
        ? "http://10.0.2.2:3010/professores"
        : "http://10.0.2.2:3010/alunos";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro no cadastro.");
      }

      Alert.alert("Sucesso", "Usuário registrado com sucesso!");
      navigation.navigate("Login");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao registrar.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      <Text style={styles.label}>Tipo de usuário:</Text>
      <Picker
        selectedValue={tipoUsuario}
        onValueChange={(itemValue) => setTipoUsuario(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Aluno" value="aluno" />
        <Picker.Item label="Professor" value="professor" />
      </Picker>

      <Button title="Registrar" onPress={handleRegister} />

      <View style={styles.spacer} />
      <Button
        title="Voltar ao Login"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  picker: {
    marginBottom: 24,
  },
  spacer: {
    height: 12,
  },
});
