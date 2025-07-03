import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

type PostDetailRouteProp = RouteProp<RootStackParamList, "PostDetail">;

export default function PostDetailScreen() {
  const route = useRoute<PostDetailRouteProp>();
  const { postId } = route.params;

  const [post, setPost] = useState<null | {
    _id: string;
    title: string;
    content: string;
    author: string;
  }>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const token = await AsyncStorage.getItem("access_token");

        const response = await fetch(`http://10.0.2.2:3010/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token ?? ""}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar o post");
        }

        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Erro ao buscar post:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator className="text-fiap-primary" size="large" />
      </View>
    );
  }

  if (!post) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Post não encontrado.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 gap-3">
      <Text className="text-3xl font-extrabold text-fiap-primary">
        {post.title}
      </Text>
      <Text className="italic text-lg text-gray-600 text-start">
        Por {post.author}
      </Text>
      <Text className="text-xl text-gray-700 pt-4 border-t-gray-400 border-t-[0.5px]">
        {post.content}
      </Text>
    </SafeAreaView>
  );
}
