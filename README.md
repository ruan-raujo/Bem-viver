# Bem-viver
<<<<<<< HEAD

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
=======
Projeto Bem-Viver
Plataforma web responsiva para acompanhamento pessoal e monitoramento autônomo de indicadores de saúde.

Sobre o Projeto
O Bem-Viver é uma solução digital voltada para o setor de saúde pública e cuidado comunitário. O objetivo principal da plataforma é descentralizar o histórico médico e os registros de visitas domiciliares - que hoje ficam concentrados apenas com os agentes comunitários de saúde -, devolvendo ao próprio paciente o protagonismo e a autonomia sobre os seus dados.

Através do sistema, o cidadão pode:

Criar uma conta e realizar login seguro (via JWT).

Cadastrar e monitorar indicadores vitais (como glicemia e pressão arterial).

Visualizar de forma clara gráficos com o histórico cronológico e evolução da sua saúde.

Tecnologias Utilizadas
O projeto foi construído utilizando as seguintes tecnologias:

Front-End: Interface Web Responsiva hospedada na Vercel.

Back-End: API RESTful em Node.js com TypeScript hospedada na Render.

Banco de Dados: MongoDB Atlas (banco NoSQL baseado em documentos).

ORM: Prisma ORM para modelagem e comunicação segura com o banco.

Segurança: JWT (Autenticação de rotas) e Bcrypt (Criptografia de senhas).

Como Executar o Projeto Localmente
Siga os passos abaixo para clonar o repositório e rodar o servidor na sua máquina:

1. Pré-requisitos
Antes de começar, você vai precisar ter instalado em sua máquina:

Node.js (versão 18 ou superior)

Git

2. Configurando as Variáveis de Ambiente (.env)
Na raiz do diretório do Back-End, crie um arquivo chamado .env e adicione as seguintes variáveis (substituindo pelos seus dados de conexão reais):

DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/bemviver?retryWrites=true&w=majority"
JWT_SECRET="sua_chave_secreta_aqui"
PORT=3333

3. Instalar Dependências e Rodar o Projeto
No terminal do seu VS Code, execute os comandos:

Instalar as bibliotecas
npm install

Sincronizar o banco de dados com o Prisma
npx prisma db push

Inicializar o servidor em modo de desenvolvimento
npm run dev

O servidor estará a rodar em: http://localhost:3333.

Estratégia de Testes
O projeto conta com rotinas de testes automatizados para garantir a qualidade e estabilidade do software:

Testes Unitários (Jest): Validam de forma isolada as regras de negócio de saúde localizadas na camada de Service.

Testes Fim a Fim / E2E (Cypress): Simulam a jornada completa do paciente clicando na tela e enviando os dados para o servidor.

Para rodar os testes da aplicação, utilize o comando:
npm run test

Equipe do Projeto
Alessy Kauã Araújo Lemos - Matrícula: 564620
Ruan da Silva Araújo - Matrícula: 542084
Carlos Jeferson Jacinto da Silva - Matrícula: 552568
>>>>>>> fbbce793934e2aeccb0bc3afb08a272e4ec3aed8
