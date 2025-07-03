import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode"; // corrigi a importação aqui
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { toastError, toastSuccess } from "../helpers/toast";

import Icon from "react-native-vector-icons/Feather";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

type DecodedToken = {
  role: "professor" | "aluno";
};

export type Post = {
  _id: string;
  title: string;
  content: string;
  author: string;
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<"professor" | "aluno" | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  // Ref para controlar o debounce
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const init = async () => {
        const storedToken = await AsyncStorage.getItem("access_token");
        if (!storedToken) {
          navigation.replace("Login");
          return;
        }

        try {
          const decoded = jwtDecode<DecodedToken>(storedToken);
          setRole(decoded.role);
          setToken(storedToken);
          fetchPosts(storedToken, ""); // aqui busca todos os posts novamente
        } catch (err) {
          toastError("Erro", "Token inválido");
          navigation.replace("Login");
        }
      };

      init();
    }, [])
  );

  const handleDeletePost = async (postId: string) => {
    Alert.alert("Confirmar", "Deseja realmente excluir este post?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("access_token");
            const response = await fetch(
              `http://10.0.2.2:3010/posts/delete/${postId}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!response.ok) {
              throw new Error("Erro ao excluir");
            }

            toastSuccess("Sucesso", "Post excluído com sucesso.");
            fetchPosts(token!, searchText); // atualiza a lista
          } catch (err) {
            toastError("Erro", "Não foi possível excluir o post.");
          }
        },
      },
    ]);
  };

  const fetchPosts = async (authToken: string, query: string) => {
    try {
      setLoading(true);
      const url = query
        ? `http://10.0.2.2:3010/posts/search/${encodeURIComponent(query)}`
        : "http://10.0.2.2:3010/posts";

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Erro na requisição");
      }
      const data = await response.json();

      if (query) {
        setPosts([data]);
      } else {
        setPosts(data);
      }
    } catch (error) {
      setPosts([]);
      toastError("Erro", "Nenhum post encontrado.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("access_token");
    navigation.replace("Login");
  };

  const handleCreatePost = () => {
    navigation.navigate("CreatePost");
  };

  const onChangeSearchText = (text: string) => {
    setSearchText(text);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      if (token) {
        fetchPosts(token, text);
      }
    }, 500);
  };

  return (
    <SafeAreaView className="flex-1 px-5 py-6 bg-gray-50">
      <View className="flex-row justify-between items-center mb-6">
        {role && (
          <Text className="text-center text-md color-fiap-gray">
            Você está logado como <Text className="font-semibold">{role}</Text>
          </Text>
        )}
        <TouchableOpacity
          activeOpacity={0.2}
          className="flex-row gap-3 justify-between rounded-lg py-3 items-center press"
          onPress={handleLogout}
        >
          <Text className="color-fiap-secondary font-semibold text-lg">
            Sair
          </Text>
          <Icon name="log-out" size={24} color="#BF3B5E" />
        </TouchableOpacity>
      </View>

      <Text className="text-3xl font-bold text-center mb-2 color-fiap-primary">
        Bem-vindo {role ? role : ""}!
      </Text>

      {role === "professor" && (
        <View className="gap-3 mb-6">
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-fiap-primary rounded-lg py-3 items-center"
            onPress={handleCreatePost}
          >
            <Text className="text-white font-semibold text-base">
              + Criar Post
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => navigation.navigate("ProfessoresList")}
            >
              <Text className="text-gray-700 underline">Ver Professores</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("AlunosList")}>
              <Text className="text-gray-700 underline">Ver Alunos</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4 bg-white focus:border-fiap-primary"
        placeholder="Buscar posts..."
        value={searchText}
        onChangeText={onChangeSearchText}
      />

      <Text className="text-lg font-bold mb-3">Posts:</Text>

      {loading ? (
        <Text className="text-center mt-4 text-gray-500">Carregando...</Text>
      ) : posts.length === 0 ? (
        <Text className="text-center mt-4 text-gray-500">
          Nenhum post encontrado.
        </Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              className="bg-white rounded-xl p-4 mb-4 border border-gray-200 shadow-sm"
              onPress={() =>
                navigation.navigate("PostDetail", { postId: item._id })
              }
            >
              <View className="flex-1 flex-col gap-3">
                <Text className="text-lg text-start font-semibold color-fiap-primary">
                  {item.title}
                </Text>
                <Text className="text-gray-600">
                  {item.content.substring(0, 100)}...
                </Text>

                {role === "professor" && (
                  <View className="flex-row justify-between mt-1">
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("EditPost", { postId: item._id })
                      }
                      className="flex-row items-center border border-blue-500 rounded-md px-3 py-2"
                    >
                      <Icon name="edit-2" size={16} color="#3B82F6" />
                      <Text className="text-blue-500 font-semibold ml-2">
                        Editar
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDeletePost(item._id)}
                      className="flex-row items-center bg-red-100 rounded-md px-3 py-2"
                    >
                      <Icon name="trash-2" size={16} color="#DC2626" />
                      <Text className="text-red-600 font-semibold ml-2">
                        Excluir
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
