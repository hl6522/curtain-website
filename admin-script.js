// Admin Dashboard Script
let currentTab = 'dashboard';
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let currentLanguage = 'en'; // Default language

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin dashboard DOM loaded');
    
    // Check authentication first
    checkAdminAuth();
    
    loadDashboardStats();
    loadCustomers();
    loadAppointments();
    console.log('Loading calendar...');
    loadCalendar(); // Load calendar on page initialization
    setupEventListeners();
    
    // Set default language and update UI
    updatePageLanguage('en'); // Default to English
    
    // Set initial language button state
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === 'en') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
});

// Check if user is authenticated as admin
function checkAdminAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        // Not logged in, redirect to admin login
        window.location.href = 'admin-login.html';
        return;
    }
    
    try {
        const userInfo = JSON.parse(currentUser);
        if (userInfo.userType !== 'admin') {
            // Not admin user, redirect to appropriate login
            if (userInfo.userType === 'content') {
                window.location.href = 'content-management.html';
            } else {
                window.location.href = 'admin-login.html';
            }
            return;
        }
        
        // Update user name display
        const userNameElement = document.querySelector('.user-name');
        if (userNameElement) {
            userNameElement.textContent = userInfo.name;
        }
    } catch (e) {
        // Invalid session, redirect to admin login
        localStorage.removeItem('currentUser');
        window.location.href = 'admin-login.html';
    }
}

// Event listeners setup
function setupEventListeners() {
    // Navigation tabs
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Language switcher
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function(event) {
            updatePageLanguage(this.dataset.lang, event);
        });
    });
    
    // Customer search
    const customerSearch = document.getElementById('customerSearch');
    if (customerSearch) {
        customerSearch.addEventListener('input', function() {
            filterCustomers(this.value);
        });
    }
    
    // User type filter
    const userTypeFilter = document.getElementById('userTypeFilter');
    if (userTypeFilter) {
        userTypeFilter.addEventListener('change', function() {
            filterCustomersByType(this.value);
        });
    }
}

// Tab switching
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to selected nav item
    const selectedNavItem = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedNavItem) {
        selectedNavItem.classList.add('active');
    }
    
    currentTab = tabName;
    
    // Load specific content based on tab
    switch(tabName) {
        case 'dashboard':
            loadDashboardStats();
            break;
        case 'customers':
            loadCustomers();
            break;
        case 'appointments':
            loadAppointments();
            loadCalendar();
            break;
        case 'quotes':
            loadQuotes();
            break;
    }
}

// Language switching
function updatePageLanguage(lang, event) {
    // Update current language
    currentLanguage = lang;
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button if event is provided
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Update all text content
    document.querySelectorAll('[data-en][data-zh]').forEach(element => {
        if (lang === 'zh') {
            element.textContent = element.getAttribute('data-zh');
        } else {
            element.textContent = element.getAttribute('data-en');
        }
    });
    
    // Update select options
    updateSelectOptionsLanguage();
}

// Update select options language
function updateSelectOptionsLanguage() {
    // Update user type filter
    const userTypeFilter = document.getElementById('userTypeFilter');
    if (userTypeFilter) {
        Array.from(userTypeFilter.options).forEach(option => {
            if (option.getAttribute('data-en') && option.getAttribute('data-zh')) {
                option.textContent = currentLanguage === 'zh' ? 
                    option.getAttribute('data-zh') : 
                    option.getAttribute('data-en');
            }
        });
    }
}

// Dashboard statistics
function loadDashboardStats() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // Count pending quotes
    const pendingQuotes = quotes.filter(quote => quote.status === 'pending').length;
    document.getElementById('pendingQuotes').textContent = pendingQuotes;
    
    // Count active orders
    const activeOrders = orders.filter(order => order.status === 'active').length;
    document.getElementById('activeOrders').textContent = activeOrders;
    
    // Count today's appointments - use local date string to avoid timezone issues
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const todayAppointments = quotes.filter(quote => 
        quote.type === 'onsite' && 
        quote.preferredDate === todayStr
    ).length;
    document.getElementById('todayAppointments').textContent = todayAppointments;
    
    // Count confirmed appointments
    const confirmedAppointments = quotes.filter(quote => 
        quote.type === 'onsite' && quote.confirmed
    ).length;
    document.getElementById('confirmedAppointments').textContent = confirmedAppointments;
    
    // Load upcoming appointments for dashboard
    const onsiteQuotes = quotes.filter(q => q.type === 'onsite');
    updateDashboardAppointmentStats(onsiteQuotes);
    
    // Load appointment status overview
    loadAppointmentStatusOverview(onsiteQuotes);
    
    // Load recent confirmed appointments
    loadRecentConfirmedAppointments(onsiteQuotes);
}

// Customer management
function loadCustomers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const customersGrid = document.getElementById('customersGrid');
    
    if (!customersGrid) return;
    
    // Update customer statistics
    updateCustomerStats(users);
    
    customersGrid.innerHTML = '';
    
    users.forEach(user => {
        const customerCard = document.createElement('div');
        customerCard.className = 'customer-card';
        customerCard.innerHTML = `
            <div class="customer-header">
                <h3>${user.name}</h3>
                <span class="user-type ${user.userType || 'self'}">${user.userType === 'onsite' ? 'On-site' : 'Self'}</span>
            </div>
            <div class="customer-info">
                <p><i class="fas fa-envelope"></i> ${user.email}</p>
                <p><i class="fas fa-phone"></i> ${user.phone}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${user.address}, ${user.city}</p>
                <p><i class="fas fa-calendar"></i> ${formatDateString(user.dateCreated)}</p>
            </div>
            <div class="customer-actions">
                <button class="btn btn-secondary" onclick="viewCustomerDetails('${user.email}')" data-en="View Details" data-zh="查看详情">View Details</button>
                <button class="btn btn-primary" onclick="editCustomer('${user.email}')" data-en="Edit" data-zh="编辑">Edit</button>
            </div>
        `;
        customersGrid.appendChild(customerCard);
    });
}

// Update customer statistics
function updateCustomerStats(users) {
    const totalCustomers = document.getElementById('totalCustomers');
    const onsiteCustomers = document.getElementById('onsiteCustomers');
    const selfCustomers = document.getElementById('selfCustomers');
    
    if (totalCustomers) totalCustomers.textContent = users.length;
    if (onsiteCustomers) onsiteCustomers.textContent = users.filter(u => u.userType === 'onsite').length;
    if (selfCustomers) selfCustomers.textContent = users.filter(u => u.userType === 'self' || !u.userType).length;
}

// Load and display appointments
function loadAppointments() {
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    const onsiteQuotes = quotes.filter(q => q.type === 'onsite');
    
    // Debug logging
    console.log('All quotes:', quotes);
    console.log('Onsite quotes:', onsiteQuotes);
    
    // Update appointment statistics
    updateAppointmentStats(onsiteQuotes);
    
    // Load appointments list
    loadAppointmentsList(onsiteQuotes);
    
    // Update dashboard stats
    updateDashboardAppointmentStats(onsiteQuotes);
}

// Update appointment statistics
function updateAppointmentStats(appointments) {
    const totalAppointments = document.getElementById('totalAppointments');
    const pendingAppointments = document.getElementById('pendingAppointments');
    const confirmedAppointments = document.getElementById('confirmedAppointments');
    
    if (totalAppointments) totalAppointments.textContent = appointments.length;
    if (pendingAppointments) pendingAppointments.textContent = appointments.filter(a => !a.confirmed).length;
    if (confirmedAppointments) confirmedAppointments.textContent = appointments.filter(a => a.confirmed).length;
}

