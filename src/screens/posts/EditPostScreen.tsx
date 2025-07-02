import React, { useEffect, useState } from "react";
import { Text, TextInput, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { LoadingButton } from "../../components/LoadingButton";
import { toastError, toastSuccess } from "../../helpers/toast";

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
        toastError("Erro", "Token não encontrado");
        return navigation.replace("Login");
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
        toastError("Erro", "Falha ao carregar post");
      }
    };

    fetchPost();
  }, [postId]);

  const handleUpdatePost = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      toastError("Erro", "Token não encontrado");
      return navigation.replace("Login");
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

      toastSuccess("Sucesso", "Post atualizado com sucesso");
      navigation.navigate("Home"); // volta para home
    } catch (err) {
      toastError("Erro", "Falha ao atualizar post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      className="bg-white px-4 pt-6 pb-10"
    >
      <Text className="m-2 text-lg text-fiap-secondary">Título</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 bg-gray-50 focus:border-fiap-primary"
        value={title}
        onChangeText={setTitle}
        placeholder="Digite o título"
      />

      <Text className=" mt-3 mb-2 text-lg text-fiap-secondary">Conteúdo</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 bg-gray-50 h-32 text-justify focus:border-fiap-primary"
        value={content}
        onChangeText={setContent}
        placeholder="Digite o conteúdo"
        multiline
        textAlignVertical="top"
      />

      <Text className="mt-3 mb-2 text-lg text-fiap-secondary">Autor</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 bg-gray-50 focus:border-fiap-primary"
        value={author}
        onChangeText={setAuthor}
        placeholder="Digite o autor"
      />

      <LoadingButton
        className="bg-fiap-primary rounded-lg p-4 items-center mt-8"
        text="Salvar alterações"
        disabled={loading}
        loading={loading}
        onPress={handleUpdatePost}
      />
    </ScrollView>
  );
}
