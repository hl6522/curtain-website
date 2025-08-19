// Global variables
let currentLanguage = 'en';
let currentUser = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    setupSmoothScrolling();
    loadUserData();
    updateUserInterface(getCurrentUser());
    
    // Prevent Google Translate popup
    preventGoogleTranslate();
    
    // 先更新语言，然后加载动态内容
    updatePageLanguage(currentLanguage);
    
    // 延迟加载动态内容，确保语言更新完成后再加载
    setTimeout(() => {
        loadDynamicContent();
        
        // 调试：检查数据加载情况
        setTimeout(() => {
            debugAboutUsData();
        }, 200);
    }, 150);
    
    // Don't initialize date selectors here as the modal might not be open yet
});

// Prevent Google Translate popup
function preventGoogleTranslate() {
    try {
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
        
    } catch (error) {
        console.error('Error preventing Google Translate:', error);
    }
}

// Language switching
function updatePageLanguage(lang) {
    currentLanguage = lang;
    
    try {
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
        
        // Update all text content, but preserve content management data
        document.querySelectorAll('[data-en][data-zh]').forEach(element => {
            // 检查这个元素是否应该被内容管理页面的数据覆盖
            const shouldPreserve = element.closest('.about-text') && 
                                 (element.tagName === 'H2' || element.tagName === 'P');
            
            if (!shouldPreserve) {
                // 对于非关于我们部分的元素，正常更新语言
                if (lang === 'zh') {
                    element.textContent = element.getAttribute('data-zh');
                } else {
                    element.textContent = element.getAttribute('data-en');
                }
            }
        });
        
        // 特别处理一些可能遗漏的元素
        try {
            // 更新按钮文本
            document.querySelectorAll('button[data-en][data-zh]').forEach(btn => {
                if (lang === 'zh') {
                    btn.textContent = btn.getAttribute('data-zh');
                } else {
                    btn.textContent = btn.getAttribute('data-en');
                }
            });
            
            // 更新链接文本
            document.querySelectorAll('a[data-en][data-zh]').forEach(link => {
                if (lang === 'zh') {
                    link.textContent = link.getAttribute('data-zh');
                } else {
                    link.textContent = link.getAttribute('data-en');
                }
            });
            
            // 更新输入框占位符
            document.querySelectorAll('input[data-en][data-zh]').forEach(input => {
                if (lang === 'zh') {
                    input.placeholder = input.getAttribute('data-zh');
                } else {
                    input.placeholder = input.getAttribute('data-en');
                }
            });
            
            // 更新标签文本
            document.querySelectorAll('label[data-en][data-zh]').forEach(label => {
                if (lang === 'zh') {
                    label.textContent = label.getAttribute('data-zh');
                } else {
                    label.textContent = label.getAttribute('data-en');
                }
            });
        } catch (error) {
            console.error('Error updating additional language elements:', error);
        }
        
        updateSelectOptionsLanguage();
        
        // 重新加载关于我们内容，确保语言正确且不被覆盖
        setTimeout(() => {
            try {
                loadAboutContent();
            } catch (error) {
                console.error('Error reloading about content after language switch:', error);
            }
        }, 100);
        
    } catch (error) {
        console.error('Error updating page language:', error);
    }
}

// Update select options language
function updateSelectOptionsLanguage() {
    try {
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
    } catch (error) {
        console.error('Error updating select options language:', error);
    }
}

// Smooth scrolling setup
function setupSmoothScrolling() {
    try {
        // Add smooth scrolling to all internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    } catch (error) {
        console.error('Error setting up smooth scrolling:', error);
    }
}

// Modal management
function openModal(modalId) {
    try {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        } else {
            console.log(`Modal with ID '${modalId}' not found`);
        }
    } catch (error) {
        console.error('Error opening modal:', error);
    }
}

function closeModal(modalId) {
    try {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        } else {
            console.log(`Modal with ID '${modalId}' not found`);
        }
    } catch (error) {
        console.error('Error closing modal:', error);
    }
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
    
    // Early return if elements don't exist (prevents TypeError)
    if (!calendarGrid || !monthTitle) {
        console.log('Calendar elements not found, skipping calendar load');
        return;
    }
    
    try {
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
        console.log('Calendar loaded successfully');
        
    } catch (error) {
        console.error('Error loading calendar:', error);
    }
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
    
    // Early return if elements don't exist
    if (!selectedSlotInfo || !selectedSlotDetails) {
        console.log('Time slot elements not found, skipping time slot selection');
        return;
    }
    
    if (availableSlots.length === 0) {
        selectedSlotInfo.style.display = 'none';
        return;
    }
    
    try {
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
        
    } catch (error) {
        console.error('Error showing time slot selection:', error);
    }
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
    const userName = document.getElementById('userName');
    const cartCount = document.getElementById('cartCount');
    
    // If no userInfo provided, get it from getCurrentUser()
    if (!userInfo) {
        userInfo = getCurrentUser();
    }
    
    try {
        if (userInfo && userInfo.userType !== 'admin') {
            // User is logged in (and not admin)
            if (userName) userName.textContent = userInfo.name;
            if (userStatusDisplay) userStatusDisplay.style.display = 'flex';
            if (loginNavItem) loginNavItem.style.display = 'none';
            
            // Update cart count
            updateCartCount();
        } else {
            // User is logged out or is admin
            if (userStatusDisplay) userStatusDisplay.style.display = 'none';
            if (loginNavItem) loginNavItem.style.display = 'block';
            
            // Clear cart count
            if (cartCount) cartCount.textContent = '0';
        }
    } catch (error) {
        console.error('Error updating user interface:', error);
    }
}

