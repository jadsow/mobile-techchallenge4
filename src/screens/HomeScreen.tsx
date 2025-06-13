import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode"; // corrigi a importação aqui
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

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
          Alert.alert("Erro", "Token inválido");
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

            Alert.alert("Sucesso", "Post excluído com sucesso.");
            fetchPosts(token!, searchText); // atualiza a lista
          } catch (err) {
            Alert.alert("Erro", "Não foi possível excluir o post.");
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
      Alert.alert("Post não encontrado.");
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
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo!</Text>
      {role && (
        <Text style={styles.subtitle}>Você está logado como: {role}</Text>
      )}

      {role === "professor" && (
        <>
          <Button title="Criar Post" onPress={handleCreatePost} />

          <TouchableOpacity
            style={styles.botaoProfessores}
            onPress={() => navigation.navigate("ProfessoresList")}
          >
            <Text style={styles.textoBotao}>Ver Professores</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoProfessores}
            onPress={() => navigation.navigate("AlunosList")}
          >
            <Text style={styles.textoBotao}>Ver Alunos</Text>
          </TouchableOpacity>
        </>
      )}

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar posts..."
        value={searchText}
        onChangeText={onChangeSearchText}
      />

      <Text style={styles.sectionTitle}>Posts:</Text>
      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Carregando...
        </Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.postCard}
              onPress={() =>
                navigation.navigate("PostDetail", { postId: item._id })
              }
            >
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text>{item.content.substring(0, 100)}...</Text>

              {role === "professor" && (
                <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
                  <TouchableOpacity
                    style={[styles.editButton, { backgroundColor: "#007bff" }]}
                    onPress={() =>
                      navigation.navigate("EditPost", { postId: item._id })
                    }
                  >
                    <Text style={styles.editButtonText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.editButton, { backgroundColor: "red" }]}
                    onPress={() => handleDeletePost(item._id)}
                  >
                    <Text style={styles.editButtonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Sair" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: { textAlign: "center", marginBottom: 20, fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 12 },
  postCard: {
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  postTitle: { fontWeight: "bold", marginBottom: 4 },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    marginTop: 10,
  },

  editButton: {
    marginTop: 8,
    backgroundColor: "#007bff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  botaoProfessores: {
    marginTop: 10,
  },
  textoBotao: {
    color: "gray",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
});
