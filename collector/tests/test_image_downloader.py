"""
Testes para o downloader de imagens de eventos.
"""
import os, tempfile, pytest
try:
    from collector.image_downloader import download_image
except ImportError:
    download_image = None

LG_URL = "https://images.sympla.com.br/6a42b6266af4f-lg.jpg"

@pytest.mark.skipif(download_image is None, reason="downloader nao implementado")
def test_download_lg_image():
    with tempfile.TemporaryDirectory() as tmp:
        path = download_image(LG_URL, tmp)
        assert os.path.isfile(path)
        assert os.path.getsize(path) > 1000  # imagem real tem > 1KB
