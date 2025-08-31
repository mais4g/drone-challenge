# 🚁 Simulador de Entrega com Drones

Este projeto é uma aplicação web completa que simula a logística de uma frota de drones para entrega de pacotes em uma área urbana representada por uma matriz.  
A aplicação possui um **backend em Node.js com Fastify** para gerenciar a lógica de negócio e um **frontend em React** para visualização e interação em tempo real.

---

## ✨ Funcionalidades Principais

- **Visualização em Tempo Real**:  
  Acompanhe a movimentação dos drones na matriz de simulação, o status dos pedidos e a disponibilidade da frota, tudo atualizado em tempo real via **WebSockets**.

- **Criação de Pedidos**:  
  Adicione novos pedidos de entrega especificando o destino (**linha e coluna**) e o **peso do pacote**.

- **Alocação Inteligente de Drones**:  
  O sistema aloca automaticamente os pedidos para os drones disponíveis, considerando a **capacidade de carga**.

- **Cálculo de Rota e Desvio de Obstáculos**:  
  Utiliza o algoritmo de **busca em largura (BFS)** para encontrar o caminho mais curto entre a base e o destino, desviando de obstáculos pré-definidos no mapa.

- **Filtragem de Pedidos**:  
  A interface permite filtrar os pedidos por status (**Todos, Em Entrega, Entregue, etc.**) para uma melhor organização.

- **Interface Otimizada**:  
  Layout limpo e funcional, com formulário de novos pedidos em uma única linha e painéis organizados em **3 colunas** para melhor aproveitamento do espaço.

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js**: Ambiente de execução do JavaScript no servidor.  
- **Fastify**: Framework web de alta performance para Node.js.  
- **Prisma**: ORM para interação com o banco de dados.  
- **@fastify/websocket**: Plugin para comunicação em tempo real.  
- **MySQL**: Banco de dados para persistência de dados (configurado via Prisma).  

### Frontend
- **React**: Biblioteca para construção da interface de usuário.  
- **Vite**: Ferramenta de build para um desenvolvimento frontend rápido.  
- **Axios**: Cliente HTTP para comunicação com a API REST do backend.  
- **CSS Moderno**: Estilização com **Flexbox**, **Grid Layout** e **variáveis CSS** para um design limpo, responsivo e com **dark mode**.  

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar e rodar a aplicação em seu ambiente local.

### 🔧 Pré-requisitos
- [Node.js](https://nodejs.org/) (versão **18.x** ou superior)  
- [NPM](https://www.npmjs.com/) (geralmente instalado com o Node.js)  
- Um servidor de banco de dados **MySQL** rodando  

---

### ⚙️ 1. Configuração do Backend

Navegue até a pasta do backend e instale as dependências:

```bash
cd backend
npm install
```

#### Configuração do Banco de Dados
Crie um arquivo **.env** na raiz da pasta `backend`.  
Dentro do arquivo, adicione a sua string de conexão com o banco de dados MySQL:

```env
DATABASE_URL="mysql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO"
```

#### Executar as migrações do Prisma
```bash
npx prisma migrate dev --name init
```

#### Iniciar o Servidor Backend
```bash
npm start
```

O servidor do backend estará rodando em:  
👉 [http://localhost:3000](http://localhost:3000)

---

### 💻 2. Configuração do Frontend

Abra um novo terminal, navegue até a pasta do frontend e instale as dependências:

```bash
cd frontend
npm install
```

#### Iniciar a Aplicação Frontend
```bash
npm run dev
```

A aplicação frontend estará acessível em:  
👉 [http://localhost:5173](http://localhost:5173)

O Vite já está configurado com um **proxy** para redirecionar as chamadas de API para o backend.

---

## 📸 Demonstração

- **Painel em 3 colunas**:  
  - Coluna 1: Criar pedidos + lista de drones  
  - Coluna 2: Lista de pedidos (com filtros e status)  
  - Coluna 3: Grid de simulação (rota em tempo real ou rota histórica)  

- **Dark Mode**:  
  Alternância entre tema claro 🌞 e escuro 🌙 com um clique.

---

## 🤝 Contribuição

Contribuições são bem-vindas!  
Sinta-se à vontade para abrir **issues** e enviar **pull requests**.

---

## 📜 Licença

Este projeto está sob a licença **MIT**.  
Veja o arquivo [LICENSE](LICENSE) para mais detalhes.