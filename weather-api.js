class WeatherApp {
    constructor() {
        this.API_KEY = 'd63d25ddf86a1bd10bd4fd2ac405ebcf';
    }
  
    initEventListeners() {
        document.getElementById('weather-search').addEventListener('submit', this.handleWeatherSearch.bind(this));
        document.getElementById('contact-form').addEventListener('submit', this.validateContactForm.bind(this));
        
        // Add dynamic menu toggle
        document.getElementById('menu-toggle').addEventListener('click', this.toggleMenu.bind(this));
    }
  
    async handleWeatherSearch(event) {
        event.preventDefault();
        const cityInput = document.getElementById('city-input');
        const cityName = cityInput.value.trim();
        
        if (!cityName) {
            this.showError(cityInput, 'Por favor ingrese un nombre de ciudad');
            return;
        }
  
        try {
            const weatherData = await this.fetchWeatherData(cityName);
            this.displayWeatherInfo(weatherData);
        } catch (error) {
            this.showError(cityInput, 'No se pudo encontrar la ciudad');
        }
    }
  
    async fetchWeatherData(city) {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.API_KEY}&units=metric&lang=es`);
        
        if (!response.ok) {
            throw new Error('Error fetching weather data');
        }
        
        return await response.json();
    }
  
    displayWeatherInfo(data) {
        const weatherContainer = document.getElementById('weather-info');
        weatherContainer.innerHTML = `
            <div class="bg-white p-4 rounded shadow">
                <h3 class="text-xl font-bold">${data.name}, ${data.sys.country}</h3>
                <p>Temperatura: ${data.main.temp}°C</p>
                <p>Sensación térmica: ${data.main.feels_like}°C</p>
                <p>Humedad: ${data.main.humidity}%</p>
                <p>Descripción: ${data.weather[0].description}</p>
            </div>
        `;
    }
  
    validateContactForm(event) {
        event.preventDefault();
        let isValid = true;
  
        // Name validation
        const nameInput = document.getElementById('name');
        if (nameInput.value.trim() === '') {
            this.showError(nameInput, 'El nombre es obligatorio');
            isValid = false;
        } else {
            this.clearError(nameInput);
        }
  
        // Email validation
        const emailInput = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            this.showError(emailInput, 'Ingrese un correo electrónico válido');
            isValid = false;
        } else {
            this.clearError(emailInput);
        }
  
        // Message validation
        const messageInput = document.getElementById('message');
        if (messageInput.value.trim().length < 10) {
            this.showError(messageInput, 'El mensaje debe tener al menos 10 caracteres');
            isValid = false;
        } else {
            this.clearError(messageInput);
        }
  
        if (isValid) {
            this.submitForm(nameInput.value, emailInput.value, messageInput.value);
        }
    }
  
    showError(input, message) {
        // Remove any existing error
        this.clearError(input);
  
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'text-red-500 text-sm mt-1 error-message';
        errorElement.textContent = message;
  
        // Insert error message after the input
        input.classList.add('border-red-500');
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
  
    clearError(input) {
        input.classList.remove('border-red-500');
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
  
    submitForm(name, email, message) {
        // Simulated form submission
        console.log('Formulario enviado:', { name, email, message });
        alert('Mensaje enviado con éxito');
        
        // Reset form
        document.getElementById('contact-form').reset();
    }
  
    toggleMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenu.classList.toggle('hidden');
    }
  }
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => new WeatherApp());