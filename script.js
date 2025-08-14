// Global variables
let currentLanguage = 'en';
let currentUser = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    setupSmoothScrolling();
    loadUserData();
    updateUserInterface(getCurrentUser());
    updatePageLanguage(currentLanguage);
    
    // Prevent Google Translate popup
    preventGoogleTranslate();
    
    // Load dynamic content from content management system
    loadDynamicContent();
    
    // Don't initialize date selectors here as the modal might not be open yet
});

// Prevent Google Translate popup
function preventGoogleTranslate() {
    // Remove Google Translate elements if they exist
    const translateElements = document.querySelectorAll('.goog-te-banner-frame, .goog-te-gadget, .goog-te-combo');
    translateElements.forEach(element => {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    });
    
    // Reset body position if it was modified by Google Translate
    if (document.body.style.top !== '') {
        document.body.style.top = '';
    }
    
    // Remove any Google Translate classes
    document.body.classList.remove('translated-ltr', 'translated-rtl');
}

// Language switching
function updatePageLanguage(lang) {
    currentLanguage = lang;
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Find and activate the button for the current language
    let activeButton = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
    if (!activeButton) {
        // Fallback: find button by text content or onclick attribute
        activeButton = document.querySelector(`.lang-btn[onclick*="'${lang}'"]`);
    }
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Update all text content
    document.querySelectorAll('[data-en][data-zh]').forEach(element => {
        if (lang === 'zh') {
            element.textContent = element.getAttribute('data-zh');
        } else {
            element.textContent = element.getAttribute('data-en');
        }
    });
    
    updateSelectOptionsLanguage();
}

// Update select options language
function updateSelectOptionsLanguage() {
    // Self quote modal selects
    const propertyTypeSelect = document.getElementById('selfPropertyType');
    const budgetSelect = document.getElementById('selfBudget');
    
    // Update self quote selects
    if (propertyTypeSelect) {
        Array.from(propertyTypeSelect.options).forEach(option => {
            if (option.getAttribute('data-en') && option.getAttribute('data-zh')) {
                option.textContent = currentLanguage === 'zh' ? 
                    option.getAttribute('data-zh') : 
                    option.getAttribute('data-en');
            }
        });
    }
    
    if (budgetSelect) {
        Array.from(budgetSelect.options).forEach(option => {
            if (option.getAttribute('data-en') && option.getAttribute('data-zh')) {
                option.textContent = currentLanguage === 'zh' ? 
                    option.getAttribute('data-zh') : 
                    option.getAttribute('data-en');
            }
        });
    }
}

// Smooth scrolling setup
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Modal management
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Tab switching
function switchTab(tabName, event) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName + 'Form').classList.add('active');
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

// Dashboard tab switching
function switchDashboardTab(tabName) {
    document.querySelectorAll('.dashboard-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelectorAll('.dashboard-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    const selectedBtn = document.querySelector(`[onclick="switchDashboardTab('${tabName}')"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
    
    // Load specific content for appointments tab
    if (tabName === 'appointments') {
        loadUserAppointments();
    }
    
    // Load specific content for quotes tab
    if (tabName === 'quotes') {
        loadUserQuotes();
    }
}

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize date selectors
function initializeDateSelectors() {
    const daySelect = document.getElementById('onsiteDateDay');
    const yearSelect = document.getElementById('onsiteDateYear');
    
    if (daySelect) {
        // Add days 1-31
        for (let i = 1; i <= 31; i++) {
            const option = document.createElement('option');
            option.value = i.toString().padStart(2, '0');
            option.textContent = i.toString();
            daySelect.appendChild(option);
        }
    }
    
    if (yearSelect) {
        // Add years from current year to 5 years ahead
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i <= currentYear + 5; i++) {
            const option = document.createElement('option');
            option.value = i.toString();
            option.textContent = i.toString();
            yearSelect.appendChild(option);
        }
    }
    
    // Load appointment calendar
    loadAppointmentCalendar();
}

// Calendar variables
let currentCalendarMonth = new Date().getMonth();
let currentCalendarYear = new Date().getFullYear();
let selectedDate = null;
let selectedTimeSlot = null;

// Load appointment calendar
function loadAppointmentCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const monthTitle = document.getElementById('calendarMonthTitle');
    
    if (!calendarGrid || !monthTitle) return;
    
    // Update month title
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    monthTitle.textContent = `${monthNames[currentCalendarMonth]} ${currentCalendarYear}`;
    
    // Get first day of month and number of days
    const firstDay = new Date(currentCalendarYear, currentCalendarMonth, 1);
    const lastDay = new Date(currentCalendarYear, currentCalendarMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    let calendarHTML = `
        <div class="calendar-weekdays">
            <div class="weekday">Sun</div>
            <div class="weekday">Mon</div>
            <div class="weekday">Tue</div>
            <div class="weekday">Wed</div>
            <div class="weekday">Thu</div>
            <div class="weekday">Fri</div>
            <div class="weekday">Sat</div>
        </div>
    `;
    
    // Generate calendar days
    for (let week = 0; week < 6; week++) {
        calendarHTML += '<div class="calendar-week">';
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + (week * 7) + dayIndex);
            
            const isCurrentMonth = currentDate.getMonth() === currentCalendarMonth;
            const isToday = currentDate.toDateString() === new Date().toDateString();
            const isPast = currentDate < new Date();
            const isFuture = currentDate > new Date();
            const isWithin14Days = (currentDate - new Date()) <= (14 * 24 * 60 * 60 * 1000);
            
            // Check if date has available time slots - use local date to avoid timezone issues
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const dayOfMonth = String(currentDate.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${dayOfMonth}`;
            const availableSlots = getAvailableTimeSlotsForDate(dateString);
            const hasAvailableSlots = availableSlots.length > 0;
            
            let dayClass = 'calendar-day';
            if (!isCurrentMonth) dayClass += ' other-month';
            if (isToday) dayClass += ' today';
            if (isPast) dayClass += ' past';
            if (hasAvailableSlots && isWithin14Days) dayClass += ' available';
            if (!isWithin14Days) dayClass += ' disabled';
            
            calendarHTML += `
                <div class="${dayClass}" 
                     data-date="${dateString}"
                     onclick="${hasAvailableSlots && isWithin14Days ? 'selectDate(this)' : ''}">
                    <div class="day-number">${currentDate.getDate()}</div>
                    ${hasAvailableSlots && isWithin14Days ? '<div class="available-indicator"></div>' : ''}
                </div>
            `;
        }
        calendarHTML += '</div>';
    }
    
    calendarGrid.innerHTML = calendarHTML;
}

// Get available time slots for a specific date
function getAvailableTimeSlotsForDate(date) {
    const timeSlots = JSON.parse(localStorage.getItem('timeSlots') || '[]');
    return timeSlots.filter(slot => 
        slot.date === date && 
        slot.status === 'available'
    );
}

// Format date string to avoid timezone issues
function formatDateString(dateStr) {
    if (!dateStr) return 'N/A';
    const [year, month, day] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString();
}

// Select a date on the calendar
function selectDate(dayElement) {
    const date = dayElement.dataset.date;
    selectedDate = date;
    
    // Remove previous selection
    document.querySelectorAll('.calendar-day.selected').forEach(day => {
        day.classList.remove('selected');
    });
    
    // Add selection to current day
    dayElement.classList.add('selected');
    
    // Show time slot selection
    showTimeSlotSelection(date);
}

// Show time slot selection for selected date
function showTimeSlotSelection(date) {
    const availableSlots = getAvailableTimeSlotsForDate(date);
    const selectedSlotInfo = document.getElementById('selectedSlotInfo');
    const selectedSlotDetails = document.getElementById('selectedSlotDetails');
    
    if (availableSlots.length === 0) {
        selectedSlotInfo.style.display = 'none';
        return;
    }
    
    let slotsHTML = '<div class="time-slot-options">';
    availableSlots.forEach(slot => {
        const isSelected = selectedTimeSlot && selectedTimeSlot.id === slot.id;
        // Create time range display based on time value
        const timeRange = slot.time === 'morning' ? 'Morning (9 AM - 12 PM)' : 
                         slot.time === 'afternoon' ? 'Afternoon (1 PM - 4 PM)' : 
                         slot.time === 'evening' ? 'Evening (5 PM - 7 PM)' : slot.time;
        
        slotsHTML += `
            <div class="time-slot-option ${isSelected ? 'selected' : ''}" 
                 onclick="selectTimeSlot('${slot.id}', '${slot.time}', '${timeRange}', event)">
                <span class="time-slot-time">${timeRange}</span>
                <span class="time-slot-status">Available</span>
            </div>
        `;
    });
    slotsHTML += '</div>';
    
    // Add confirm button
    slotsHTML += `
        <div class="time-slot-confirm" style="margin-top: 1rem; text-align: center;">
            <button type="button" class="btn btn-primary" onclick="confirmTimeSlotSelection()" 
                    style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                <span data-en="Confirm Selection" data-zh="确认选择">Confirm Selection</span>
            </button>
        </div>
    `;
    
    // Fix date display issue by using local date parsing
    const [year, month, day] = date.split('-');
    const displayDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    selectedSlotDetails.innerHTML = `
        <strong>Date:</strong> ${formatDateString(date)}<br>
        ${slotsHTML}
    `;
    
    selectedSlotInfo.style.display = 'block';
}

// Select a time slot
function selectTimeSlot(slotId, time, timeRange, event) {
    selectedTimeSlot = { id: slotId, time: time, timeRange: timeRange };
    
    // Update visual selection
    document.querySelectorAll('.time-slot-option').forEach(option => {
        option.classList.remove('selected');
    });
    if (event && event.target) {
        const timeSlotOption = event.target.closest('.time-slot-option');
        if (timeSlotOption) {
            timeSlotOption.classList.add('selected');
        }
    }
    
    // Update form fields
    const onsiteDate = document.getElementById('onsiteDate');
    if (onsiteDate) {
        onsiteDate.value = selectedDate;
    }
    
    const onsiteTime = document.getElementById('onsiteTime');
    if (onsiteTime) {
        onsiteTime.value = time;
    }
}

// Confirm time slot selection
function confirmTimeSlotSelection() {
    if (!selectedTimeSlot) {
        alert('Please select a time slot first');
        return;
    }
    
    // Show success message
    const selectedSlotInfo = document.getElementById('selectedSlotInfo');
    const selectedSlotDetails = document.getElementById('selectedSlotDetails');
    
    // Fix date display issue by using local date parsing
    const [year, month, day] = selectedDate.split('-');
    const displayDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    selectedSlotDetails.innerHTML = `
        <div style="text-align: center; color: #27ae60; padding: 1rem;">
            <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
            <h4 style="margin: 0.5rem 0; color: #27ae60;">Time Slot Confirmed!</h4>
            <p style="margin: 0; color: #7f8c8d;">
                <strong>Date:</strong> ${formatDateString(selectedDate)}<br>
                <strong>Time:</strong> ${selectedTimeSlot.timeRange}
            </p>
        </div>
    `;
    
    selectedSlotInfo.style.display = 'block';
}