// Update dashboard appointment statistics
function updateDashboardAppointmentStats(appointments) {
    const todayAppointments = document.getElementById('todayAppointments');
    const upcomingAppointments = document.getElementById('upcomingAppointments');
    
    if (todayAppointments) {
        // Use local date string to avoid timezone issues
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const todayCount = appointments.filter(a => 
            a.preferredDate === todayStr
        ).length;
        todayAppointments.textContent = todayCount;
    }
    
    if (upcomingAppointments) {
        // Use local date comparison to avoid timezone issues
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const upcoming = appointments.filter(a => {
            // Parse the date string and compare with today
            const [year, month, day] = a.preferredDate.split('-');
            const appointmentDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            return appointmentDate > today && !a.confirmed;
        }).slice(0, 5); // Show only next 5 upcoming appointments
        
        let upcomingHTML = '';
        if (upcoming.length === 0) {
            upcomingHTML = '<p data-en="No upcoming appointments" data-en="No upcoming appointments" data-zh="没有即将到来的预约">No upcoming appointments</p>';
        } else {
            upcoming.forEach(appointment => {
                upcomingHTML += `
                    <div class="upcoming-appointment-item">
                        <div class="appointment-date">
                            <i class="fas fa-calendar"></i>
                            ${formatDateString(appointment.preferredDate)}
                        </div>
                        <div class="appointment-info">
                            <strong>${appointment.name}</strong> - ${appointment.preferredTime === 'morning' ? 'Morning (9 AM - 12 PM)' : 
                                                                 appointment.preferredTime === 'afternoon' ? 'Afternoon (1 PM - 4 PM)' : 
                                                                 appointment.preferredTime === 'evening' ? 'Evening (5 PM - 7 PM)' : appointment.preferredTime}
                        </div>
                        <div class="appointment-status ${appointment.confirmed ? 'confirmed' : 'pending'}">
                            ${appointment.confirmed ? 'Confirmed' : 'Pending'}
                        </div>
                    </div>
                `;
            });
        }
        upcomingAppointments.innerHTML = upcomingHTML;
    }
}

// Load appointments list
function loadAppointmentsList(appointments) {
    const appointmentsList = document.getElementById('appointmentsList');
    if (!appointmentsList) return;
    
    if (appointments.length === 0) {
        appointmentsList.innerHTML = '<p data-en="No appointments found" data-zh="未找到预约">No appointments found</p>';
        return;
    }
    
    let appointmentsHTML = '';
    appointments.forEach(appointment => {
        // Try to get user by userId first, then by email
        let user = null;
        if (appointment.userId) {
            user = getUserById(appointment.userId);
        } else if (appointment.email) {
            user = getUserByEmail(appointment.email);
        }
        
        appointmentsHTML += `
            <div class="appointment-item ${appointment.confirmed ? 'confirmed' : 'pending'}">
                <div class="appointment-header">
                    <h4>${user ? user.name : appointment.name}</h4>
                    <span class="appointment-status ${appointment.confirmed ? 'confirmed' : 'pending'}">
                        ${appointment.confirmed ? 'Confirmed' : 'Pending'}
                    </span>
                </div>
                <div class="appointment-details">
                    <p><strong>Date:</strong> ${formatDateString(appointment.preferredDate)}</p>
                    <p><strong>Time:</strong> ${appointment.preferredTime === 'morning' ? 'Morning (9 AM - 12 PM)' : 
                                               appointment.preferredTime === 'afternoon' ? 'Afternoon (1 PM - 4 PM)' : 
                                               appointment.preferredTime === 'evening' ? 'Evening (5 PM - 7 PM)' : appointment.preferredTime}</p>
                    <p><strong>Property:</strong> ${appointment.propertyType}</p>
                    <p><strong>Rooms:</strong> ${appointment.roomCount}</p>
                    <p><strong>Notes:</strong> ${appointment.notes || 'None'}</p>
                </div>
                <div class="appointment-actions">
                    ${!appointment.confirmed ? `
                        <button class="btn btn-success" onclick="confirmAppointment('${appointment.id}')" data-en="Confirm" data-zh="确认">Confirm</button>
                    ` : ''}
                    <button class="btn btn-secondary" onclick="viewAppointmentDetails('${appointment.id}')" data-en="View Details" data-zh="查看详情">View Details</button>
                </div>
            </div>
        `;
    });
    
    appointmentsList.innerHTML = appointmentsHTML;
}

