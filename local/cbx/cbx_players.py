import re
import requests
from fastapi import APIRouter, HTTPException, Query
from bs4 import BeautifulSoup
from typing import List, Optional
from utils import get_hidden_fields

router = APIRouter(prefix="/jogadores", tags=["jogadores"])

BASE_URL = "https://www.cbx.org.br"
URL      = f"{BASE_URL}/rating"

def scrape_jogadores(
    uf: str,
    max_pages: Optional[int] = None
) -> List[dict]:
    session = requests.Session()

    # GET inicial
    resp = session.get(URL)
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail="Erro ao acessar página de jogadores")
    soup = BeautifulSoup(resp.text, "html.parser")
    hidden = get_hidden_fields(soup)

    # Postback para filtrar por UF
    payload = {
        **hidden,
        "ctl00$ContentPlaceHolder1$cboUF": uf,
        "__EVENTTARGET":   "ctl00$ContentPlaceHolder1$cboUF",
        "__EVENTARGUMENT": "",
        "ctl00$ContentPlaceHolder1$btnBuscar": "Buscar"
    }
    resp = session.post(URL, data=payload)
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail="Erro no filtro de UF")
    soup = BeautifulSoup(resp.text, "html.parser")
    hidden = get_hidden_fields(soup)

    # Função interna para extrair números de página
    def extract_pages(soup):
        pages = set()
        for a in soup.find_all("a", href=True):
            m = re.search(r"Page\$(\d+)", a["href"])
            if m:
                pages.add(int(m.group(1)))
        return pages

    # Descobre páginas a visitar (inclui a 1)
    pages_to_visit = sorted(extract_pages(soup) | {1})
    if max_pages:
        pages_to_visit = [p for p in pages_to_visit if p <= max_pages]

    visited = set()
    jogadores = []

    while pages_to_visit:
        page = pages_to_visit.pop(0)
        if page in visited:
            continue
        visited.add(page)

        # Postback de paginação
        if page > 1:
            post = {
                **hidden,
                "__EVENTTARGET":   "ctl00$ContentPlaceHolder1$gdvMain",
                "__EVENTARGUMENT": f"Page${page}",
            }
            resp = session.post(URL, data=post)
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail=f"Erro na página {page}")
            soup = BeautifulSoup(resp.text, "html.parser")
            hidden = get_hidden_fields(soup)

        # Extrai a tabela de jogadores
        table = soup.find("table", class_="grid")
        if not table:
            continue

        rows = table.find_all("tr", recursive=False)
        headers = [th.get_text(strip=True) for th in rows[0].find_all("th")]

        # Para cada linha de dados
        for row in rows[1:]:
            if "grid-pager" in row.get("class", []):
                continue
            cells = row.find_all("td")
            if not cells:
                continue
            vals = [td.get_text(strip=True) for td in cells]
            rec = dict(zip(headers, vals))

            # Adiciona link do jogador
            cbx_id = rec.get("ID CBX", "")
            rec["link"] = f"{BASE_URL}/jogador/{cbx_id}" if cbx_id else ""
            jogadores.append(rec)

        # Se não limitamos, agenda novas páginas
        if not max_pages:
            novas = extract_pages(soup)
            for p in sorted(novas):
                if p not in visited and p not in pages_to_visit:
                    pages_to_visit.append(p)

    return jogadores

@router.get("", response_model=List[dict])
def get_jogadores(
    uf: str = Query("SP", min_length=2, max_length=2, description="Sigla da UF (ex: SP, RJ)"),
    paginas: Optional[int] = Query(None, ge=1, description="Número máximo de páginas a raspar")
):
    """
    Retorna lista de jogadores da CBX filtrados por UF.
    - **uf**: sigla do estado (2 caracteres)
    - **paginas**: opcional, limita quantas páginas serão raspadas
    """
    return scrape_jogadores(uf=uf, max_pages=paginas)
