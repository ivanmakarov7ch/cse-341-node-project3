document.addEventListener('DOMContentLoaded', async () => {
  await loadCakes();
  await updateAuthUI();
});

// Fetch and display cakes
async function loadCakes() {
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
}

// Update the login/logout section
async function updateAuthUI() {
  const authSection = document.getElementById('auth-section');

  try {
    const res = await fetch('/auth/me'); // check session
    if (res.ok) {
      const user = await res.json();
      authSection.innerHTML = `
        Hello, ${user.username} | <a href="/auth/logout">Logout</a>
      `;

      // Optionally, show admin actions if user is logged in
      showCakeActions();
    } else {
      authSection.innerHTML = `
        <a href="/auth/github" class="github-login-btn">Login with GitHub</a>
      `;
    }
  } catch (err) {
    console.error(err);
    authSection.innerHTML = `
      <a href="/auth/github" class="github-login-btn">Login with GitHub</a>
    `;
  }
}

// Optionally, add POST/PUT/DELETE buttons for logged-in users
function showCakeActions() {
  const container = document.getElementById('cakes-container');
  const cakeCards = container.querySelectorAll('.cake-card');

  cakeCards.forEach(card => {
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => {
      alert('Edit functionality here');
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => {
      alert('Delete functionality here');
    };

    card.appendChild(editBtn);
    card.appendChild(deleteBtn);
  });
}