// Navigate to previous month
function previousMonth() {
    currentCalendarMonth--;
    if (currentCalendarMonth < 0) {
        currentCalendarMonth = 11;
        currentCalendarYear--;
    }
    loadAppointmentCalendar();
}

// Navigate to next month
function nextMonth() {
    currentCalendarMonth++;
    if (currentCalendarMonth > 11) {
        currentCalendarMonth = 0;
        currentCalendarYear++;
    }
    loadAppointmentCalendar();
}

// Check if a specific date and time is available
function isTimeSlotAvailable(date, time) {
    const timeSlots = JSON.parse(localStorage.getItem('timeSlots') || '[]');
    const slot = timeSlots.find(s => 
        s.date === date && 
        s.time === time && 
        s.status === 'available'
    );
    
    return slot && (slot.maxBookings - slot.currentBookings) > 0;
}

// Get available time slots for a specific date
function getAvailableTimeSlotsForDate(date) {
    const timeSlots = JSON.parse(localStorage.getItem('timeSlots') || '[]');
    return timeSlots.filter(slot => 
        slot.date === date && 
        slot.status === 'available'
    );
}

// Quote modals
function openQuoteModal() {
    openOnsiteQuote();
}

// Open on-site quote modal
function openOnsiteQuote() {
    // Check if user is logged in
    if (!isLoggedIn()) {
        // Show message that registration is required
        showNotification(
            currentLanguage === 'zh' 
                ? '上门测量需要先注册并登录账户。' 
                : 'On-site measurement requires registration and login first.',
            'error'
        );
        openModal('loginModal');
        return;
    }
    openModal('onsiteQuoteModal');
    // Initialize date selectors after modal is opened
    setTimeout(() => {
        initializeDateSelectors();
    }, 100);
}

// Open self measurement quote modal
function openSelfQuote() {
    // Check if user is logged in
    if (!isLoggedIn()) {
        // Show message that registration is required
        showNotification(
            currentLanguage === 'zh' 
                ? '自助量尺需要先注册账户，请先登录或注册' 
                : 'Self measurement requires account registration. Please login or register first',
            'warning'
        );
        // Open login modal instead
        openLoginModal();
        return;
    }
    openModal('selfQuoteModal');
    initializeSelfQuote();
}

// Initialize self quote functionality
function initializeSelfQuote() {
    // Clear previous content
    const roomsContainer = document.getElementById('roomsContainer');
    if (roomsContainer) {
        roomsContainer.innerHTML = '';
    }
    
    // Reset counters
    if (document.getElementById('totalRooms')) {
        document.getElementById('totalRooms').textContent = '0';
    }
    if (document.getElementById('totalWindows')) {
        document.getElementById('totalWindows').textContent = '0';
    }
    if (document.getElementById('estimatedPrice')) {
        document.getElementById('estimatedPrice').textContent = '$0.00';
    }
    
    // Add initial room
    addRoom();
}

// Self quote form setup
function setupSelfQuoteForm() {
    const roomsContainer = document.getElementById('roomsContainer');
    const roomCount = parseInt(document.getElementById('selfRoomCount').value);
    
    if (roomsContainer) {
        roomsContainer.innerHTML = '';
        
        for (let i = 0; i < roomCount; i++) {
            addRoom();
        }
    }
    
    updateSelectOptionsLanguage();
}

// Room management functions
function addRoom() {
    const roomsContainer = document.getElementById('roomsContainer');
    if (!roomsContainer) return;
    
    const roomIndex = roomsContainer.children.length;
    
    const roomItem = document.createElement('div');
    roomItem.className = 'room-item';
    roomItem.innerHTML = `
        <div class="room-header">
            <div class="room-title">
                <h4 data-en="Room ${roomIndex + 1}" data-zh="房间 ${roomIndex + 1}">Room ${roomIndex + 1}</h4>
                <span class="room-type-label" data-en="Select room type" data-zh="选择房间类型">Select room type</span>
            </div>
            <div class="room-actions">
                <button type="button" onclick="removeRoom(${roomIndex})" class="btn btn-danger btn-sm" title="Remove Room">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="room-config">
            <div class="room-type-selector">
                <select name="roomType_${roomIndex}" required onchange="updateRoomTypeLabel(this, ${roomIndex})">
                    <option value="" data-en="Select Room Type" data-zh="选择房间类型">Select Room Type</option>
                    <option value="living-room" data-en="Living Room" data-zh="客厅">Living Room</option>
                    <option value="bedroom" data-en="Bedroom" data-zh="卧室">Bedroom</option>
                    <option value="kitchen" data-en="Kitchen" data-zh="厨房">Kitchen</option>
                    <option value="dining-room" data-en="Dining Room" data-zh="餐厅">Dining Room</option>
                    <option value="bathroom" data-en="Bathroom" data-zh="浴室">Bathroom</option>
                    <option value="office" data-en="Office" data-zh="办公室">Office</option>
                    <option value="family-room" data-en="Family Room" data-zh="家庭室">Family Room</option>
                    <option value="basement" data-en="Basement" data-zh="地下室">Basement</option>
                    <option value="attic" data-en="Attic" data-zh="阁楼">Attic</option>
                </select>
            </div>
            <div class="windows-section">
                <div class="windows-header">
                    <h5 data-en="Windows" data-zh="窗户">Windows</h5>
                    <div class="window-actions">
                        <button type="button" onclick="addWindowToRoom(${roomIndex})" class="btn btn-primary btn-sm">
                            <i class="fas fa-plus"></i> <span data-en="Add Window" data-zh="添加窗户">Add Window</span>
                        </button>
                        <button type="button" onclick="addMultipleWindowsToRoom(${roomIndex})" class="btn btn-secondary btn-sm">
                            <i class="fas fa-plus"></i> <span data-en="Add Multiple" data-zh="添加多个">Add Multiple</span>
                        </button>
                        <button type="button" onclick="clearAllWindowsInRoom(${roomIndex})" class="btn btn-outline-danger btn-sm">
                            <i class="fas fa-trash"></i> <span data-en="Clear All" data-zh="清空所有">Clear All</span>
                        </button>
                    </div>
                </div>
                <div class="windows-list" id="windowsList_${roomIndex}">
                    <!-- Windows will be added here -->
                </div>
            </div>
        </div>
    `;
    
    roomsContainer.appendChild(roomItem);
    addWindowToRoom(roomIndex);
    updateRoomNumbers();
    updatePageLanguage(currentLanguage);
}

function updateRoomNumbers() {
    const roomItems = document.querySelectorAll('.room-item');
    roomItems.forEach((item, index) => {
        const header = item.querySelector('.room-header h4');
        header.textContent = currentLanguage === 'zh' ? `房间 ${index + 1}` : `Room ${index + 1}`;
        
        const windowsList = item.querySelector('.windows-list');
        if (windowsList) {
            windowsList.id = `windowsList_${index}`;
        }
        
        const addBtn = item.querySelector('[onclick*="addWindowToRoom"]');
        if (addBtn) {
            addBtn.setAttribute('onclick', `addWindowToRoom(${index})`);
        }
        
        const addMultipleBtn = item.querySelector('[onclick*="addMultipleWindowsToRoom"]');
        if (addMultipleBtn) {
            addMultipleBtn.setAttribute('onclick', `addMultipleWindowsToRoom(${index})`);
        }
        
        const clearBtn = item.querySelector('[onclick*="clearAllWindowsInRoom"]');
        if (clearBtn) {
            clearBtn.setAttribute('onclick', `clearAllWindowsInRoom(${index})`);
        }
        
        // Update room type label
        const roomTypeSelect = item.querySelector('select[name^="roomType_"]');
        if (roomTypeSelect) {
            updateRoomTypeLabel(roomTypeSelect, index);
        }
    });
}

// Window management functions
function addWindowToRoom(roomIndex) {
    const windowsList = document.getElementById(`windowsList_${roomIndex}`);
    const windowIndex = windowsList.children.length;
    
    const windowItem = document.createElement('div');
    windowItem.className = 'window-item';
    windowItem.innerHTML = `
        <div class="window-item-header">
            <div class="window-title">
                <h6 data-en="Window ${windowIndex + 1}" data-zh="窗户 ${windowIndex + 1}">Window ${windowIndex + 1}</h6>
                <span class="window-type-label" data-en="Select window type" data-zh="选择窗户类型">Select window type</span>
                <span class="curtain-type-label" data-en="Select curtain type" data-zh="选择窗帘类型">Select curtain type</span>
            </div>
            <button type="button" onclick="removeWindowFromRoom(this, ${roomIndex})" class="btn btn-danger btn-xs" title="Remove Window">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="window-config">
            <div class="window-type-row">
                <div class="window-type-selector">
                    <select name="windowType_${roomIndex}_${windowIndex}" required onchange="updateWindowTypeLabel(this, ${roomIndex}, ${windowIndex})">
                        <option value="" data-en="Select Window Type" data-zh="选择窗户类型">Select Window Type</option>
                        <option value="casement" data-en="Casement" data-zh="平开窗">Casement</option>
                        <option value="double-hung" data-en="Double Hung" data-zh="双悬窗">Double Hung</option>
                        <option value="bay" data-en="Bay" data-zh="凸窗">Bay</option>
                        <option value="picture" data-en="Picture" data-zh="落地窗">Picture</option>
                        <option value="sliding" data-en="Sliding" data-zh="推拉窗">Sliding</option>
                    </select>
                </div>
                <div class="curtain-type-selector">
                    <select name="curtainType_${roomIndex}_${windowIndex}" onchange="updateCurtainTypeLabel(this, ${roomIndex}, ${windowIndex})">
                        <option value="" data-en="Select Curtain Type" data-zh="选择窗帘类型">Select Curtain Type</option>
                        <option value="roller" data-en="Roller Blind" data-zh="卷帘">Roller Blind</option>
                        <option value="venetian" data-en="Venetian Blind" data-zh="百叶帘">Venetian Blind</option>
                        <option value="roman" data-en="Roman Shade" data-zh="罗马帘">Roman Shade</option>
                        <option value="curtain" data-en="Curtain" data-zh="布艺窗帘">Curtain</option>
                        <option value="none" data-en="No Curtain" data-zh="无需窗帘">No Curtain</option>
                    </select>
                </div>
            </div>
            <div class="window-dimensions">
                <div class="dimension-group">
                    <label data-en="Width (ft)" data-zh="宽度 (英尺)">Width (ft)</label>
                    <input type="number" name="windowWidth_${roomIndex}_${windowIndex}" step="0.1" min="0.1" required>
                </div>
                <div class="dimension-group">
                    <label data-en="Height (ft)" data-zh="高度 (英尺)">Height (ft)</label>
                    <input type="number" name="windowHeight_${roomIndex}_${windowIndex}" step="0.1" min="0.1" required>
                </div>
                <div class="dimension-group">
                    <label data-en="Quantity" data-zh="数量">Quantity</label>
                    <input type="number" name="windowQuantity_${roomIndex}_${windowIndex}" min="1" value="1" required>
                </div>
            </div>
        </div>
    `;
    
    windowsList.appendChild(windowItem);
    updateWindowNumbersInRoom(roomIndex);
    updatePageLanguage(currentLanguage);
}

