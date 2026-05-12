# TDB Responde

Front-end React + Vite + TypeScript para a Sprint 4 da FIAP, com estilização em TailwindCSS e integração por `fetch` nativo com API Java/Quarkus.

## Tecnologias

- React 18
- Vite
- TypeScript
- TailwindCSS
- React Router
- React Hook Form
- Fetch API nativa
- Back-end esperado: Java + Quarkus

## Como rodar o front-end

```bash
npm install
npm run dev
```

Por padrao, o Vite abre em `http://localhost:5173`.

## Configuracao da API

Crie um arquivo `.env` na raiz do projeto quando precisar apontar para outra API:

```env
VITE_API_URL=http://localhost:8080
```

Se a variavel nao existir, o front usa `http://localhost:8080`.

## Como rodar o back-end

Este checkout nao contem o projeto Java/Quarkus (`pom.xml`, `src/main/java` ou Resources REST). No repositorio do back-end, use o comando equivalente:

```bash
mvn quarkus:dev
```

O Quarkus deve liberar CORS para o front local, por exemplo `http://localhost:5173`, e para a URL de producao.

## Endpoints consumidos

Autenticacao e portal:

- `POST /auth/register`
- `POST /auth/login`
- `GET /atendimentos`
- `GET /atendimentos/solicitados`
- `GET /atendimentos/voluntario/{voluntarioId}`
- `GET /usuarios`
- `GET /usuarios/{id}`
- `PUT /usuarios/{id}`
- `DELETE /usuarios/{id}`

Services administrativos ainda existentes:

- `GET /voluntarios`
- `GET /voluntarios/{id}`
- `POST /voluntarios`
- `PUT /voluntarios/{id}`
- `DELETE /voluntarios/{id}`
- `GET /especialidades`
- `GET /especialidades/{id}`

## Principais telas

- Home institucional
- Sobre
- FAQ
- Contato
- Integrantes
- Solucao
- Login
- Portal do Beneficiario
- Portal do Voluntario
- Painel do Voluntario
- Cadastro publico de voluntario

## Integrantes

- Alisson Kawan
- Marcos Vinicius
- Eduardo Boni

## Observacoes de integracao

- O projeto nao usa Axios.
- A camada HTTP fica em `src/services/apiClient.ts`.
- A URL base fica em `src/config/api.ts`.
- Cadastro de conta chama `POST /auth/register`.
- Login chama `POST /auth/login` e salva apenas o usuario retornado como sessao simples.
- Portal do voluntario chama `GET /atendimentos/solicitados` e `GET /atendimentos/voluntario/{voluntarioId}`.
- O botao "Assumir atendimento" esta preparado, mas aguarda o back-end expor um endpoint especifico.

Endpoint recomendado para assumir atendimento:

```http
PUT /atendimentos/{atendimentoId}/assumir
Content-Type: application/json

{
  "voluntarioId": 1
}
```

## Links

- GitHub: https://github.com/AlissonMarcoschalenge77
- Vercel: preencher com a URL do deploy
- YouTube: preencher com a URL do video
