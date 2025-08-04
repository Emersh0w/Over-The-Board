// Configuração da API
const API_BASE_URL = 'https://chess-tournaments-api-1.onrender.com';

// Estado da aplicação
let currentSection = 'home';
let apiData = {};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateClock();
    checkApiHealth();
    getCacheStats();
});

// Inicialização da aplicação
function initializeApp() {
    showSection('home');
    updateClock();
    setInterval(updateClock, 1000);
}

// Event Listeners
function setupEventListeners() {
    // Navegação
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const section = e.currentTarget.dataset.section;
            showSection(section);
        });
    });

    // Enter key nos inputs
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const activeSection = document.querySelector('.section.active');
            if (activeSection) {
                const sectionId = activeSection.id;
                switch(sectionId) {
                    case 'tournaments':
                        searchTournaments();
                        break;
                    case 'players':
                        searchPlayers();
                        break;
                    case 'news':
                        searchNews();
                        break;
                    case 'announcements':
                        searchAnnouncements();
                        break;
                }
            }
        }
    });
}

// Navegação entre seções
function showSection(sectionName) {
    // Remove classe active de todas as seções
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove classe active de todos os botões de navegação
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Adiciona classe active na seção atual
    document.getElementById(sectionName).classList.add('active');
    
    // Adiciona classe active no botão correspondente
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    // Fechar menu mobile se estiver aberto
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
            toggle: false
        });
        bsCollapse.hide();
    }
    
    currentSection = sectionName;
}

// Utilitários
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('currentTime').textContent = timeString;
}

function showLoading() {
    document.getElementById('loadingOverlay').classList.add('show');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('show');
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remove o toast após 5 segundos
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

function getToastIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// API Calls
async function makeApiCall(endpoint, params = {}) {
    try {
        const url = new URL(`${API_BASE_URL}${endpoint}`);
        Object.keys(params).forEach(key => {
            if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
                url.searchParams.append(key, params[key]);
            }
        });

        console.log('Making API call to:', url.toString());
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Atualiza o painel admin com a resposta
        document.getElementById('apiResponse').textContent = JSON.stringify(data, null, 2);
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        document.getElementById('apiResponse').textContent = `Erro: ${error.message}`;
        throw error;
    }
}

// Health Check
async function checkApiHealth() {
    try {
        const health = await makeApiCall('/health');
        document.getElementById('apiStatus').textContent = 'Online';
        document.getElementById('healthStatus').innerHTML = `
            <span class="status-dot healthy"></span>
            <span class="status-text">API Online</span>
        `;
        showToast('API está funcionando corretamente', 'success');
    } catch (error) {
        document.getElementById('apiStatus').textContent = 'Offline';
        document.getElementById('healthStatus').innerHTML = `
            <span class="status-dot error"></span>
            <span class="status-text">API Offline</span>
        `;
        showToast('Erro ao conectar com a API', 'error');
    }
}

// Cache Stats
async function getCacheStats() {
    try {
        const stats = await makeApiCall('/cache/stats');
        const cacheSize = stats.cache_size || 0;
        document.getElementById('cacheSize').textContent = cacheSize;
        document.getElementById('adminCacheSize').textContent = cacheSize;
    } catch (error) {
        document.getElementById('cacheSize').textContent = 'Error';
        document.getElementById('adminCacheSize').textContent = 'Error';
    }
}

// Clear Cache
async function clearCache() {
    if (!confirm('Tem certeza que deseja limpar o cache?')) {
        return;
    }
    
    try {
        showLoading();
        await fetch(`${API_BASE_URL}/cache/clear`, { method: 'DELETE' });
        await getCacheStats();
        showToast('Cache limpo com sucesso', 'success');
    } catch (error) {
        showToast('Erro ao limpar cache', 'error');
    } finally {
        hideLoading();
    }
}

// Search Functions
async function searchTournaments() {
    const year = document.getElementById('tournamentYear').value;
    const month = document.getElementById('tournamentMonth').value;
    const limit = document.getElementById('tournamentLimit').value;
    
    try {
        showLoading();
        const tournaments = await makeApiCall('/tournaments', {
            federation: 'cbx',
            year: year,
            month: month,
            limit: limit
        });
        
        displayTournaments(tournaments);
        showToast(`${tournaments.length} torneios encontrados`, 'success');
    } catch (error) {
        showToast('Erro ao buscar torneios', 'error');
        document.getElementById('tournamentsResults').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erro ao carregar torneios: ${error.message}</p>
            </div>
        `;
    } finally {
        hideLoading();
    }
}

async function searchPlayers() {
    const uf = document.getElementById('playerUF').value;
    const pages = document.getElementById('playerPages').value;
    
    try {
        showLoading();
        const players = await makeApiCall('/jogadores', {
            uf: uf,
            paginas: pages
        });
        
        displayPlayers(players);
        showToast(`${players.length} jogadores encontrados`, 'success');
    } catch (error) {
        showToast('Erro ao buscar jogadores', 'error');
        document.getElementById('playersResults').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erro ao carregar jogadores: ${error.message}</p>
            </div>
        `;
    } finally {
        hideLoading();
    }
}

async function searchNews() {
    const pages = document.getElementById('newsPages').value;
    
    try {
        showLoading();
        const news = await makeApiCall('/noticias', {
            paginas: pages
        });
        
        displayNews(news);
        showToast(`${news.length} notícias encontradas`, 'success');
    } catch (error) {
        showToast('Erro ao buscar notícias', 'error');
        document.getElementById('newsResults').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erro ao carregar notícias: ${error.message}</p>
            </div>
        `;
    } finally {
        hideLoading();
    }
}

async function searchAnnouncements() {
    const pages = document.getElementById('announcementPages').value;
    
    try {
        showLoading();
        const announcements = await makeApiCall('/comunicados', {
            paginas: pages
        });
        
        displayAnnouncements(announcements);
        showToast(`${announcements.length} comunicados encontrados`, 'success');
    } catch (error) {
        showToast('Erro ao buscar comunicados', 'error');
        document.getElementById('announcementsResults').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erro ao carregar comunicados: ${error.message}</p>
            </div>
        `;
    } finally {
        hideLoading();
    }
}