function removeWindowFromRoom(button, roomIndex) {
    const windowItem = button.closest('.window-item');
    windowItem.remove();
    updateWindowNumbersInRoom(roomIndex);
}

function updateWindowNumbersInRoom(roomIndex) {
    const windowsList = document.getElementById(`windowsList_${roomIndex}`);
    const windowItems = windowsList.querySelectorAll('.window-item');
    
    windowItems.forEach((item, index) => {
        const header = item.querySelector('.window-item-header h6');
        header.textContent = currentLanguage === 'zh' ? `窗户 ${index + 1}` : `Window ${index + 1}`;
        
        const inputs = item.querySelectorAll('input, select');
        inputs.forEach(input => {
            const oldName = input.name;
            const newName = oldName.replace(/_\d+$/, `_${index}`);
            input.name = newName;
        });
        
        // Update window type label
        const windowTypeSelect = item.querySelector('select[name^="windowType_"]');
        if (windowTypeSelect) {
            updateWindowTypeLabel(windowTypeSelect, roomIndex, index);
        }
        
        // Update curtain type label
        const curtainTypeSelect = item.querySelector('select[name^="curtainType_"]');
        if (curtainTypeSelect) {
            updateCurtainTypeLabel(curtainTypeSelect, roomIndex, index);
        }
    });
}

function addMultipleWindowsToRoom(roomIndex) {
    const count = prompt(currentLanguage === 'zh' ? '请输入要添加的窗户数量:' : 'Enter the number of windows to add:');
    if (count && !isNaN(count) && count > 0) {
        for (let i = 0; i < parseInt(count); i++) {
            addWindowToRoom(roomIndex);
        }
    }
}

function clearAllWindowsInRoom(roomIndex) {
    const windowsList = document.getElementById(`windowsList_${roomIndex}`);
    windowsList.innerHTML = '';
}

// Update room type label
function updateRoomTypeLabel(select, roomIndex) {
    const roomItem = select.closest('.room-item');
    const typeLabel = roomItem.querySelector('.room-type-label');
    const selectedOption = select.options[select.selectedIndex];
    
    if (selectedOption.value) {
        typeLabel.textContent = selectedOption.textContent;
        typeLabel.style.color = '#27ae60';
    } else {
        typeLabel.textContent = currentLanguage === 'zh' ? '选择房间类型' : 'Select room type';
        typeLabel.style.color = '#95a5a6';
    }
}

// Update window type label
function updateWindowTypeLabel(select, roomIndex, windowIndex) {
    const windowItem = select.closest('.window-item');
    const typeLabel = windowItem.querySelector('.window-type-label');
    const selectedOption = select.options[select.selectedIndex];
    
    if (selectedOption.value) {
        typeLabel.textContent = selectedOption.textContent;
        typeLabel.style.color = '#27ae60';
    } else {
        typeLabel.textContent = currentLanguage === 'zh' ? '选择窗户类型' : 'Select window type';
        typeLabel.style.color = '#95a5a6';
    }
}

// Update curtain type label
function updateCurtainTypeLabel(select, roomIndex, windowIndex) {
    const windowItem = select.closest('.window-item');
    const typeLabel = windowItem.querySelector('.curtain-type-label');
    const selectedOption = select.options[select.selectedIndex];
    
    if (selectedOption.value) {
        typeLabel.textContent = selectedOption.textContent;
        typeLabel.style.color = '#27ae60';
    } else {
        typeLabel.textContent = currentLanguage === 'zh' ? '选择窗帘类型' : 'Select curtain type';
        typeLabel.style.color = '#95a5a6';
    }
}

// Remove room function
function removeRoom(roomIndex) {
    if (confirm(currentLanguage === 'zh' ? '确定要删除这个房间吗？' : 'Are you sure you want to remove this room?')) {
        const roomItem = document.querySelector(`.room-item:nth-child(${roomIndex + 1})`);
        if (roomItem) {
            roomItem.remove();
            updateRoomNumbers();
        }
    }
}

// Check login for self quote
function checkLoginForSelfQuote() {
    const user = getCurrentUser();
    if (!user) {
        showNotification(
            currentLanguage === 'zh' ? '请先登录后再进行自助量尺报价。' : 'Please login first before starting self measurement quote.',
            'warning'
        );
        openModal('loginModal');
        return;
    }
    
    openSelfQuote();
}

// Save self quote draft
function saveSelfQuote() {
    const quoteData = collectSelfQuoteData();
    
    if (quoteData.rooms.length === 0) {
        showNotification(
            currentLanguage === 'zh' ? '请至少添加一个房间。' : 'Please add at least one room.',
            'warning'
        );
        return;
    }
    
    // Save to localStorage
    const drafts = JSON.parse(localStorage.getItem('selfQuoteDrafts') || '[]');
    const draftId = 'draft_' + Date.now();
    quoteData.id = draftId;
    quoteData.savedAt = new Date().toISOString();
    drafts.push(quoteData);
    localStorage.setItem('selfQuoteDrafts', JSON.stringify(drafts));
    
    showNotification(
        currentLanguage === 'zh' ? '草稿已保存！' : 'Draft saved successfully!',
        'success'
    );
}

// Preview self quote
function previewSelfQuote() {
    const quoteData = collectSelfQuoteData();
    
    if (quoteData.rooms.length === 0) {
        showNotification(
            currentLanguage === 'zh' ? '请至少添加一个房间。' : 'Please add at least one room.',
            'warning'
        );
        return;
    }
    
    let totalWindows = 0;
    quoteData.rooms.forEach(room => {
        totalWindows += room.windows.length;
    });
    
    if (totalWindows === 0) {
        showNotification(
            currentLanguage === 'zh' ? '请至少添加一个窗户。' : 'Please add at least one window.',
            'warning'
        );
        return;
    }
    
    // Populate preview modal
    populateQuotePreview(quoteData);
    
    // Show preview modal
    openModal('quotePreviewModal');
}

