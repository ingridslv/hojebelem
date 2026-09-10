"""
Classificador de eventos por palavras-chave.

Classifica cada evento em uma categoria e (opcionalmente) subcategoria
baseado no nome do evento e organizador. Adaptado do repo de referencia
ezequielfb/Web-Scraper-Eventos (simplificado para as categorias do site).
"""
import re


# Categorias: nome -> lista de palavras-chave
CATEGORIES = {
    "Musica": ["show", "festival", "banda", "cantor", "tributo", "turnê",
               "rock", "sertanejo", "samba", "pagode", "eletrônica", "dj",
               "mpb", "funk", "gospel", "reggae", "forró", "jazz", "blues",
               "concerto", "orquestra", "micareta", "carnaval", "balada"],
    "Teatro": ["teatro", "peça", "stand-up", "comédia", "drama",
               "monólogo", "musical", "palco", "humor", "performance"],
    "Esporte": ["esporte", "corrida", "maratona", "futebol", "campeonato",
                "crossfit", "jiu-jitsu", "luta", "mma"],
    "Gastronomia": ["gastronomia", "comida", "chef", "degustação",
                    "restaurante", "vinho", "cerveja", "churrasco", "bar",
                    "food", "barbecue", "bbq"],
    "Feira": ["feira", "exposição", "expo", "mostra", "artesanato",
              "negócios", "mercado", "design", "arte", "fotografia",
              "quadrinhos", "games", "geek", "livros", "automóveis"],
    "Infantil": ["infantil", "criança", "kids", "infância", "família",
                 "bonecos", "mágica"],
    "Palestra": ["palestra", "curso", "workshop", "webinar", "conferência",
                 "treinamento", "seminário", "aulão", "congresso",
                 "encontro", "imersão", "mentoria"],
    "Festa": ["festa", "balada", "noite", "reveillon", "open bar",
              "open bar", "after", "pool party", "sunset"],
}


def classify_event(title: str, organizer_name: str = None) -> str:
    """Classifica um evento baseado em palavras-chave no titulo.

    Args:
        title: nome do evento
        organizer_name: nome do organizador (opcional, melhora acerto)

    Returns:
        nome da categoria — ex: "Musica" ou "Outros"
    """
    text = (title + " " + (organizer_name or "")).lower()
    # remove pontuacao para casamento mais limpo
    text = re.sub(r"[^\w\s]", " ", text)

    for category, keywords in CATEGORIES.items():
        for kw in keywords:
            if kw in text:
                return category
    return "Outros"
