import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreatePost"
>;

export default function CreatePostScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("access_token");
      if (!storedToken) {
        Alert.alert("Erro", "Você precisa estar logado.");
        navigation.replace("Login");
        return;
      }
      setToken(storedToken);
    };

    loadToken();
  }, []);

  const handleSubmit = async () => {
    if (!title || !content) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch("http://10.0.2.2:3010/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar post.");
      }

      Alert.alert("Sucesso", "Post criado com sucesso!");
      navigation.goBack(); // volta para Home
    } catch (err) {
      Alert.alert("Erro", "Não foi possível criar o post.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Novo Post</Text>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Conteúdo"
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={6}
      />
      <Button title="Publicar" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  multiline: {
    height: 120,
    textAlignVertical: "top",
  },
});
