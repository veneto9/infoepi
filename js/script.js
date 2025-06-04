// script.js

// Menu mobile toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('nav');
if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}

// Dropdown mobile
const dropdowns = document.querySelectorAll('.dropdown');
if (window.innerWidth < 992) {
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        if (link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        }
    });
}

// Funções auxiliares
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', options);
}

function extractFirstImage(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    const img = div.querySelector('img');
    return img ? img.src : null;
}

function truncateText(text, maxLength) {
    if (!text) return '';
    let cleanText = text.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + '...';
}

// Carregar feed do blog
async function loadBlogPosts() {
    const rssFeedUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://infovepi.substack.com/feed';
    const newsContainer = document.getElementById('blog-posts-container');
    if (!newsContainer) return;

    try {
        const response = await fetch(rssFeedUrl);
        const data = await response.json();
        if (!data.items || data.items.length === 0) {
            newsContainer.innerHTML = '<p class="text-center w-100">Nenhuma notícia disponível no momento.</p>';
            return;
        }

        data.items.slice(0, 3).forEach(post => {
            const title = post.title;
            const link = post.link;
            const pubDate = formatDate(post.pubDate);
            let imageUrl = post.thumbnail || extractFirstImage(post.content) || 'https://via.placeholder.com/400x200?text=INFOEPI';
            const description = truncateText(post.description, 140);

            const cardHtml = `
                <article class="news-card featured">
                    <div class="tag alert">NOTÍCIA EM DESTAQUE</div>
                    <img src="${imageUrl}" class="card-img-top" alt="${title}">
                    <div class="news-content">
                        <h3>${title}</h3>
                        <div class="news-meta">🕒 ${pubDate}</div>
                        <p>${description}</p>
                        <a href="${link}" class="btn btn-primary mt-auto" target="_blank">Ler mais</a>
                    </div>
                </article>`;
            newsContainer.innerHTML += cardHtml;
        });
    } catch (error) {
        newsContainer.innerHTML = '<p class="text-center w-100 text-danger">Erro ao carregar notícias.</p>';
    }
}

// Carregar clipping de notícias
async function loadClippingPosts() {
    const clippingRSSUrls = [
        'https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=vigilancia+epidemiologica+saude+publica+lang:pt&hl=pt-BR&gl=BR&ceid=BR:pt',
        'https://api.rss2json.com/v1/api.json?rss_url=https://g1.globo.com/rss/g1/saude/',
        'https://api.rss2json.com/v1/api.json?rss_url=https://www.who.int/rss-feeds/news.xml',
        'https://api.rss2json.com/v1/api.json?rss_url=https://www.paho.org/en/rss/news'
    ];
    const clippingContainer = document.getElementById('clipping-posts-container');
    if (!clippingContainer) return;

    try {
        let allClippingPosts = [];
        const results = await Promise.all(clippingRSSUrls.map(url => fetch(url).then(res => res.json()).catch(() => ({ items: [] }))));
        results.forEach(feedData => {
            if (feedData.items) allClippingPosts = allClippingPosts.concat(feedData.items);
        });

        allClippingPosts.sort((a, b) => new Date(b.pubDate || b.published) - new Date(a.pubDate || a.published));

        clippingContainer.innerHTML = '';
        allClippingPosts.slice(0, 8).forEach(post => {
            const title = post.title || 'Sem título';
            const link = post.link || '#'; 
            const source = post.source?.title || 'Fonte Desconhecida';
            const date = post.pubDate ? formatDate(post.pubDate) : (post.published ? formatDate(post.published) : 'Data Desconhecida');
            let imageUrl = extractFirstImage(post.description || '') || 'https://via.placeholder.com/400x120?text=Noticia';
            const truncatedDescription = truncateText(post.description || '', 120);

            const cardHtml = `
                <article class="news-card">
                    <div class="tag analysis">${source}</div>
                    <img src="${imageUrl}" class="card-img-top" alt="${title}">
                    <div class="news-content">
                        <h3>${title}</h3>
                        <div class="news-meta">📅 ${date}</div>
                        <p>${truncatedDescription}</p>
                        <a href="${link}" class="btn btn-primary mt-auto" target="_blank">Ler Notícia</a>
                    </div>
                </article>`;
            clippingContainer.innerHTML += cardHtml;
        });
    } catch (error) {
        clippingContainer.innerHTML = '<p class="text-center w-100 text-danger">Erro ao carregar clipping.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
    loadClippingPosts();
});