// Load appointment status overview for dashboard
function loadAppointmentStatusOverview(appointments) {
    const statusOverview = document.getElementById('appointmentStatusOverview');
    if (!statusOverview) return;
    
    // Count appointments by status
    const totalAppointments = appointments.length;
    const confirmedAppointments = appointments.filter(a => a.confirmed).length;
    const pendingAppointments = appointments.filter(a => !a.confirmed).length;
    
    // Count appointments by service type (based on time slot status)
    const measurementAppointments = appointments.filter(a => a.confirmed).length; // All confirmed are measurement
    const installationAppointments = 0; // Will be updated when installation service is implemented
    const maintenanceAppointments = 0; // Will be updated when maintenance service is implemented
    
    const overviewHTML = `
        <div class="status-overview-grid">
            <div class="status-overview-item">
                <div class="status-number">${totalAppointments}</div>
                <div class="status-label" data-en="Total Appointments" data-zh="总预约数">Total Appointments</div>
            </div>
            <div class="status-overview-item confirmed">
                <div class="status-number">${confirmedAppointments}</div>
                <div class="status-label" data-en="Confirmed" data-zh="已确认">Confirmed</div>
            </div>
            <div class="status-overview-item pending">
                <div class="status-number">${pendingAppointments}</div>
                <div class="status-label" data-en="Pending" data-zh="待确认">Pending</div>
            </div>
        </div>
        
        <div class="service-type-overview">
            <h4 data-en="Service Type Breakdown" data-zh="服务类型细分">Service Type Breakdown</h4>
            <div class="service-type-grid">
                <div class="service-type-item measurement">
                    <div class="service-type-icon">
                        <i class="fas fa-ruler-combined"></i>
                    </div>
                    <div class="service-type-info">
                        <div class="service-type-name" data-en="On-site Measurement" data-zh="上门测量">On-site Measurement</div>
                        <div class="service-type-count">${measurementAppointments}</div>
                    </div>
                </div>
                <div class="service-type-item installation">
                    <div class="service-type-icon">
                        <i class="fas fa-tools"></i>
                    </div>
                    <div class="service-type-info">
                        <div class="service-type-name" data-en="Installation" data-zh="安装">Installation</div>
                        <div class="service-type-count">${installationAppointments}</div>
                    </div>
                </div>
                <div class="service-type-item maintenance">
                    <div class="service-type-icon">
                        <i class="fas fa-wrench"></i>
                    </div>
                    <div class="service-type-info">
                        <div class="service-type-name" data-en="Maintenance" data-zh="维护">Maintenance</div>
                        <div class="service-type-count">${maintenanceAppointments}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    statusOverview.innerHTML = overviewHTML;
    
    // Update language for dynamic content
    updatePageLanguage(currentLanguage);
}

// Load recent confirmed appointments for dashboard
function loadRecentConfirmedAppointments(appointments) {
    const recentConfirmed = document.getElementById('recentConfirmedAppointments');
    if (!recentConfirmed) return;
    
    const confirmedAppointments = appointments.filter(a => a.confirmed)
        .sort((a, b) => {
            // Parse date strings to avoid timezone issues
            const [yearA, monthA, dayA] = a.preferredDate.split('-');
            const [yearB, monthB, dayB] = b.preferredDate.split('-');
            const dateA = new Date(parseInt(yearA), parseInt(monthA) - 1, parseInt(dayA));
            const dateB = new Date(parseInt(yearB), parseInt(monthB) - 1, parseInt(dayB));
            return dateB - dateA;
        })
        .slice(0, 5); // Show only 5 most recent
    
    if (confirmedAppointments.length === 0) {
        recentConfirmed.innerHTML = '<p data-en="No confirmed appointments yet" data-zh="暂无已确认的预约">No confirmed appointments yet</p>';
        return;
    }
    
    let confirmedHTML = '';
    confirmedAppointments.forEach(appointment => {
        // Try to get user by userId first, then by email
        let user = null;
        if (appointment.userId) {
            user = getUserById(appointment.userId);
        } else if (appointment.email) {
            user = getUserByEmail(appointment.email);
        }
        
        confirmedHTML += `
            <div class="confirmed-appointment-item">
                <div class="appointment-header">
                                            <div class="appointment-date">
                            <i class="fas fa-calendar-check"></i>
                            ${formatDateString(appointment.preferredDate)}
                        </div>
                    <div class="appointment-status confirmed">
                        <i class="fas fa-check-circle"></i>
                        Confirmed
                    </div>
                </div>
                <div class="appointment-info">
                    <div class="customer-name">
                        <i class="fas fa-user"></i>
                        ${user ? user.name : appointment.name}
                    </div>
                    <div class="appointment-time">
                        <i class="fas fa-clock"></i>
                        ${appointment.preferredTime === 'morning' ? 'Morning (9 AM - 12 PM)' : 
                          appointment.preferredTime === 'afternoon' ? 'Afternoon (1 PM - 4 PM)' : 
                          appointment.preferredTime === 'evening' ? 'Evening (5 PM - 7 PM)' : appointment.preferredTime}
                    </div>
                    <div class="appointment-details">
                        <span class="property-type">
                            <i class="fas fa-home"></i>
                            ${appointment.propertyType}
                        </span>
                        <span class="room-count">
                            <i class="fas fa-door-open"></i>
                            ${appointment.roomCount} rooms
                        </span>
                    </div>
                </div>
            </div>
        `;
    });
    
    recentConfirmed.innerHTML = confirmedHTML;
    
    // Update language for dynamic content
    updatePageLanguage(currentLanguage);
}

// Get user by email
function getUserByEmail(email) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(u => u.email === email);
}

// Format date string to avoid timezone issues
function formatDateString(dateStr) {
    if (!dateStr) return 'N/A';
    const [year, month, day] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString();
}

// Get user by ID
function getUserById(userId) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(u => u.id === userId || u.email === userId);
}

// Confirm appointment
function confirmAppointment(appointmentId) {
    if (confirm('Are you sure you want to confirm this appointment?')) {
        const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
        const quoteIndex = quotes.findIndex(q => q.id === appointmentId);
        
        if (quoteIndex !== -1) {
            quotes[quoteIndex].confirmed = true;
            quotes[quoteIndex].confirmedAt = new Date().toISOString();
            localStorage.setItem('quotes', JSON.stringify(quotes));
            
            // Update time slot status
            updateTimeSlotStatus(quotes[quoteIndex]);
            
            // Reload appointments
            loadAppointments();
            showNotification('Appointment confirmed successfully!', 'success');
        }
    }
}

// Update time slot status when appointment is confirmed
function updateTimeSlotStatus(appointment) {
    const timeSlots = JSON.parse(localStorage.getItem('timeSlots') || '[]');
    const appointmentDate = appointment.preferredDate;
    const appointmentTime = appointment.preferredTime;
    
    // Find and update the corresponding time slot
    const slotIndex = timeSlots.findIndex(slot => 
        slot.date === appointmentDate && slot.time === appointmentTime
    );
    
    if (slotIndex !== -1) {
        timeSlots[slotIndex].status = 'confirmed';
        timeSlots[slotIndex].confirmedAt = new Date().toISOString();
        localStorage.setItem('timeSlots', JSON.stringify(timeSlots));
    }
}

// View appointment details
function viewAppointmentDetails(appointmentId) {
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    const appointment = quotes.find(q => q.id === appointmentId);
    
    if (!appointment) {
        showNotification('Appointment not found', 'error');
        return;
    }
    
    const user = getUserByEmail(appointment.email);
    
    // Create modal for appointment details
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.maxWidth = '600px';
    
    modalContent.innerHTML = `
        <div style="padding: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3 style="margin: 0; color: #2c3e50;">Appointment Details</h3>
                <button class="close" onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
            </div>
            
            <div class="appointment-detail-section">
                <h4 style="color: #3498db; margin-bottom: 1rem;">Customer Information</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Name:</strong> ${user ? user.name : appointment.name}
                    </div>
                    <div class="detail-item">
                        <strong>Email:</strong> ${appointment.email}
                    </div>
                    <div class="detail-item">
                        <strong>Phone:</strong> ${appointment.phone}
                    </div>
                    <div class="detail-item">
                        <strong>Address:</strong> ${appointment.address}, ${appointment.city}, ${appointment.zipCode}
                    </div>
                </div>
            </div>
            
            <div class="appointment-detail-section">
                <h4 style="color: #3498db; margin-bottom: 1rem;">Appointment Information</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Date:</strong> ${formatDateString(appointment.preferredDate)}
                    </div>
                    <div class="detail-item">
                        <strong>Time:</strong> ${appointment.preferredTime === 'morning' ? 'Morning (9 AM - 12 PM)' : 
                                               appointment.preferredTime === 'afternoon' ? 'Afternoon (1 PM - 4 PM)' : 
                                               appointment.preferredTime === 'evening' ? 'Evening (5 PM - 7 PM)' : appointment.preferredTime}
                    </div>
                    <div class="detail-item">
                        <strong>Property Type:</strong> ${appointment.propertyType}
                    </div>
                    <div class="detail-item">
                        <strong>Room Count:</strong> ${appointment.roomCount}
                    </div>
                    <div class="detail-item">
                        <strong>Status:</strong> 
                        <span class="status-badge ${appointment.confirmed ? 'confirmed' : 'pending'}">
                            ${appointment.confirmed ? 'Confirmed' : 'Pending'}
                        </span>
                    </div>
                    <div class="detail-item">
                        <strong>Notes:</strong> ${appointment.notes || 'None'}
                    </div>
                </div>
            </div>
            
            <div class="appointment-actions" style="margin-top: 2rem; text-align: center;">
                ${!appointment.confirmed ? `
                    <button class="btn btn-success" onclick="confirmAppointment('${appointment.id}'); this.closest('.modal').remove();" 
                            style="background: #27ae60; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-right: 1rem;">
                        Confirm Appointment
                    </button>
                ` : ''}
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()" 
                        style="background: #95a5a6; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                    Close
                </button>
            </div>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Filter customers by search
function filterCustomers(searchTerm) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
    );
    
    displayFilteredCustomers(filteredUsers);
}

// Filter customers by user type
function filterCustomersByType(userType) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    let filteredUsers = users;
    
    if (userType !== 'all') {
        filteredUsers = users.filter(user => user.userType === userType);
    }
    
    displayFilteredCustomers(filteredUsers);
}

// Display filtered customers
function displayFilteredCustomers(users) {
    const customersGrid = document.getElementById('customersGrid');
    
    if (!customersGrid) return;
    
    customersGrid.innerHTML = '';
    
    users.forEach(user => {
        const customerCard = document.createElement('div');
        customerCard.className = 'customer-card';
        customerCard.innerHTML = `
            <div class="customer-header">
                <h3>${user.name}</h3>
                <span class="user-type ${user.userType || 'self'}">${user.userType === 'onsite' ? 'On-site' : 'Self'}</span>
            </div>
            <div class="customer-info">
                <p><i class="fas fa-envelope"></i> ${user.email}</p>
                <p><i class="fas fa-phone"></i> ${user.phone}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${user.address}, ${user.city}</p>
                <p><i class="fas fa-calendar"></i> ${formatDateString(user.dateCreated)}</p>
            </div>
            <div class="customer-actions">
                <button class="btn btn-secondary" onclick="viewCustomerDetails('${user.email}')" data-en="View Details" data-zh="查看详情">View Details</button>
                <button class="btn btn-primary" onclick="editCustomer('${user.email}')" data-en="Edit" data-zh="编辑">Edit</button>
            </div>
        `;
        customersGrid.appendChild(customerCard);
    });
}

// Calendar time slot management
let selectedCalendarDate = null;

