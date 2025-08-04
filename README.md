# Chess Tournaments API 🏆

Bem-vindo à **Chess Tournaments API**! Uma API moderna e robusta para consulta de informações sobre xadrez da Confederação Brasileira de Xadrez (CBX).

> **Nota**: Este é um projeto pessoal e não possui ligação oficial com a CBX.

## 🚀 Funcionalidades

### ✅ Disponíveis
- **Torneios CBX** - Lista torneios por ano e mês
- **Jogadores CBX** - Consulta jogadores por estado
- **Notícias CBX** - Últimas notícias do site oficial
- **Comunicados CBX** - Comunicados oficiais da federação
- **Cache inteligente** - Sistema de cache para melhor performance
- **Rate limiting** - Proteção contra spam e sobrecarga
- **Logging avançado** - Logs detalhados para debugging
- **CORS habilitado** - Acesso de qualquer origem
- **Documentação automática** - Swagger UI e ReDoc

### 🔄 Em desenvolvimento
- **FIDE Tournaments** - Torneios internacionais
- **USCF Integration** - Federação americana
- **Chess-results.com** - Maior base de torneios mundial

## 📋 Endpoints

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/` | GET | Informações da API |
| `/health` | GET | Status da aplicação |
| `/tournaments` | GET | Lista torneios CBX |
| `/jogadores` | GET | Lista jogadores por UF |
| `/noticias` | GET | Últimas notícias |
| `/comunicados` | GET | Comunicados oficiais |
| `/cache/stats` | GET | Estatísticas do cache |
| `/cache/clear` | DELETE | Limpa o cache |
| `/docs` | GET | Documentação Swagger |
| `/redoc` | GET | Documentação ReDoc |

## 🛠️ Tecnologias

- **FastAPI** - Framework web moderno e rápido
- **Python 3.8+** - Linguagem principal
- **BeautifulSoup4** - Web scraping
- **Uvicorn** - Servidor ASGI
- **Requests** - Cliente HTTP
- **Jinja2** - Cliente Python

## 🏃‍♂️ Como executar

### Pré-requisitos
- Python 3.8 ou superior
- pip (gerenciador de pacotes)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd Chess-Tournaments-API-main
   ```

2. **Instale as dependências**
   ```bash
   pip install -r requirements.txt
   ```

3. **Execute a API**
   ```bash
   python main.py
   ```
   
   Ou usando uvicorn diretamente:
   ```bash
   python -m uvicorn main:app --reload
   ```

### 🌐 Acesso

Após iniciar, a API estará disponível em:

- **API**: https://chess-tournaments-api-1.onrender.com
- **Documentação**: https://chess-tournaments-api-1.onrender.com/docs
- **ReDoc**: https://chess-tournaments-api-1.onrender.com/redoc

## 📖 Exemplos de uso

### Buscar torneios de 2025
```bash
curl "https://chess-tournaments-api-1.onrender.com/tournaments?federation=cbx&year=2025&month=1&limit=5"
```

### Buscar jogadores de São Paulo
```bash
curl "https://chess-tournaments-api-1.onrender.com/jogadores?uf=SP&paginas=1"
```

### Últimas notícias
```bash
curl "https://chess-tournaments-api-1.onrender.com/noticias?paginas=1"
```

## ⚙️ Configurações

A API suporta configuração via variáveis de ambiente:

- `DEBUG` - Modo debug (true/false)
- `RATE_LIMIT_REQUESTS` - Limite de requisições por minuto
- `CACHE_TTL_DEFAULT` - TTL padrão do cache em segundos
- `HTTP_TIMEOUT` - Timeout para requisições HTTP
- `LOG_LEVEL` - Nível de log (DEBUG, INFO, WARNING, ERROR)

## 📊 Recursos avançados

### Cache
- Sistema de cache em memória
- TTL configurável por endpoint
- Endpoint para monitoramento: `/cache/stats`

### Rate Limiting
- 100 requisições por minuto por IP (configurável)
- Headers informativos: `X-RateLimit-*`
- Resposta 429 quando limite excedido

### Logging
- Logs estruturados
- Arquivo de log: `chess_api.log`
- Diferentes níveis de verbosidade

## 🏗️ Arquitetura futura

```
CHESS TOURNAMENTS API
├── international/
│   ├── fide/           # Torneios FIDE
│   └── chess-results/  # Chess-results.com
├── local/
│   ├── brazil/
│   │   └── cbx/        # ✅ Implementado
│   └── united_states/
│       └── uscf/       # 🔄 Planejado
└── features/
    ├── analytics/      # 📊 Análises
    ├── notifications/  # 🔔 Alertas
    └── export/         # 📤 Exportação
```

## 🤝 Contribuição

Contribuições são bem-vindas! Este projeto visa se tornar a maior API de torneios de xadrez do mundo.

### Como contribuir:
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença Apache 2.0. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🚧 Status do projeto

**Versão atual**: 1.0.2  
**Progresso**: ~35% concluído  
**Próxima milestone**: Integração FIDE

---

Feito com ☕ e muito ❤️ para a comunidade brasileira de xadrez!
