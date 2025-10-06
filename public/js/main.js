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
