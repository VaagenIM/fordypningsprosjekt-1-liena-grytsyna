document.addEventListener('DOMContentLoaded', function() {
    // Initialize weekly menu data from localStorage or set defaults
    let weeklyMenu = JSON.parse(localStorage.getItem('weeklyMenu')) || {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: []
    };
    // DOM elements
    const dayTabs = document.querySelectorAll('.day-tab');
    const dayContents = document.querySelectorAll('.day-content');
    const addItemBtns = document.querySelectorAll('.add-item-btn');
    const formTemplate = document.querySelector('.form-template');
    const saveAllBtn = document.getElementById('save-all-btn');
    const previewBtn = document.getElementById('preview-btn');
    // Initialize UI with stored data
    initializeMenuItems();
    // Tab switching functionality
    dayTabs.forEach((tab)=>{
        tab.addEventListener('click', ()=>{
            const day = tab.getAttribute('data-day');
            // Update active tab
            dayTabs.forEach((t)=>t.classList.remove('active'));
            tab.classList.add('active');
            // Show selected day content, hide others
            dayContents.forEach((content)=>{
                if (content.id === `${day}-content`) content.classList.remove('hidden');
                else content.classList.add('hidden');
            });
        });
    });
    // Add item button functionality
    addItemBtns.forEach((btn)=>{
        btn.addEventListener('click', ()=>{
            const day = btn.getAttribute('data-day');
            showItemForm(day);
        });
    });
    // Save all changes
    saveAllBtn.addEventListener('click', ()=>{
        localStorage.setItem('weeklyMenu', JSON.stringify(weeklyMenu));
        alert('Weekly menu saved successfully!');
    });
    // Preview functionality
    previewBtn.addEventListener('click', ()=>{
        localStorage.setItem('weeklyMenu', JSON.stringify(weeklyMenu));
        window.open('index.html', '_blank');
    });
    // Function to initialize menu items from stored data
    function initializeMenuItems() {
        for(const day in weeklyMenu){
            const container = document.getElementById(`${day}-items`);
            container.innerHTML = '';
            weeklyMenu[day].forEach((item, index)=>{
                container.appendChild(createMenuItemElement(item, day, index));
            });
        }
    }
    // Function to create menu item element
    function createMenuItemElement(item, day, index) {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.setAttribute('data-id', index);
        menuItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="menu-item-image">
      <div class="menu-item-details">
        <div class="menu-item-name">${item.name}</div>
        <div class="menu-item-description">${item.description}</div>
        <div class="menu-item-price">${item.price} NOK</div>
      </div>
      <div class="menu-item-actions">
        <button class="edit-btn" data-day="${day}" data-id="${index}">Edit</button>
        <button class="delete-btn" data-day="${day}" data-id="${index}">Delete</button>
      </div>
    `;
        // Add event listeners for edit and delete buttons
        menuItem.querySelector('.edit-btn').addEventListener('click', function() {
            const itemDay = this.getAttribute('data-day');
            const itemId = parseInt(this.getAttribute('data-id'));
            editMenuItem(itemDay, itemId);
        });
        menuItem.querySelector('.delete-btn').addEventListener('click', function() {
            const itemDay = this.getAttribute('data-day');
            const itemId = parseInt(this.getAttribute('data-id'));
            deleteMenuItem(itemDay, itemId);
        });
        return menuItem;
    }
    // Function to show item form (add or edit)
    function showItemForm(day, itemId = null) {
        const container = document.getElementById(`${day}-items`);
        const form = formTemplate.querySelector('form').cloneNode(true);
        // Create form container
        const formContainer = document.createElement('div');
        formContainer.className = 'menu-item-form-container';
        formContainer.appendChild(form);
        // If editing existing item, populate form with item data
        if (itemId !== null) {
            const item = weeklyMenu[day][itemId];
            form.querySelector('[name="name"]').value = item.name;
            form.querySelector('[name="description"]').value = item.description;
            form.querySelector('[name="price"]').value = item.price;
            form.querySelector('[name="image"]').value = item.image;
            form.querySelector('[name="itemId"]').value = itemId;
        }
        // Set the day in the form
        form.querySelector('[name="day"]').value = day;
        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            saveMenuItem(this);
        });
        // Handle cancel button
        form.querySelector('.cancel-btn').addEventListener('click', function() {
            formContainer.remove();
        });
        // Add form before the add button
        container.appendChild(formContainer);
    }
    // Function to save menu item from form
    function saveMenuItem(form) {
        const day = form.querySelector('[name="day"]').value;
        const itemId = form.querySelector('[name="itemId"]').value;
        const menuItem = {
            name: form.querySelector('[name="name"]').value,
            description: form.querySelector('[name="description"]').value,
            price: parseFloat(form.querySelector('[name="price"]').value),
            image: form.querySelector('[name="image"]').value
        };
        if (itemId === '') // Add new item
        weeklyMenu[day].push(menuItem);
        else // Update existing item
        weeklyMenu[day][parseInt(itemId)] = menuItem;
        // Refresh the UI
        initializeMenuItems();
        // Remove the form
        form.closest('.menu-item-form-container').remove();
    }
    // Function to edit menu item
    function editMenuItem(day, itemId) {
        showItemForm(day, itemId);
    }
    // Function to delete menu item
    function deleteMenuItem(day, itemId) {
        if (confirm('Are you sure you want to delete this item?')) {
            weeklyMenu[day].splice(itemId, 1);
            initializeMenuItems();
        }
    }
});

//# sourceMappingURL=admin.0cb64676.js.map
