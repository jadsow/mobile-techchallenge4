import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "EditPost">;

export default function EditPostScreen({ route, navigation }: Props) {
  const { postId } = route.params;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        Alert.alert("Erro", "Token não encontrado");
        navigation.replace("Login");
        return;
      }

      try {
        const response = await fetch(`http://10.0.2.2:3010/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Erro ao buscar post");

        const data = await response.json();
        setTitle(data.title);
        setContent(data.content);
        setAuthor(data.author);
      } catch (err) {
        Alert.alert("Erro", "Falha ao carregar post");
      }
    };

    fetchPost();
  }, [postId]);

  const handleUpdatePost = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      Alert.alert("Erro", "Token não encontrado");
      navigation.replace("Login");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://10.0.2.2:3010/posts/edit/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, content, author }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar o post");
      }

      Alert.alert("Sucesso", "Post atualizado com sucesso");
      navigation.navigate("Home"); // volta para home
    } catch (err) {
      Alert.alert("Erro", "Falha ao atualizar post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Digite o título"
      />

      <Text style={styles.label}>Conteúdo</Text>
      <TextInput
        style={[styles.input, { height: 120 }]}
        value={content}
        onChangeText={setContent}
        multiline
        placeholder="Digite o conteúdo"
      />

      <Text style={styles.label}>Autor</Text>
      <TextInput
        style={styles.input}
        value={author}
        onChangeText={setAuthor}
        placeholder="Digite o autor"
      />

      <View style={{ marginTop: 20 }}>
        <Button
          title={loading ? "Salvando..." : "Salvar Alterações"}
          onPress={handleUpdatePost}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
});