// Customer dashboard
function openCustomerDashboard() {
    try {
        const user = getCurrentUser();
        if (user) {
            // Load dashboard content first
            loadDashboardContent();
            
            // Load user data
            loadUserData();
            
            openModal('customerDashboardModal');
        } else {
            showNotification('Please log in to access dashboard', 'error');
        }
    } catch (error) {
        console.error('Error opening customer dashboard:', error);
        showNotification('Error opening dashboard', 'error');
    }
}

// Dashboard functions
function loadDashboardContent() {
    try {
        const dashboardContent = document.getElementById('dashboardContent');
        const user = getCurrentUser();
        
        // Early return if element doesn't exist
        if (!dashboardContent) {
            console.log('Dashboard content element not found, skipping dashboard load');
            return;
        }
        
        if (user) {
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
                
                <!-- Favorites Tab -->
                <div id="favoritesTab" class="dashboard-tab-content">
                    <h3 data-en="Favorites" data-zh="收藏">Favorites</h3>
                    <div id="favoritesList">
                        <p data-en="No favorites found." data-zh="未找到收藏。">No favorites found.</p>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading dashboard content:', error);
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
    try {
        if (currentUser) {
            return currentUser;
        }
        
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            currentUser = JSON.parse(userJson);
            return currentUser;
        }
        
        return null;
        
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
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
    try {
        const ordersList = document.getElementById('ordersList');
        const user = getCurrentUser();
        
        // Early return if element doesn't exist
        if (!ordersList) {
            console.log('Orders list element not found, skipping order history load');
            return;
        }
        
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
    } catch (error) {
        console.error('Error loading order history:', error);
    }
}

function loadQuoteHistory() {
    try {
        const quotesList = document.getElementById('quotesList');
        const user = getCurrentUser();
        
        // Early return if element doesn't exist
        if (!quotesList) {
            console.log('Quotes list element not found, skipping quote history load');
            return;
        }
        
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
    } catch (error) {
        console.error('Error loading quote history:', error);
    }
}

function loadFavorites() {
    try {
        const favoritesList = document.getElementById('favoritesList');
        const user = getCurrentUser();
        
        // Early return if element doesn't exist
        if (!favoritesList) {
            console.log('Favorites list element not found, skipping favorites load');
            return;
        }
        
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
    } catch (error) {
        console.error('Error loading favorites:', error);
    }
}

// Profile management
function updateProfile(event) {
    try {
        event.preventDefault();
        
        const user = getCurrentUser();
        if (!user) {
            showNotification('User not found', 'error');
            return;
        }
        
        const updatedUser = {
            ...user,
            name: document.getElementById('profileName')?.value || user.name,
            email: document.getElementById('profileEmail')?.value || user.email,
            phone: document.getElementById('profilePhone')?.value || user.phone,
            address: document.getElementById('profileAddress')?.value || user.address,
            city: document.getElementById('profileCity')?.value || user.city,
            state: document.getElementById('profileState')?.value || user.state,
            zipcode: document.getElementById('profileZipcode')?.value || user.zipcode
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
        
        showNotification('Profile updated successfully', 'success');
        
    } catch (error) {
        console.error('Error updating profile:', error);
        showNotification('Error updating profile', 'error');
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
    try {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
            const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems.toString();
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
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
    try {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
        
    } catch (error) {
        console.error('Error showing notification:', error);
        // Fallback to alert if notification fails
        alert(message);
    }
}

function showSuccessMessage(message, title) {
    document.getElementById('successTitle').textContent = title;
    document.getElementById('successMessage').textContent = message;
    openModal('successModal');
}

// Cart management functions
function loadCartItems() {
    try {
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        const cartSummaryContainer = document.getElementById('cartSummaryContainer');
        
        // Early return if elements don't exist
        if (!cartItemsContainer || !cartSummaryContainer) {
            console.log('Cart elements not found, skipping cart load');
            return;
        }
        
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <p data-en="Your cart is empty" data-zh="您的购物车是空的">Your cart is empty</p>
                </div>
            `;
            cartSummaryContainer.innerHTML = `
                <div class="cart-summary">
                    <h3 data-en="Cart Summary" data-zh="购物车摘要">Cart Summary</h3>
                    <p data-en="Total: $0.00" data-zh="总计：$0.00">Total: $0.00</p>
                </div>
            `;
            return;
        }
        
        // Load cart items
        cartItemsContainer.innerHTML = cartItems.map((item, index) => `
            <div class="cart-item">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='${getDefaultProductImage()}'">
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                    <p class="item-price">$${item.price}</p>
                    <div class="item-quantity">
                        <button onclick="updateQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <button onclick="removeFromCart(${index})" class="remove-btn">
                        <span data-en="Remove" data-zh="移除">Remove</span>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Update cart summary
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartSummaryContainer.innerHTML = `
            <div class="cart-summary">
                <h3 data-en="Cart Summary" data-zh="购物车摘要">Cart Summary</h3>
                <p data-en="Total Items: ${cartItems.length}" data-zh="总件数：${cartItems.length}">Total Items: ${cartItems.length}</p>
                <p data-en="Total: $${total.toFixed(2)}" data-zh="总计：$${total.toFixed(2)}">Total: $${total.toFixed(2)}</p>
                <button onclick="checkout()" class="checkout-btn">
                    <span data-en="Checkout" data-zh="结账">Checkout</span>
                </button>
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading cart items:', error);
    }
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
    
    // Note: loadDynamicContent is already called in the first DOMContentLoaded listener
    // No need to call it again here
});

// Load dynamic content from content management system
function loadDynamicContent() {
    try {
        console.log('Loading dynamic content...');
        console.log('Current page elements:');
        console.log('- Hero section:', document.querySelector('.hero') ? 'Found' : 'Not found');
        console.log('- About text:', document.querySelector('.about-text') ? 'Found' : 'Not found');
        console.log('- About image container:', document.querySelector('#aboutImageContainer') ? 'Found' : 'Not found');
        console.log('- Product series grid:', document.getElementById('productSeriesGrid') ? 'Found' : 'Not found');
        console.log('- Gallery grid:', document.getElementById('galleryGrid') ? 'Found' : 'Not found');
        
        // Check if we have content in localStorage, if not use defaults
        console.log('Checking localStorage for existing content...');
        
        // Load all content
        console.log('Loading background images...');
        loadBackgroundImages();
        
        console.log('Loading about content...');
        loadAboutContent();
        
        console.log('Loading product series content...');
        loadProductSeriesContent();
        
        console.log('Loading gallery content...');
        loadGalleryContent();
        
        console.log('Dynamic content loading completed');
        
    } catch (error) {
        console.error('Error loading dynamic content:', error);
    }
}

// Function to clear old localStorage data
function clearOldLocalStorageData() {
    try {
        console.log('Force clearing all old localStorage data to use defaults');
        
        // Clear all old data
        localStorage.removeItem('productSeries');
        localStorage.removeItem('backgroundImages');
        localStorage.removeItem('aboutContent');
        localStorage.removeItem('aboutImage');
        
        console.log('All old data cleared, will use default content');
        
    } catch (error) {
        console.error('Error clearing old localStorage data:', error);
    }
}

// Load product series content
function loadProductSeriesContent() {
    try {
        console.log('loadProductSeriesContent: Starting...');
        const seriesGrid = document.getElementById('productSeriesGrid');
        if (!seriesGrid) {
            console.log('Product series grid not found, skipping product series load');
            return;
        }
        console.log('Product series grid found, proceeding with load');
        
        const productSeries = JSON.parse(localStorage.getItem('productSeries')) || getDefaultProductSeries();
        console.log('Loading product series:', productSeries.length, 'items');
        console.log('Product series data:', productSeries);
        
        seriesGrid.innerHTML = '';
        console.log('Cleared series grid, adding items...');
        
        productSeries.forEach((series, index) => {
            try {
                const seriesItem = document.createElement('div');
                seriesItem.className = 'series-item';
                
                let imageSrc = series.image || getDefaultProductImage();
                if (!imageSrc || imageSrc === 'undefined') {
                    console.warn(`Invalid image source for product series ${index + 1}, using default`);
                    imageSrc = getDefaultProductImage();
                }
                
                seriesItem.innerHTML = `
                    <div class="series-image">
                        <img src="${imageSrc}" alt="${series.name}" onerror="this.src='${getDefaultProductImage()}'">
                    </div>
                    <div class="series-content">
                        <h3>${series.name}</h3>
                        <p>${series.description}</p>
                        <button class="btn btn-primary" onclick="openProductSeriesModal()">
                            <span data-en="Learn More" data-zh="了解更多">Learn More</span>
                        </button>
                    </div>
                `;
                
                seriesGrid.appendChild(seriesItem);
                console.log(`Loaded product series ${index + 1}: ${series.name}`);
                
            } catch (error) {
                console.error(`Error loading product series ${index + 1}:`, error);
            }
        });
        
        console.log('Product series loaded successfully:', productSeries.length, 'items displayed');
        
    } catch (error) {
        console.error('Error loading product series content:', error);
    }
}

// Function to get default product image
function getDefaultProductImage() {
    // Create a simple colored rectangle SVG
    const svg = `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f39c12"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" dy=".3em">Product</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

// Load gallery content
function loadGalleryContent() {
    try {
        console.log('loadGalleryContent: Starting...');
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) {
            console.log('Gallery grid not found, skipping gallery load');
            return;
        }
        console.log('Gallery grid found, proceeding with load');
        
        const gallery = JSON.parse(localStorage.getItem('gallery')) || getDefaultGallery();
        console.log('Loading gallery:', gallery.length, 'items');
        console.log('Gallery data:', gallery);
        
        galleryGrid.innerHTML = '';
        console.log('Cleared gallery grid, adding items...');
        
        gallery.forEach((item, index) => {
            try {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                
                let imageSrc = item.image || getDefaultGalleryImage();
                if (!imageSrc || imageSrc === 'undefined') {
                    console.warn(`Invalid image source for gallery item ${index + 1}, using default`);
                    imageSrc = getDefaultGalleryImage();
                }
                
                galleryItem.innerHTML = `
                    <div class="gallery-image">
                        <img src="${imageSrc}" alt="${item.title}" onerror="this.src='${getDefaultGalleryImage()}'">
                    </div>
                    <div class="gallery-content">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                `;
                
                galleryGrid.appendChild(galleryItem);
                console.log(`Loaded gallery item ${index + 1}: ${item.title}`);
                
            } catch (error) {
                console.error(`Error loading gallery item ${index + 1}:`, error);
            }
        });
        
        console.log('Gallery loaded successfully:', gallery.length, 'items displayed');
        
    } catch (error) {
        console.error('Error loading gallery content:', error);
    }
}

// Function to get default gallery image
function getDefaultGalleryImage() {
    // Create a simple colored rectangle SVG
    const svg = `<svg width="300" height="250" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#e74c3c"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" dy=".3em">Gallery</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

// Load background images for homepage
function loadBackgroundImages() {
    try {
        console.log('loadBackgroundImages: Starting...');
        const hero = document.querySelector('.hero');
        if (!hero) {
            console.log('Hero section not found, skipping background images load');
            return;
        }
        console.log('Hero section found, proceeding with background load');
        
        const backgrounds = JSON.parse(localStorage.getItem('backgroundImages')) || getDefaultBackgrounds();
        console.log('Backgrounds data:', backgrounds);
        
        if (backgrounds.length > 0) {
            try {
                const firstBackground = backgrounds[0];
                let imageSrc = firstBackground.image || getDefaultBackgroundImage();
                
                if (!imageSrc || imageSrc === 'undefined') {
                    console.warn('Invalid background image source, using default');
                    imageSrc = getDefaultBackgroundImage();
                }
                
                console.log('Setting background image:', imageSrc);
                hero.style.backgroundImage = `url('${imageSrc}')`;
                
                // Set up slideshow if multiple images
                if (backgrounds.length > 1) {
                    console.log('Setting up slideshow with', backgrounds.length, 'images');
                    let currentIndex = 0;
                    
                    // Add slideshow indicators
                    addSlideshowIndicators(hero, backgrounds.length);
                    
                    // Set up automatic slideshow
                    const slideshowInterval = setInterval(() => {
                        currentIndex = (currentIndex + 1) % backgrounds.length;
                        changeBackgroundImage(hero, backgrounds[currentIndex], currentIndex);
                        updateSlideshowIndicators(currentIndex);
                    }, 3000); // Change every 3 seconds for better visibility
                    
                    // Store interval ID for potential manual control
                    hero.dataset.slideshowInterval = slideshowInterval;
                    
                    // Add manual navigation
                    addSlideshowNavigation(hero, backgrounds, currentIndex);
                }
                
                console.log('Background image loaded successfully');
                
            } catch (error) {
                console.error('Error setting background image:', error);
                // Fallback to default
                const defaultBg = getDefaultBackgroundImage();
                hero.style.backgroundImage = `url('${defaultBg}')`;
            }
        } else {
            // Use default background
            const defaultBg = getDefaultBackgroundImage();
            hero.style.backgroundImage = `url('${defaultBg}')`;
            console.log('Using default background image');
        }
        
    } catch (error) {
        console.error('Error loading background images:', error);
        // Fallback to default
        try {
            const hero = document.querySelector('.hero');
            if (hero) {
                const defaultBg = getDefaultBackgroundImage();
                hero.style.backgroundImage = `url('${defaultBg}')`;
            }
        } catch (fallbackError) {
            console.error('Error setting fallback background:', fallbackError);
        }
    }
}

// Function to get default background image
function getDefaultBackgroundImage() {
    // Create a simple colored rectangle SVG with light background
    const svg = `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f8f9fa"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="12" fill="#495057" text-anchor="middle" dy=".3em">Background</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

// Function to change background image with fade effect
function changeBackgroundImage(hero, background, index) {
    try {
        let bgSrc = background.image || getDefaultBackgroundImage();
        
        if (!bgSrc || bgSrc === 'undefined') {
            console.warn('Invalid background image source, using default');
            bgSrc = getDefaultBackgroundImage();
        }
        
        // Add fade transition
        hero.style.transition = 'background-image 0.5s ease-in-out';
        hero.style.backgroundImage = `url('${bgSrc}')`;
        
        console.log(`Changed to background image ${index + 1}:`, bgSrc);
        
    } catch (error) {
        console.error('Error changing background image:', error);
    }
}

// Function to add slideshow indicators
function addSlideshowIndicators(hero, totalImages) {
    // Remove existing indicators
    const existingIndicators = hero.querySelector('.slideshow-indicators');
    if (existingIndicators) {
        existingIndicators.remove();
    }
    
    const indicators = document.createElement('div');
    indicators.className = 'slideshow-indicators';
    indicators.style.cssText = `
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 10px;
        z-index: 10;
    `;
    
    for (let i = 0; i < totalImages; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'slideshow-indicator';
        indicator.dataset.index = i;
        indicator.style.cssText = `
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: ${i === 0 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.4)'};
            cursor: pointer;
            transition: background 0.3s ease;
        `;
        
        indicator.addEventListener('click', () => {
            // Manual navigation will be handled by navigation function
            console.log('Indicator clicked:', i);
        });
        
        indicators.appendChild(indicator);
    }
    
    hero.appendChild(indicators);
}

// Function to update slideshow indicators
function updateSlideshowIndicators(activeIndex) {
    const indicators = document.querySelectorAll('.slideshow-indicator');
    indicators.forEach((indicator, index) => {
        indicator.style.background = index === activeIndex 
            ? 'rgba(255, 255, 255, 0.8)' 
            : 'rgba(255, 255, 255, 0.4)';
    });
}

// Function to add slideshow navigation
function addSlideshowNavigation(hero, backgrounds, currentIndex) {
    // Remove existing navigation
    const existingNav = hero.querySelector('.slideshow-navigation');
    if (existingNav) {
        existingNav.remove();
    }
    
    const navigation = document.createElement('div');
    navigation.className = 'slideshow-navigation';
    navigation.style.cssText = `
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        z-index: 10;
    `;
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '‹';
    prevBtn.className = 'slideshow-nav-btn prev-btn';
    prevBtn.style.cssText = `
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        font-size: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        transition: background 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    prevBtn.addEventListener('mouseenter', () => {
        prevBtn.style.background = 'rgba(255, 255, 255, 0.4)';
    });
    
    prevBtn.addEventListener('mouseleave', () => {
        prevBtn.style.background = 'rgba(255, 255, 255, 0.2)';
    });
    
    prevBtn.addEventListener('click', () => {
        const currentIndex = parseInt(hero.dataset.currentIndex || 0);
        const newIndex = (currentIndex - 1 + backgrounds.length) % backgrounds.length;
        changeBackgroundImage(hero, backgrounds[newIndex], newIndex);
        updateSlideshowIndicators(newIndex);
        hero.dataset.currentIndex = newIndex;
        
        // Reset automatic slideshow
        resetSlideshow(hero, backgrounds, newIndex);
    });
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '›';
    nextBtn.className = 'slideshow-nav-btn next-btn';
    nextBtn.style.cssText = `
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        font-size: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        transition: background 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    nextBtn.addEventListener('mouseenter', () => {
        nextBtn.style.background = 'rgba(255, 255, 255, 0.4)';
    });
    
    nextBtn.addEventListener('mouseleave', () => {
        nextBtn.style.background = 'rgba(255, 255, 255, 0.2)';
    });
    
    nextBtn.addEventListener('click', () => {
        const currentIndex = parseInt(hero.dataset.currentIndex || 0);
        const newIndex = (currentIndex + 1) % backgrounds.length;
        changeBackgroundImage(hero, backgrounds[newIndex], newIndex);
        updateSlideshowIndicators(newIndex);
        hero.dataset.currentIndex = newIndex;
        
        // Reset automatic slideshow
        resetSlideshow(hero, backgrounds, newIndex);
    });
    
    navigation.appendChild(prevBtn);
    navigation.appendChild(nextBtn);
    hero.appendChild(navigation);
    
    // Store current index
    hero.dataset.currentIndex = currentIndex;
}

// Function to reset slideshow after manual navigation
function resetSlideshow(hero, backgrounds, currentIndex) {
    // Clear existing interval
    if (hero.dataset.slideshowInterval) {
        clearInterval(parseInt(hero.dataset.slideshowInterval));
    }
    
    // Restart automatic slideshow
    const slideshowInterval = setInterval(() => {
        const newIndex = (currentIndex + 1) % backgrounds.length;
        changeBackgroundImage(hero, backgrounds[newIndex], newIndex);
        updateSlideshowIndicators(newIndex);
        hero.dataset.currentIndex = newIndex;
        currentIndex = newIndex;
    }, 3000);
    
    hero.dataset.slideshowInterval = slideshowInterval;
}

// Load about us content
function loadAboutContent() {
    try {
        console.log('loadAboutContent: Starting...');
        const aboutText = document.querySelector('.about-text');
        const aboutImageElement = document.querySelector('#aboutImageContainer');
        const aboutImage = document.querySelector('#aboutImage');
        
        console.log('About elements found:');
        console.log('- aboutText:', aboutText ? 'Found' : 'Not found');
        console.log('- aboutImageElement:', aboutImageElement ? 'Found' : 'Not found');
        console.log('- aboutImage:', aboutImage ? 'Found' : 'Not found');
        
        if (!aboutText || !aboutImageElement) {
            console.log('About us elements not found, skipping about content load');
            return;
        }
        
        // 首先尝试从内容管理页面读取数据
        const aboutUsData = JSON.parse(localStorage.getItem('aboutUs') || '{}');
        const aboutData = JSON.parse(localStorage.getItem('aboutContent')) || getDefaultAboutContent();
        const aboutImageData = localStorage.getItem('aboutImage');
        
        console.log('About us data from content management:', aboutUsData);
        console.log('About data loaded:', aboutData);
        console.log('About image data:', aboutImageData);
        
        // Update text content - 优先使用内容管理页面的数据
        let titleElement = null;
        let descriptions = [];
        
        try {
            titleElement = aboutText.querySelector('h2');
            descriptions = aboutText.querySelectorAll('p');
            console.log('Found title element:', titleElement ? 'Yes' : 'No');
            console.log('Found', descriptions.length, 'description paragraphs');
            
            // 更新标题
            if (titleElement) {
                // 优先使用内容管理页面的数据
                if (aboutUsData.title) {
                    titleElement.textContent = aboutUsData.title;
                    console.log('Title updated from content management:', aboutUsData.title);
                } else {
                    // 如果没有内容管理数据，使用默认语言文本
                    const defaultTitle = currentLanguage === 'zh' ? '关于WHL优雅窗帘' : 'About WHL Elegant Curtains';
                    titleElement.textContent = defaultTitle;
                    console.log('Title set to default language:', defaultTitle);
                }
            }
            
            // 更新描述段落
            if (descriptions && descriptions.length >= 1) {
                // 优先使用内容管理页面的数据
                if (aboutUsData.description) {
                    descriptions[0].textContent = aboutUsData.description;
                    console.log('Description updated from content management:', aboutUsData.description);
                } else {
                    // 如果没有内容管理数据，使用默认语言文本
                    const defaultDesc = currentLanguage === 'zh' ? 
                        '我们是一家家族企业，在创造美丽窗帘方面拥有超过20年的经验。我们对质量和客户满意度的承诺使我们成为整个地区房主的值得信赖的选择。' :
                        'We are a family-owned business with over 20 years of experience in creating beautiful window treatments. Our commitment to quality and customer satisfaction has made us the trusted choice for homeowners throughout the region.';
                    descriptions[0].textContent = defaultDesc;
                    console.log('Description set to default language');
                }
            }
        } catch (error) {
            console.error('Error updating about text:', error);
        }
        
        // Update image - 优先使用内容管理页面的数据
        try {
            // 优先使用内容管理页面的图片，然后是其他来源
            let imageSrc = aboutUsData.image || aboutImageData || aboutData.image || getDefaultAboutImage();
            if (!imageSrc || imageSrc === 'undefined') {
                console.warn('Invalid about us image source, using default');
                imageSrc = getDefaultAboutImage();
            }
            
            // Remove display:none style and set image
            if (aboutImage) {
                console.log('Setting about image:', imageSrc);
                aboutImage.style.display = 'block';
                aboutImage.src = imageSrc;
                aboutImage.onerror = function() {
                    console.log('About image failed to load, using default');
                    this.src = getDefaultAboutImage();
                };
                console.log('About image set successfully');
            }
            
            console.log('About us image loaded successfully');
            
        } catch (error) {
            console.error('Error updating about image:', error);
        }
        
        console.log('About content loaded successfully');
        
        // 调试信息：显示最终设置的内容
        if (titleElement) {
            console.log('Final title set to:', titleElement.textContent);
        }
        if (descriptions && descriptions.length >= 1) {
            console.log('Final description set to:', descriptions[0].textContent);
        }
        
    } catch (error) {
        console.error('Error loading about content:', error);
    }
}

// 调试函数：检查localStorage中的关于我们数据
function debugAboutUsData() {
    console.log('=== Debug About Us Data ===');
    console.log('aboutUs:', localStorage.getItem('aboutUs'));
    console.log('aboutContent:', localStorage.getItem('aboutContent'));
    console.log('aboutImage:', localStorage.getItem('aboutImage'));
    
    try {
        const aboutUs = JSON.parse(localStorage.getItem('aboutUs') || '{}');
        console.log('Parsed aboutUs:', aboutUs);
        console.log('Title:', aboutUs.title);
        console.log('Description:', aboutUs.description);
        console.log('Image:', aboutUs.image ? 'Present' : 'Not present');
    } catch (e) {
        console.error('Error parsing aboutUs:', e);
    }
    
    // 检查页面上的实际内容
    const titleElement = document.querySelector('.about-text h2');
    const descriptions = document.querySelectorAll('.about-text p');
    
    console.log('=== Page Content ===');
    console.log('Title element:', titleElement ? titleElement.textContent : 'Not found');
    console.log('Description 1:', descriptions[0] ? descriptions[0].textContent : 'Not found');
    console.log('Description 2:', descriptions[1] ? descriptions[1].textContent : 'Not found');
}

// Function to get default about us image
function getDefaultAboutImage() {
    // Create a simple colored rectangle SVG
    const svg = `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#4a90e2"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" dy=".3em">About Us</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

// Default content functions (same as in content-management.js)
function getDefaultProductSeries() {
    return [
        {
            name: 'Blackout Curtains',
            nameZh: '遮光窗帘',
            description: 'Professional blackout fabrics with excellent light blocking properties',
            descriptionZh: '专业的遮光面料，具有出色的遮光性能',
            image: (() => {
                const svg = `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#2c3e50"/>
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle" dy=".3em">Blackout</text>
                </svg>`;
                return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
            })(),
            category: 'blackout'
        },
        {
            name: 'Roller Blinds',
            nameZh: '卷帘',
            description: 'High-quality roller blind fabrics for modern window treatments',
            descriptionZh: '高品质卷帘面料，适用于现代窗户装饰',
            image: (() => {
                const svg = `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#e74c3c"/>
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle" dy=".3em">Roller</text>
                </svg>`;
                return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
            })(),
            category: 'roller'
        },
        {
            name: 'Sheer Elegance',
            nameZh: '优雅薄纱',
            description: 'Elegant sheer fabrics combining beauty and functionality',
            descriptionZh: '优雅的薄纱面料，结合美观与功能性',
            image: (() => {
                const svg = `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#9b59b6"/>
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle" dy=".3em">Sheer</text>
                </svg>`;
                return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
            })(),
            category: 'sheer'
        },
        {
            name: 'Roman Shades',
            nameZh: '罗马帘',
            description: 'Classic roman shade fabrics with elegant pleating',
            descriptionZh: '经典的罗马帘面料，具有优雅的褶皱效果',
            image: (() => {
                const svg = `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#f39c12"/>
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle" dy=".3em">Roman</text>
                </svg>`;
                return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
            })(),
            category: 'roman'
        },
        {
            name: 'Elegant Drapery',
            nameZh: '优雅窗帘',
            description: 'Premium drapery fabrics for large windows and formal spaces',
            descriptionZh: '优质窗帘面料，适用于大窗户和正式空间',
            image: (() => {
                const svg = `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#1abc9c"/>
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle" dy=".3em">Drapery</text>
                </svg>`;
                return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
            })(),
            category: 'drapery'
        },
        {
            name: 'Layered Treatments',
            nameZh: '分层装饰',
            description: 'Multi-layer fabric solutions for sophisticated window treatments',
            descriptionZh: '多层面料解决方案，适用于精致的窗户装饰',
            image: (() => {
                const svg = `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#34495e"/>
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle" dy=".3em">Layered</text>
                </svg>`;
                return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
            })(),
            category: 'layered'
        },
        {
            name: 'Moisture Resistant',
            nameZh: '防潮面料',
            description: 'Weather-resistant fabrics for bathrooms and outdoor spaces',
            descriptionZh: '防潮面料，适用于浴室和户外空间',
            image: (() => {
                const svg = `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#3498db"/>
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle" dy=".3em">Moisture</text>
                </svg>`;
                return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
            })(),
            category: 'moisture'
        },
        {
            name: 'Classic Valances',
            nameZh: '经典帷幔',
            description: 'Timeless valance fabrics for traditional and elegant interiors',
            descriptionZh: '永恒的帷幔面料，适用于传统和优雅的室内装饰',
            image: (() => {
                const svg = `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#8e44ad"/>
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle" dy=".3em">Valances</text>
                </svg>`;
                return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
            })(),
            category: 'valances'
        },
        {
            name: 'Smart Home Integration',
            nameZh: '智能家居集成',
            description: 'Advanced fabrics with smart home technology integration',
            descriptionZh: '集成智能家居技术的高级面料',
            image: (() => {
                const svg = `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#e67e22"/>
                    <text x="50%" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle" dy=".3em">Smart</text>
                </svg>`;
                return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
            })(),
            category: 'smart'
        },
        {
            name: 'Eco-Friendly Materials',
            nameZh: '环保材料',
            description: 'Sustainable and environmentally friendly curtain materials',
            descriptionZh: '可持续和环保的窗帘材料',
            image: (() => {
                const svg = `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#27ae60"/>
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle" dy=".3em">Eco</text>
                </svg>`;
                return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
            })(),
            category: 'eco'
        }
    ];
}

function getDefaultGallery() {
    return [
        {
            title: 'Elegant Living Room',
            titleZh: '优雅客厅',
            description: 'Elegant living room curtains',
            descriptionZh: '优雅的客厅窗帘',
            image: (() => {
                const svg = `<svg width="300" height="250" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#e74c3c"/>
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" dy=".3em">Living Room</text>
                </svg>`;
                return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
            })()
        },
        {
            title: 'Modern Kitchen',
            titleZh: '现代厨房',
            description: 'Modern kitchen window treatments',
            descriptionZh: '现代厨房窗户装饰',
            image: (() => {
                const svg = `<svg width="300" height="250" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#f39c12"/>
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" dy=".3em">Kitchen</text>
                </svg>`;
                return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
            })()
        },
        {
            title: 'Cozy Bedroom',
            titleZh: '温馨卧室',
            description: 'Cozy bedroom curtains',
            descriptionZh: '温馨的卧室窗帘',
            image: (() => {
                const svg = `<svg width="300" height="250" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#9b59b6"/>
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" dy=".3em">Bedroom</text>
                </svg>`;
                return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
            })()
        },
        {
            title: 'Formal Dining Room',
            titleZh: '正式餐厅',
            description: 'Formal dining room elegance',
            descriptionZh: '正式餐厅的优雅装饰',
            image: (() => {
                const svg = `<svg width="300" height="250" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#34495e"/>
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" dy=".3em">Dining Room</text>
                </svg>`;
                return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
            })()
        }
    ];
}

function getDefaultBackgrounds() {
    return [
        {
            image: (() => {
                const svg = `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#f8f9fa"/>
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="12" fill="#495057" text-anchor="middle" dy=".3em">Background 1</text>
                </svg>`;
                return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
            })(),
            order: 1
        },
        {
            image: (() => {
                const svg = `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#e9ecef"/>
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="12" fill="#6c757d" text-anchor="middle" dy=".3em">Background 2</text>
                </svg>`;
                return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
            })(),
            order: 2
        },
        {
            image: (() => {
                const svg = `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#dee2e6"/>
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="12" fill="#495057" text-anchor="middle" dy=".3em">Background 3</text>
                </svg>`;
                return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
            })(),
            order: 3
        }
    ];
}

function getDefaultAboutContent() {
    return {
        title: 'About WHL Elegant Curtains',
        titleZh: '关于WHL优雅窗帘',
        description: 'We are a family-owned business with over 20 years of experience in creating beautiful window treatments. Our commitment to quality and customer satisfaction has made us the trusted choice for homeowners throughout the region.',
        descriptionZh: '我们是一家家族企业，在创造美丽窗帘方面拥有超过20年的经验。我们对质量和客户满意度的承诺使我们成为整个地区房主的值得信赖的选择。'
    };
}

// Function to open product series modal
function openProductSeriesModal() {
    try {
        // This is a placeholder function for the main page
        // The actual modal functionality is in content-management.html
        console.log('Product series modal opened (placeholder)');
        
        // You can add actual modal functionality here if needed
        // For now, just show a notification
        showNotification('Product series details will be available in the content management system', 'info');
        
    } catch (error) {
        console.error('Error opening product series modal:', error);
    }
}

function loadAppointments() {
    try {
        const appointmentsList = document.getElementById('appointmentsList');
        
        // Early return if element doesn't exist
        if (!appointmentsList) {
            console.log('Appointments list element not found, skipping appointments load');
            return;
        }
        
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        if (appointments.length > 0) {
            const appointmentsHTML = appointments.map(appointment => `
                <div class="appointment-item">
                    <h4>Appointment #${appointment.id}</h4>
                    <p>Customer: ${appointment.customerName}</p>
                    <p>Date: ${appointment.date}</p>
                    <p>Time: ${appointment.time}</p>
                    <p>Status: ${appointment.status}</p>
                </div>
            `).join('');
            appointmentsList.innerHTML = appointmentsHTML;
        } else {
            appointmentsList.innerHTML = '<p data-en="No appointments found." data-zh="未找到预约。">No appointments found.</p>';
        }
    } catch (error) {
        console.error('Error loading appointments:', error);
    }
}

function switchLanguage(lang) {
    try {
        currentLanguage = lang;
        updatePageLanguage(lang);
        refreshAllContent();
        
        // Show notification
        const message = lang === 'zh' ? '语言已切换到中文' : 'Language switched to English';
        showNotification(message, 'success');
        
    } catch (error) {
        console.error('Error switching language:', error);
    }
}

function refreshAllContent() {
    try {
        // Refresh all dynamic content
        loadBackgroundImages();
        loadAboutContent();
        loadProductSeriesContent();
        loadGalleryContent();
        
        console.log('All content refreshed');
        
    } catch (error) {
        console.error('Error refreshing content:', error);
    }
}

function loadQuotes() {
    try {
        const quotesList = document.getElementById('quotesList');
        
        // Early return if element doesn't exist
        if (!quotesList) {
            console.log('Quotes list element not found, skipping quotes load');
            return;
        }
        
        const quotes = JSON.parse(localStorage.getItem('userQuotes') || '[]');
        if (quotes.length > 0) {
            const quotesHTML = quotes.map(quote => `
                <div class="quote-item">
                    <h4>Quote #${quote.id}</h4>
                    <p>Customer: ${quote.customerName}</p>
                    <p>Date: ${quote.date}</p>
                    <p>Total: ${quote.total}</p>
                    <p>Status: ${quote.status}</p>
                </div>
            `).join('');
            quotesList.innerHTML = quotesHTML;
        } else {
            quotesList.innerHTML = '<p data-en="No quotes found." data-zh="未找到报价。">No quotes found.</p>';
        }
    } catch (error) {
        console.error('Error loading quotes:', error);
    }
}
