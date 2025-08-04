"""
Servidor simples para servir o frontend da Chess Tournaments API
"""
import http.server
import socketserver
import os
import webbrowser
from threading import Timer
from config import settings

# Configurações
PORT = 3000

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Handler HTTP com suporte a CORS"""
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

def open_browser():
    """Abre o navegador automaticamente"""
    webbrowser.open(f'{settings.LOCAL_URL}:{PORT}')

def start_server():
    """Inicia o servidor frontend"""
    
    # Muda para o diretório do frontend
    if os.path.exists(settings.FRONTEND_DIR):
        os.chdir(settings.FRONTEND_DIR)
    else:
        print(f"❌ Diretório '{settings.FRONTEND_DIR}' não encontrado!")
        return
    
    # Configura o servidor
    handler = CORSHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", PORT), handler) as httpd:
            print("🚀 Chess Tournaments Frontend Server")
            print("=" * 50)
            print(f"📂 Servindo arquivos de: {os.getcwd()}")
            
            if settings.IS_RENDER == True:
                print(f"🌐 URL: {settings.RENDER_URL}")
                print(f"📊 API: {settings.RENDER_URL}")
            else:
                print(f"🌐 URL: {settings.LOCAL_URL}:{PORT}")
                print(f"📊 API: {settings.LOCAL_URL}")               
            print("=" * 50)
            print("💡 Dicas:")
            if not settings.IS_RENDER:
                print("   - Certifique-se que a API esteja rodando na porta 8000")
                print("   - Pressione Ctrl+C para parar o servidor")
            print("=" * 50)
            
            # Abre o navegador após 2 segundos
            Timer(2.0, open_browser).start()
            
            # Inicia o servidor
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n👋 Servidor frontend encerrado!")
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"❌ Porta {PORT} já está em uso!")
            print("💡 Tente usar uma porta diferente ou encerre o processo que está usando a porta.")
        else:
            print(f"❌ Erro ao iniciar servidor: {e}")

if __name__ == "__main__":
    start_server()
