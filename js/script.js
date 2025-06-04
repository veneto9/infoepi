// Função para alternar o menu mobile
document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector("nav");

    if (navToggle && nav) {
        navToggle.addEventListener("click", () => {
            nav.classList.toggle("active");
        });
    }

    // Fechar o menu ao clicar fora
    document.addEventListener("click", (event) => {
        if (
            nav &&
            nav.classList.contains("active") &&
            !event.target.closest("nav") &&
            !event.target.closest(".nav-toggle")
        ) {
            nav.classList.remove("active");
        }
    });
});

// Função para ativar/desativar dropdowns no mobile
document.addEventListener("DOMContentLoaded", () => {
    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach((dropdown) => {
        const link = dropdown.querySelector("a");
        if (link) {
            link.addEventListener("click", (event) => {
                if (window.innerWidth < 992) {
                    event.preventDefault();
                    dropdown.classList.toggle("active");
                }
            });
        }
    });
});

// Função para carregar cards de notícias dinamicamente (exemplo básico)
function loadNewsCards() {
    const newsGrid = document.querySelector(".news-grid");

    if (!newsGrid) return;

    const placeholderNews = [
        {
            title: "Título da Notícia 1",
            tag: "ALERTA EPIDEMIOLÓGICO",
            meta: "🕒 Há 2 horas | 📍 São Paulo | 👁️ 1.2k visualizações",
            summary: "Resumo breve da notícia 1.",
        },
        {
            title: "Título da Notícia 2",
            tag: "DADOS EM FOCO",
            meta: "🕒 Ontem | 📍 Nacional | 👁️ 845 visualizações",
            summary: "Resumo breve da notícia 2.",
        },
        {
            title: "Título da Notícia 3",
            tag: "ANÁLISE CRÍTICA",
            meta: "🕒 2 dias atrás | 📍 Brasília | 👁️ 623 visualizações",
            summary: "Resumo breve da notícia 3.",
        },
    ];

    placeholderNews.forEach((news) => {
        const card = document.createElement("article");
        card.classList.add("news-card");

        card.innerHTML = `
            <div class="tag ${news.tag.toLowerCase().replace(" ", "-")}">${news.tag}</div>
            <div class="news-content">
                <h3>${news.title}</h3>
                <div class="news-meta">${news.meta}</div>
                <p>${news.summary}</p>
            </div>
        `;

        newsGrid.appendChild(card);
    });
}

// Carregar cards de notícias ao iniciar
document.addEventListener("DOMContentLoaded", () => {
    loadNewsCards();
});
