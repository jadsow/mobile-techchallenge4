import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import LoadingScreen from "../screens/LoadingScreen";
import PostDetailScreen from "../screens/posts/PostDetailScreen";
import CreatePostScreen from "../screens/posts/CreatePostScreen";
import EditPostScreen from "../screens/posts/EditPostScreen";
import ProfessoresListScreen from "../screens/professores/ProfessoresList";
import EditProfessorScreen from "../screens/professores/EditProfessorScreen";
import CreateProfessorScreen from "../screens/professores/CreateProfessorScreen";
import AlunosListScreen from "../screens/alunos/AlunosListScreen";
import EditAlunoScreen from "../screens/alunos/EditAlunoScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Loading">
      <Stack.Screen
        name="Loading"
        component={LoadingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{ headerTitle: "Detalhes" }}
      />
      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="EditPost"
        component={EditPostScreen}
        options={{ headerTitle: "Editar" }}
      />
      <Stack.Screen name="ProfessoresList" component={ProfessoresListScreen} />
      <Stack.Screen name="EditProfessor" component={EditProfessorScreen} />
      <Stack.Screen name="CreateProfessor" component={CreateProfessorScreen} />
      <Stack.Screen name="AlunosList" component={AlunosListScreen} />
      <Stack.Screen name="EditAluno" component={EditAlunoScreen} />
    </Stack.Navigator>
  );
}
