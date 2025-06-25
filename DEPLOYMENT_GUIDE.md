# Guia de Implantação na Netlify

Este é um guia passo a passo para implantar seu projeto Next.js na Netlify.

## Pré-requisitos

1.  Uma conta na [Netlify](https://www.netlify.com/).
2.  Seu projeto em um repositório Git (GitHub, GitLab ou Bitbucket).

## Passo 1: Importar seu Projeto para a Netlify

1.  Faça login no seu painel da Netlify.
2.  Clique no botão **"Add new site"** e selecione **"Import an existing project"**.
3.  Escolha seu provedor de Git (ex: GitHub) e autorize o acesso da Netlify ao seu repositório.
4.  Selecione o repositório do seu projeto na lista.

## Passo 2: Configurar as Definições de Build

A Netlify é inteligente e geralmente detecta que seu projeto é construído com Next.js, configurando tudo automaticamente. O arquivo `netlify.toml` que adicionei ao projeto ajuda a garantir que as configurações corretas sejam usadas.

Verifique se as configurações estão assim (normalmente já estarão corretas):

-   **Build command:** `npm run build`
-   **Publish directory:** `.next`

## Passo 3: Adicionar Variáveis de Ambiente (muito importante para o seu `.env`)

Suas chaves de API e outras informações sensíveis do arquivo `.env` **não devem** ser enviadas para o repositório Git. Em vez disso, você deve configurá-las diretamente na interface da Netlify:

1.  Dentro das configurações do seu site na Netlify, vá para **"Site configuration"** > **"Build & deploy"** > **"Environment"**.
2.  Na seção **"Environment variables"**, clique em **"Edit variables"**.
3.  Adicione cada variável do seu arquivo `.env`. Por exemplo, se seu arquivo `.env` contém `GOOGLE_API_KEY=sua_chave_secreta_aqui`, você criará uma nova variável com:
    -   **Key:** `GOOGLE_API_KEY`
    -   **Value:** `sua_chave_secreta_aqui`
4.  Clique em **"Save"**. Repita o processo para todas as variáveis necessárias.

Essas variáveis serão injetadas de forma segura durante o processo de build e estarão disponíveis para suas funções de backend (Genkit flows).

## Passo 4: Realizar o Deploy

1.  Depois de configurar as variáveis de ambiente, clique no botão **"Deploy site"** (ou **"Trigger deploy"** se o site já foi criado).
2.  A Netlify começará a construir seu projeto. Você pode acompanhar o progresso em tempo real nos logs de deploy.
3.  Quando o deploy for concluído com sucesso, seu site estará online em uma URL fornecida pela Netlify (algo como `nome-aleatorio-incrivel.netlify.app`). Você pode configurar um domínio personalizado mais tarde, se desejar.

É isso! Seu site estará no ar. A Netlify fará o deploy automaticamente toda vez que você enviar novas alterações para a branch principal do seu repositório.
