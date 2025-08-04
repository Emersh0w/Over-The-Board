# 🎯 Chess Tournaments API - Frontend Demo

Este diretório contém um **frontend moderno e elegante** para a Chess Tournaments API.

## 🚀 Como executar

### Opção 1: Servidor Python (Recomendado)
```bash
# Na pasta raiz do projeto
python serve_frontend.py
```

### Opção 2: Servidor HTTP simples
```bash
# Navegue até a pasta frontend
cd frontend

# Python 3
python -m http.server 3000

# Ou Python 2
python -m SimpleHTTPServer 3000
```

### Opção 3: Live Server (VS Code)
1. Instale a extensão "Live Server" no VS Code
2. Abra o arquivo `frontend/index.html`
3. Clique em "Go Live" no canto inferior direito

## 🌐 Acessos

- **Frontend**: https://chess-tournaments-api-1.onrender.com ou http://localhost:3000
- **API**: https://chess-tournaments-api-1.onrender.com ou http://localhost:8000
- **Docs**: https://chess-tournaments-api-1.onrender.com/docs ou http://localhost:8000/docs

## ✨ Funcionalidades

### 🏠 Dashboard Principal
- Status da API em tempo real
- Estatísticas do cache
- Links rápidos para documentação
- Relógio em tempo real

### 🏆 Torneios
- Busca por ano e mês
- Filtros avançados
- Cards informativos com todos os dados
- Links para regulamentos

### 👥 Jogadores
- Busca por estado (UF)
- Informações completas do jogador
- Ratings CBX e FIDE
- Links para perfis

### 📰 Notícias
- Últimas notícias da CBX
- Data de publicação
- Links para matérias completas

### 📢 Comunicados
- Comunicados oficiais
- Ordenação por data
- Acesso direto aos documentos

### ⚙️ Administração
- Health check da API
- Estatísticas do cache
- Limpar cache
- Logs de requisições em tempo real
- Links úteis para documentação

## 🎨 Design

### Características
- **Responsivo** - Funciona em desktop, tablet e mobile
- **Moderno** - Design clean e profissional
- **Acessível** - Cores contrastantes e fontes legíveis
- **Interativo** - Feedback visual e notificações toast

### Tecnologias
- **HTML5** semântico
- **CSS3** com variáveis customizadas
- **JavaScript ES6+** vanilla
- **Font Awesome** para ícones
- **Google Fonts** (Inter) para tipografia

### Paleta de Cores
- Primary: `#2563eb` (Azul)
- Secondary: `#64748b` (Cinza)
- Success: `#10b981` (Verde)
- Warning: `#f59e0b` (Amarelo)
- Danger: `#ef4444` (Vermelho)

## 📱 Responsividade

O frontend é totalmente responsivo e se adapta a diferentes tamanhos de tela:

- **Desktop** (1200px+): Layout completo com sidebar
- **Tablet** (768px-1199px): Layout adaptado
- **Mobile** (até 767px): Layout empilhado e menu colapsado

## 🔧 Customização

### Alterar cores
Edite as variáveis CSS no arquivo `styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #64748b;
    /* ... outras variáveis */
}
```

### Alterar URL da API
Edite a constante no arquivo `script.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000';
```

## 🚀 Deploy

### Para produção:
1. Altere a URL da API no `script.js`
2. Otimize CSS e JS (minificação)
3. Configure HTTPS
4. Use um servidor web como Nginx ou Apache

### Exemplo Nginx:
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    
    location / {
        root /path/to/frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📋 Recursos Implementados

- ✅ Dashboard com estatísticas
- ✅ Busca de torneios com filtros
- ✅ Lista de jogadores por UF
- ✅ Notícias da CBX
- ✅ Comunicados oficiais
- ✅ Painel administrativo
- ✅ Cache management
- ✅ Health monitoring
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive design
- ✅ Accessibility features

## 🔮 Recursos Futuros

- 🔄 Busca em tempo real
- 🔄 Favoritos e bookmarks
- 🔄 Exportação de dados
- 🔄 Modo escuro/claro
- 🔄 PWA (Progressive Web App)
- 🔄 Offline support
- 🔄 Gráficos e estatísticas
- 🔄 Notificações push

---

**Desenvolvido com ❤️ para a comunidade brasileira de xadrez!**
