import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";

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
        navigation.replace("Login");
        return;
      }
      const decoded: any = jwtDecode(storedToken);
      if (decoded.role !== "professor") {
        Alert.alert("Acesso negado", "Apenas professores podem editar alunos.");
        navigation.goBack();
        return;
      }
      setToken(storedToken);
    };

    getToken();
  }, []);

  const handleSalvar = async () => {
    if (!nome || !email) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    try {
      if (!token) {
        Alert.alert("Erro", "Token inválido");
        return;
      }
      console.log("Atualizando aluno:", alunoId, nome, email);
      const response = await fetch(`http://10.0.2.2:3010/alunos/${alunoId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar");

      Alert.alert("Sucesso", "Aluno atualizado com sucesso.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o aluno.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Aluno</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <Button title="Salvar" onPress={handleSalvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