// Populate quote preview
function populateQuotePreview(quoteData) {
    // Property information
    const propertyType = document.getElementById('selfPropertyType');
    const budget = document.getElementById('selfBudget');
    const notes = document.getElementById('selfNotes');
    
    document.getElementById('previewPropertyType').textContent = propertyType.value ? propertyType.options[propertyType.selectedIndex].textContent : '-';
    document.getElementById('previewBudget').textContent = budget.value ? budget.options[budget.selectedIndex].textContent : '-';
    document.getElementById('previewNotes').textContent = notes.value || '-';
    
    // Rooms summary
    const roomsSummary = document.getElementById('previewRoomsSummary');
    let roomsHTML = '';
    
    quoteData.rooms.forEach((room, roomIndex) => {
        roomsHTML += `
            <div class="room-summary">
                <div class="room-summary-header">
                    <h4>${currentLanguage === 'zh' ? '房间' : 'Room'} ${roomIndex + 1}: ${getRoomTypeName(room.type)}</h4>
                    <span class="window-count">${room.windows.length} ${currentLanguage === 'zh' ? '个窗户' : 'windows'}</span>
                </div>
                <div class="windows-summary">
                    ${room.windows.map((window, windowIndex) => `
                        <div class="window-summary">
                            <span class="window-type">${getWindowTypeName(window.type)}</span>
                            <span class="curtain-type">${getCurtainTypeName(window.curtainType)}</span>
                            <span class="window-dimensions">${window.width}' × ${window.height}'</span>
                            <span class="window-quantity">×${window.quantity}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    roomsSummary.innerHTML = roomsHTML;
    
    // Quote summary
    const totalRooms = quoteData.rooms.length;
    let totalWindows = 0;
    
    quoteData.rooms.forEach(room => {
        totalWindows += room.windows.length;
    });
    
    document.getElementById('previewTotalRooms').textContent = totalRooms;
    document.getElementById('previewTotalWindows').textContent = totalWindows;
}

// Submit self quote
function submitSelfQuote() {
    const quoteData = collectSelfQuoteData();
    
    // Generate unique ID
    quoteData.id = 'quote_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    quoteData.type = 'self';
    quoteData.date = new Date().toISOString();
    quoteData.userId = getCurrentUserId();
    quoteData.status = 'pending';
    
    // Save to localStorage
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    quotes.push(quoteData);
    localStorage.setItem('quotes', JSON.stringify(quotes));
    
    // Close preview modal
    closeModal('quotePreviewModal');
    
    // Show success message
    showNotification(
        currentLanguage === 'zh' ? '你的询价已提交，我们将在24小时内回复报价，请在我的报价中查询。' : 'Your inquiry has been submitted. We will respond within 24 hours. Please check in My Quotes.',
        'success'
    );
    
    // Close self quote modal
    closeModal('selfQuoteModal');
    
    // Reset form
    resetSelfQuoteForm();
}

// Collect self quote data
function collectSelfQuoteData() {
    const rooms = collectSelfRoomsAndWindows();
    
    return {
        propertyType: document.getElementById('selfPropertyType').value,
        budget: document.getElementById('selfBudget').value,
        notes: document.getElementById('selfNotes').value,
        rooms: rooms
    };
}

// Reset self quote form
function resetSelfQuoteForm() {
    document.getElementById('selfPropertyType').value = '';
    document.getElementById('selfBudget').value = '';
    document.getElementById('selfNotes').value = '';
    
    const roomsContainer = document.getElementById('roomsContainer');
    if (roomsContainer) {
        roomsContainer.innerHTML = '';
    }
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

// Quote form submissions
function handleOnsiteQuoteSubmission(event) {
    event.preventDefault();
    
    // Get selected date and time from calendar
    if (!selectedDate || !selectedTimeSlot) {
        showNotification(
            currentLanguage === 'zh' 
                ? '请先选择预约日期和时间段' 
                : 'Please select appointment date and time slot first',
            'error'
        );
        return;
    }
    
    const formData = {
        name: document.getElementById('onsiteName').value,
        phone: document.getElementById('onsitePhone').value,
        email: document.getElementById('onsiteEmail').value,
        address: document.getElementById('onsiteAddress').value,
        city: document.getElementById('onsiteCity').value,
        zipCode: document.getElementById('onsiteZIP').value,
        propertyType: document.getElementById('onsitePropertyType').value,
        roomCount: document.getElementById('onsiteRooms').value,
        preferredDate: selectedDate,
        preferredTime: selectedTimeSlot.time,
        notes: document.getElementById('onsiteNotes').value,
        type: 'onsite',
        date: new Date().toISOString()
    };
    
    // Show confirmation popup
    showConfirmationPopup(
        currentLanguage === 'zh' 
            ? '已收到预约信息，我们会尽快与你联系确认。' 
            : 'Appointment information received, we will contact you soon to confirm.',
        currentLanguage === 'zh' ? '预约确认' : 'Appointment Confirmation',
        () => {
            // Check if user is logged in
            if (!isLoggedIn()) {
                // Create account automatically using the provided information
                createAccountFromOnsiteQuote(formData);
            } else {
                // User is logged in, just submit the quote
                submitOnsiteQuote(formData);
            }
        }
    );
}

// Create account automatically from on-site quote
function createAccountFromOnsiteQuote(formData) {
    // Generate a random password for the new account
    const tempPassword = generateTempPassword();
    
    const accountData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: '', // No state field in new form
        zipCode: formData.zipCode,
        password: tempPassword,
        userType: 'onsite' // Mark as on-site measurement user
    };
    
    // Create the account
    const newUser = createAppointmentUser(accountData);
    if (newUser) {
        // Auto-login the user
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        currentUser = newUser;
        updateUserInterface(newUser);
        
        // Submit the quote with user ID
        formData.userId = newUser.email; // Use email as userId for compatibility
        submitOnsiteQuote(formData);
        
        // Show success message with account info
        showSuccessMessage(
            currentLanguage === 'zh' 
                ? `账户创建成功！临时密码：${tempPassword}，请及时修改密码` 
                : `Account created successfully! Temporary password: ${tempPassword}, please change it soon`,
            currentLanguage === 'zh' ? '账户创建成功' : 'Account Created'
        );
    } else {
        showSuccessMessage(
            currentLanguage === 'zh' ? '账户创建失败' : 'Account creation failed',
            'error'
        );
    }
}

// Submit on-site quote
function submitOnsiteQuote(formData) {
    // Ensure userId is set
    if (!formData.userId && isLoggedIn()) {
        formData.userId = getCurrentUserId();
    }
    
    // Generate unique ID for the appointment
    formData.id = 'appointment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Save to localStorage
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    quotes.push(formData);
    localStorage.setItem('quotes', JSON.stringify(quotes));
    
    // Show success message
    showSuccessMessage(
        currentLanguage === 'zh' 
            ? '预约成功！我们会尽快联系您安排上门测量。' 
            : 'Appointment booked successfully! We will contact you soon to schedule the on-site measurement.',
        currentLanguage === 'zh' ? '预约成功' : 'Appointment Booked'
    );
    
    // Close modal and reset form
    closeModal('onsiteQuoteModal');
    document.getElementById('onsiteQuoteForm').reset();
}

// Helper functions for address parsing
function extractCityFromAddress(address) {
    // Simple city extraction - you might want to improve this
    const parts = address.split(',');
    return parts.length > 1 ? parts[1].trim() : '';
}

function extractStateFromAddress(address) {
    const parts = address.split(',');
    return parts.length > 2 ? parts[2].trim() : '';
}

function extractZipFromAddress(address) {
    const parts = address.split(',');
    return parts.length > 3 ? parts[3].trim() : '';
}

// Generate temporary password
function generateTempPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

function handleSelfQuoteSubmission(event) {
    event.preventDefault();
    
    // Check if user is logged in
    if (!isLoggedIn()) {
        showSuccessMessage(
            currentLanguage === 'zh' 
                ? '自助量尺需要先登录账户，请先登录或注册' 
                : 'Self measurement requires account login. Please login or register first',
            'error'
        );
        openLoginModal();
        return;
    }
    
    const rooms = collectSelfRoomsAndWindows();
    
    if (rooms.length === 0) {
        alert(currentLanguage === 'zh' ? '请至少添加一个房间。' : 'Please add at least one room.');
        return;
    }
    
    let totalWindows = 0;
    rooms.forEach(room => {
        totalWindows += room.windows.length;
    });
    
    if (totalWindows === 0) {
        alert(currentLanguage === 'zh' ? '请至少添加一个窗户。' : 'Please add at least one window.');
        return;
    }
    
    const quoteData = {
        id: 'quote_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        rooms: rooms,
        propertyType: document.getElementById('selfPropertyType').value,
        budget: document.getElementById('selfBudget').value,
        notes: document.getElementById('selfNotes').value,
        type: 'self',
        date: new Date().toISOString(),
        userId: getCurrentUserId() // Add user ID
    };
    
    // Save to localStorage
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    quotes.push(quoteData);
    localStorage.setItem('quotes', JSON.stringify(quotes));
    
    // Generate quote table
    generateQuoteTable(quoteData);
    
    // Show success message
    showSuccessMessage(
        currentLanguage === 'zh' 
            ? '自助量尺报价已生成成功！' 
            : 'Self measurement quote generated successfully!',
        currentLanguage === 'zh' ? '报价生成成功' : 'Quote Generated'
    );
}

// Collect rooms and windows data
function collectSelfRoomsAndWindows() {
    const rooms = [];
    const roomItems = document.querySelectorAll('.room-item');
    
    roomItems.forEach((roomItem, roomIndex) => {
        const roomType = roomItem.querySelector('select[name^="roomType_"]').value;
        const windows = [];
        
        const windowItems = roomItem.querySelectorAll('.window-item');
        windowItems.forEach((windowItem, windowIndex) => {
            const windowType = windowItem.querySelector('select[name^="windowType_"]').value;
            const curtainType = windowItem.querySelector('select[name^="curtainType_"]').value;
            const width = parseFloat(windowItem.querySelector('input[name^="windowWidth_"]').value);
            const height = parseFloat(windowItem.querySelector('input[name^="windowHeight_"]').value);
            const quantity = parseInt(windowItem.querySelector('input[name^="windowQuantity_"]').value);
            
            if (windowType && width && height && quantity) {
                windows.push({
                    type: windowType,
                    curtainType: curtainType || 'none',
                    width: width,
                    height: height,
                    quantity: quantity
                });
            }
        });
        
        if (roomType && windows.length > 0) {
            rooms.push({
                type: roomType,
                windows: windows
            });
        }
    });
    
    return rooms;
}

// Generate quote
function generateQuote() {
    const rooms = collectSelfRoomsAndWindows();
    
    if (rooms.length === 0) {
        showNotification(
            currentLanguage === 'zh' ? '请至少添加一个房间。' : 'Please add at least one room.',
            'error'
        );
        return;
    }
    
    let totalWindows = 0;
    rooms.forEach(room => {
        totalWindows += room.windows.length;
    });
    
    if (totalWindows === 0) {
        showNotification(
            currentLanguage === 'zh' ? '请至少添加一个窗户。' : 'Please add at least one window.',
            'error'
        );
        return;
    }
    
    // Show quote summary
    const quoteSummary = document.getElementById('quoteSummary');
    if (quoteSummary) {
        quoteSummary.style.display = 'block';
    }
    
    // Update summary values
    updateQuoteSummary(rooms);
    
    const quoteData = {
        rooms: rooms,
        notes: '',
        type: 'self',
        date: new Date().toISOString(),
        userId: getCurrentUserId()
    };
    
    // Save to localStorage
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    quotes.push(quoteData);
    localStorage.setItem('quotes', JSON.stringify(quotes));
    
    // Generate quote table
    generateQuoteTable(quoteData);
    
    // Show success message
    showNotification(
        currentLanguage === 'zh' ? '自助量尺报价已生成成功！' : 'Self measurement quote generated successfully!',
        'success'
    );
}

// Generate quote table
function generateQuoteTable(quoteData) {
    // Generate quote ID
    const quoteId = 'Q' + Date.now();
    document.getElementById('quoteId').textContent = quoteId;
    
    // Set current date
    const currentDate = new Date().toLocaleDateString();
    document.getElementById('quoteDate').textContent = currentDate;
    
    // Set customer info
    const user = getCurrentUser();
    if (user) {
        document.getElementById('customerName').textContent = user.name;
        document.getElementById('customerEmail').textContent = user.email;
        document.getElementById('customerPhone').textContent = user.phone;
        document.getElementById('customerAddress').textContent = `${user.address}, ${user.city}, ${user.state} ${user.zipcode}`;
    }
    
    // Generate quote items
    generateQuoteItems(quoteData.rooms);
    
    // Set notes
    document.getElementById('quoteNotes').textContent = quoteData.notes || 'No additional notes.';
    
    // Calculate and display totals
    calculateQuoteTotal();
    
    // Show modal
    openModal('quoteTableModal');
}

// Update quote summary
function updateQuoteSummary(rooms) {
    const totalRooms = rooms.length;
    let totalWindows = 0;
    let totalPrice = 0;
    
    rooms.forEach(room => {
        totalWindows += room.windows.length;
        room.windows.forEach(window => {
            const basePrice = getWindowBasePrice(window.type);
            const area = window.width * window.height;
            const unitPrice = basePrice * area;
            totalPrice += unitPrice * window.quantity;
        });
    });
    
    // Update display
    if (document.getElementById('totalRooms')) {
        document.getElementById('totalRooms').textContent = totalRooms;
    }
    if (document.getElementById('totalWindows')) {
        document.getElementById('totalWindows').textContent = totalWindows;
    }
    if (document.getElementById('estimatedPrice')) {
        document.getElementById('estimatedPrice').textContent = `$${totalPrice.toFixed(2)}`;
    }
}

// Generate quote items
function generateQuoteItems(rooms) {
    const quoteItemsList = document.getElementById('quoteItemsList');
    quoteItemsList.innerHTML = '';
    
    rooms.forEach((room, roomIndex) => {
        room.windows.forEach((window, windowIndex) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'quote-item';
            
            const basePrice = getWindowBasePrice(window.type);
            const area = window.width * window.height;
            const unitPrice = basePrice * area;
            const totalPrice = unitPrice * window.quantity;
            
            itemDiv.innerHTML = `
                <div class="item-details">
                    <div class="item-name">${getWindowTypeName(window.type)}</div>
                    <div class="item-type">${getRoomTypeName(room.type)}</div>
                    <div class="item-dimensions">${window.width}' × ${window.height}'</div>
                    <div class="item-quantity">×${window.quantity}</div>
                    <div class="item-price">$${unitPrice.toFixed(2)}</div>
                </div>
            `;
            
            quoteItemsList.appendChild(itemDiv);
        });
    });
}

// Get window base price
function getWindowBasePrice(windowType) {
    const prices = {
        'casement': 25,
        'double-hung': 30,
        'bay': 45,
        'picture': 35,
        'sliding': 28
    };
    return prices[windowType] || 25;
}

// Get window type name
function getWindowTypeName(windowType) {
    const names = {
        'casement': 'Casement Window',
        'double-hung': 'Double Hung Window',
        'bay': 'Bay Window',
        'picture': 'Picture Window',
        'sliding': 'Sliding Window'
    };
    return names[windowType] || 'Window';
}

// Get room type name
function getRoomTypeName(roomType) {
    const names = {
        'living-room': 'Living Room',
        'bedroom': 'Bedroom',
        'kitchen': 'Kitchen',
        'dining-room': 'Dining Room',
        'bathroom': 'Bathroom',
        'office': 'Office',
        'family-room': 'Family Room',
        'basement': 'Basement',
        'attic': 'Attic'
    };
    return names[roomType] || 'Room';
}

// Calculate quote total
function calculateQuoteTotal() {
    const quoteItems = document.querySelectorAll('.quote-item');
    let subtotal = 0;
    
    quoteItems.forEach(item => {
        const priceText = item.querySelector('.item-price').textContent;
        const price = parseFloat(priceText.replace('$', ''));
        const quantity = parseInt(item.querySelector('.item-quantity').textContent.replace('×', ''));
        subtotal += price * quantity;
    });
    
    const tax = subtotal * 0.08875; // 8.875% tax rate
    const total = subtotal + tax;
    
    document.getElementById('quoteSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('quoteTax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('quoteTotal').textContent = `$${total.toFixed(2)}`;
}

// Quote actions
function printQuote() {
    window.print();
}

function acceptQuote() {
    // Save quote to user's quotes
    const user = getCurrentUser();
    if (user) {
        const quotes = JSON.parse(localStorage.getItem('userQuotes') || '[]');
        quotes.push({
            id: document.getElementById('quoteId').textContent,
            date: document.getElementById('quoteDate').textContent,
            total: document.getElementById('quoteTotal').textContent,
            status: 'accepted'
        });
        localStorage.setItem('userQuotes', JSON.stringify(quotes));
    }
    
    showSuccessMessage(
        currentLanguage === 'zh' ? '报价已接受！我们会尽快处理您的订单。' : 'Quote accepted! We will process your order soon.',
        currentLanguage === 'zh' ? '报价已接受' : 'Quote Accepted'
    );
    
    closeModal('quoteTableModal');
}

// User management
function createAppointmentUser(userData) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === userData.email || user.phone === userData.phone);
    
    if (existingUser) {
        return existingUser; // Return existing user if found
    }
    
    const newUser = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        zipCode: userData.zipCode,
        password: userData.password,
        userType: userData.userType,
        type: 'customer',
        dateCreated: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return newUser; // Return the created user
}

