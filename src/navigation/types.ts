import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;
export type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Register"
>;

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  PostDetail: { postId: string };
  EditPost: { postId: string };
  CreatePost: undefined;
  ProfessoresList: undefined;
  EditProfessor: { professorId: string };
  CreateProfessor: undefined;
  CreateAluno: undefined;
  AlunosList: undefined;
  EditAluno: { alunoId: string; nome: string; email: string };
};
