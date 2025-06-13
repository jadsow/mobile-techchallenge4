import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        throw new Error("Credenciais inválidas");
      }

      const data = await response.json();

      await AsyncStorage.setItem("access_token", data.access_token);
      Alert.alert("Login realizado com sucesso!");
      navigation.replace("Home");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

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

      <Text style={styles.label}>Tipo de usuário:</Text>
      <View style={styles.userTypeContainer}>
        <TouchableOpacity
          style={[
            styles.userTypeButton,
            tipoUsuario === "aluno" && styles.userTypeButtonSelected,
          ]}
          onPress={() => setTipoUsuario("aluno")}
        >
          <Text
            style={[
              styles.userTypeText,
              tipoUsuario === "aluno" && styles.userTypeTextSelected,
            ]}
          >
            Aluno
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.userTypeButton,
            tipoUsuario === "professor" && styles.userTypeButtonSelected,
          ]}
          onPress={() => setTipoUsuario("professor")}
        >
          <Text
            style={[
              styles.userTypeText,
              tipoUsuario === "professor" && styles.userTypeTextSelected,
            ]}
          >
            Professor
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Button title="Entrar" onPress={handleLogin} />
          <View style={{ marginTop: 10 }}>
            <Button
              title="Registro"
              onPress={() => navigation.navigate("Register")}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  label: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
    fontWeight: "500",
  },

  userTypeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 24,
  },

  userTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#ddd",
  },

  userTypeButtonSelected: {
    backgroundColor: "#007bff",
  },

  userTypeText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },

  userTypeTextSelected: {
    color: "#fff",
  },
});