// User authentication
function handleLoginSubmission(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showNotification(
            currentLanguage === 'zh' ? '请填写所有字段。' : 'Please fill in all fields.',
            'error'
        );
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Set current user
        localStorage.setItem('currentUser', JSON.stringify(user));
        currentUser = user;
        
        // Update UI
        updateUserInterface(user);
        
        // Close modal and reset form first
        closeModal('loginModal');
        document.getElementById('loginForm').reset();
        
        // Show success notification after closing modal
        setTimeout(() => {
            showNotification(
                currentLanguage === 'zh' ? '登录成功！' : 'Login successful!',
                'success'
            );
        }, 100);
    } else {
        showNotification(
            currentLanguage === 'zh' ? '邮箱或密码错误。' : 'Invalid email or password.',
            'error'
        );
    }
}

function handleRegisterSubmission(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const address = document.getElementById('registerAddress').value;
    const city = document.getElementById('registerCity').value;
    const state = document.getElementById('registerState').value;
    const zipcode = document.getElementById('registerZIP').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validation
    if (!name || !email || !phone || !address || !city || !state || !zipcode || !password || !confirmPassword) {
        showNotification(
            currentLanguage === 'zh' ? '请填写所有字段。' : 'Please fill in all fields.',
            'error'
        );
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification(
            currentLanguage === 'zh' ? '密码不匹配。' : 'Passwords do not match.',
            'error'
        );
        return;
    }
    
    if (password.length < 6) {
        showNotification(
            currentLanguage === 'zh' ? '密码至少需要6个字符。' : 'Password must be at least 6 characters.',
            'error'
        );
        return;
    }
    
    if (!agreeTerms) {
        showNotification(
            currentLanguage === 'zh' ? '请同意条款和条件。' : 'Please agree to the terms and conditions.',
            'error'
        );
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find(user => user.email === email);
    
    if (existingUser) {
        showNotification(
            currentLanguage === 'zh' ? '该邮箱已被注册。' : 'This email is already registered.',
            'error'
        );
        return;
    }
    
    // Create new user
    const newUser = {
        name: name,
        email: email,
        phone: phone,
        address: address,
        city: city,
        state: state,
        zipcode: zipcode,
        password: password,
        type: 'customer',
        userType: 'self', // Default to self measurement user
        dateCreated: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    currentUser = newUser;
    
    // Update UI
    updateUserInterface(newUser);
    
    // Close modal and reset form first
    closeModal('loginModal');
    document.getElementById('registerForm').reset();
    
    // Show success notification after closing modal
    setTimeout(() => {
        showNotification(
            currentLanguage === 'zh' ? '注册成功！已自动登录。' : 'Registration successful! You are now logged in.',
            'success'
        );
    }, 100);
}

// User interface management
function updateUserInterface(userInfo) {
    const userStatusDisplay = document.getElementById('userStatusDisplay');
    const loginBtn = document.querySelector('.dropdown-toggle');
    const loginNavItem = document.getElementById('loginNavItem');
    
    // If no userInfo provided, get it from getCurrentUser()
    if (!userInfo) {
        userInfo = getCurrentUser();
    }
    
    if (userInfo && userInfo.userType !== 'admin') {
        // User is logged in (and not admin)
        document.getElementById('userName').textContent = userInfo.name;
        userStatusDisplay.style.display = 'flex';
        loginNavItem.style.display = 'none';
        
        // Update cart count
        updateCartCount();
    } else {
        // User is logged out or is admin
        userStatusDisplay.style.display = 'none';
        loginNavItem.style.display = 'block';
        
        // Clear cart count
        document.getElementById('cartCount').textContent = '0';
    }
}

// Customer dashboard
function openCustomerDashboard() {
    const user = getCurrentUser();
    if (user) {
        // Load dashboard content first
        loadDashboardContent();
        
        // Load user data
        loadUserData();
        
        openModal('customerDashboardModal');
    }
}

// Dashboard functions
function loadDashboardContent() {
    const dashboardContent = document.getElementById('dashboardContent');
    const user = getCurrentUser();
    
    if (dashboardContent && user) {
        dashboardContent.innerHTML = `
            <!-- Profile Tab -->
            <div id="profileTab" class="dashboard-tab-content active">
                <h3 data-en="Profile Information" data-zh="个人资料信息">Profile Information</h3>
                <form id="profileForm" onsubmit="updateProfile(event)">
                    <div class="form-group">
                        <input type="text" id="profileName" value="${user.name || ''}" required>
                        <label data-en="Full Name" data-zh="姓名">Full Name</label>
                    </div>
                    <div class="form-group">
                        <input type="email" id="profileEmail" value="${user.email || ''}" required>
                        <label data-en="Email" data-zh="邮箱">Email</label>
                    </div>
                    <div class="form-group">
                        <input type="tel" id="profilePhone" value="${user.phone || ''}" required>
                        <label data-en="Phone" data-zh="电话">Phone</label>
                    </div>
                    <div class="form-group">
                        <input type="text" id="profileAddress" value="${user.address || ''}" required>
                        <label data-en="Address" data-zh="地址">Address</label>
                    </div>
                    <div class="form-group">
                        <input type="text" id="profileCity" value="${user.city || ''}" required>
                        <label data-en="City" data-zh="城市">City</label>
                    </div>
                    <div class="form-group">
                        <input type="text" id="profileState" value="${user.state || ''}" required>
                        <label data-en="State" data-zh="州/省">State</label>
                    </div>
                    <div class="form-group">
                        <input type="text" id="profileZipcode" value="${user.state || ''}" required>
                        <label data-en="ZIP Code" data-zh="邮编">ZIP Code</label>
                    </div>
                    <button type="submit" class="btn btn-primary" data-en="Update Profile" data-zh="更新资料">Update Profile</button>
                </form>
            </div>
            
            <!-- Orders Tab -->
            <div id="ordersTab" class="dashboard-tab-content">
                <h3 data-en="Order History" data-zh="订单历史">Order History</h3>
                <div id="ordersList">
                    <p data-en="No orders found." data-zh="未找到订单。">No orders found.</p>
                </div>
            </div>
            
            <!-- Quotes Tab -->
            <div id="quotesTab" class="dashboard-tab-content">
                <h3 data-en="Quote History" data-zh="报价历史">Quote History</h3>
                <div id="quotesList">
                    <p data-en="No quotes found." data-zh="未找到报价。">No quotes found.</p>
                </div>
            </div>
            
            <!-- Appointments Tab -->
            <div id="appointmentsTab" class="dashboard-tab-content">
                <h3 data-en="My Appointments" data-zh="我的预约">My Appointments</h3>
                <div id="appointmentsList">
                    <p data-en="No appointments found." data-zh="未找到预约。">No appointments found.</p>
                </div>
            </div>
            
            <!-- On-site Measurement Tab -->
            <div id="onsiteMeasurementTab" class="dashboard-tab-content">
                <h3 data-en="On-site Measurement" data-zh="上门测量">On-site Measurement</h3>
                <div id="onsiteMeasurementContent">
                    ${user.userType === 'onsite' ? `
                        <div class="measurement-form">
                            <h4 data-en="Measurement Information" data-zh="测量信息">Measurement Information</h4>
                            <form id="onsiteMeasurementForm" onsubmit="submitOnsiteMeasurement(event)">
                                <div class="form-group">
                                    <label data-en="Measurer Name" data-zh="测量人姓名">Measurer Name</label>
                                    <input type="text" id="measurerName" required>
                                </div>
                                <div class="form-group">
                                    <label data-en="Property Type" data-zh="房产类型">Property Type</label>
                                    <select id="measurementPropertyType" required>
                                        <option value="" data-en="Select Property Type" data-zh="选择房产类型">Select Property Type</option>
                                        <option value="single-family" data-en="Single Family Home" data-zh="单户住宅">Single Family Home</option>
                                        <option value="townhouse" data-en="Townhouse" data-zh="联排别墅">Townhouse</option>
                                        <option value="apartment" data-en="Apartment" data-zh="公寓">Apartment</option>
                                        <option value="custom" data-en="Custom" data-zh="自定义">Custom</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label data-en="Number of Rooms" data-zh="房间数量">Number of Rooms</label>
                                    <input type="number" id="measurementRooms" min="1" max="20" value="1" required>
                                </div>
                                <div class="form-group">
                                    <label data-en="Window Types" data-zh="窗户类型">Window Types</label>
                                    <div class="checkbox-group">
                                        <label><input type="checkbox" value="curtains"> <span data-en="Curtains" data-zh="窗帘">Curtains</span></label>
                                        <label><input type="checkbox" value="blinds"> <span data-en="Blinds" data-zh="百叶窗">Blinds</span></label>
                                        <label><input type="checkbox" value="shades"> <span data-en="Shades" data-zh="遮阳帘">Shades</span></label>
                                        <label><input type="checkbox" value="drapes"> <span data-en="Drapes" data-zh="布帘">Drapes</span></label>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label data-en="Special Requirements" data-zh="特殊要求">Special Requirements</label>
                                    <textarea id="measurementNotes" rows="3" data-en="Any special requirements or notes..." data-zh="任何特殊要求或备注..."></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary" data-en="Submit Measurement" data-zh="提交测量">Submit Measurement</button>
                            </form>
                        </div>
                    ` : `
                        <div class="access-denied">
                            <p data-en="This feature is only available for on-site measurement users after admin approval." data-zh="此功能仅在上门测量用户获得管理员批准后可用。">This feature is only available for on-site measurement users after admin approval.</p>
                        </div>
                    `}
                </div>
            </div>
            
            <!-- Favorites Tab -->
            <div id="favoritesTab" class="dashboard-tab-content">
                <h3 data-en="My Favorites" data-zh="我的收藏">My Favorites</h3>
                <div id="favoritesList">
                    <p data-en="No favorites found." data-zh="未找到收藏。">No favorites found.</p>
                </div>
            </div>
        `;
        
        // Update language after content is loaded
        updatePageLanguage(currentLanguage);
    }
}

function showProfile() {
    openCustomerDashboard();
    switchDashboardTab('profile');
}

function showMyOrders() {
    openCustomerDashboard();
    switchDashboardTab('orders');
}

function showMyQuotes() {
    openCustomerDashboard();
    switchDashboardTab('quotes');
}

function showMyAppointments() {
    openCustomerDashboard();
    switchDashboardTab('appointments');
}

function showMyFavorites() {
    openCustomerDashboard();
    switchDashboardTab('favorites');
}

function showOnsiteMeasurement() {
    openCustomerDashboard();
    switchDashboardTab('onsiteMeasurement');
}

// Handle on-site measurement form submission
function submitOnsiteMeasurement(event) {
    event.preventDefault();
    
    const formData = {
        measurerName: document.getElementById('measurerName').value,
        propertyType: document.getElementById('measurementPropertyType').value,
        roomCount: document.getElementById('measurementRooms').value,
        windowTypes: [],
        notes: document.getElementById('measurementNotes').value,
        userId: getCurrentUserId(),
        type: 'onsite-measurement',
        date: new Date().toISOString()
    };
    
    // Collect selected window types
    document.querySelectorAll('#onsiteMeasurementForm input[type="checkbox"]:checked').forEach(checkbox => {
        formData.windowTypes.push(checkbox.value);
    });
    
    // Save to localStorage
    const measurements = JSON.parse(localStorage.getItem('onsiteMeasurements') || '[]');
    measurements.push(formData);
    localStorage.setItem('onsiteMeasurements', JSON.stringify(measurements));
    
    // Show success message
    showNotification(
        currentLanguage === 'zh' ? '测量信息提交成功！' : 'Measurement information submitted successfully!',
        'success'
    );
    
    // Reset form
    document.getElementById('onsiteMeasurementForm').reset();
}

function showCart() {
    window.location.href = 'cart.html';
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    updateUserInterface(null);
    
    showNotification(
        currentLanguage === 'zh' ? '已成功退出登录。' : 'Successfully logged out.',
        'success'
    );
}

// Utility functions
function isLoggedIn() {
    const user = getCurrentUser();
    return user !== null && user.userType !== 'admin';
}

function getCurrentUserId() {
    const user = getCurrentUser();
    return user ? user.email : null;
}

function getCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        try {
            const user = JSON.parse(currentUser);
            // Don't return admin users for regular website
            if (user.userType === 'admin') {
                return null;
            }
            return user;
        } catch (e) {
            localStorage.removeItem('currentUser');
            return null;
        }
    }
    return null;
}

