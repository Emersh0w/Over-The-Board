import importlib
from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List

router = APIRouter(prefix="/tournaments", tags=["tournaments"])

# Mapeie as federações ao módulo e à função fetch
FEDERATIONS = {
    "cbx": ("local.cbx.cbx_tournaments", "get_tournaments"),
}

@router.get("", response_model=List[dict])
def get_tournaments(
    federation: Optional[str] = Query(
        None, description="Sigla da federação (cbx, fide, uscf…). Se omitido, agrega todas."
    ),
    year: str = Query(..., min_length=4, max_length=4, description="Ano, ex: 2025"),
    month: str = Query("", max_length=2, description="Mês (1–12) ou vazio para “Todos”"),
    limit: int = Query(1, ge=1, description="Máximo de torneios a retornar")
):
    results: List[dict] = []

    def call_fetch(module_path, func_name):
        mod = importlib.import_module(module_path)
        func = getattr(mod, func_name)
        return func(year, month, limit)

    if federation:
        key = federation.lower()
        if key not in FEDERATIONS:
            raise HTTPException(status_code=404, detail=f"Federação '{federation}' não suportada.")
        module_path, func_name = FEDERATIONS[key]
        results = call_fetch(module_path, func_name)
    else:
        # agrega de todas as federações
        for module_path, func_name in FEDERATIONS.values():
            try:
                fetched = call_fetch(module_path, func_name)
                results.extend(fetched)
            except Exception:
                # se algum scraping falhar, ignora e continua
                continue
        # garante que não ultrapasse limit no total
        results = results[:limit]

    return results
