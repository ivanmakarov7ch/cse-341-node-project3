async function updateAuthUI() {
  const el = document.getElementById('auth-section');
  try {
    const res = await fetch('/auth/me');
    if (res.ok) {
      const user = await res.json();
      el.innerHTML = `
        <img class="profile-pic" src="${escapeHtml(user.avatar)}" alt="Avatar">
        <span>${escapeHtml(user.displayName)}</span>
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