function loadUserData() {
    const user = getCurrentUser();
    if (user && user.userType !== 'admin') {
        // Load orders
        loadOrderHistory();
        
        // Load quotes
        loadQuoteHistory();
        
        // Load favorites
        loadFavorites();
    }
}

function loadOrderHistory() {
    const ordersList = document.getElementById('ordersList');
    const user = getCurrentUser();
    
    if (user && user.userType !== 'admin') {
        const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        if (orders.length > 0) {
            ordersList.innerHTML = orders.map(order => `
                <div class="order-item">
                    <h4>Order #${order.id}</h4>
                    <p>Date: ${order.date}</p>
                    <p>Total: ${order.total}</p>
                    <p>Status: ${order.status}</p>
                </div>
            `).join('');
        } else {
            ordersList.innerHTML = `<p data-en="No orders found." data-zh="未找到订单。">No orders found.</p>`;
        }
    }
}

function loadQuoteHistory() {
    const quotesList = document.getElementById('quotesList');
    const user = getCurrentUser();
    
    if (user && user.userType !== 'admin') {
        const quotes = JSON.parse(localStorage.getItem('userQuotes') || '[]');
        if (quotes.length > 0) {
            quotesList.innerHTML = quotes.map(quote => `
                <div class="quote-item">
                    <h4>Quote #${quote.id}</h4>
                    <p>Date: ${quote.date}</p>
                    <p>Total: ${quote.total}</p>
                    <p>Status: ${quote.status}</p>
                </div>
            `).join('');
        } else {
            quotesList.innerHTML = `<p data-en="No quotes found." data-zh="未找到报价。">No quotes found.</p>`;
        }
    }
}

function loadFavorites() {
    const favoritesList = document.getElementById('favoritesList');
    const user = getCurrentUser();
    
    if (user && user.userType !== 'admin') {
        const favorites = JSON.parse(localStorage.getItem('userFavorites') || '[]');
        if (favorites.length > 0) {
            favoritesList.innerHTML = favorites.map(favorite => `
                <div class="favorite-item">
                    <h4>${favorite.name}</h4>
                    <p>${favorite.description}</p>
                </div>
            `).join('');
        } else {
            favoritesList.innerHTML = `<p data-en="No favorites found." data-zh="未找到收藏。">No favorites found.</p>`;
        }
    }
}

// Profile management
function updateProfile() {
    const user = getCurrentUser();
    if (user) {
        const updatedUser = {
            ...user,
            name: document.getElementById('profileName').value,
            email: document.getElementById('profileEmail').value,
            phone: document.getElementById('profilePhone').value,
            address: document.getElementById('profileAddress').value,
            city: document.getElementById('profileCity').value,
            state: document.getElementById('profileState').value,
            zipcode: document.getElementById('profileZipcode').value
        };
        
        // Update current user
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        currentUser = updatedUser;
        
        // Update users array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        // Update UI
        updateUserInterface(updatedUser);
        
        showNotification(
            currentLanguage === 'zh' ? '个人资料已更新。' : 'Profile updated successfully.',
            'success'
        );
    }
}

function changePassword() {
    const user = getCurrentUser();
    if (user) {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;
        
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            showNotification(
                currentLanguage === 'zh' ? '请填写所有密码字段。' : 'Please fill in all password fields.',
                'error'
            );
            return;
        }
        
        if (currentPassword !== user.password) {
            showNotification(
                currentLanguage === 'zh' ? '当前密码不正确。' : 'Current password is incorrect.',
                'error'
            );
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            showNotification(
                currentLanguage === 'zh' ? '新密码不匹配。' : 'New passwords do not match.',
                'error'
            );
            return;
        }
        
        if (newPassword.length < 6) {
            showNotification(
                currentLanguage === 'zh' ? '新密码至少需要6个字符。' : 'New password must be at least 6 characters.',
                'error'
            );
            return;
        }
        
        // Update password
        const updatedUser = { ...user, password: newPassword };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        currentUser = updatedUser;
        
        // Update users array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        // Clear password fields
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmNewPassword').value = '';
        
        showNotification(
            currentLanguage === 'zh' ? '密码已成功更改。' : 'Password changed successfully.',
            'success'
        );
    }
}

// Cart management
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Other functions
function openLoginModal() {
    openModal('loginModal');
}

function openGallery() {
    document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
}

function openRoomDetails(roomType) {
    console.log('Opening room details for:', roomType);
}

function handleContactSubmission(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        message: document.getElementById('contactMessage').value,
        date: new Date().toISOString()
    };
    
    // Save contact message
    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    contacts.push(formData);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    
    // Show success message
    showSuccessMessage(
        currentLanguage === 'zh' ? '消息已发送！我们会尽快回复您。' : 'Message sent! We will reply to you soon.',
        currentLanguage === 'zh' ? '消息已发送' : 'Message Sent'
    );
    
    // Reset form
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactMessage').value = '';
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function showSuccessMessage(message, title) {
    document.getElementById('successTitle').textContent = title;
    document.getElementById('successMessage').textContent = message;
    openModal('successModal');
}