// Display Functions
function displayTournaments(tournaments) {
    const container = document.getElementById('tournamentsResults');
    
    if (!tournaments || tournaments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-trophy"></i>
                <p>Nenhum torneio encontrado</p>
            </div>
        `;
        return;
    }
    
    const cardsHTML = tournaments.map(tournament => `
        <div class="card tournament-card">
            <div class="card-header">
                <div class="card-title">${tournament.name || 'Nome não disponível'}</div>
                <div class="tournament-meta">
                    ${tournament.id ? `<span class="tournament-badge">ID: ${tournament.id}</span>` : ''}
                    ${tournament.status ? `<span class="tournament-badge status">${tournament.status}</span>` : ''}
                </div>
            </div>
            <div class="card-body">
                <div class="tournament-details">
                    ${tournament.period ? `<p><strong>Período:</strong> ${tournament.period}</p>` : ''}
                    ${tournament.location ? `<p><strong>Local:</strong> ${tournament.location}</p>` : ''}
                    ${tournament.organizer ? `<p><strong>Organizador:</strong> ${tournament.organizer}</p>` : ''}
                    ${tournament.time_control ? `<p><strong>Ritmo:</strong> ${tournament.time_control}</p>` : ''}
                    ${tournament.total_players ? `<p><strong>Total de Jogadores:</strong> ${tournament.total_players}</p>` : ''}
                    ${tournament.fide_players ? `<p><strong>Jogadores FIDE:</strong> ${tournament.fide_players}</p>` : ''}
                    ${tournament.rating ? `<p><strong>Rating:</strong> ${tournament.rating}</p>` : ''}
                    ${tournament.observation ? `<p><strong>Observações:</strong> ${tournament.observation}</p>` : ''}
                    ${tournament.regulation_link && tournament.regulation_link !== 'https://www.cbx.org.br' ? 
                        `<p><a href="${tournament.regulation_link}" target="_blank" class="news-link">Ver Regulamento</a></p>` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = `<div class="card-grid">${cardsHTML}</div>`;
}

function displayPlayers(players) {
    const container = document.getElementById('playersResults');
    
    if (!players || players.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <p>Nenhum jogador encontrado</p>
            </div>
        `;
        return;
    }
    
    const cardsHTML = players.map(player => `
        <div class="card player-card">
            <div class="card-header">
                <div class="card-title">${player.Nome || 'Nome não disponível'}</div>
                ${player['Rating CBX'] ? `<div class="player-rating">${player['Rating CBX']}</div>` : ''}
            </div>
            <div class="card-body">
                <div class="player-details">
                    ${player['ID CBX'] ? `<p><strong>ID CBX:</strong> ${player['ID CBX']}</p>` : ''}
                    ${player['Rating FIDE'] ? `<p><strong>Rating FIDE:</strong> ${player['Rating FIDE']}</p>` : ''}
                    ${player.UF ? `<p><strong>UF:</strong> ${player.UF}</p>` : ''}
                    ${player.Cidade ? `<p><strong>Cidade:</strong> ${player.Cidade}</p>` : ''}
                    ${player.link && player.link !== 'https://www.cbx.org.br/jogador/' ? 
                        `<p><a href="${player.link}" target="_blank" class="news-link">Ver Perfil</a></p>` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = `<div class="card-grid">${cardsHTML}</div>`;
}

function displayNews(news) {
    const container = document.getElementById('newsResults');
    
    if (!news || news.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-newspaper"></i>
                <p>Nenhuma notícia encontrada</p>
            </div>
        `;
        return;
    }
    
    const cardsHTML = news.map(item => `
        <div class="card news-card">
            <div class="card-header">
                <div class="card-title">${item.titulo || 'Título não disponível'}</div>
                ${item.data ? `<div class="news-date">${item.data}</div>` : ''}
            </div>
            <div class="card-body">
                ${item.link ? `<a href="${item.link}" target="_blank" class="news-link">Ler notícia completa</a>` : ''}
            </div>
        </div>
    `).join('');
    
    container.innerHTML = `<div class="card-grid">${cardsHTML}</div>`;
}

function displayAnnouncements(announcements) {
    const container = document.getElementById('announcementsResults');
    
    if (!announcements || announcements.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bullhorn"></i>
                <p>Nenhum comunicado encontrado</p>
            </div>
        `;
        return;
    }
    
    const cardsHTML = announcements.map(item => `
        <div class="card announcement-card">
            <div class="card-header">
                <div class="card-title">${item.titulo || 'Título não disponível'}</div>
                ${item.data ? `<div class="announcement-date">${item.data}</div>` : ''}
            </div>
            <div class="card-body">
                ${item.link ? `<a href="${item.link}" target="_blank" class="announcement-link">Ler comunicado completo</a>` : ''}
            </div>
        </div>
    `).join('');
    
    container.innerHTML = `<div class="card-grid">${cardsHTML}</div>`;
}

// Admin Functions
async function checkHealth() {
    await checkApiHealth();
}

// Refresh cache stats periodically
setInterval(getCacheStats, 30000); // A cada 30 segundos

// Auto-refresh API status
setInterval(checkApiHealth, 60000); // A cada 1 minuto