function selectCalendarDate(dateElement, date) {
    // Toggle selection for multi-select
    if (dateElement.classList.contains('selected')) {
        dateElement.classList.remove('selected');
        if (selectedCalendarDate && selectedCalendarDate.toDateString() === date.toDateString()) {
            selectedCalendarDate = null;
            hideTimeSlotPanel();
        }
    } else {
        dateElement.classList.add('selected');
        selectedCalendarDate = date;
        showTimeSlotPanel(date);
    }
}

function showTimeSlotPanel(date) {
    const panel = document.getElementById('timeSlotPanel');
    const title = document.getElementById('selectedDateTitle');
    
    if (panel && title) {
        // Use local date components to avoid timezone issues
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        title.textContent = `${getCurrentLanguage() === 'zh' ? '时间段设置：' : 'Time Slots for '} ${dateStr}`;
        panel.style.display = 'block';
        
        // Load current time slots for this date
        loadDateTimeSlots(date);
    }
}

function hideTimeSlotPanel() {
    const panel = document.getElementById('timeSlotPanel');
    if (panel) {
        panel.style.display = 'none';
    }
}

function loadDateTimeSlots(date) {
    const timeSlots = JSON.parse(localStorage.getItem('timeSlots') || '[]');
    // Use local date components to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const dateSlots = timeSlots.filter(slot => slot.date === dateStr);
    
    const container = document.getElementById('currentDateSlots');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (dateSlots.length === 0) {
        container.innerHTML = '<p class="no-slots" data-en="No time slots for this date" data-zh="此日期暂无时间段">No time slots for this date</p>';
        return;
    }
    
    dateSlots.forEach(slot => {
        const slotItem = document.createElement('div');
        slotItem.className = 'date-slot-item';
        slotItem.innerHTML = `
            <div class="slot-info">
                <span class="slot-time">${getTimeSlotLabel(slot.time)}</span>
                <span class="slot-status ${slot.status}">${slot.status}</span>
            </div>
            <div class="slot-actions">
                <button class="btn btn-sm btn-danger" onclick="deleteTimeSlot('${slot.id}')" data-en="Delete" data-zh="删除">Delete</button>
            </div>
        `;
        container.appendChild(slotItem);
    });
}

function getTimeSlotLabel(time) {
    const labels = {
        morning: getCurrentLanguage() === 'zh' ? '上午 (9:00 - 12:00)' : 'Morning (9 AM - 12 PM)',
        afternoon: getCurrentLanguage() === 'zh' ? '下午 (1:00 - 4:00)' : 'Afternoon (1 PM - 4 PM)'
    };
    return labels[time] || time;
}

function getCurrentLanguage() {
    const activeLang = document.querySelector('.lang-btn.active');
    return activeLang ? activeLang.dataset.lang : 'en';
}

function addTimeSlotForDate() {
    if (!selectedCalendarDate) {
        showNotification('Please select a date first', 'error');
        return;
    }
    
    const time = document.getElementById('newSlotTime').value;
    
    if (!time) {
        showNotification('Please select a time slot', 'error');
        return;
    }
    
    // Use local date components to avoid timezone issues
    const year = selectedCalendarDate.getFullYear();
    const month = String(selectedCalendarDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedCalendarDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    // Check if this time slot already exists
    const timeSlots = JSON.parse(localStorage.getItem('timeSlots') || '[]');
    const existingSlot = timeSlots.find(slot => 
        slot.date === dateStr && slot.time === time
    );
    
    if (existingSlot) {
        showNotification('This time slot already exists for this date!', 'error');
        return;
    }
    
    const newSlot = {
        id: Date.now().toString(),
        date: dateStr,
        time: time,
        maxBookings: 3,
        currentBookings: 0,
        status: 'available',
        createdAt: new Date().toISOString()
    };
    
    timeSlots.push(newSlot);
    localStorage.setItem('timeSlots', JSON.stringify(timeSlots));
    
    // Reload time slots for the selected date
    loadDateTimeSlots(selectedCalendarDate);
    
    // Reset form
    document.getElementById('newSlotTime').value = 'morning';
    
    showNotification('Time slot added successfully!', 'success');
}

// Delete time slot function for calendar
function deleteTimeSlot(slotId) {
    if (confirm('Are you sure you want to delete this time slot?')) {
        const timeSlots = JSON.parse(localStorage.getItem('timeSlots') || '[]');
        const updatedSlots = timeSlots.filter(slot => slot.id !== slotId);
        localStorage.setItem('timeSlots', JSON.stringify(updatedSlots));
        
        showNotification('Time slot deleted successfully!', 'success');
        
        // Reload time slots for the selected date if panel is open
        if (selectedCalendarDate) {
            loadDateTimeSlots(selectedCalendarDate);
        }
    }
}

function confirmTimeSlot(slotId) {
    if (confirm('Are you sure you want to confirm this time slot? Confirmed slots cannot be booked by customers.')) {
        const timeSlots = JSON.parse(localStorage.getItem('timeSlots') || '[]');
        const slotIndex = timeSlots.findIndex(slot => slot.id === slotId);
        
        if (slotIndex !== -1) {
            timeSlots[slotIndex].status = 'confirmed';
            timeSlots[slotIndex].confirmedAt = new Date().toISOString();
            localStorage.setItem('timeSlots', JSON.stringify(timeSlots));
            
            showNotification('Time slot confirmed successfully!', 'success');
        }
    }
}

// Calendar functions
function loadCalendar() {
    console.log('loadCalendar called');
    updateCalendarHeader();
    generateCalendarGrid();
}

function updateCalendarHeader() {
    console.log('updateCalendarHeader called');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonthElement = document.getElementById('currentMonth');
    if (currentMonthElement) {
        currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        console.log(`Calendar header updated: ${monthNames[currentMonth]} ${currentYear}`);
    } else {
        console.error('currentMonth element not found');
    }
}

function generateCalendarGrid() {
    console.log('generateCalendarGrid called');
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) {
        console.error('calendarGrid element not found');
        return;
    }
    console.log('calendarGrid found, clearing content');
    calendarGrid.innerHTML = '';
    
    // Generate calendar days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    console.log(`Generating calendar for month ${currentMonth}, year ${currentYear}`);
    console.log(`First day: ${firstDay}, Last day: ${lastDay}, Start date: ${startDate}`);
    
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        if (date.getMonth() === currentMonth) {
            dayElement.classList.add('current-month');
            
            // Get appointments for this date - use local date components to avoid timezone issues
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            
            // Get time slots for this date
            const timeSlots = getTimeSlotsForDate(dateStr);
            const morningSlot = timeSlots.find(slot => slot.time === 'morning');
            const afternoonSlot = timeSlots.find(slot => slot.time === 'afternoon');
            
            const appointments = getAppointmentsForDate(dateStr);
            const morningAppointment = appointments.find(a => a.preferredTime === 'morning');
            const afternoonAppointment = appointments.find(a => a.preferredTime === 'afternoon');
            
            // Debug logging for appointments
            console.log(`Date: ${dateStr}, Morning appointment:`, morningAppointment);
            console.log(`Date: ${dateStr}, Afternoon appointment:`, afternoonAppointment);
            
            // Determine final status for each time slot
            // If there's a confirmed appointment, override the time slot status with appropriate confirmed type
            let morningStatus, afternoonStatus;
            
            if (morningAppointment && morningAppointment.confirmed) {
                // Determine confirmed status based on the original time slot status
                if (morningSlot && morningSlot.status === 'onsite-measurement') {
                    morningStatus = 'confirmed-measurement';
                } else if (morningSlot && morningSlot.status === 'installation') {
                    morningStatus = 'confirmed-installation';
                } else if (morningSlot && morningSlot.status === 'maintenance') {
                    morningStatus = 'confirmed-maintenance';
                } else {
                    morningStatus = 'confirmed-measurement'; // Default for other cases
                }
            } else {
                morningStatus = morningSlot ? morningSlot.status : 'no-slot';
            }
            
            if (afternoonAppointment && afternoonAppointment.confirmed) {
                // Determine confirmed status based on the original time slot status
                if (afternoonSlot && afternoonSlot.status === 'onsite-measurement') {
                    afternoonStatus = 'confirmed-measurement';
                } else if (afternoonSlot && afternoonSlot.status === 'installation') {
                    afternoonStatus = 'confirmed-installation';
                } else if (afternoonSlot && afternoonSlot.status === 'maintenance') {
                    afternoonStatus = 'confirmed-maintenance';
                } else {
                    afternoonStatus = 'confirmed-measurement'; // Default for other cases
                }
            } else {
                afternoonStatus = afternoonSlot ? afternoonSlot.status : 'no-slot';
            }
            
            dayElement.innerHTML = `
                <span class="day-number">${date.getDate()}</span>
                <div class="time-slots-display">
                    <div class="time-slot-item ${morningStatus}" data-time="morning" data-date="${dateStr}" data-has-confirmed="${morningAppointment && morningAppointment.confirmed ? 'true' : 'false'}">
                        <span class="time-label">AM</span>
                        <span class="status-text">${morningStatus.startsWith('confirmed-') ? 'Confirmed' : morningStatus}</span>
                        ${morningAppointment ? `<div class="appointment-indicator ${morningAppointment.confirmed ? 'confirmed' : 'pending'}">${morningAppointment.name}</div>` : ''}
                    </div>
                    <div class="time-slot-item ${afternoonStatus}" data-time="afternoon" data-date="${dateStr}" data-has-confirmed="${afternoonAppointment && afternoonAppointment.confirmed ? 'true' : 'false'}">
                        <span class="time-label">PM</span>
                        <span class="status-text">${afternoonStatus.startsWith('confirmed-') ? 'Confirmed' : afternoonStatus}</span>
                        ${afternoonAppointment ? `<div class="appointment-indicator ${afternoonAppointment.confirmed ? 'confirmed' : 'pending'}">${afternoonAppointment.name}</div>` : ''}
                    </div>
                </div>
            `;
            
            // Add click event for date selection
            dayElement.addEventListener('click', () => selectCalendarDate(dayElement, date));
            dayElement.style.cursor = 'pointer';
            
            // Add click events for time slot editing
            dayElement.querySelectorAll('.time-slot-item').forEach(slotElement => {
                slotElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    editTimeSlotStatus(slotElement);
                });
            });
        } else {
            dayElement.innerHTML = `<span class="day-number other-month">${date.getDate()}</span>`;
        }
        
        calendarGrid.appendChild(dayElement);
    }
    console.log(`Calendar generation completed. Total days: ${calendarGrid.children.length}`);
}

