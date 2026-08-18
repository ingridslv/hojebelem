"""
Downloader de imagens de eventos da Sympla.

Baixa a imagem de capa (tamanho 'lg') e salva localmente no diretorio de
uploads. O site hojebelem serve arquivos estaticos de public/uploads/.
"""
import os
import requests

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/126.0.0.0 Safari/537.36"
}


def download_image(url: str, dest_dir: str) -> str:
    """Baixa uma imagem da Sympla e salva no diretorio de destino.

    Args:
        url: URL da imagem (ex: ...-lg.jpg)
        dest_dir: diretorio onde salvar (deve existir)

    Returns:
        caminho absoluto do arquivo salvo, ou string vazia se falhar
    """
    if not url:
        return ""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
    except requests.RequestException:
        return ""

    # nome do arquivo baseado no hash da Sympla
    filename = os.path.basename(url)
    if not filename:
        return ""
    dest = os.path.join(dest_dir, filename)
    with open(dest, "wb") as f:
        f.write(resp.content)
    return dest
