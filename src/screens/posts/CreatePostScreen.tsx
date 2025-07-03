import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { LoadingButton } from "../../components/LoadingButton";
import { toastError, toastSuccess } from "../../helpers/toast";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreatePost"
>;

export default function CreatePostScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("access_token");
      if (!storedToken) {
        toastError("Erro", "Você precisa estar logado.");
        navigation.replace("Login");
        return;
      }
      setToken(storedToken);
    };

    loadToken();
  }, []);

  const handleSubmit = async () => {
    if (!title || !content || !author) {
      return toastError("Erro", "Preencha todos os campos.");
    }

    try {
      setLoading(true);

      const response = await fetch("http://10.0.2.2:3010/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          author,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar post.");
      }

      toastSuccess("Sucesso", "Post criado com sucesso!");
      navigation.goBack(); // volta para Home
    } catch (err) {
      toastError("Erro", "Não foi possível criar o post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white px-4 pt-6 pb-10"
    >
      <Text className="text-2xl font-bold text-start mb-3 color-fiap-primary">
        Novo Post
      </Text>

      <View className="bg-yellow-50 border border-gray-200 rounded-md p-3 mb-5">
        <Text className="italic text-sm text-gray-700">
          Preencha os campos abaixo para criar um novo post. Tente ser claro e
          direto no título, e escreva um conteúdo relevante para os alunos.
        </Text>
      </View>

      <TextInput
        className="border border-gray-300 rounded-lg p-3 bg-gray-50 mb-4 focus:border-fiap-primary"
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        className="border border-gray-300 rounded-lg p-3 bg-gray-50 mb-6 h-32 text-justify focus:border-fiap-primary"
        placeholder="Conteúdo"
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />

      <TextInput
        className="border border-gray-300 rounded-lg p-3 bg-gray-50 mb-4 focus:border-fiap-primary"
        placeholder="Autor"
        value={author}
        onChangeText={setAuthor}
      />

      <LoadingButton
        loading={loading}
        className="bg-fiap-primary rounded-lg p-4 items-center mt-2"
        text="Publicar"
        onPress={handleSubmit}
      />
    </ScrollView>
  );
}
