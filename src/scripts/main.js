// --- Dynamic weekly menu rendering ---
async function fetchMenu() {
  const res = await fetch('/api/menu');
  if (!res.ok) return {};
  return await res.json();
}

function createProductCard(item, idx) {
  const div = document.createElement('div');
  // добавляем модификатор main__product--N (от 1 до 6, далее по кругу)
  const mod = (idx % 6) + 1;
  div.className = `main__product product main__product--${mod}`;
  div.innerHTML = `
    <img src="${item.image || ''}" class="main__image image image__main" alt="#" />
    <h3 class="product__title title title__product">${item.name || ''}</h3>
    <p class="product__text text text__product">${item.description || ''}</p>
    <div class="product__price">${item.price ? item.price + ' NOK' : ''}</div>
  `;
  return div;
}

function renderWeeklyMenu(menu) {
  const container = document.getElementById('weekly-menu');
  container.innerHTML = '';
  const days = ['monday','tuesday','wednesday','thursday','friday'];
  days.forEach(day => {
    if (menu[day] && menu[day].length) {
      const dayBlock = document.createElement('div');
      dayBlock.className = 'weekly-menu__day';
      dayBlock.innerHTML = `<h3 class=\"weekly-menu__day-title\">${day.charAt(0).toUpperCase() + day.slice(1)}</h3>`;
      menu[day].forEach((item, idx) => {
        dayBlock.appendChild(createProductCard(item, idx));
      });
      container.appendChild(dayBlock);
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const menu = await fetchMenu();
  renderWeeklyMenu(menu);
});
// Entry script
console.log("App loaded");

document.querySelectorAll('.title').forEach(el => {
  el.addEventListener('click', () => {
    el.classList.toggle('active');
  });
});