function getTimeSlotsForDate(dateStr) {
    const timeSlots = JSON.parse(localStorage.getItem('timeSlots') || '[]');
    const dateSlots = timeSlots.filter(slot => slot.date === dateStr);
    
    // Debug logging
    console.log(`Getting time slots for date: ${dateStr}`, dateSlots);
    
    return dateSlots;
}

function getAppointmentsForDate(dateStr) {
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    
    // Debug logging
    console.log('Getting appointments for date:', dateStr);
    console.log('All quotes:', quotes);
    
    // Use exact string match to avoid timezone issues
    const appointments = quotes.filter(quote => 
        quote.type === 'onsite' && 
        quote.preferredDate === dateStr
    );
    
    console.log('Filtered appointments:', appointments);
    
    // Also check if there are any time slots with onsite-measurement status
    const timeSlots = JSON.parse(localStorage.getItem('timeSlots') || '[]');
    const dateTimeSlots = timeSlots.filter(slot => 
        slot.date === dateStr && 
        slot.status === 'onsite-measurement'
    );
    
    console.log('Date time slots:', dateTimeSlots);
    
    return appointments;
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    loadCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    loadCalendar();
}

// Utility functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showNotification(message, type = 'info') {
    // Create a notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer;">×</button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Close modals when clicking close button
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('close')) {
        const modal = event.target.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
});

// Load quotes data
function loadQuotes() {
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    const selfQuotes = quotes.filter(q => q.type === 'self');
    
    console.log('Loading quotes...', quotes);
    console.log('Self quotes:', selfQuotes);
    
    // Load recent quotes for dashboard
    loadRecentQuotes(selfQuotes);
    
    // Load quotes table
    loadQuotesTable(selfQuotes);
}

// Load recent quotes for dashboard
function loadRecentQuotes(quotes) {
    const recentQuotesContainer = document.getElementById('recentQuotes');
    if (!recentQuotesContainer) return;
    
    // Get recent 5 quotes
    const recentQuotes = quotes.slice(0, 5);
    
    if (recentQuotes.length === 0) {
        recentQuotesContainer.innerHTML = '<p data-en="No recent quote requests" data-zh="暂无最近的报价请求">No recent quote requests</p>';
        return;
    }
    
    let recentQuotesHTML = '';
    recentQuotes.forEach(quote => {
        const totalWindows = quote.rooms ? quote.rooms.reduce((total, room) => total + room.windows.length, 0) : 0;
        const totalRooms = quote.rooms ? quote.rooms.length : 0;
        
        recentQuotesHTML += `
            <div class="recent-quote-item">
                <div class="quote-info">
                    <div class="quote-header">
                        <span class="quote-date">${formatDateString(quote.date)}</span>
                        <span class="quote-status ${quote.status || 'pending'}">${getQuoteStatusText(quote.status || 'pending')}</span>
                    </div>
                    <div class="quote-details">
                        <p><strong data-en="Customer:" data-zh="客户：">Customer:</strong> ${getCustomerName(quote.userId)}</p>
                        <p><strong data-en="Rooms:" data-zh="房间：">Rooms:</strong> ${totalRooms}</p>
                        <p><strong data-en="Windows:" data-zh="窗户：">Windows:</strong> ${totalWindows}</p>
                        <p><strong data-en="Budget:" data-zh="预算：">Budget:</strong> ${getBudgetText(quote.budget)}</p>
                    </div>
                </div>
                <div class="quote-actions">
                    <button class="btn btn-primary btn-sm" onclick="viewQuoteDetails('${quote.id}')" data-en="View Details" data-zh="查看详情">View Details</button>
                    <button class="btn btn-success btn-sm" onclick="updateQuoteStatus('${quote.id}', 'reviewed')" data-en="Review" data-zh="审核">Review</button>
                </div>
            </div>
        `;
    });
    
    recentQuotesContainer.innerHTML = recentQuotesHTML;
}

// Load quotes table
function loadQuotesTable(quotes) {
    const quotesTableBody = document.getElementById('quotesTableBody');
    if (!quotesTableBody) return;
    
    if (quotes.length === 0) {
        quotesTableBody.innerHTML = '<tr><td colspan="7" data-en="No quote requests found" data-zh="未找到报价请求">No quote requests found</td></tr>';
        return;
    }
    
    let quotesHTML = '';
    quotes.forEach(quote => {
        const totalWindows = quote.rooms ? quote.rooms.reduce((total, room) => total + room.windows.length, 0) : 0;
        const totalRooms = quote.rooms ? quote.rooms.length : 0;
        const roomTypes = quote.rooms ? quote.rooms.map(room => getRoomTypeName(room.type)).join(', ') : '';
        
        quotesHTML += `
            <tr>
                <td>${formatDateString(quote.date)}</td>
                <td>${getCustomerName(quote.userId)}</td>
                <td>${roomTypes}</td>
                <td>${totalWindows}</td>
                <td>${getBudgetText(quote.budget)}</td>
                <td><span class="status-badge ${quote.status || 'pending'}">${getQuoteStatusText(quote.status || 'pending')}</span></td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="viewQuoteDetails('${quote.id}')" data-en="View" data-zh="查看">View</button>
                    <button class="btn btn-success btn-sm" onclick="updateQuoteStatus('${quote.id}', 'reviewed')" data-en="Review" data-zh="审核">Review</button>
                    <button class="btn btn-info btn-sm" onclick="addQuotePrice('${quote.id}')" data-en="Add Price" data-zh="添加价格">Add Price</button>
                </td>
            </tr>
        `;
    });
    
    quotesTableBody.innerHTML = quotesHTML;
}

