// User authentication functions
function validateSignup(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value;
    const fullName = form.querySelector('input[placeholder="Full Name"]').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return false;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(user => user.email === email)) {
        alert('Email already registered!');
        return false;
    }

    users.push({ email, password, fullName });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful! Please login.');
    
    const loginTab = document.querySelector('[href="#login"]');
    if (loginTab) {
        loginTab.click();
    }
    form.reset();
    return false;
}

function validateLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert('Invalid email or password!');
        return false;
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.href = 'welcome.html';
    return false;
}

// Countdown Timer
function updateCountdown() {
    const endDate = new Date('2024-03-01').getTime();
    const now = new Date().getTime();
    const distance = endDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Donation tracking
function updateDonationProgress() {
    const donations = JSON.parse(localStorage.getItem('donations') || '[]');
    const totalAmount = donations.reduce((sum, donation) => sum + parseFloat(donation.amount), 0);
    const targetAmount = 10000000; // 1 crore
    const percentage = (totalAmount / targetAmount) * 100;

    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        progressBar.textContent = `${percentage.toFixed(1)}%`;
    }
}

// Donor list animation
function updateDonorList() {
    const donations = JSON.parse(localStorage.getItem('donations') || '[]');
    const donorList = document.querySelector('.donor-list');
    
    if (donorList) {
        donorList.innerHTML = '';
        donations.slice(-5).forEach(donation => {
            const div = document.createElement('div');
            div.className = 'donor-item fade-in';
            div.textContent = `${donation.name} - ₹${parseInt(donation.amount).toLocaleString()}`;
            donorList.appendChild(div);
        });
    }
}

// Social sharing
function setupSocialSharing() {
    const shareButtons = document.querySelectorAll('.social-buttons a');
    const shareData = {
        title: 'Manduva - Independent Film Project',
        text: 'Support our independent film project!',
        url: window.location.href
    };

    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (navigator.share) {
                navigator.share(shareData);
            }
        });
    });
}

// Form validation for donation
function validateDonationForm(event) {
    event.preventDefault();
    const form = event.target;
    const donationData = {
        name: form.querySelector('input[placeholder="Full Name"]').value,
        email: form.querySelector('input[type="email"]').value,
        phone: form.querySelector('input[type="tel"]').value,
        city: form.querySelector('input[placeholder="City"]').value,
        amount: form.querySelector('input[placeholder="Amount (₹)"]').value,
        date: new Date().toISOString()
    };

    const donations = JSON.parse(localStorage.getItem('donations') || '[]');
    donations.push(donationData);
    localStorage.setItem('donations', JSON.stringify(donations));
    
    window.location.href = 'payment.html';
    return false;
}

// Authentication check
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser && !window.location.href.includes('index.html')) {
        window.location.href = 'index.html';
    }
}

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    if (window.location.href.includes('welcome.html')) {
        setInterval(updateCountdown, 1000);
        updateDonationProgress();
        updateDonorList();
        setupSocialSharing();
    }

    const userEmail = document.getElementById('userEmail');
    if (userEmail) {
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        userEmail.textContent = user.email || '';
    }
});

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}