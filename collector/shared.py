"""Constantes compartilhadas pelo coletor Sympla."""
import os

# User-Agent para requisicoes a Sympla (configuravel via env)
HEADERS = {
    "User-Agent": os.environ.get(
        "SYMPLA_USER_AGENT",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/126.0.0.0 Safari/537.36",
    )
}

# Timeouts HTTP (segundos), configuraveis via env
HTTP_TIMEOUT = int(os.environ.get("COLLECTOR_HTTP_TIMEOUT", "30"))
BFF_TIMEOUT = int(os.environ.get("COLLECTOR_BFF_TIMEOUT", "15"))
