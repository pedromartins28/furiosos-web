# Furiosos Web

Front-end da aplicação **Furiosos**, desenvolvida com [Quasar Framework (Vue.js)](https://quasar.dev/). Este projeto faz parte de um desafio técnico do processo seletivo da **FURIA Esports**, com o objetivo de aplicar a estratégia **Know Your Fan**, permitindo que fãs da organização interajam de forma gamificada, acumulem **FURIA Points** e tenham acesso a conteúdos exclusivos.

## 📸 Visão Geral

- Integração com Instagram via OAuth2
- Upload de documentos com verificação OCR
- Verificação de links de perfis em sites de e-sports
- Notícias e calendário de jogos da FURIA
- Sistema de login com Supabase
- Sistema de missões semanais
- Acúmulo de FURIA Points por ações realizadas

---

## 🚀 Rodando Localmente

### Pré-requisitos

- Node.js v18+
- Quasar CLI

### Instalação

```bash
npm install -g @quasar/cli
```

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/furiosos-web.git
cd furiosos-web
npm install
```

### Inicie o servidor de desenvolvimento

```bash
quasar dev
```

---

### Lint dos arquivos

```bash
npm run lint
```

### Formatação automática

```bash
npm run format
```

### Build para produção

```bash
quasar build
```

### Customização da configuração

Veja [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

---

## ⚙️ Configuração do Supabase

Acesse [https://supabase.com/](https://supabase.com/) e crie um novo projeto. Em seguida:

### 🔸 Tabelas

Crie as seguintes tabelas com os campos esperados:

1. `users`
   - `id` (UUID, PK)
   - `email` (string)
   - `nome` (string)
   - `cpf` (string)
   - `endereco` (string)
   - `data_nascimento` (date)
   - `imagem_url` (string)
   - `documento_url` (string)
   - `interesses` (string[])
   - `furia_points` (integer)

2. `interesses_opcoes`
   - `id` (int, PK)
   - `descricao` (string)
   - `categoria_id` (foreign key → categorias_interesse)

3. `categorias_interesse`
   - `id` (int, PK)
   - `nome` (string)

4. `instagram_posts`
   - `id`
   - `user_id`
   - `caption`
   - `like_count`
   - `media_type`
   - `timestamp`

5. `instagram_insights`
   - `post_id`
   - `alcance`
   - `impressões`

> **Importante**: Popule as tabelas `categorias_interesse` e `interesses_opcoes` conforme as categorias e opções que desejar disponibilizar no formulário de interesses dos usuários.

### 🔸 Autenticação

- Ative o provedor **Email + Senha**
- Configure os redirecionamentos (callback URLs) permitidos

### 🔸 Bucket de Storage

- Crie um bucket chamado `documentos`
- Defina se será de acesso público ou controlado por políticas de segurança (RLS)

---

## 📱 Integração com Facebook Developers (Instagram OAuth)

1. Acesse [https://developers.facebook.com/](https://developers.facebook.com/)
2. Crie um **App do tipo Empresa**
3. Adicione o produto **Instagram**
4. Configure:
   - Uma conta profissional de Instagram (comercial ou criador)
   - A URL de redirecionamento (callback), por exemplo:  
     `https://sua-url.com/auth/instagram/callback`
5. Gere o `client_id` e configure seu `.env`:

```env
VITE_INSTAGRAM_CLIENT_ID=seu_id
VITE_INSTAGRAM_REDIRECT_URI=https://sua-url.com/auth/instagram/callback
```

6. Vá em **Configurações > Básico** e preencha nome, política de privacidade e ícone para poder usar em produção.

> ⚠️ **Atenção**: o login via Instagram **funciona apenas com contas profissionais** (do tipo comercial ou criador de conteúdo).

📚 Documentação oficial da API: [https://developers.facebook.com/docs/instagram-platform](https://developers.facebook.com/docs/instagram-platform)

---


---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis, necessárias para o funcionamento da aplicação:

```env
VITE_INSTAGRAM_CLIENT_ID=
VITE_INSTAGRAM_REDIRECT_URI=
INSTAGRAM_CLIENT_SECRET=
VITE_API_URL=
VITE_TWITCH_PARENT=
```

### Explicação de cada variável:

| Variável                     | Descrição |
|-----------------------------|-----------|
| `VITE_INSTAGRAM_CLIENT_ID`  | ID do aplicativo criado no Facebook Developers para autenticação via Instagram OAuth2. |
| `VITE_INSTAGRAM_REDIRECT_URI` | URL de redirecionamento configurada no Facebook Developers, para onde o usuário será enviado após login. Deve coincidir com a configurada na plataforma. |
| `INSTAGRAM_CLIENT_SECRET`   | Chave secreta do app do Instagram, usada no backend para trocar o `code` pelo `access_token`. |
| `VITE_API_URL`              | URL da API backend da aplicação. Exemplo: `http://localhost:3000` em desenvolvimento, ou a URL pública em produção. |
| `VITE_TWITCH_PARENT`        | Domínio autorizado para a Twitch embutir o player. Em desenvolvimento, use `localhost`; em produção, use seu domínio (ex: `meusite.com`). |

> ⚠️ Lembre-se de **nunca versionar seu arquivo `.env`**. Ele deve ser adicionado ao `.gitignore` por segurança.


## 📦 Deploy na Vercel

Este projeto pode ser facilmente publicado na [Vercel](https://vercel.com/):

1. Faça login na Vercel e importe o repositório `furiosos-web`
2. Configure as variáveis de ambiente de produção (como as do `.env`)
3. A Vercel já detectará automaticamente o comando de build padrão:

```bash
quasar build
```