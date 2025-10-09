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
  try {
    const res = await fetch('/api/me');
    if (res.ok) {
      const user = await res.json();
      authSection.innerHTML = `
        Hello, ${user.name} | <a href="/logout">Logout</a>
      `;
    } else {
      authSection.innerHTML = `
        <a href="/auth/google" class="google-login-btn">Login with Google</a>
      `;
    }
  } catch (error) {
    authSection.innerHTML = `
      <a href="/auth/google" class="google-login-btn">Login with Google</a>
    `;
  }
}

// Call on page load
updateAuthUI();
