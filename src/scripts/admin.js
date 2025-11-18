// --- API helpers ---
async function fetchMenu() {
  const res = await fetch('/api/menu');
  if (!res.ok) return {};
  return await res.json();
}

async function saveMenu(menuData) {
  const res = await fetch('/api/menu', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(menuData)
  });
  return await res.json();
}

async function uploadImage(file) {
  // If we got a File object
  if (file instanceof File) {
    const formData = new FormData();
    formData.append('file', file);
		
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
		
    if (!res.ok) {
      throw new Error('Failed to upload image');
    }
		
    const data = await res.json();
    return data.url;
  } 
  // If we got base64 data
  else if (typeof file === 'string' && file.startsWith('data:')) {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image: file })
    });
		
    if (!res.ok) {
      throw new Error('Failed to upload image');
    }
		
    const data = await res.json();
    return data.url;
  }
	
  return null;
}

// --- State ---
const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
let menuData = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: []
};
let currentDay = 'monday';

// --- UI helpers ---
function renderMenuForDay(day) {
  const container = document.getElementById(`${day}-items`);
  container.innerHTML = '';
  (menuData[day] || []).forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.innerHTML = `
			<img src="${item.image || ''}" class="menu-item-image" alt="" />
			<div class="menu-item-details">
				<div class="menu-item-name">${item.name}</div>
				<div class="menu-item-description">${item.description}</div>
				<div class="menu-item-price">${item.price} NOK</div>
			</div>
			<div class="menu-item-actions">
				<button class="edit-btn" data-idx="${idx}" data-day="${day}">Edit</button>
				<button class="delete-btn" data-idx="${idx}" data-day="${day}">Delete</button>
			</div>
		`;
    container.appendChild(div);
  });
}

function renderAllDays() {
  WEEKDAYS.forEach(renderMenuForDay);
}

function showForm(day, item = null, idx = null) {
  const formTemplate = document.querySelector('.form-template');
  const form = formTemplate.querySelector('form');
  form.day.value = day;
  form.itemId.value = idx !== null ? idx : '';
  form.name.value = item ? item.name : '';
  form.description.value = item ? item.description : '';
  form.price.value = item ? item.price : '';
  form.image.value = item ? item.image : '';
	
  // Reset file input and preview
  const fileInput = document.getElementById('item-image-file');
  if (fileInput) {
    fileInput.value = '';
    document.querySelector('.selected-file-name').textContent = 'No file chosen';
  }
	
  // Show image preview if there's an image URL
  const imagePreview = document.querySelector('.image-preview');
  const previewImg = document.getElementById('image-preview');
  if (item && item.image) {
    previewImg.src = item.image;
    imagePreview.classList.remove('hidden');
  } else {
    imagePreview.classList.add('hidden');
  }
	
  formTemplate.classList.remove('hidden');
}

// Setup image preview functionality
function setupImagePreview() {
  const fileInput = document.getElementById('item-image-file');
  const imagePreview = document.querySelector('.image-preview');
  const previewImg = document.getElementById('image-preview');
  const fileNameSpan = document.querySelector('.selected-file-name');
	
  fileInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
      const file = this.files[0];
      fileNameSpan.textContent = file.name;
			
      const reader = new FileReader();
      reader.onload = function(e) {
        previewImg.src = e.target.result;
        imagePreview.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    } else {
      fileNameSpan.textContent = 'No file chosen';
      imagePreview.classList.add('hidden');
    }
  });
}

function hideForm() {
  document.querySelector('.form-template').classList.add('hidden');
}

// --- Event handlers ---
document.addEventListener('DOMContentLoaded', async () => {
  // Загрузка меню
  menuData = await fetchMenu();
	
  // Если пусто, инициализируем
  const emptyMenu = WEEKDAYS.reduce((obj, day) => {
    obj[day] = [];
    return obj;
  }, {});
  menuData = Object.assign(emptyMenu, menuData);
	
  renderAllDays();
	
  // Setup image preview functionality
  setupImagePreview();

  // Переключение вкладок
  document.querySelectorAll('.day-tab').forEach(btn => {
    btn.addEventListener('click', e => {
      document.querySelectorAll('.day-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.day-content').forEach(dc => dc.classList.add('hidden'));
      document.getElementById(`${btn.dataset.day}-content`).classList.remove('hidden');
      currentDay = btn.dataset.day;
    });
  });

  // Кнопки "Add Item"
  document.querySelectorAll('.add-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showForm(btn.dataset.day);
    });
  });

  // Кнопка "Save All Changes"
  document.getElementById('save-all-btn').addEventListener('click', async () => {
    await saveMenu(menuData);
    alert('Menu saved!');
  });

  // Кнопка "Cancel" в форме
  document.querySelector('.cancel-btn').addEventListener('click', hideForm);

  // Сохранение блюда из формы
  document.querySelector('.menu-item-form').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const day = form.day.value;
    const idx = form.itemId.value;
		
    // Show loading indicator
    const saveBtn = form.querySelector('.save-btn');
    const originalBtnText = saveBtn.textContent;
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
		
    try {
      let imageUrl = form.image.value;
      const fileInput = document.getElementById('item-image-file');
			
      // If a file was selected, upload it
      if (fileInput.files && fileInput.files[0]) {
        const uploadedUrl = await uploadImage(fileInput.files[0]);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }
			
      const item = {
        name: form.name.value,
        description: form.description.value,
        price: form.price.value,
        image: imageUrl
      };
			
      if (idx === '') {
        menuData[day].push(item);
      } else {
        menuData[day][idx] = item;
      }
			
      renderMenuForDay(day);
      hideForm();
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('Failed to save menu item: ' + error.message);
    } finally {
      // Restore button state
      saveBtn.disabled = false;
      saveBtn.textContent = originalBtnText;
    }
  });

  // Edit/Delete кнопки
  document.querySelectorAll('.menu-items-container').forEach(container => {
    container.addEventListener('click', e => {
      if (e.target.classList.contains('edit-btn')) {
        const day = e.target.dataset.day;
        const idx = e.target.dataset.idx;
        showForm(day, menuData[day][idx], idx);
      }
      if (e.target.classList.contains('delete-btn')) {
        const day = e.target.dataset.day;
        const idx = e.target.dataset.idx;
        if (confirm('Delete this item?')) {
          menuData[day].splice(idx, 1);
          renderMenuForDay(day);
        }
      }
    });
  });
});
