// Admin credentials
const ADMIN_EMAIL = "podetiudaykiran@gmail.com";
const ADMIN_PASSWORD = "admin123"; // Change this to your preferred password

function validateAdminLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem('adminLoggedIn', 'true');
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid admin credentials!');
    }
    return false;
}

function checkAdminAuth() {
    const isAdmin = localStorage.getItem('adminLoggedIn');
    if (!isAdmin && !window.location.href.includes('admin.html')) {
        window.location.href = 'admin.html';
    }
}

function logoutAdmin() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'admin.html';
}

function getDonations() {
    return JSON.parse(localStorage.getItem('donations') || '[]');
}

function updateDashboardStats() {
    const donations = getDonations();
    const totalAmount = donations.reduce((sum, donation) => sum + parseFloat(donation.amount), 0);
    const totalDonors = donations.length;

    document.getElementById('totalAmount').textContent = `₹${totalAmount.toLocaleString()}`;
    document.getElementById('totalDonors').textContent = totalDonors;
    
    const donationsList = document.getElementById('donationsList');
    if (donationsList) {
        donationsList.innerHTML = '';
        donations.forEach(donation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${donation.name}</td>
                <td>${donation.email}</td>
                <td>${donation.phone}</td>
                <td>${donation.city}</td>
                <td>₹${parseFloat(donation.amount).toLocaleString()}</td>
                <td>${donation.date}</td>
            `;
            donationsList.appendChild(row);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    if (window.location.href.includes('dashboard.html')) {
        updateDashboardStats();
    }
});