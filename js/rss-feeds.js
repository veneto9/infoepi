
// =========================
// Feed POPULAÇÃO GERAL (Substack)
// =========================
document.addEventListener('DOMContentLoaded', async () => {
  const rssFeedUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://infovepi.substack.com/feed';
  const container = document.getElementById('blog-posts-container');

  try {
    const response = await fetch(rssFeedUrl);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      container.innerHTML = '<p class="text-center w-100">Nenhuma notícia disponível no momento.</p>';
      return;
    }

    container.innerHTML = '';
    data.items.slice(0, 3).forEach(post => {
      const card = `
        <div class="col">
          <div class="card h-100 shadow-sm">
            <img src="${post.thumbnail || 'https://via.placeholder.com/400x200?text=InfoEPI'}" class="card-img-top" alt="${post.title}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${post.title}</h5>
              <p class="card-text small text-muted">${new Date(post.pubDate).toLocaleDateString('pt-BR')}</p>
              <p class="card-text">${post.description.replace(/<[^>]+>/g, '').slice(0, 120)}...</p>
              <a href="${post.link}" class="btn btn-primary mt-auto" target="_blank">Ler mais</a>
            </div>
          </div>
        </div>
      `;
      container.innerHTML += card;
    });
  } catch (err) {
    container.innerHTML = '<p class="text-danger text-center">Erro ao carregar feed do blog.</p>';
  }
});

// =========================
// Feed PROFISSIONAIS DE SAÚDE (clipping técnico)
// =========================
document.addEventListener('DOMContentLoaded', async () => {
  const sources = [
    'https://api.rss2json.com/v1/api.json?rss_url=https://portal.fiocruz.br/rss.xml',
    'https://api.rss2json.com/v1/api.json?rss_url=https://www.paho.org/en/rss/news',
    'https://api.rss2json.com/v1/api.json?rss_url=https://www.who.int/rss-feeds/news.xml',
    'https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=vigilancia+epidemiologica+site:gov.br&hl=pt-BR&gl=BR&ceid=BR:pt'
  ];

  const container = document.getElementById('clipping-posts-container');
  container.innerHTML = '';

  try {
    let allPosts = [];

    const results = await Promise.all(sources.map(url =>
      fetch(url).then(res => res.ok ? res.json() : { items: [] }).catch(() => ({ items: [] }))
    ));

    results.forEach(feed => {
      if (feed.items) allPosts.push(...feed.items);
    });

    allPosts = allPosts
      .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
      .slice(0, 8);

    if (allPosts.length === 0) {
      container.innerHTML = '<p class="text-center w-100">Nenhuma notícia técnica disponível.</p>';
      return;
    }

    allPosts.forEach(post => {
      const card = `
        <div class="col">
          <div class="card h-100 shadow-sm">
            <img src="${post.thumbnail || 'https://via.placeholder.com/400x120?text=Notícia'}" class="card-img-top" alt="${post.title}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${post.title}</h5>
              <p class="card-text small text-muted">${new Date(post.pubDate).toLocaleDateString('pt-BR')}</p>
              <p class="card-text">${(post.description || '').replace(/<[^>]+>/g, '').slice(0, 100)}...</p>
              <a href="${post.link}" class="btn btn-primary mt-auto" target="_blank">Ler Notícia</a>
            </div>
          </div>
        </div>
      `;
      container.innerHTML += card;
    });

  } catch (err) {
    container.innerHTML = '<p class="text-danger text-center">Erro ao carregar clipping técnico.</p>';
  }
});
