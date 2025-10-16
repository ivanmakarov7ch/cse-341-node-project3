document.addEventListener('DOMContentLoaded', async () => {
  await loadCakes();
  await updateAuthUI();
});

async function loadCakes() {
  const container = document.getElementById('cakes-container');
  try {
    const res = await fetch('/api/cakes');
    if (!res.ok) throw new Error(res.statusText);
    const cakes = await res.json();
    container.innerHTML = cakes.map(c => `
      <div class="cake-card">
        <h2>${escapeHtml(c.name)}</h2>
        <p>${escapeHtml(c.description || '')}</p>
        <p>Flavor: ${escapeHtml(c.flavor)}</p>
        <p>Price: $${(c.price||0).toFixed(2)}</p>
        <p>${c.available ? '✅ Available' : '❌ Unavailable'}</p>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<p class="error">Error loading cakes: ${err.message}</p>`;
  }
}

async function updateAuthUI() {
  const el = document.getElementById('auth-section');
  try {
    const res = await fetch('/auth/me');
    if (res.ok) {
      const user = await res.json();
      el.innerHTML = `
        <img class="profile-pic" src="${escapeHtml(user.avatar || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png')}" alt="Avatar">
        <span>${escapeHtml(user.username)}</span>
        <button id="logout-btn">Logout</button>
      `;
      document.getElementById('logout-btn').addEventListener('click', async () => {
        await fetch('/auth/logout');
        updateAuthUI();
      });
    } else {
      el.innerHTML = `<a class="github-login-btn" href="/auth/github">Login with GitHub</a>`;
    }
  } catch (err) {
    el.innerHTML = `<a class="github-login-btn" href="/auth/github">Login with GitHub</a>`;
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