// Cart management functions
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cartItemsList');
    const cartSummaryContainer = document.getElementById('cartSummary');
    
    if (!cartItemsContainer) return;
    
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p data-en="Your cart is empty" data-zh="您的购物车是空的">Your cart is empty</p>
                <a href="index.html" class="btn btn-primary">
                    <span data-en="Continue Shopping" data-zh="继续购物">Continue Shopping</span>
                </a>
            </div>
        `;
        
        if (cartSummaryContainer) {
            cartSummaryContainer.innerHTML = `
                <div class="summary-items">
                    <div class="summary-item">
                        <span data-en="Subtotal" data-zh="小计">Subtotal</span>
                        <span>$0.00</span>
                    </div>
                    <div class="summary-item">
                        <span data-en="Tax" data-zh="税费">Tax</span>
                        <span>$0.00</span>
                    </div>
                    <div class="summary-item total">
                        <span data-en="Total" data-zh="总计">Total</span>
                        <span>$0.00</span>
                    </div>
                </div>
            `;
        }
        return;
    }
    
    // Display cart items
    cartItemsContainer.innerHTML = cartItems.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image || 'images/curtain-default.jpg'}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>${item.description || ''}</p>
                <p class="item-type">${item.roomType || ''} - ${item.windowType || ''}</p>
                <p class="item-dimensions">${item.width}' × ${item.height}'</p>
            </div>
            <div class="cart-item-quantity">
                <button onclick="updateCartItemQuantity(${index}, -1)" class="btn btn-sm">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateCartItemQuantity(${index}, 1)" class="btn btn-sm">+</button>
            </div>
            <div class="cart-item-price">
                $${item.price.toFixed(2)}
            </div>
            <div class="cart-item-total">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
            <div class="cart-item-actions">
                <button onclick="removeFromCart(${index})" class="btn btn-danger btn-sm">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Update summary
    updateCartSummary();
}

function updateCartItemQuantity(index, change) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    if (cartItems[index]) {
        cartItems[index].quantity += change;
        
        if (cartItems[index].quantity <= 0) {
            cartItems.splice(index, 1);
        }
        
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Reload cart display
        loadCartItems();
        
        // Update cart count in main navigation
        updateCartCount();
    }
}

function removeFromCart(index) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    if (cartItems[index]) {
        cartItems.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Reload cart display
        loadCartItems();
        
        // Update cart count in main navigation
        updateCartCount();
        
        showNotification(
            currentLanguage === 'zh' ? '商品已从购物车中移除' : 'Item removed from cart',
            'success'
        );
    }
}

function updateCartSummary() {
    const cartSummaryContainer = document.getElementById('cartSummary');
    if (!cartSummaryContainer) return;
    
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    if (cartItems.length === 0) {
        cartSummaryContainer.innerHTML = `
            <div class="summary-items">
                <div class="summary-item">
                    <span data-en="Subtotal" data-zh="小计">Subtotal</span>
                    <span>$0.00</span>
                </div>
                <div class="summary-item">
                    <span data-en="Tax" data-zh="税费">Tax</span>
                    <span>$0.00</span>
                </div>
                <div class="summary-item total">
                    <span data-en="Total" data-zh="总计">Total</span>
                    <span>$0.00</span>
                </div>
            </div>
        `;
        return;
    }
    
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08875; // 8.875% tax rate
    const total = subtotal + tax;
    
    cartSummaryContainer.innerHTML = `
        <div class="summary-items">
            <div class="summary-item">
                <span data-en="Subtotal" data-zh="小计">Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-item">
                <span data-en="Tax" data-zh="税费">Tax</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-item total">
                <span data-en="Total" data-zh="总计">Total</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        </div>
        <div class="cart-actions">
            <button onclick="clearCart()" class="btn btn-secondary">
                <span data-en="Clear Cart" data-zh="清空购物车">Clear Cart</span>
            </button>
            <button onclick="checkout()" class="btn btn-primary">
                <span data-en="Checkout" data-zh="结算">Checkout</span>
            </button>
        </div>
    `;
}

function clearCart() {
    if (confirm(currentLanguage === 'zh' ? '确定要清空购物车吗？' : 'Are you sure you want to clear the cart?')) {
        localStorage.removeItem('cartItems');
        loadCartItems();
        updateCartCount();
        
        showNotification(
            currentLanguage === 'zh' ? '购物车已清空' : 'Cart cleared',
            'success'
        );
    }
}

function checkout() {
    // For now, just show a success message
    // In a real application, this would redirect to a payment processor
    showNotification(
        currentLanguage === 'zh' ? '结算功能即将推出！' : 'Checkout feature coming soon!',
        'info'
    );
}

// Confirmation popup function
function showConfirmationPopup(message, title, onConfirm) {
    // Create confirmation modal
    const confirmationModal = document.createElement('div');
    confirmationModal.className = 'modal';
    confirmationModal.style.display = 'block';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.maxWidth = '400px';
    modalContent.style.textAlign = 'center';
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>${title}</h3>
        </div>
        <div style="padding: 2rem;">
            <p style="margin-bottom: 2rem; font-size: 1.1rem;">${message}</p>
            <div class="form-actions">
                <button class="btn btn-secondary" id="closeBtn">
                    ${currentLanguage === 'zh' ? '关闭' : 'Close'}
                </button>
                <button class="btn btn-primary" id="confirmBtn">
                    ${currentLanguage === 'zh' ? '确认' : 'Confirm'}
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners
    modalContent.querySelector('#closeBtn').addEventListener('click', () => {
        confirmationModal.remove();
    });
    
    modalContent.querySelector('#confirmBtn').addEventListener('click', () => {
        confirmationModal.remove();
        if (onConfirm && typeof onConfirm === 'function') {
            onConfirm();
        }
    });
    
    confirmationModal.appendChild(modalContent);
    document.body.appendChild(confirmationModal);
}

function confirmAndClose(button, callback) {
    const modal = button.closest('.modal');
    modal.remove();
    if (callback && typeof callback === 'function') {
        callback();
    }
}

// Load user appointments for dashboard
function loadUserAppointments() {
    const user = getCurrentUser();
    if (!user) return;
    
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    // Check both userId and email for compatibility
    const userAppointments = quotes.filter(quote => 
        (quote.userId === user.id || quote.userId === user.email || quote.email === user.email) && quote.type === 'onsite'
    );
    
    // Debug logging
    console.log('Current user:', user);
    console.log('All quotes:', quotes);
    console.log('User appointments:', userAppointments);
    
    const appointmentsList = document.getElementById('appointmentsList');
    if (!appointmentsList) return;
    
    if (userAppointments.length === 0) {
        appointmentsList.innerHTML = '<p data-en="No appointments found." data-zh="未找到预约。">No appointments found.</p>';
        return;
    }
    
    let appointmentsHTML = '';
    userAppointments.forEach(appointment => {
        const timeDisplay = appointment.preferredTime === 'morning' ? 'Morning (9 AM - 12 PM)' : 
                           appointment.preferredTime === 'afternoon' ? 'Afternoon (1 PM - 4 PM)' : 
                           appointment.preferredTime === 'evening' ? 'Evening (5 PM - 7 PM)' : appointment.preferredTime;
        
        appointmentsHTML += `
            <div class="appointment-item ${appointment.confirmed ? 'confirmed' : 'pending'}">
                <div class="appointment-header">
                    <h4 data-en="Appointment" data-zh="预约">Appointment</h4>
                    <span class="appointment-status ${appointment.confirmed ? 'confirmed' : 'pending'}">
                        ${appointment.confirmed ? 'Confirmed' : 'Pending'}
                    </span>
                </div>
                <div class="appointment-details">
                    <p><strong data-en="Date" data-zh="日期">Date:</strong> ${formatDateString(appointment.preferredDate)}</p>
                    <p><strong data-en="Time" data-zh="时间">Time:</strong> ${timeDisplay}</p>
                    <p><strong data-en="Property Type" data-zh="房产类型">Property Type:</strong> ${appointment.propertyType}</p>
                    <p><strong data-en="Room Count" data-zh="房间数量">Room Count:</strong> ${appointment.roomCount}</p>
                    <p><strong data-en="Notes" data-zh="备注">Notes:</strong> ${appointment.notes || 'None'}</p>
                </div>
                ${!appointment.confirmed ? `
                    <div class="appointment-actions">
                        <button class="btn btn-primary" onclick="editAppointment('${appointment.id}')" data-en="Edit Appointment" data-zh="编辑预约">Edit Appointment</button>
                        <button class="btn btn-danger" onclick="cancelAppointment('${appointment.id}')" data-en="Cancel Appointment" data-zh="取消预约">Cancel Appointment</button>
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    appointmentsList.innerHTML = appointmentsHTML;
}

// Load user quotes for dashboard
function loadUserQuotes() {
    const user = getCurrentUser();
    if (!user) return;
    
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    // Check both userId and email for compatibility
    const userQuotes = quotes.filter(quote => 
        (quote.userId === user.id || quote.userId === user.email || quote.email === user.email) && quote.type === 'self'
    );
    
    // Debug logging
    console.log('Current user:', user);
    console.log('All quotes:', quotes);
    console.log('User quotes:', userQuotes);
    
    const quotesList = document.getElementById('quotesList');
    if (!quotesList) return;
    
    if (userQuotes.length === 0) {
        quotesList.innerHTML = '<p data-en="No quotes found." data-zh="未找到报价。">No quotes found.</p>';
        return;
    }
    
    let quotesHTML = '';
    userQuotes.forEach(quote => {
        const totalWindows = quote.rooms ? quote.rooms.reduce((total, room) => total + room.windows.length, 0) : 0;
        const totalRooms = quote.rooms ? quote.rooms.length : 0;
        const statusClass = quote.status || 'pending';
        const statusText = getQuoteStatusText(quote.status || 'pending');
        
        quotesHTML += `
            <div class="quote-item ${statusClass}">
                <div class="quote-header">
                    <h4 data-en="Quote Request" data-zh="报价请求">Quote Request</h4>
                    <span class="quote-status ${statusClass}">${statusText}</span>
                </div>
                <div class="quote-details">
                    <p><strong data-en="Date:" data-zh="日期：">Date:</strong> ${formatDateString(quote.date)}</p>
                    <p><strong data-en="Rooms:" data-zh="房间：">Rooms:</strong> ${totalRooms}</p>
                    <p><strong data-en="Windows:" data-zh="窗户：">Windows:</strong> ${totalWindows}</p>
                    <p><strong data-en="Budget:" data-zh="预算：">Budget:</strong> ${getBudgetText(quote.budget)}</p>
                    ${quote.price ? `<p><strong data-en="Price:" data-zh="价格：">Price:</strong> $${quote.price.toFixed(2)}</p>` : ''}
                    ${quote.notes ? `<p><strong data-en="Notes:" data-zh="备注：">Notes:</strong> ${quote.notes}</p>` : ''}
                </div>
                <div class="quote-actions">
                    <button class="btn btn-primary" onclick="viewQuoteDetails('${quote.id}')" data-en="View Details" data-zh="查看详情">View Details</button>
                    ${quote.status === 'quoted' ? `
                        <button class="btn btn-success" onclick="acceptQuote('${quote.id}')" data-en="Accept" data-en="Accept" data-zh="接受">Accept</button>
                        <button class="btn btn-danger" onclick="rejectQuote('${quote.id}')" data-en="Reject" data-zh="拒绝">Reject</button>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    quotesList.innerHTML = quotesHTML;
}

// Get quote status text for user interface
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

// Get budget text for user interface
function getBudgetText(budget) {
    if (!budget) return 'N/A';
    
    const budgetMap = {
        'under-1000': currentLanguage === 'zh' ? '1000美元以下' : 'Under $1,000',
        '1000-2500': currentLanguage === 'zh' ? '1000-2500美元' : '$1,000 - $2,500',
        '2500-5000': currentLanguage === 'zh' ? '2500-5000美元' : '$2,500 - $5,000',
        '5000-10000': currentLanguage === 'zh' ? '5000-10000美元' : '$5,000 - $10,000',
        'over-10000': currentLanguage === 'zh' ? '10000美元以上' : 'Over $10,000'
    };
    
    return budgetMap[budget] || budget;
}

// View quote details for user
function viewQuoteDetails(quoteId) {
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    const quote = quotes.find(q => q.id === quoteId);
    
    if (!quote) {
        showNotification(
            currentLanguage === 'zh' ? '报价未找到' : 'Quote not found',
            'error'
        );
        return;
    }
    
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
                        ${quote.price ? `
                            <div class="info-item">
                                <label data-en="Price:" data-zh="价格：">Price:</label>
                                <span class="price-amount">$${quote.price.toFixed(2)}</span>
                            </div>
                        ` : ''}
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
                
                ${quote.status === 'quoted' ? `
                    <div class="quote-actions-section">
                        <button class="btn btn-success" onclick="acceptQuote('${quoteId}')" data-en="Accept Quote" data-zh="接受报价">Accept Quote</button>
                        <button class="btn btn-danger" onclick="rejectQuote('${quoteId}')" data-en="Reject Quote" data-zh="拒绝报价">Reject Quote</button>
                    </div>
                ` : ''}
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

// Accept quote
function acceptQuote(quoteId) {
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    const quoteIndex = quotes.findIndex(q => q.id === quoteId);
    
    if (quoteIndex === -1) {
        showNotification(
            currentLanguage === 'zh' ? '报价未找到' : 'Quote not found',
            'error'
        );
        return;
    }
    
    quotes[quoteIndex].status = 'accepted';
    quotes[quoteIndex].acceptedAt = new Date().toISOString();
    
    localStorage.setItem('quotes', JSON.stringify(quotes));
    
    showNotification(
        currentLanguage === 'zh' ? '报价已接受！' : 'Quote accepted successfully!',
        'success'
    );
    
    // Refresh quotes display
    loadUserQuotes();
    
    // Close modal if open
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Reject quote
function rejectQuote(quoteId) {
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    const quoteIndex = quotes.findIndex(q => q.id === quoteId);
    
    if (quoteIndex === -1) {
        showNotification(
            currentLanguage === 'zh' ? '报价未找到' : 'Quote not found',
            'error'
        );
        return;
    }
    
    quotes[quoteIndex].status = 'rejected';
    quotes[quoteIndex].rejectedAt = new Date().toISOString();
    
    localStorage.setItem('quotes', JSON.stringify(quotes));
    
    showNotification(
        currentLanguage === 'zh' ? '报价已拒绝' : 'Quote rejected',
        'success'
    );
    
    // Refresh quotes display
    loadUserQuotes();
    
    // Close modal if open
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
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

// Edit appointment function
function editAppointment(appointmentId) {
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    const appointment = quotes.find(q => q.id === appointmentId);
    
    if (!appointment) {
        showNotification('Appointment not found', 'error');
        return;
    }
    
    // Open the onsite quote modal with pre-filled data
    openModal('onsiteQuoteModal');
    
    // Pre-fill the form with existing data
    setTimeout(() => {
        document.getElementById('onsiteName').value = appointment.name || '';
        document.getElementById('onsitePhone').value = appointment.phone || '';
        document.getElementById('onsiteEmail').value = appointment.email || '';
        document.getElementById('onsiteAddress').value = appointment.address || '';
        document.getElementById('onsiteCity').value = appointment.city || '';
        document.getElementById('onsiteZIP').value = appointment.zipCode || '';
        document.getElementById('onsitePropertyType').value = appointment.propertyType || '';
        document.getElementById('onsiteRooms').value = appointment.roomCount || '';
        document.getElementById('onsiteNotes').value = appointment.notes || '';
        
        // Set the selected date and time
        selectedDate = appointment.preferredDate;
        selectedTimeSlot = { time: appointment.preferredTime, timeRange: appointment.preferredTime };
        
        // Load calendar and show selected date
        loadAppointmentCalendar();
        
        // Update the form submission to handle editing
        const form = document.getElementById('onsiteQuoteForm');
        form.onsubmit = (e) => updateAppointment(e, appointmentId);
    }, 100);
}

// Update appointment function
function updateAppointment(event, appointmentId) {
    event.preventDefault();
    
    if (!selectedDate || !selectedTimeSlot) {
        showNotification(
            currentLanguage === 'zh' 
                ? '请先选择预约日期和时间段' 
                : 'Please select appointment date and time slot first',
            'error'
        );
        return;
    }
    
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    const quoteIndex = quotes.findIndex(q => q.id === appointmentId);
    
    if (quoteIndex === -1) {
        showNotification('Appointment not found', 'error');
        return;
    }
    
    // Update the appointment data
    quotes[quoteIndex] = {
        ...quotes[quoteIndex],
        name: document.getElementById('onsiteName').value,
        phone: document.getElementById('onsitePhone').value,
        email: document.getElementById('onsiteEmail').value,
        address: document.getElementById('onsiteAddress').value,
        city: document.getElementById('onsiteCity').value,
        zipCode: document.getElementById('onsiteZIP').value,
        propertyType: document.getElementById('onsitePropertyType').value,
        roomCount: document.getElementById('onsiteRooms').value,
        preferredDate: selectedDate,
        preferredTime: selectedTimeSlot.time,
        notes: document.getElementById('onsiteNotes').value,
        updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('quotes', JSON.stringify(quotes));
    
    // Show success message
    showNotification(
        currentLanguage === 'zh' 
            ? '预约更新成功！' 
            : 'Appointment updated successfully!',
        'success'
    );
    
    // Close modal and refresh appointments
    closeModal('onsiteQuoteModal');
    loadUserAppointments();
}

// Cancel appointment function
function cancelAppointment(appointmentId) {
    if (confirm(currentLanguage === 'zh' ? '确定要取消这个预约吗？' : 'Are you sure you want to cancel this appointment?')) {
        const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
        const updatedQuotes = quotes.filter(q => q.id !== appointmentId);
        localStorage.setItem('quotes', JSON.stringify(updatedQuotes));
        
        showNotification(
            currentLanguage === 'zh' 
                ? '预约已取消' 
                : 'Appointment cancelled',
            'success'
        );
        
        loadUserAppointments();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            updateUserInterface(currentUser);
        } catch (e) {
            localStorage.removeItem('currentUser');
        }
    }
    
    // Update language
    updatePageLanguage(currentLanguage);
    
    // Load dynamic content from content management system
    loadDynamicContent();
});

// Load dynamic content from content management system
function loadDynamicContent() {
    loadProductSeriesContent();
    loadGalleryContent();
    loadBackgroundImages();
    loadAboutContent();
}

// Load product series content
function loadProductSeriesContent() {
    const productSeries = JSON.parse(localStorage.getItem('productSeries')) || getDefaultProductSeries();
    const seriesGrid = document.querySelector('.series-grid');
    
    if (!seriesGrid) return;
    
    seriesGrid.innerHTML = '';
    
    productSeries.forEach((series, index) => {
        const seriesItem = document.createElement('div');
        seriesItem.className = 'series-item';
        seriesItem.innerHTML = `
            <img src="${series.image}" alt="${series.name}" data-en="${series.name}" data-zh="${series.name}">
            <div class="series-content">
                <h3 data-en="${series.name}" data-zh="${series.name}">${series.name}</h3>
                <p data-en="${series.description}" data-zh="${series.description}">${series.description}</p>
                <button onclick="openProductSeriesModal('${series.category}')" class="btn btn-outline" data-en="Learn More" data-zh="了解更多">Learn More</button>
            </div>
        `;
        seriesGrid.appendChild(seriesItem);
    });
    
    // Update language after loading content
    updatePageLanguage(currentLanguage);
}

// Load gallery content
function loadGalleryContent() {
    const gallery = JSON.parse(localStorage.getItem('gallery')) || getDefaultGallery();
    const galleryGrid = document.querySelector('.gallery-grid');
    
    if (!galleryGrid) return;
    
    // Update language after loading content
    updatePageLanguage(currentLanguage);
}

// Load background images for homepage
function loadBackgroundImages() {
    const backgrounds = JSON.parse(localStorage.getItem('backgroundImages')) || getDefaultBackgrounds();
    const hero = document.querySelector('.hero');
    
    if (!hero || backgrounds.length === 0) return;
    
    // Set first background as default
    hero.style.backgroundImage = `url('${backgrounds[0].image}')`;
    
    // If multiple backgrounds, create slideshow effect
    if (backgrounds.length > 1) {
        let currentIndex = 0;
        setInterval(() => {
            currentIndex = (currentIndex + 1) % backgrounds.length;
            hero.style.backgroundImage = `url('${backgrounds[currentIndex].image}')`;
        }, 5000); // Change every 5 seconds
    }
}

// Load about us content
function loadAboutContent() {
    const aboutData = JSON.parse(localStorage.getItem('aboutContent')) || getDefaultAboutContent();
    const aboutSection = document.querySelector('#about .about-content');
    
    if (!aboutSection) return;
    
    // Update text content
    const aboutText = aboutSection.querySelector('.about-text');
    if (aboutText) {
        const title = aboutText.querySelector('h2');
        const description = aboutText.querySelector('p');
        
        if (title) {
            title.textContent = aboutData.title;
            title.setAttribute('data-en', aboutData.title);
            title.setAttribute('data-zh', aboutData.title);
        }
        
        if (description) {
            description.textContent = aboutData.description;
            description.setAttribute('data-en', aboutData.description);
            description.setAttribute('data-zh', aboutData.description);
        }
    }
    
    // Add right side image if it doesn't exist
    if (!aboutSection.querySelector('.about-image')) {
        const aboutImage = document.createElement('div');
        aboutImage.className = 'about-image';
        aboutImage.innerHTML = `<img src="${aboutData.image}" alt="About Us">`;
        aboutSection.appendChild(aboutImage);
    }
    
    // Update language after loading content
    updatePageLanguage(currentLanguage);
}

// Default content functions (same as in content-management.js)
function getDefaultProductSeries() {
    return [
        {
            name: 'Blackout Curtains',
            description: 'Professional blackout fabrics with excellent light blocking properties',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJsYWNrb3V0IEN1cnRhaW5zPC90ZXh0Pjwvc3ZnPg==',
            category: 'blackout'
        },
        {
            name: 'Roller Blinds',
            description: 'High-quality roller blind fabrics for modern window treatments',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlJvbGxlciBCbGluZHM8L3RleHQ+PC9zdmc+',
            category: 'roller'
        },
        {
            name: 'Sheer Elegance',
            description: 'Elegant sheer fabrics combining beauty and functionality',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlNoZWVyIEVsZWdhbmNlPC90ZXh0Pjwvc3ZnPg==',
            category: 'sheer'
        },
        {
            name: 'Roman Shades',
            description: 'Classic roman shade fabrics with elegant pleating',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlJvbWFuIFNoYWRlczwvdGV4dD48L3N2Zz4=',
            category: 'roman'
        },
        {
            name: 'Elegant Drapery',
            description: 'Premium drapery fabrics for large windows and formal spaces',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVsZWdhbnQgRHJhcGVyeTwvdGV4dD48L3N2Zz4=',
            category: 'drapery'
        },
        {
            name: 'Layered Treatments',
            description: 'Multi-layer fabric solutions for sophisticated window treatments',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxheWVyZWQgVHJlYXRtZW50czwvdGV4dD48L3N2Zz4=',
            category: 'layered'
        },
        {
            name: 'Moisture Resistant',
            description: 'Weather-resistant fabrics for bathrooms and outdoor spaces',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1vaXN0dXJlIFJlc2lzdGFudDwvdGV4dD48L3N2Zz4=',
            category: 'moisture'
        },
        {
            name: 'Classic Valances',
            description: 'Timeless valance fabrics for traditional and elegant interiors',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNsYXNzaWMgVmFsYW5jZXM8L3RleHQ+PC9zdmc+',
            category: 'valances'
        }
    ];
}

function getDefaultGallery() {
    return [
        {
            title: 'Elegant Living Room',
            description: 'Elegant living room curtains',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVsZWdhbnQgTGl2aW5nIFJvb208L3RleHQ+PC9zdmc+'
        },
        {
            title: 'Modern Kitchen',
            description: 'Modern kitchen window treatments',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1vZGVybiBLaXRjaGVuPC90ZXh0Pjwvc3ZnPg=='
        },
        {
            title: 'Cozy Bedroom',
            description: 'Cozy bedroom curtains',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNvenkgQmVkcm9vbTwvdGV4dD48L3N2Zz4='
        },
        {
            title: 'Formal Dining Room',
            description: 'Formal dining room elegance',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZvcm1hbCBEaW5pbmcgUm9vbTwvdGV4dD48L3N2Zz4='
        }
    ];
}

function getDefaultBackgrounds() {
    return [
        {
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJhY2tncm91bmQgMSA8L3RleHQ+PC9zdmc+',
            order: 1
        },
        {
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJhY2tncm91bmQgMiA8L3RleHQ+PC9zdmc+',
            order: 2
        },
        {
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJhY2tncm91bmQgMyA8L3RleHQ+PC9zdmc+',
            order: 3
        }
    ];
}

function getDefaultAboutContent() {
    return {
        title: 'About Elegant Curtains',
        description: 'We are a family-owned business with over 20 years of experience in creating beautiful window treatments. Our commitment to quality and customer satisfaction has made us the trusted choice for homeowners throughout the region.',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFib3V0IFVzPC90ZXh0Pjwvc3ZnPg=='
    };
}
