document.addEventListener('DOMContentLoaded', async () => {
  await loadCakes();
  await updateAuthUI();
});

// Load cakes from API
async function loadCakes() {
  const container = document.getElementById('cakes-container');
  try {
    const res = await fetch('/api/cakes');
    const cakes = await res.json();

    container.innerHTML = cakes.map(cake => `
      <div class="cake-card">
        <h2>${cake.name}</h2>
        <p>${cake.description || 'No description'}</p>
        <p>Flavor: ${cake.flavor}</p>
        <p>Price: $${cake.price.toFixed(2)}</p>
        <p>Available: ${cake.available ? '✅' : '❌'}</p>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<p class="error">Error loading cakes: ${err.message}</p>`;
  }
}

// Update the login/logout UI
async function updateAuthUI() {
  const authSection = document.getElementById('auth-section');
  try {
    const res = await fetch('/auth/me');
    if (res.ok) {
      const user = await res.json();
      authSection.innerHTML = `
        Hello, ${user.username} | <button id="logout-btn">Logout</button>
      `;

      document.getElementById('logout-btn').addEventListener('click', async () => {
        await fetch('/auth/logout');
        updateAuthUI(); // refresh UI
      });
    } else {
      authSection.innerHTML = `
        <a href="/auth/github" class="github-login-btn">Login with GitHub</a>
      `;
    }
  } catch (error) {
    authSection.innerHTML = `
      <a href="/auth/github" class="github-login-btn">Login with GitHub</a>
    `;
  }
}
