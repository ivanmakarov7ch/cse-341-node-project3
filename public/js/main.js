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

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('cakes-container');
  const authSection = document.getElementById('auth-section');

  let cakes = [];
  let jwtToken = localStorage.getItem('jwtToken');

  // Fetch cakes and display
  try {
    const res = await fetch('/api/cakes');
    cakes = await res.json();

    container.innerHTML = cakes.map(cake => `
      <div class="cake-card">
        <h2>${cake.name}</h2>
        <p>${cake.description || 'No description'}</p>
        <p>Price: $${cake.price.toFixed(2)}</p>
        <p>Available: ${cake.available ? '✅' : '❌'}</p>
        <button onclick="showReviewForm('${cake._id}', '${cake.name}')">Leave a Review</button>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<p class="error">Error loading cakes: ${err.message}</p>`;
  }

  // Update Auth UI
  updateAuthUI();

  // Review Form Container
  const reviewFormContainer = document.createElement('div');
  reviewFormContainer.id = 'review-form-container';
  document.body.appendChild(reviewFormContainer);
});

// Update login/logout section
async function updateAuthUI() {
  const authSection = document.getElementById('auth-section');
  const jwtToken = localStorage.getItem('jwtToken');

  if (!jwtToken) {
    authSection.innerHTML = `<a href="/auth/google" class="google-login-btn">Login with Google</a>`;
    return;
  }

  try {
    const res = await fetch('/api/me', {
      headers: { 'Authorization': `Bearer ${jwtToken}` }
    });
    if (!res.ok) throw new Error('Not authenticated');
    const user = await res.json();

    authSection.innerHTML = `Hello, ${user.username} | <a href="#" onclick="logout()">Logout</a>`;
  } catch (err) {
    localStorage.removeItem('jwtToken');
    authSection.innerHTML = `<a href="/auth/google" class="google-login-btn">Login with Google</a>`;
  }
}

// Logout
function logout() {
  localStorage.removeItem('jwtToken');
  updateAuthUI();
}

// Show review form
function showReviewForm(cakeId, cakeName) {
  const container = document.getElementById('review-form-container');
  container.innerHTML = `
    <h3>Review for: ${cakeName}</h3>
    <form id="review-form">
      <label>Rating (1-5): <input type="number" name="rating" min="1" max="5" required></label><br>
      <label>Comment: <textarea name="comment" required></textarea></label><br>
      <button type="submit">Submit Review</button>
    </form>
    <p id="review-msg"></p>
  `;

  document.getElementById('review-form').onsubmit = async (e) => {
    e.preventDefault();
    const jwtToken = localStorage.getItem('jwtToken');
    if (!jwtToken) {
      alert('You must be logged in to post a review.');
      return;
    }

    const formData = new FormData(e.target);
    const reviewData = {
      user: null, // We'll get it from /api/me
      cake: cakeId,
      rating: parseInt(formData.get('rating')),
      comment: formData.get('comment')
    };

    try {
      // Get current user
      const userRes = await fetch('/api/me', {
        headers: { 'Authorization': `Bearer ${jwtToken}` }
      });
      const user = await userRes.json();
      reviewData.user = user._id;

      // Send POST request
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(reviewData)
      });

      if (!res.ok) throw new Error('Failed to post review');
      document.getElementById('review-msg').innerText = 'Review posted successfully!';
      e.target.reset();
    } catch (err) {
      document.getElementById('review-msg').innerText = `Error: ${err.message}`;
    }
  };
}
