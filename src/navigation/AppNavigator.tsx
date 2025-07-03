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
import CreateAlunoScreen from "../screens/alunos/CreateAlunoScreen";

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
      <Stack.Screen
        name="ProfessoresList"
        component={ProfessoresListScreen}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="EditProfessor"
        component={EditProfessorScreen}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="CreateProfessor"
        component={CreateProfessorScreen}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="AlunosList"
        component={AlunosListScreen}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="CreateAluno"
        component={CreateAlunoScreen}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="EditAluno"
        component={EditAlunoScreen}
        options={{ headerTitle: "" }}
      />
    </Stack.Navigator>
  );
}