// Get customer name by userId
function getCustomerName(userId) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === userId);
    return user ? user.name : userId;
}

// Get budget text
function getBudgetText(budget) {
    if (!budget) return 'N/A';
    
    const budgetMap = {
        'under-1000': 'Under $1,000',
        '1000-2500': '$1,000 - $2,500',
        '2500-5000': '$2,500 - $5,000',
        '5000-10000': '$5,000 - $10,000',
        'over-10000': 'Over $10,000'
    };
    
    return budgetMap[budget] || budget;
}

// Get quote status text
function getQuoteStatusText(status) {
    const statusMap = {
        'pending': currentLanguage === 'zh' ? '待处理' : 'Pending',
        'reviewed': currentLanguage === 'zh' ? '已审核' : 'Reviewed',
        'quoted': currentLanguage === 'zh' ? '已报价' : 'Quoted',
        'accepted': currentLanguage === 'zh' ? '已接受' : 'Accepted',
        'rejected': currentLanguage === 'zh' ? '已拒绝' : 'Rejected'
    };
    
    return statusMap[status] || status;
}

// Get room type name
function getRoomTypeName(type) {
    const roomTypes = {
        'living-room': currentLanguage === 'zh' ? '客厅' : 'Living Room',
        'bedroom': currentLanguage === 'zh' ? '卧室' : 'Bedroom',
        'kitchen': currentLanguage === 'zh' ? '厨房' : 'Kitchen',
        'dining-room': currentLanguage === 'zh' ? '餐厅' : 'Dining Room',
        'bathroom': currentLanguage === 'zh' ? '浴室' : 'Bathroom',
        'office': currentLanguage === 'zh' ? '办公室' : 'Office',
        'family-room': currentLanguage === 'zh' ? '家庭室' : 'Family Room',
        'basement': currentLanguage === 'zh' ? '地下室' : 'Basement',
        'attic': currentLanguage === 'zh' ? '阁楼' : 'Attic'
    };
    return roomTypes[type] || type;
}

