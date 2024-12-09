class ShoeStore {
    constructor() {
        // Considera mover la API key a una variable de entorno o configuración externa
        this.apiKey = 'd63d25ddf86a1bd10bd4fd2ac405ebcf'; 
        this.products = [
            { id: 1, name: 'Zapato Casual', price: 50, image: 'images/zapato-casual.webp', description: 'Cómodo y versátil' },
            { id: 2, name: 'Zapato Formal', price: 70, image: 'images/zapato-formal.webp', description: 'Elegante para ocasiones especiales' },
            { id: 3, name: 'Tenis Deportivos', price: 60, image: 'images/zapato-deportivo.webp', description: 'Ideal para actividades deportivas' }
        ];
        this.cart = [];
        this.initEventListeners();
        this.renderProducts();
        this.fetchWeather();
    }
  
    renderProducts() {
        const container = document.getElementById('product-container');
        container.innerHTML = this.products.map(product => `
            <div class="product-item" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded-md mb-2">
                <h3 class="text-lg font-semibold">${product.name}</h3>
                <p class="text-gray-600">${product.description}</p>
                <p class="text-gray-600">$${product.price.toFixed(2)}</p>
                <button class="mt-2 w-full bg-primary text-white py-2 rounded add-to-cart hover:bg-red-600">
                    Agregar al carrito
                </button>
            </div>
        `).join('');
    }
  
    initEventListeners() {
        // Usa delegación de eventos para mejorar rendimiento
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('add-to-cart')) {
                this.handleAddToCart(event);
            }
            if (event.target.classList.contains('remove-item')) {
                this.handleRemoveFromCart(event);
            }
        });
  
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactSubmit.bind(this));
            
            // Validación en tiempo real
            contactForm.addEventListener('input', this.validateFormInRealTime.bind(this));
        }
    }
  
    validateFormInRealTime(event) {
        const field = event.target;
        const errorElement = document.getElementById(`${field.id}-error`);
        
        if (field.id === 'email') {
            this.validateEmail(field, errorElement);
        } else if (field.id === 'name' || field.id === 'message') {
            this.validateRequired(field, errorElement);
        }
    }
  
    validateEmail(field, errorElement) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            errorElement.textContent = 'Por favor, ingrese un correo electrónico válido';
            field.classList.add('border-red-500');
        } else {
            errorElement.textContent = '';
            field.classList.remove('border-red-500');
        }
    }
  
    validateRequired(field, errorElement) {
        if (field.value.trim() === '') {
            errorElement.textContent = `El campo ${field.name} es obligatorio`;
            field.classList.add('border-red-500');
        } else {
            errorElement.textContent = '';
            field.classList.remove('border-red-500');
        }
    }
  
    handleAddToCart(event) {
        const productElement = event.target.closest('.product-item');
        const productId = parseInt(productElement.dataset.id);
        const product = this.products.find(p => p.id === productId);
  
        if (product) {
            this.cart.push(product);
            this.updateCart();
            this.showCartNotification(product);
        }
    }
  
    showCartNotification(product) {
        const notification = document.createElement('div');
        notification.classList.add('fixed', 'top-4', 'right-4', 'bg-green-500', 'text-white', 'p-4', 'rounded', 'shadow-lg');
        notification.textContent = `${product.name} agregado al carrito`;
        document.body.appendChild(notification);
  
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
  
    handleRemoveFromCart(event) {
        const productId = parseInt(event.target.dataset.id);
        this.cart = this.cart.filter(p => p.id !== productId);
        this.updateCart();
    }
  
    updateCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        const checkoutButton = document.getElementById('checkout');
  
        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-gray-500">Tu carrito está vacío.</p>';
            cartTotalElement.textContent = '0.00';
            checkoutButton.disabled = true;
            return;
        }
  
        const cartItemsHTML = this.cart.map(product => `
            <div class="flex justify-between items-center bg-gray-100 p-2 rounded-xl">
                <span>${product.name}</span>
                <div class="flex items-center space-x-2">
                    <span>$${product.price.toFixed(2)}</span>
                    <button class="text-red-500 remove-item hover:bg-red-100" data-id="${product.id}">Eliminar</button>
                </div>
            </div>
        `).join('');
  
        cartItemsContainer.innerHTML = cartItemsHTML;
  
        const total = this.cart.reduce((sum, product) => sum + product.price, 0);
        cartTotalElement.textContent = total.toFixed(2);
        checkoutButton.disabled = false;
    }
  
    async fetchWeather() {
        const weatherElement = document.getElementById('weather');
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Buenos%20Aires&units=metric&lang=es&appid=${this.apiKey}`);
            const data = await response.json();
            const { name, weather, main } = data;
            weatherElement.innerHTML = `
                <div class="flex items-center">
                    <span>Clima en ${name}: ${weather[0].description}, ${main.temp}°C</span>
                    <img src="https://openweathermap.org/img/wn/${weather[0].icon}.png" alt="Weather icon" class="ml-2 w-8 h-8">
                </div>
            `;
        } catch (error) {
            weatherElement.textContent = 'No se pudo obtener el clima.';
        }
    }
  
    handleContactSubmit(event) {
        event.preventDefault();
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
  
        const errors = this.validateForm(name.value, email.value, message.value);
  
        if (Object.keys(errors).length > 0) {
            this.showFormErrors(errors);
        } else {
            this.submitForm(name.value, email.value, message.value);
        }
    }
  
    submitForm(name, email, message) {
        console.log('Mensaje enviado:', { name, email, message });
        this.showSuccessModal();
        document.getElementById('contact-form').reset();
        this.clearFormErrors();
    }
  
    showSuccessModal() {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div class="bg-white p-8 rounded-lg text-center">
                    <h2 class="text-2xl mb-4">¡Mensaje enviado!</h2>
                    <p>Gracias por contactarnos. Te responderemos pronto.</p>
                    <button class="mt-4 bg-primary text-white px-4 py-2 rounded close-modal">Cerrar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
  
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => new ShoeStore());