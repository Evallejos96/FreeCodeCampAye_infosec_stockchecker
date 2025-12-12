// Función para mostrar resultados de manera legible
function displayResult(data) {
  const resultDiv = document.getElementById('jsonResult');
  resultDiv.innerHTML = ''; // limpiar antes

  if (!data.stockData) return;

  if (Array.isArray(data.stockData)) {
    // Dos stocks
    data.stockData.forEach(s => {
      const div = document.createElement('div');
      div.textContent = `${s.stock} — $${s.price} — rel_likes: ${s.rel_likes}`;
      resultDiv.appendChild(div);
    });
  } else {
    // Un stock
    const s = data.stockData;
    resultDiv.textContent = `${s.stock} — $${s.price} — likes: ${s.likes}`;
  }
}

// Formulario 1: un stock
document.getElementById('testForm2').addEventListener('submit', e => {
  e.preventDefault();
  const stock = e.target[0].value.trim();
  const checkbox = e.target[1].checked;
  const url = `/api/stock-prices?stock=${stock}` + (checkbox ? '&like=true' : '');

  fetch(url)
    .then(res => res.json())
    .then(data => displayResult(data));
});

// Formulario 2: dos stocks
document.getElementById('testForm').addEventListener('submit', e => {
  e.preventDefault();
  const stock1 = e.target[0].value.trim();
  const stock2 = e.target[1].value.trim();
  const checkbox = e.target[2].checked;

  let url = `/api/stock-prices?stock=${stock1}&stock=${stock2}`;
  if (checkbox) url += '&like=true';

  fetch(url)
    .then(res => res.json())
    .then(data => displayResult(data));
});