// View quote details
function viewQuoteDetails(quoteId) {
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    const quote = quotes.find(q => q.id === quoteId);
    
    if (!quote) {
        showNotification('Quote not found', 'error');
        return;
    }
    
    const customerName = getCustomerName(quote.userId);
    const totalWindows = quote.rooms ? quote.rooms.reduce((total, room) => total + room.windows.length, 0) : 0;
    const totalRooms = quote.rooms ? quote.rooms.length : 0;
    
    // Create modal content
    const modalContent = `
        <div class="quote-detail-modal">
            <div class="modal-header">
                <h3 data-en="Quote Details" data-zh="报价详情">Quote Details</h3>
                <button class="close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="quote-info-section">
                    <h4 data-en="Basic Information" data-zh="基本信息">Basic Information</h4>
                    <div class="info-grid">
                        <div class="info-item">
                            <label data-en="Customer:" data-zh="客户：">Customer:</label>
                            <span>${customerName}</span>
                        </div>
                        <div class="info-item">
                            <label data-en="Date:" data-zh="日期：">Date:</label>
                            <span>${formatDateString(quote.date)}</span>
                        </div>
                        <div class="info-item">
                            <label data-en="Status:" data-zh="状态：">Status:</label>
                            <span class="status-badge ${quote.status || 'pending'}">${getQuoteStatusText(quote.status || 'pending')}</span>
                        </div>
                        <div class="info-item">
                            <label data-en="Budget:" data-zh="预算：">Budget:</label>
                            <span>${getBudgetText(quote.budget)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="quote-rooms-section">
                    <h4 data-en="Rooms & Windows" data-zh="房间和窗户">Rooms & Windows</h4>
                    ${quote.rooms ? quote.rooms.map((room, roomIndex) => `
                        <div class="room-detail">
                            <h5>${currentLanguage === 'zh' ? '房间' : 'Room'} ${roomIndex + 1}: ${getRoomTypeName(room.type)}</h5>
                            <div class="windows-detail">
                                ${room.windows.map((window, windowIndex) => `
                                    <div class="window-detail">
                                        <span class="window-type">${getWindowTypeName(window.type)}</span>
                                        <span class="curtain-type">${getCurtainTypeName(window.curtainType)}</span>
                                        <span class="window-dimensions">${window.width}' × ${window.height}'</span>
                                        <span class="window-quantity">×${window.quantity}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('') : ''}
                </div>
                
                ${quote.notes ? `
                    <div class="quote-notes-section">
                        <h4 data-en="Notes" data-zh="备注">Notes</h4>
                        <p>${quote.notes}</p>
                    </div>
                ` : ''}
                
                <div class="quote-actions-section">
                    <button class="btn btn-success" onclick="updateQuoteStatus('${quoteId}', 'reviewed')" data-en="Mark as Reviewed" data-zh="标记为已审核">Mark as Reviewed</button>
                    <button class="btn btn-info" onclick="addQuotePrice('${quoteId}')" data-en="Add Price" data-zh="添加价格">Add Price</button>
                    <button class="btn btn-danger" onclick="updateQuoteStatus('${quoteId}', 'rejected')" data-en="Reject" data-zh="拒绝">Reject</button>
                </div>
            </div>
        </div>
    `;
    
    // Create and show modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Update quote status
function updateQuoteStatus(quoteId, newStatus) {
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    const quoteIndex = quotes.findIndex(q => q.id === quoteId);
    
    if (quoteIndex === -1) {
        showNotification('Quote not found', 'error');
        return;
    }
    
    quotes[quoteIndex].status = newStatus;
    quotes[quoteIndex].updatedAt = new Date().toISOString();
    
    localStorage.setItem('quotes', JSON.stringify(quotes));
    
    showNotification(
        currentLanguage === 'zh' ? '报价状态已更新' : 'Quote status updated successfully',
        'success'
    );
    
    // Refresh quotes display
    loadQuotes();
    
    // Close modal if open
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Add quote price
function addQuotePrice(quoteId) {
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    const quote = quotes.find(q => q.id === quoteId);
    
    if (!quote) {
        showNotification('Quote not found', 'error');
        return;
    }
    
    const price = prompt(currentLanguage === 'zh' ? '请输入报价金额:' : 'Enter quote price:');
    if (!price || isNaN(parseFloat(price))) {
        showNotification(
            currentLanguage === 'zh' ? '请输入有效的价格' : 'Please enter a valid price',
            'error'
        );
        return;
    }
    
    const quoteIndex = quotes.findIndex(q => q.id === quoteId);
    quotes[quoteIndex].price = parseFloat(price);
    quotes[quoteIndex].status = 'quoted';
    quotes[quoteIndex].quotedAt = new Date().toISOString();
    
    localStorage.setItem('quotes', JSON.stringify(quotes));
    
    showNotification(
        currentLanguage === 'zh' ? '价格已添加，报价状态已更新' : 'Price added and quote status updated',
        'success'
    );
    
    // Refresh quotes display
    loadQuotes();
}

// Get window type name
function getWindowTypeName(type) {
    const windowTypes = {
        'casement': currentLanguage === 'zh' ? '平开窗' : 'Casement',
        'double-hung': currentLanguage === 'zh' ? '双悬窗' : 'Double Hung',
        'bay': currentLanguage === 'zh' ? '凸窗' : 'Bay',
        'picture': currentLanguage === 'zh' ? '落地窗' : 'Picture',
        'sliding': currentLanguage === 'zh' ? '推拉窗' : 'Sliding'
    };
    return windowTypes[type] || type;
}

// Get curtain type name
function getCurtainTypeName(type) {
    const curtainTypes = {
        'roller': currentLanguage === 'zh' ? '卷帘' : 'Roller Blind',
        'venetian': currentLanguage === 'zh' ? '百叶帘' : 'Venetian Blind',
        'roman': currentLanguage === 'zh' ? '罗马帘' : 'Roman Shade',
        'curtain': currentLanguage === 'zh' ? '布艺窗帘' : 'Curtain',
        'none': currentLanguage === 'zh' ? '无需窗帘' : 'No Curtain'
    };
    return curtainTypes[type] || type;
}

function viewCustomerDetails(email) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);
    
    if (!user) {
        showNotification('Customer not found', 'error');
        return;
    }
    
    // Get user's appointments and quotes
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    const userAppointments = quotes.filter(q => 
        (q.userId === user.email || q.email === user.email) && q.type === 'onsite'
    );
    const userQuotes = quotes.filter(q => 
        (q.userId === user.email || q.email === user.email) && q.type === 'self'
    );
    
    const customerDetailContent = document.getElementById('customerDetailContent');
    if (customerDetailContent) {
        customerDetailContent.innerHTML = `
            <div class="customer-detail-header">
                <h2>${user.name} - Customer Details</h2>
                <button class="btn btn-secondary" onclick="closeModal('customerDetailModal')">Close</button>
            </div>
            
            <div class="customer-detail-content">
                <!-- Basic Information -->
                <div class="customer-detail-section">
                    <h3 data-en="Basic Information" data-zh="基本信息">Basic Information</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label data-en="Name" data-zh="姓名">Name:</label>
                            <span>${user.name}</span>
                        </div>
                        <div class="detail-item">
                            <label data-en="Email" data-zh="邮箱">Email:</label>
                            <span>${user.email}</span>
                        </div>
                        <div class="detail-item">
                            <label data-en="Phone" data-zh="电话">Phone:</label>
                            <span>${user.phone || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <label data-en="Address" data-zh="地址">Address:</label>
                            <span>${user.address || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <label data-en="City" data-zh="城市">City:</label>
                            <span>${user.city || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <label data-en="User Type" data-zh="用户类型">User Type:</label>
                            <span class="user-type-badge">Customer</span>
                        </div>
                        <div class="detail-item">
                            <label data-en="Registration Date" data-zh="注册日期">Registration Date:</label>
                            <span>${user.dateCreated ? formatDateString(user.dateCreated) : 'N/A'}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Appointments Status -->
                <div class="customer-detail-section">
                    <h3 data-en="Appointments Status" data-zh="预约状态">Appointments Status</h3>
                    <div class="appointments-summary">
                        <div class="summary-item">
                            <span class="summary-number">${userAppointments.length}</span>
                            <span class="summary-label" data-en="Total Appointments" data-zh="总预约数">Total Appointments</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-number">${userAppointments.filter(a => a.confirmed).length}</span>
                            <span class="summary-label" data-en="Confirmed" data-zh="已确认">Confirmed</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-number">${userAppointments.filter(a => !a.confirmed).length}</span>
                            <span class="summary-label" data-en="Pending" data-zh="待确认">Pending</span>
                        </div>
                    </div>
                </div>
                
                <!-- Appointments History -->
                <div class="customer-detail-section">
                    <h3 data-en="Appointments History" data-zh="预约历史">Appointments History</h3>
                    <div class="appointments-list">
                        ${userAppointments.length === 0 ? 
                            '<p data-en="No appointments found" data-zh="未找到预约">No appointments found</p>' :
                            userAppointments.map(appointment => `
                                <div class="appointment-item ${appointment.confirmed ? 'confirmed' : 'pending'}">
                                    <div class="appointment-header">
                                        <span class="appointment-date">${formatDateString(appointment.preferredDate)}</span>
                                        <span class="appointment-status ${appointment.confirmed ? 'confirmed' : 'pending'}">
                                            ${appointment.confirmed ? 'Confirmed' : 'Pending'}
                                        </span>
                                    </div>
                                    <div class="appointment-details">
                                        <p><strong data-en="Time" data-zh="时间">Time:</strong> ${appointment.preferredTime === 'morning' ? 'Morning (9 AM - 12 PM)' : 
                                                                                           appointment.preferredTime === 'afternoon' ? 'Afternoon (1 PM - 4 PM)' : 
                                                                                           appointment.preferredTime === 'evening' ? 'Evening (5 PM - 7 PM)' : appointment.preferredTime}</p>
                                        <p><strong data-en="Property Type" data-zh="房产类型">Property Type:</strong> ${appointment.propertyType || 'N/A'}</p>
                                        <p><strong data-en="Room Count" data-zh="房间数量">Room Count:</strong> ${appointment.roomCount || 'N/A'}</p>
                                        <p><strong data-en="Notes" data-zh="备注">Notes:</strong> ${appointment.notes || 'N/A'}</p>
                                    </div>
                                    ${!appointment.confirmed ? `
                                        <div class="appointment-actions">
                                            <button class="btn btn-success btn-sm" onclick="confirmAppointment('${appointment.id}')" data-en="Confirm" data-zh="确认">Confirm</button>
                                        </div>
                                    ` : ''}
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
                
                <!-- Quote History -->
                <div class="customer-detail-section">
                    <h3 data-en="Quote History" data-zh="报价历史">Quote History</h3>
                    <div class="quotes-list">
                        ${userQuotes.length === 0 ? 
                            '<p data-en="No quotes found" data-zh="未找到报价">No quotes found</p>' :
                            userQuotes.map(quote => `
                                <div class="quote-item">
                                    <div class="quote-header">
                                        <span class="quote-date">${formatDateString(quote.date)}</span>
                                        <span class="quote-type">Quote Request</span>
                                    </div>
                                    <div class="quote-details">
                                        <p><strong data-en="Property Type" data-zh="房产类型">Property Type:</strong> ${quote.propertyType || 'N/A'}</p>
                                        <p><strong data-en="Budget" data-zh="预算">Budget:</strong> ${quote.budget || 'N/A'}</p>
                                        <p><strong data-en="Room Count" data-zh="房间数量">Room Count:</strong> ${quote.rooms ? quote.rooms.length : 'N/A'}</p>
                                        <p><strong data-en="Notes" data-zh="备注">Notes:</strong> ${quote.notes || 'N/A'}</p>
                                    </div>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
            </div>
        `;
    }
    
    // Open the modal
    openModal('customerDetailModal');
}

function editCustomer(email) {
    // Edit customer
    console.log('Editing customer:', email);
}

function editTimeSlot(slotId) {
    // Edit time slot
    console.log('Editing time slot:', slotId);
}

// Edit time slot status directly from calendar
function editTimeSlotStatus(slotElement) {
    const time = slotElement.dataset.time;
    const date = slotElement.dataset.date;
    const hasConfirmed = slotElement.dataset.hasConfirmed === 'true';
    
    // Check if this time slot has a confirmed appointment
    if (hasConfirmed) {
        showNotification('This time slot has a confirmed appointment and cannot be modified', 'warning');
        return;
    }
    
    const currentStatus = slotElement.classList.contains('available') ? 'available' : 
                         slotElement.classList.contains('unavailable') ? 'unavailable' : 
                         slotElement.classList.contains('onsite-measurement') ? 'onsite-measurement' :
                         slotElement.classList.contains('installation') ? 'installation' :
                         slotElement.classList.contains('maintenance') ? 'maintenance' :
                         slotElement.classList.contains('confirmed-measurement') ? 'confirmed-measurement' :
                         slotElement.classList.contains('confirmed-installation') ? 'confirmed-installation' :
                         slotElement.classList.contains('confirmed-maintenance') ? 'confirmed-maintenance' : 'no-slot';
    
    // Create modal for status selection
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.maxWidth = '400px';
    
    modalContent.innerHTML = `
        <div style="padding: 2rem;">
            <h3 style="margin-bottom: 1.5rem; color: #2c3e50;">Edit Time Slot Status</h3>
            <p style="margin-bottom: 1rem; color: #7f8c8d;">
                <strong>Date:</strong> ${formatDateString(date)}<br>
                <strong>Time:</strong> ${time === 'morning' ? 'Morning (9 AM - 12 PM)' : 'Afternoon (1 PM - 4 PM)'}
            </p>
            
            <div class="form-group">
                <label for="statusSelect" style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333;" data-en="Status:" data-zh="状态：">Status:</label>
                <select id="statusSelect" style="width: 100%; padding: 12px 15px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 1rem;">
                    <option value="available" data-en="Available" data-zh="可预约" ${currentStatus === 'available' ? 'selected' : ''}>Available</option>
                    <option value="unavailable" data-en="Unavailable" data-zh="不可预约" ${currentStatus === 'unavailable' ? 'selected' : ''}>Unavailable</option>
                    <option value="no-slot" data-en="No Slot" data-zh="无时间段" ${currentStatus === 'no-slot' ? 'selected' : ''}>No Slot</option>
                    <option value="onsite-measurement" data-en="On-site Measurement" data-zh="上门测量" ${currentStatus === 'onsite-measurement' ? 'selected' : ''}>On-site Measurement</option>
                    <option value="installation" data-en="Installation" data-zh="上门安装" ${currentStatus === 'installation' ? 'selected' : ''}>Installation</option>
                    <option value="maintenance" data-en="Maintenance" data-zh="维护" ${currentStatus === 'maintenance' ? 'selected' : ''}>Maintenance</option>
                    <option value="confirmed-measurement" data-en="Confirmed Measurement" data-zh="已确认测量" ${currentStatus === 'confirmed-measurement' ? 'selected' : ''}>Confirmed Measurement</option>
                    <option value="confirmed-installation" data-en="Confirmed Installation" data-zh="已确认安装" ${currentStatus === 'confirmed-installation' ? 'selected' : ''}>Confirmed Installation</option>
                    <option value="confirmed-maintenance" data-en="Confirmed Maintenance" data-zh="已确认维护" ${currentStatus === 'confirmed-maintenance' ? 'selected' : ''}>Confirmed Maintenance</option>
                </select>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
                <button class="btn btn-secondary" onclick="closeStatusEditModal()" style="background: #95a5a6; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">Cancel</button>
                <button class="btn btn-primary" onclick="saveTimeSlotStatus('${date}', '${time}')" style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">Save</button>
            </div>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeStatusEditModal();
        }
    });
}

// Close status edit modal
function closeStatusEditModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Save time slot status
function saveTimeSlotStatus(date, time) {
    const statusSelect = document.getElementById('statusSelect');
    if (!statusSelect) return;
    
    const newStatus = statusSelect.value;
    updateTimeSlotStatusInCalendar(date, time, newStatus);
    generateCalendarGrid(); // Refresh calendar
    closeStatusEditModal();
}

// Update time slot status in localStorage and calendar
function updateTimeSlotStatusInCalendar(date, time, status) {
    // Check if there's a confirmed appointment for this date and time
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    const confirmedAppointment = quotes.find(quote => 
        quote.type === 'onsite' && 
        quote.preferredDate === date && 
        quote.preferredTime === time && 
        quote.confirmed
    );
    
    if (confirmedAppointment) {
        showNotification('Cannot modify time slot with confirmed appointment', 'error');
        return;
    }
    
    const timeSlots = JSON.parse(localStorage.getItem('timeSlots') || '[]');
    
    if (status === 'no-slot') {
        // Remove the slot
        const updatedSlots = timeSlots.filter(slot => !(slot.date === date && slot.time === time));
        localStorage.setItem('timeSlots', JSON.stringify(updatedSlots));
        showNotification(`${time.toUpperCase()} slot removed for ${date}`, 'success');
    } else {
        // Update or create the slot
        let slotIndex = timeSlots.findIndex(slot => slot.date === date && slot.time === time);
        
        if (slotIndex === -1) {
            // Create new slot
            const newSlot = {
                id: Date.now().toString(),
                date: date,
                time: time,
                status: status,
                maxBookings: 3,
                currentBookings: 0,
                createdAt: new Date().toISOString()
            };
            timeSlots.push(newSlot);
        } else {
            // Update existing slot
            timeSlots[slotIndex].status = status;
        }
        
        localStorage.setItem('timeSlots', JSON.stringify(timeSlots));
        
        // Show appropriate notification based on status
        let statusText = status;
        if (status === 'onsite-measurement') statusText = 'On-site Measurement';
        else if (status === 'installation') statusText = 'Installation';
        else if (status === 'maintenance') statusText = 'Maintenance';
        else if (status === 'confirmed-measurement') statusText = 'Confirmed Measurement';
        else if (status === 'confirmed-installation') statusText = 'Confirmed Installation';
        else if (status === 'confirmed-maintenance') statusText = 'Confirmed Maintenance';
        
        showNotification(`${time.toUpperCase()} slot set to ${statusText} for ${date}`, 'success');
    }
}

// Batch edit time slots for multiple dates
function batchEditTimeSlots() {
    const selectedDates = getSelectedDates();
    if (selectedDates.length === 0) {
        alert('Please select dates first by clicking on them');
        return;
    }
    
    const time = prompt('Set time slot (morning/afternoon):');
    if (!time || !['morning', 'afternoon'].includes(time.toLowerCase())) {
        alert('Please enter: morning or afternoon');
        return;
    }
    
    const status = prompt('Set status (available/unavailable):');
    if (!status || !['available', 'unavailable'].includes(status.toLowerCase())) {
        alert('Please enter: available or unavailable');
        return;
    }
    
    let updatedCount = 0;
    selectedDates.forEach(date => {
        updateTimeSlotStatusInCalendar(date, time.toLowerCase(), status.toLowerCase());
        updatedCount++;
    });
    
    showNotification(`Updated ${updatedCount} dates for ${time} ${status}`, 'success');
    generateCalendarGrid(); // Refresh calendar
    clearSelectedDates();
}

// Get selected dates for batch editing
function getSelectedDates() {
    return Array.from(document.querySelectorAll('.calendar-day.selected'))
        .map(day => day.querySelector('.day-number').textContent)
        .filter(dayNum => {
            const dayElement = document.querySelector(`.calendar-day .day-number:contains('${dayNum}')`).closest('.calendar-day');
            return dayElement && dayElement.classList.contains('current-month');
        })
        .map(dayNum => {
            // Use local date components to avoid timezone issues
            const year = currentYear;
            const month = String(currentMonth + 1).padStart(2, '0');
            const day = String(parseInt(dayNum)).padStart(2, '0');
            return `${year}-${month}-${day}`;
        });
}

// Clear selected dates
function clearSelectedDates() {
    document.querySelectorAll('.calendar-day.selected').forEach(day => {
        day.classList.remove('selected');
    });
}

function scheduleAppointment() {
    openModal('appointmentModal');
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear admin session
        localStorage.removeItem('currentUser');
        
        // Redirect to admin login page
        window.location.href = 'admin-login.html';
    }
}

// Export functions for global use
window.openModal = openModal;
window.closeModal = closeModal;
window.switchTab = switchTab;
window.addTimeSlotForDate = addTimeSlotForDate;
window.deleteTimeSlot = deleteTimeSlot;
window.previousMonth = previousMonth;
window.nextMonth = nextMonth;
window.scheduleAppointment = scheduleAppointment;
window.viewCustomerDetails = viewCustomerDetails;
window.editCustomer = editCustomer;
window.editTimeSlot = editTimeSlot;
window.logout = logout;
window.batchEditTimeSlots = batchEditTimeSlots;
window.clearSelectedDates = clearSelectedDates;
window.closeStatusEditModal = closeStatusEditModal;
window.saveTimeSlotStatus = saveTimeSlotStatus;

