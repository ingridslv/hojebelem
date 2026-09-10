# Testes do Coletor Sympla

Testes pytest do coletor. Rode com:

```bash
cd /opt/hojebelem
python3 -m pytest collector/tests/ -v
```

## Arquivos

| Arquivo | Cobre |
|---|---|
| `test_sympla_parser.py` | Parser do payload Flight (usa `fixtures/sympla_belem_p1.html`) |
| `test_sympla_bff.py` | APIs BFF reais (organizer + tickets) — precisa de internet |
| `test_normalizer.py` | Normalizacao para o schema Event |
| `test_classifier.py` | Classificador por palavras-chave |
| `test_db_upsert.py` | Upsert no Postgres — precisa de `DATABASE_URL` |
| `test_image_downloader.py` | Download de imagem (modulo postergado) |

## Requisitos

- `pytest` instalado (`pip install pytest`)
- Para `test_db_upsert.py`: banco local com seed (export `DATABASE_URL`)
- Para `test_sympla_bff.py`: acesso a internet

## Dados de teste

O `fixtures/sympla_belem_p1.html` e um snapshot real da pagina de listagem da
Sympla (baixado em 18/08/2026). Se o formato do payload Flight mudar, o teste
`test_parse_extracts_12_events` falha — sinal de que o parser precisa de ajuste.
