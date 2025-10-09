document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('cakes-container');
  try {
    const res = await fetch('/api/cakes');
    const cakes = await res.json();

    container.innerHTML = cakes.map(cake => `
      <div class="cake-card">
        <h2>${cake.name}</h2>
        <p>${cake.description || 'No description'}</p>
        <p>Price: $${cake.price.toFixed(2)}</p>
        <p>Available: ${cake.available ? '✅' : '❌'}</p>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<p class="error">Error loading cakes: ${err.message}</p>`;
  }
});

async function updateAuthUI() {
  const authSection = document.getElementById('auth-section');
  const token = localStorage.getItem('jwtToken');
  const username = localStorage.getItem('username');

  if (token && username) {
    authSection.innerHTML = `
      Hello, ${username} | <button id="logout-btn">Logout</button>
    `;
    document.getElementById('logout-btn').addEventListener('click', () => {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('username');
      updateAuthUI();
    });
  } else {
    authSection.innerHTML = `
      <a href="/auth/google" class="google-login-btn">Login with Google</a>
    `;
  }
}

// Optional helper to fetch protected endpoints with token
async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('jwtToken');
  options.headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  };
  return fetch(url, options);
}

// Call on page load
updateAuthUI();
