document.getElementById('cakeForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const price = parseFloat(document.getElementById('price').value);
  const category = document.getElementById('category').value;
  const message = document.getElementById('message');

  const cake = { name, description, price, category };

  try {
    const response = await fetch('/api/cakes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cake)
    });

    if (response.ok) {
      message.style.color = 'green';
      message.textContent = '🎉 Cake added successfully!';
      document.getElementById('cakeForm').reset();
    } else {
      const data = await response.json();
      message.style.color = 'red';
      message.textContent = `⚠️ Error: ${data.message || 'Something went wrong.'}`;
    }
  } catch (error) {
    message.style.color = 'red';
    message.textContent = '🚫 Could not connect to the server.';
  }
});
