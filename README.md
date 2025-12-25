# Hive Management Backend 🐝

Backend da plataforma **Colmeia Digital**, responsável pelo processamento, armazenamento e disponibilização dos dados coletados pelos nós sensores embarcados, bem como pelo gerenciamento de usuários, apiários, colmeias, manejos, colheitas, alertas e autenticação.

Este repositório representa a **camada de aplicação e serviços**, atuando como elo central entre o firmware embarcado e as interfaces de visualização e gerenciamento.

---

## 📌 Visão Geral

O backend foi desenvolvido utilizando **Node.js** com o framework **NestJS**, adotando uma arquitetura modular e escalável. A aplicação segue princípios de separação de responsabilidades, injeção de dependências e padronização de APIs REST, além de integrar comunicação assíncrona via **MQTT** para ingestão de dados em tempo real provenientes das colmeias.

Entre suas principais responsabilidades estão:

- Receber e persistir leituras de sensores
- Processar regras de negócio e estados das colmeias
- Detectar condições críticas automaticamente
- Gerenciar entidades do domínio da apicultura
- Disponibilizar dados para dashboards e aplicações cliente

---

## 🧰 Tecnologias Utilizadas

- Node.js
- NestJS
- TypeScript
- Eclipse Mosquitto (Broker MQTT)
- JWT
- PostgreSQL com extensão **TimescaleDB** + TypeORM
- Swagger (documentação da API)
- Docker e Docker Compose
- Nginx (produção)
- GitHub Actions (CI/CD)
- DigitalOcean (Deploy)

---

## 🧱 Arquitetura Geral

O backend atua como núcleo do sistema, integrando os seguintes componentes:

- **Firmware (ESP32)** → Publicação de dados via MQTT
- **Broker MQTT** → Transporte assíncrono das leituras
- **Backend NestJS** → Processamento, persistência e regras de negócio
- **Banco de Dados** → Armazenamento histórico e relacional
- **Frontend / Dashboards** → Consumo via API REST

---

## 🔐 Autenticação e Autorização

O sistema implementa autenticação baseada em **JWT (JSON Web Token)**, com suporte a:

- Login e logout
- Refresh token
- Proteção de rotas
- Identificação do usuário autenticado via decorator

### Endpoints de Autenticação

- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `GET /auth/profile`

---

## 👤 Usuários

Gerenciamento de usuários da plataforma.

### Endpoints

- `POST /users` — Criação de novo usuário

---

## 🐝 Apiários

Entidade responsável por agrupar colmeias em um mesmo local físico.

### Funcionalidades

- CRUD completo de apiários
- Associação de colmeias

---

## 🏠 Colmeias (Hives)

Representam as colmeias monitoradas individualmente pelo sistema.

### Funcionalidades

- Cadastro e atualização de colmeias
- Associação a apiários
- Controle de status (ativa, offline)
- Registro da última leitura recebida

### Endpoints

- `POST /hives`
- `GET /hives/:id`
- `GET /hives/apiary/:apiaryId`
- `PUT /hives/:id`
- `DELETE /hives/:id`

---

## 📊 Leituras de Sensores

Responsável por armazenar e disponibilizar os dados enviados pelo firmware.

### Funcionalidades

- Armazenamento de leituras históricas
- Consulta da última leitura
- Geração de séries temporais para gráficos
- Exportação de dados

### Endpoints

- `GET /sensor-readings/:hiveId/latest`
- `GET /sensor-readings/:hiveId/history`
- `GET /sensor-readings/:hiveId/history/export`

---

## 📡 Integração MQTT

O backend mantém um cliente MQTT ativo para receber dados publicados pelas colmeias.

### Responsabilidades do Serviço MQTT

- Conexão automática ao broker
- Subscrição aos tópicos das colmeias
- Processamento do payload JSON
- Persistência das leituras no banco de dados
- Geração de alertas automáticos

---

## ⚠️ Alertas

O sistema de alertas notifica o usuário sobre condições críticas detectadas automaticamente.

### Tipos de Alertas

- Colmeia offline
- Condições ambientais anormais
- Perda significativa de peso

### Endpoints

- `GET /alerts`
- `PUT /alerts/:id`

---

## ⏱️ Tarefas Agendadas (Cron Jobs)

O backend executa tarefas periódicas para garantir a integridade do sistema.

### Verificação de Colmeias Offline

Uma tarefa automática verifica colmeias que não reportam dados dentro de um intervalo configurado e:

- Atualiza o status da colmeia para **OFFLINE**
- Registra um alerta crítico
- Mantém o histórico do evento

---

## 🛠️ Manejos

Registro de intervenções realizadas pelo apicultor na colmeia.

### Funcionalidades

- Criação, edição e remoção de manejos
- Associação a colmeias
- Paginação e consulta histórica

### Endpoints

- `POST /managements`
- `GET /managements/:id`
- `GET /managements/hive/:hiveId`
- `PUT /managements/:id`
- `DELETE /managements/:id`

---

## 🍯 Colheitas

Registro das colheitas realizadas nos apiários.

### Funcionalidades

- Controle histórico de colheitas
- Associação ao apiário e usuário
- Atualização e remoção

### Endpoints

- `POST /harvests`
- `GET /harvests/:id`
- `GET /harvests/apiary/:apiaryId`
- `PUT /harvests/:id`
- `DELETE /harvests/:id`

---

## 📈 Dashboard

Fornece dados consolidados para visualização gerencial.

### Funcionalidades

- Estatísticas gerais do sistema
- Indicadores de produtividade
- Status das colmeias

### Endpoint

- `GET /dashboard/stats`

---

## 🏗️ Docker Multi-Stage Build

O projeto utiliza **Docker multi-stage** para otimizar imagens:

### Estágios

1. **Base**
   - Instala dependências
2. **Development**
   - Hot reload
   - Código completo
3. **Build**
   - Compila TypeScript → JavaScript
4. **Production**
   - Apenas dependências de produção
   - Código compilado (`dist/`)

### Benefícios

- Imagem final menor
- Menor superfície de ataque
- Builds mais rápidos
- Separação clara de ambientes

---

## 🌐 Produção e Deploy

### Arquitetura em Produção

```
Internet
   |
 Nginx (80)
   |
 Backend NestJS (3000)
   |
 PostgreSQL + MQTT
```

---

### Deploy Automatizado (CI/CD)

O deploy é feito via **GitHub Actions**, acionado a cada push na branch `main`.

#### Pipeline (`deploy.yml`)

1. Checkout do código
2. SCP para servidor (DigitalOcean)
3. Criação do `.env` via Secrets
4. Criação automática de usuários MQTT
5. Build e subida dos containers
6. Limpeza de imagens antigas

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

---


## 🏫 Contexto Acadêmico

Este backend integra um sistema completo de IoT desenvolvido como parte de um **Trabalho de Conclusão de Curso em Engenharia de Computação**, cujo objetivo é oferecer uma solução escalável, de baixo custo e eficiente para o monitoramento remoto de colmeias na apicultura racional.
