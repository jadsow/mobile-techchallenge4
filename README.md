# 📱 Blog Educacional Mobile

Este projeto é um app mobile criado com React Native para gerenciamento de postagens educativas por professores, com suporte a visualização por alunos.
A arquitetura foi baseada na separação de responsabilidades por funcionalidades.

### Princípios Adotados

- **Separação por domínios**: cada funcionalidade principal (alunos, professores, posts) possui sua própria pasta com telas relacionadas.
- **Navigation centralizada**: as rotas da aplicação são organizadas por stack (`AuthStack` e `AppNavigator`) para facilitar o fluxo de login e controle de navegação por autenticação.
- **Uso de JWT**: o token de autenticação é armazenado no `AsyncStorage` e decodificado para controle de acesso por tipo de usuário (`professor` ou `aluno`).
- **Controle de acesso**: Professores têm acesso a telas de administração e criação/edição/exclusão. Alunos possuem acesso restrito à leitura de posts.
- **Reutilização de componentes e lógica limpa**: sceens são separadas por responsabilidades, sem mistura de lógica de autenticação, navegação e layout.

## Tecnologias utilizadas em todo projeto:

- React Native
- TypeScript
- NestJS (Backend)
- MongoDB com Mongoose
- JWT (Autenticação)

## 📦 Funcionalidades

### Professores

- Login e autenticação
- Criar, editar e excluir posts
- Listar, editar e excluir alunos
- Listar, editar e excluir professores

### Alunos

- Login e autenticação
- Visualizar posts

## 🔐 Autenticação

- Professores e alunos realizam login.
- Após login, um token JWT é armazenado localmente e utilizado nas requisições.
- Permissões são controladas com base no tipo do usuário (professor/aluno).

## 🚀 Execução

### Instalação do Frontend (Mobile)

Após baixar o projeto do backend através do link (https://github.com/jadsow/techchallenge2-backend), rodá-lo com docker compose up (com o docker desktop aberto) utilizar os seguintes comandos nesse projeto:
npm install
npx expo start
Para visualização do aplicativo, sugerimos baixar o android studio para criar um virtual device manager e assim conseguir visualizar o projeto, abrindo-o em um dispositivo android.

## 🧩 Dificuldades Enfrentadas

- Integração com JWT (armazenamento, expiração e refresh)
- Diferença de permissões entre aluno e professor
- Atualização de senha e estrutura segura no backend
- Comunicação entre telas sem endpoint de `GET /aluno/:id`
