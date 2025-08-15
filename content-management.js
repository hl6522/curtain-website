// Content Management System JavaScript

// Global language state
let currentLanguage = 'en';

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    
    checkAuth();
    loadContent();
    initializeLanguageSwitcher();
    
    // Wait for DOM to be fully loaded before checking About Us elements
    setTimeout(() => {
        console.log('Checking About Us elements after DOM load');
        ensureAboutUsElementsExist();
        updateAboutFormDisplay();
    }, 100);
    
    // Additional retry with longer delay
    setTimeout(() => {
        console.log('Second attempt to load About Us form');
        ensureAboutUsElementsExist();
        updateAboutFormDisplay();
    }, 500);
    
    // Final retry with even longer delay
    setTimeout(() => {
        console.log('Third attempt to load About Us form');
        ensureAboutUsElementsExist();
        updateAboutFormDisplay();
    }, 1000);
});

// Function to ensure About Us elements exist
function ensureAboutUsElementsExist() {
    console.log('Ensuring About Us elements exist...');
    
    // Check if elements exist
    const titleInput = document.getElementById('aboutTitle');
    const titleInputZh = document.getElementById('aboutTitleZh');
    const descInput = document.getElementById('aboutDescription');
    const descInputZh = document.getElementById('aboutDescriptionZh');
    const imageFileInput = document.getElementById('aboutImageFile');
    
    console.log('Element check results:');
    console.log('aboutTitle:', titleInput);
    console.log('aboutTitleZh:', titleInputZh);
    console.log('aboutDescription:', descInput);
    console.log('aboutDescriptionZh:', descInputZh);
    console.log('aboutImageFile:', imageFileInput);
    
    // If any elements are missing, completely rebuild the section
    if (!titleInput || !titleInputZh || !descInput || !descInputZh || !imageFileInput) {
        console.log('Some About Us elements are missing, completely rebuilding section...');
        rebuildAboutUsSection();
    } else {
        console.log('All About Us elements found successfully');
    }
}

// Language switching functionality
function switchLanguage(lang) {
    console.log('Switching language to:', lang); // Debug log
    
    // Update global language state
    currentLanguage = lang;
    console.log('Current language set to:', currentLanguage);
    
    // Update active button state
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
    
    // Update page language
    updatePageLanguage(lang);
    
    // Refresh all content
    refreshAllContent();
    
    // Update modal form visibility if any modals are open
    updateModalFormVisibility();
}

// Force refresh all dynamic content to reflect language changes
function refreshAllContent() {
    // Refresh product series display
    const productSeriesGrid = document.getElementById('productSeriesGrid');
    if (productSeriesGrid) {
        loadProductSeries();
    }
    
    // Refresh gallery display
    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid) {
        loadGallery();
    }
    
    // Refresh background images display
    const backgroundSlideshow = document.getElementById('backgroundSlideshow');
    if (backgroundSlideshow) {
        loadBackgroundImages();
    }
    
    // Update About Us form display based on current language
    updateAboutFormDisplay();
}

// Initialize language switcher
function initializeLanguageSwitcher() {
    // Set default language
    switchLanguage('en');
}

// Update page content based on language
function updatePageLanguage(lang) {
    console.log('Updating page language to:', lang); // Debug log
    
    // Update static text elements
    const textElements = document.querySelectorAll('[data-en], [data-zh]');
    textElements.forEach(element => {
        if (lang === 'en' && element.dataset.en) {
            element.textContent = element.dataset.en;
        } else if (lang === 'zh' && element.dataset.zh) {
            element.textContent = element.dataset.zh;
        }
    });
    
    // Update section headers and other static text
    updateStaticText(lang);
}

// Update static text elements on the page
function updateStaticText(lang) {
    const textUpdates = {
        'en': {
            'Content Management Dashboard': 'Content Management Dashboard',
            'Manage website content, images, and media': 'Manage website content, images, and media',
            'Product Series Management': 'Product Series Management',
            'Gallery Management': 'Gallery Management',
            'Homepage Background Images': 'Homepage Background Images',
            'About Us Page Management': 'About Us Page Management',
            'Add New Product Series': 'Add New Product Series',
            'Add New Gallery Item': 'Add New Gallery Item',
            'Add New Background Image': 'Add New Background Image',
            'Text Content': 'Text Content',
            'Right Side Image': 'Right Side Image',
            'Upload New Image': 'Upload New Image',
            'Series Name': 'Series Name',
            'Description': 'Description',
            'Title': 'Title',
            'Save Text Changes': 'Save Text Changes',
            '添加新产品系列': 'Add New Product Series',
            '添加新画廊项目': 'Add New Gallery Item',
            '添加新背景图片': 'Add New Background Image',
            '画廊管理': 'Gallery Management',
            '首页背景图片': 'Homepage Background Images',
            '关于我们页面管理': 'About Us Page Management',
            '文本内容': 'Text Content',
            '标题': 'Title',
            '描述': 'Description',
            '保存文本更改': 'Save Text Changes',
            '右侧图片': 'Right Side Image',
            '上传新图片': 'Upload New Image',
            '产品系列管理': 'Product Series Management'
        },
        'zh': {
            'Content Management Dashboard': '内容管理仪表板',
            'Manage website content, images, and media': '管理网站内容、图片和媒体',
            'Product Series Management': '产品系列管理',
            'Gallery Management': '画廊管理',
            'Homepage Background Images': '首页背景图片',
            'About Us Page Management': '关于我们页面管理',
            'Add New Product Series': '添加新产品系列',
            'Add New Gallery Item': '添加新画廊项目',
            'Add New Background Image': '添加新背景图片',
            'Text Content': '文本内容',
            'Right Side Image': '右侧图片',
            'Upload New Image': '上传新图片',
            'Series Name': '系列名称',
            'Description': '描述',
            'Title': '标题',
            'Save Text Changes': '保存文本更改',
            '添加新产品系列': '添加新产品系列',
            '添加新画廊项目': '添加新画廊项目',
            '添加新背景图片': '添加新背景图片',
            'Gallery Management': '画廊管理',
            'Homepage Background Images': '首页背景图片',
            'About Us Page Management': '关于我们页面管理',
            'Text Content': '文本内容',
            'Title': '标题',
            'Description': '描述',
            'Save Text Changes': '保存文本更改',
            'Right Side Image': '右侧图片',
            '上传新图片': '上传新图片',
            '产品系列管理': '产品系列管理'
        }
    };
    
    const updates = textUpdates[lang];
    if (updates) {
        Object.keys(updates).forEach(oldText => {
            const elements = document.querySelectorAll('h1, h2, h3, p, button, label, span, div');
            elements.forEach(element => {
                if (element.textContent.trim() === oldText) {
                    element.textContent = updates[oldText];
                }
            });
        });
    }
    
    // Update form input visibility based on language
    updateFormInputVisibility(lang);
    
    // Force refresh of dynamic content after static text update
    setTimeout(() => {
        refreshAllContent();
    }, 100);
}

// Update form input visibility based on current language
function updateFormInputVisibility(lang) {
    // Only hide/show inputs that are not in About Us form and not in open modals
    const allLangInputs = document.querySelectorAll('.lang-input');
    allLangInputs.forEach(input => {
        if (!input.id.includes('about')) {
            // Check if this input is in an open modal
            const modal = input.closest('.modal');
            if (!modal || modal.style.display !== 'block') {
                // Only hide inputs that are not in open modals
                input.style.display = 'none';
            }
        }
    });
    
    // Show only inputs for current language (except About Us form and open modals)
    const currentLangInputs = document.querySelectorAll(`.lang-input[data-lang="${lang}"]`);
    currentLangInputs.forEach(input => {
        if (!input.id.includes('about')) {
            // Check if this input is in an open modal
            const modal = input.closest('.modal');
            if (!modal || modal.style.display !== 'block') {
                // Only show inputs that are not in open modals
                input.style.display = 'block';
            }
        }
    });
    
    // Update required attributes (except About Us form and open modals)
    if (lang === 'zh') {
        // For Chinese, make Chinese inputs required and English inputs not required
        document.querySelectorAll('.lang-input[data-lang="zh"]').forEach(input => {
            if (!input.id.includes('about')) {
                const modal = input.closest('.modal');
                if (!modal || modal.style.display !== 'block') {
                    input.required = true;
                }
            }
        });
        document.querySelectorAll('.lang-input[data-lang="en"]').forEach(input => {
            if (!input.id.includes('about')) {
                const modal = input.closest('.modal');
                if (!modal || modal.style.display !== 'block') {
                    input.required = false;
                }
            }
        });
    } else {
        // For English, make English inputs required and Chinese inputs not required
        document.querySelectorAll('.lang-input[data-lang="en"]').forEach(input => {
            if (!input.id.includes('about')) {
                const modal = input.closest('.modal');
                if (!modal || modal.style.display !== 'block') {
                    input.required = true;
                }
            }
        });
        document.querySelectorAll('.lang-input[data-lang="zh"]').forEach(input => {
            if (!input.id.includes('about')) {
                const modal = input.closest('.modal');
                if (!modal || modal.style.display !== 'block') {
                    input.required = false;
                }
            }
        });
    }
    
    // Don't call updateAboutFormDisplay here to avoid conflicts
    // It will be called separately from the language switching logic
}

// Update modal form visibility based on current language
function updateModalFormVisibility() {
    // Get all open modals
    const openModals = document.querySelectorAll('.modal[style*="display: block"]');
    
    openModals.forEach(modal => {
        console.log('Updating modal form visibility for:', modal.id);
        
        // Debug: Check what elements exist in the modal
        console.log('Modal HTML content:', modal.innerHTML);
        
        // Get all lang-input elements in this modal
        const langInputs = modal.querySelectorAll('.lang-input');
        console.log('Found lang-input elements:', langInputs.length);
        
        // Debug: Check all elements with class attribute
        const allElementsWithClass = modal.querySelectorAll('[class]');
        console.log('All elements with class attribute:', allElementsWithClass.length);
        allElementsWithClass.forEach(el => {
            console.log('Element with class:', el.tagName, el.id, 'classes:', el.className);
        });
        
        // Debug: Check all input elements
        const allInputs = modal.querySelectorAll('input, textarea');
        console.log('All input/textarea elements:', allInputs.length);
        allInputs.forEach(input => {
            console.log('Input element:', input.tagName, input.id, 'classes:', input.className, 'data-lang:', input.dataset.lang);
        });
        
        langInputs.forEach(input => {
            const lang = input.dataset.lang;
            if (lang === currentLanguage) {
                input.style.display = 'block';
                input.required = true;
                console.log('Showing lang input:', input.id, 'for language:', lang);
            } else {
                input.style.display = 'none';
                input.required = false;
                console.log('Hiding lang input:', input.id, 'for language:', lang);
            }
        });
        
        // Ensure non-language-specific inputs are always visible
        const nonLangInputs = modal.querySelectorAll('input:not(.lang-input), select:not(.lang-input), textarea:not(.lang-input)');
        nonLangInputs.forEach(input => {
            input.style.display = 'block';
            console.log('Ensuring non-language input is visible:', input.id, input.type);
        });
        
        // Force show all form elements in the modal
        const allFormElements = modal.querySelectorAll('input, select, textarea, label, .form-group');
        allFormElements.forEach(element => {
            element.style.display = 'block';
            element.style.visibility = 'visible';
            element.style.opacity = '1';
            console.log('Force showing form element:', element.id, element.type, 'display:', element.style.display);
        });
        
        // Ensure all input containers are visible
        const inputContainers = modal.querySelectorAll('[id*="Inputs"]');
        inputContainers.forEach(container => {
            container.style.display = 'block';
            container.style.visibility = 'visible';
            console.log('Force showed input container:', container.id);
        });
        
        // Specifically ensure all input fields are visible
        const modalInputs = modal.querySelectorAll('input[type="text"], input[type="file"], textarea, select');
        modalInputs.forEach(input => {
            input.style.display = 'block';
            input.style.visibility = 'visible';
            input.style.opacity = '1';
            console.log('Force showed input field:', input.id, input.type);
        });
    });
}

// Check if user is authenticated as content manager
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'content-login.html';
        return;
    }
    
    try {
        const userInfo = JSON.parse(currentUser);
        if (userInfo.userType !== 'content') {
            window.location.href = 'content-login.html';
            return;
        }
        
        // Update user name display
        document.getElementById('userName').textContent = userInfo.name;
    } catch (e) {
        window.location.href = 'content-login.html';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'content-login.html';
}

// Load all content
function loadContent() {
    loadProductSeries();
    loadGallery();
    loadBackgroundImages();
    loadAboutContent();
}

// Product Series Management
function loadProductSeries() {
    const grid = document.getElementById('productSeriesGrid');
    const productSeries = JSON.parse(localStorage.getItem('productSeries')) || getDefaultProductSeries();
    
    grid.innerHTML = '';
    
    productSeries.forEach((series, index) => {
        const item = document.createElement('div');
        item.className = 'content-item';
        
        // Display content based on current language
        const displayName = currentLanguage === 'zh' ? (series.nameZh || series.name) : series.name;
        const displayDescription = currentLanguage === 'zh' ? (series.descriptionZh || series.description) : series.description;
        
        item.innerHTML = `
            <img src="${series.image}" alt="${displayName}">
            <h4>${displayName}</h4>
            <p>${displayDescription}</p>
            <div class="item-controls">
                <button class="btn btn-edit" data-index="${index}">${currentLanguage === 'zh' ? '编辑' : 'Edit'}</button>
                <button class="btn btn-delete" data-index="${index}">${currentLanguage === 'zh' ? '删除' : 'Delete'}</button>
            </div>
        `;
        
        // Add event listeners to the buttons
        const editBtn = item.querySelector('.btn-edit');
        const deleteBtn = item.querySelector('.btn-delete');
        
        editBtn.addEventListener('click', function() {
            editProductSeries(index);
        });
        
        deleteBtn.addEventListener('click', function() {
            deleteProductSeries(index);
        });
        grid.appendChild(item);
    });
}

function getDefaultProductSeries() {
    return [
        {
            name: 'Blackout Curtains',
            nameZh: '遮光窗帘',
            description: 'Professional blackout fabrics with excellent light blocking properties',
            descriptionZh: '专业的遮光面料，具有出色的遮光性能',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJsYWNrb3V0IEN1cnRhaW5zPC90ZXh0Pjwvc3ZnPg==',
            category: 'blackout'
        },
        {
            name: 'Roller Blinds',
            nameZh: '卷帘',
            description: 'High-quality roller blind fabrics for modern window treatments',
            descriptionZh: '高品质卷帘面料，适用于现代窗户装饰',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlJvbGxlciBCbGluZHM8L3RleHQ+PC9zdmc+',
            category: 'roller'
        },
        {
            name: 'Sheer Elegance',
            nameZh: '优雅薄纱',
            description: 'Elegant sheer fabrics combining beauty and functionality',
            descriptionZh: '优雅的薄纱面料，结合美观与功能性',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlNoZWVyIEVsZWdhbmNlPC90ZXh0Pjwvc3ZnPg==',
            category: 'sheer'
        },
        {
            name: 'Roman Shades',
            nameZh: '罗马帘',
            description: 'Classic roman shade fabrics with elegant pleating',
            descriptionZh: '经典的罗马帘面料，具有优雅的褶皱效果',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlJvbWFuIFNoYWRlczwvdGV4dD48L3N2Zz4=',
            category: 'roman'
        },
        {
            name: 'Elegant Drapery',
            nameZh: '优雅窗帘',
            description: 'Premium drapery fabrics for large windows and formal spaces',
            descriptionZh: '优质窗帘面料，适用于大窗户和正式空间',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVsZWdhbnQgRHJhcGVyeTwvdGV4dD48L3N2Zz4=',
            category: 'drapery'
        },
        {
            name: 'Layered Treatments',
            nameZh: '分层装饰',
            description: 'Multi-layer fabric solutions for sophisticated window treatments',
            descriptionZh: '多层面料解决方案，适用于精致的窗户装饰',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxheWVyZWQgVHJlYXRtZW50czwvdGV4dD48L3N2Zz4=',
            category: 'layered'
        },
        {
            name: 'Moisture Resistant',
            nameZh: '防潮面料',
            description: 'Weather-resistant fabrics for bathrooms and outdoor spaces',
            descriptionZh: '防潮面料，适用于浴室和户外空间',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1vaXN0dXJlIFJlc2lzdGFudDwvdGV4dD48L3N2Zz4=',
            category: 'moisture'
        },
        {
            name: 'Classic Valances',
            nameZh: '经典帷幔',
            description: 'Timeless valance fabrics for traditional and elegant interiors',
            descriptionZh: '永恒的帷幔面料，适用于传统和优雅的室内装饰',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNsYXNzaWMgVmFsYW5jZXM8L3N2Zz4=',
            category: 'valances'
        }
    ];
}

function openProductSeriesModal(editIndex = null) {
    const modal = document.getElementById('productSeriesModal');
    const title = document.getElementById('productSeriesModalTitle');
    const form = document.getElementById('productSeriesForm');
    
    // Check if required elements exist
    if (!modal || !title || !form) {
        console.log('Product series modal elements not found');
        return;
    }
    
    // Check and recreate missing elements if necessary
    checkAndRecreateModalElements('productSeriesModal');
    
    if (editIndex !== null) {
        title.textContent = currentLanguage === 'zh' ? '编辑产品系列' : 'Edit Product Series';
        const productSeries = JSON.parse(localStorage.getItem('productSeries')) || getDefaultProductSeries();
        const series = productSeries[editIndex];
        
        // Check if form elements exist before setting values
        const nameInput = document.getElementById('productSeriesName');
        const nameZhInput = document.getElementById('productSeriesNameZh');
        const descInput = document.getElementById('productSeriesDescription');
        const descZhInput = document.getElementById('productSeriesDescriptionZh');
        const categoryInput = document.getElementById('productSeriesCategory');
        
        if (nameInput && nameZhInput && descInput && descZhInput && categoryInput) {
            nameInput.value = series.name;
            nameZhInput.value = series.nameZh || '';
            descInput.value = series.description;
            descZhInput.value = series.descriptionZh || '';
            categoryInput.value = series.category;
        }
        
        form.dataset.editIndex = editIndex;
    } else {
        title.textContent = currentLanguage === 'zh' ? '添加新产品系列' : 'Add New Product Series';
        form.reset();
        delete form.dataset.editIndex;
    }
    
    modal.style.display = 'block';
    
    // Immediately ensure all inputs are visible
    ensureModalInputsVisible('productSeriesModal');
    
    // Then update the language-specific visibility
    updateModalFormVisibility();
    
    // Finally, ensure the current language inputs are visible
    setTimeout(() => {
        const langInputs = modal.querySelectorAll('.lang-input');
        langInputs.forEach(input => {
            const lang = input.dataset.lang;
            if (lang === currentLanguage) {
                input.style.display = 'block';
                input.required = true;
                console.log('Final visibility check - showing:', input.id, 'for language:', lang);
            } else {
                input.style.display = 'none';
                input.required = false;
                console.log('Final visibility check - hiding:', input.id, 'for language:', lang);
            }
        });
    }, 100);
}

function closeProductSeriesModal() {
    document.getElementById('productSeriesModal').style.display = 'none';
}

function editProductSeries(index) {
    openProductSeriesModal(index);
}

function deleteProductSeries(index) {
    const message = currentLanguage === 'zh' ? '你确定要删除这个产品系列吗？' : 'Are you sure you want to delete this product series?';
    if (confirm(message)) {
        const productSeries = JSON.parse(localStorage.getItem('productSeries')) || getDefaultProductSeries();
        productSeries.splice(index, 1);
        localStorage.setItem('productSeries', JSON.stringify(productSeries));
        loadProductSeries();
    }
}

// Gallery Management
function loadGallery() {
    const grid = document.getElementById('galleryGrid');
    const gallery = JSON.parse(localStorage.getItem('gallery')) || getDefaultGallery();
    
    grid.innerHTML = '';
    
    gallery.forEach((item, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'content-item';
        // Display content based on current language
        const displayTitle = currentLanguage === 'zh' ? (item.titleZh || item.title) : item.title;
        const displayDescription = currentLanguage === 'zh' ? (item.descriptionZh || item.description) : item.description;
        
        galleryItem.innerHTML = `
            <img src="${item.image}" alt="${displayTitle}">
            <h4>${displayTitle}</h4>
            <p>${displayDescription}</p>
            <div class="item-controls">
                <button class="btn btn-edit" data-index="${index}">${currentLanguage === 'zh' ? '编辑' : 'Edit'}</button>
                <button class="btn btn-delete" data-index="${index}">${currentLanguage === 'zh' ? '删除' : 'Delete'}</button>
            </div>
        `;
        
        // Add event listeners to the buttons
        const editBtn = galleryItem.querySelector('.btn-edit');
        const deleteBtn = galleryItem.querySelector('.btn-delete');
        
        editBtn.addEventListener('click', function() {
            editGalleryItem(index);
        });
        
        deleteBtn.addEventListener('click', function() {
            deleteGalleryItem(index);
        });
        grid.appendChild(galleryItem);
    });
}

function getDefaultGallery() {
    return [
        {
            title: 'Elegant Living Room',
            titleZh: '优雅客厅',
            description: 'Elegant living room curtains',
            descriptionZh: '优雅的客厅窗帘',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVsZWdhbnQgTGl2aW5nIFJvb208L3RleHQ+PC9zdmc+'
        },
        {
            title: 'Modern Kitchen',
            titleZh: '现代厨房',
            description: 'Modern kitchen window treatments',
            descriptionZh: '现代厨房窗户装饰',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1vZGVybiBLaXRjaGVuPC90ZXh0Pjwvc3ZnPg=='
        },
        {
            title: 'Cozy Bedroom',
            titleZh: '温馨卧室',
            description: 'Cozy bedroom curtains',
            descriptionZh: '温馨的卧室窗帘',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNvenkgQmVkcm9vbTwvdGV4dD48L3N2Zz4='
        },
        {
            title: 'Formal Dining Room',
            titleZh: '正式餐厅',
            description: 'Formal dining room elegance',
            descriptionZh: '正式餐厅的优雅',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZvcm1hbCBEaW5pbmcgUm9vbTwvdGV4dD48L3N2Zz4='
        }
    ];
}

function openGalleryModal(editIndex = null) {
    const modal = document.getElementById('galleryModal');
    const title = document.getElementById('galleryModalTitle');
    const form = document.getElementById('galleryForm');
    
    if (editIndex !== null) {
        title.textContent = currentLanguage === 'zh' ? '编辑画廊项目' : 'Edit Gallery Item';
        const gallery = JSON.parse(localStorage.getItem('gallery')) || getDefaultGallery();
        const item = gallery[editIndex];
        
        // Check if elements exist before setting values
        const titleInput = document.getElementById('galleryTitle');
        const titleZhInput = document.getElementById('galleryTitleZh');
        const descInput = document.getElementById('galleryDescription');
        const descZhInput = document.getElementById('galleryDescriptionZh');
        
        if (titleInput) titleInput.value = item.title;
        if (titleZhInput) titleZhInput.value = item.titleZh || '';
        if (descInput) descInput.value = item.description;
        if (descZhInput) descZhInput.value = item.descriptionZh || '';
        
        form.dataset.editIndex = editIndex;
    } else {
        title.textContent = currentLanguage === 'zh' ? '添加新画廊项目' : 'Add New Gallery Item';
        form.reset();
        delete form.dataset.editIndex;
    }
    
    // Check and recreate missing elements if necessary
    checkAndRecreateModalElements('galleryModal');
    
    modal.style.display = 'block';
    
    // Immediately ensure all inputs are visible
    ensureModalInputsVisible('galleryModal');
    
    // Then update the language-specific visibility
    updateModalFormVisibility();
    
    // Finally, ensure the current language inputs are visible
    setTimeout(() => {
        const langInputs = modal.querySelectorAll('.lang-input');
        langInputs.forEach(input => {
            const lang = input.dataset.lang;
            if (lang === currentLanguage) {
                input.style.display = 'block';
                input.required = true;
                console.log('Final visibility check - showing:', input.id, 'for language:', lang);
            } else {
                input.style.display = 'none';
                input.required = false;
                console.log('Final visibility check - hiding:', input.id, 'for language:', lang);
            }
        });
    }, 100);
}

function closeGalleryModal() {
    document.getElementById('galleryModal').style.display = 'none';
}

function editGalleryItem(index) {
    openGalleryModal(index);
}

function deleteGalleryItem(index) {
    const message = currentLanguage === 'zh' ? '你确定要删除这个画廊项目吗？' : 'Are you sure you want to delete this gallery item?';
    if (confirm(message)) {
        const gallery = JSON.parse(localStorage.getItem('gallery')) || getDefaultGallery();
        gallery.splice(index, 1);
        localStorage.setItem('gallery', JSON.stringify(gallery));
        loadGallery();
    }
}

// Background Images Management
function loadBackgroundImages() {
    const slideshow = document.getElementById('backgroundSlideshow');
    const backgrounds = JSON.parse(localStorage.getItem('backgroundImages')) || getDefaultBackgrounds();
    
    slideshow.innerHTML = '';
    
    backgrounds.forEach((bg, index) => {
        const item = document.createElement('div');
        item.className = 'background-item';
        item.innerHTML = `
            <img src="${bg.image}" alt="Background ${index + 1}">
            <div class="item-overlay">
                <div class="item-controls">
                    <button class="btn btn-edit" onclick="editBackgroundImage(${index})">${currentLanguage === 'zh' ? '编辑' : 'Edit'}</button>
                    <button class="btn btn-delete" onclick="editBackgroundImage(${index})">${currentLanguage === 'zh' ? '删除' : 'Delete'}</button>
                </div>
            </div>
        `;
        slideshow.appendChild(item);
    });
}

function getDefaultBackgrounds() {
    return [
        {
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJhY2tncm91bmQgMSA8L3RleHQ+PC9zdmc+',
            order: 1
        },
        {
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJhY2tncm91bmQgMiA8L3RleHQ+PC9zdmc+',
            order: 2
        },
        {
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJhY2tncm91bmQgMyA8L3RleHQ+PC9zdmc+',
            order: 3
        }
    ];
}

function openBackgroundModal(editIndex = null) {
    const modal = document.getElementById('backgroundModal');
    const form = document.getElementById('backgroundForm');
    
    if (editIndex !== null) {
        const backgrounds = JSON.parse(localStorage.getItem('backgroundImages')) || getDefaultBackgrounds();
        const bg = backgrounds[editIndex];
        
        document.getElementById('backgroundOrder').value = bg.order;
        form.dataset.editIndex = editIndex;
    } else {
        form.reset();
        delete form.dataset.editIndex;
    }
    
    modal.style.display = 'block';
}

function closeBackgroundModal() {
    document.getElementById('backgroundModal').style.display = 'none';
}

function editBackgroundImage(index) {
    openBackgroundModal(index);
}

function deleteBackgroundImage(index) {
    const message = currentLanguage === 'zh' ? '你确定要删除这个背景图片吗？' : 'Are you sure you want to delete this background image?';
    if (confirm(message)) {
        const backgrounds = JSON.parse(localStorage.getItem('backgroundImages')) || getDefaultBackgrounds();
        backgrounds.splice(index, 1);
        localStorage.setItem('backgroundImages', JSON.stringify(backgrounds));
        loadBackgroundImages();
    }
}

// Recreate missing About Us elements
function recreateAboutUsElements() {
    console.log('Recreating About Us elements...');
    
    const aboutContainer = document.querySelector('.about-text-editor');
    if (!aboutContainer) {
        console.log('About Us container not found');
        return;
    }
    
    // Check if titleInputs div exists, if not, create it
    let titleInputsDiv = document.getElementById('titleInputs');
    if (!titleInputsDiv) {
        console.log('titleInputs div not found, creating it...');
        titleInputsDiv = document.createElement('div');
        titleInputsDiv.id = 'titleInputs';
        titleInputsDiv.className = 'form-group';
        
        // Try to insert it after the titleLabel
        const titleLabel = document.getElementById('titleLabel');
        if (titleLabel && titleLabel.parentNode) {
            titleLabel.parentNode.insertBefore(titleInputsDiv, titleLabel.nextSibling);
            console.log('titleInputs div inserted after titleLabel');
        } else {
            console.log('titleLabel not found, attempting to recreate entire form structure...');
            
            // Try to find the form-group container that contains the titleLabel
            const formGroups = aboutContainer.querySelectorAll('.form-group');
            let titleFormGroup = null;
            
            // Find the form-group that contains the titleLabel
            formGroups.forEach(group => {
                if (group.querySelector('#titleLabel')) {
                    titleFormGroup = group;
                }
            });
            
            if (titleFormGroup) {
                console.log('Found title form-group, inserting titleInputs div after titleLabel');
                const titleLabelInGroup = titleFormGroup.querySelector('#titleLabel');
                if (titleLabelInGroup) {
                    titleFormGroup.insertBefore(titleInputsDiv, titleLabelInGroup.nextSibling);
                } else {
                    titleFormGroup.appendChild(titleInputsDiv);
                }
            } else {
                console.log('title form-group not found, inserting titleInputs div at the beginning of aboutContainer');
                aboutContainer.insertBefore(titleInputsDiv, aboutContainer.firstChild);
            }
        }
    } else {
        console.log('titleInputs div already exists.');
    }

    // Check if aboutTitle exists, if not, create it
    let aboutTitleInput = document.getElementById('aboutTitle');
    if (!aboutTitleInput) {
        console.log('aboutTitle not found, creating it...');
        aboutTitleInput = document.createElement('input');
        aboutTitleInput.type = 'text';
        aboutTitleInput.id = 'aboutTitle';
        aboutTitleInput.placeholder = 'English title';
        aboutTitleInput.classList.add('lang-input');
        aboutTitleInput.dataset.lang = 'en';
        
        // Set the correct default value
        const aboutData = JSON.parse(localStorage.getItem('aboutContent')) || getDefaultAboutContent();
        aboutTitleInput.value = aboutData.title;
        
        titleInputsDiv.appendChild(aboutTitleInput);
        console.log('aboutTitle created with value:', aboutTitleInput.value);
    } else {
        console.log('aboutTitle already exists.');
    }

    // Check if aboutTitleZh exists, if not, create it
    let aboutTitleZhInput = document.getElementById('aboutTitleZh');
    if (!aboutTitleZhInput) {
        console.log('aboutTitleZh not found, creating it...');
        aboutTitleZhInput = document.createElement('input');
        aboutTitleZhInput.type = 'text';
        aboutTitleZhInput.id = 'aboutTitleZh';
        aboutTitleZhInput.placeholder = '中文标题';
        aboutTitleZhInput.classList.add('lang-input');
        aboutTitleZhInput.dataset.lang = 'zh';
        aboutTitleZhInput.style.display = 'none'; // Initially hidden
        
        // Set the correct default value
        const aboutData = JSON.parse(localStorage.getItem('aboutContent')) || getDefaultAboutContent();
        aboutTitleZhInput.value = aboutData.titleZh;
        
        titleInputsDiv.appendChild(aboutTitleZhInput);
        console.log('aboutTitleZh created with value:', aboutTitleZhInput.value);
    } else {
        console.log('aboutTitleZh already exists.');
    }
    
    // Check if aboutImageFile exists, if not, create it
    let aboutImageFileInput = document.getElementById('aboutImageFile');
    if (!aboutImageFileInput) {
        console.log('aboutImageFile not found, creating it...');
        
        // Find the about-image-editor container
        const imageEditorContainer = document.querySelector('.about-image-editor');
        if (imageEditorContainer) {
            // Remove any existing form-group for image to avoid duplicates
            const existingImageFormGroups = imageEditorContainer.querySelectorAll('.form-group');
            existingImageFormGroups.forEach(group => {
                if (group.querySelector('input[type="file"]') || group.querySelector('label[for="aboutImageFile"]')) {
                    group.remove();
                    console.log('Removed existing image form-group');
                }
            });
            
            // Create new form-group for image
            const imageFormGroup = document.createElement('div');
            imageFormGroup.className = 'form-group';
            
            // Insert it before the save button
            const saveButton = imageEditorContainer.querySelector('button');
            if (saveButton) {
                imageEditorContainer.insertBefore(imageFormGroup, saveButton);
            } else {
                imageEditorContainer.appendChild(imageFormGroup);
            }
            
            // Create only one label in the current language
            const imageLabel = document.createElement('label');
            imageLabel.setAttribute('for', 'aboutImageFile');
            imageLabel.textContent = currentLanguage === 'zh' ? '上传新图片' : 'Upload New Image';
            imageFormGroup.appendChild(imageLabel);
            console.log('Image label created in language:', currentLanguage);
            
            // Create the file input
            aboutImageFileInput = document.createElement('input');
            aboutImageFileInput.type = 'file';
            aboutImageFileInput.id = 'aboutImageFile';
            aboutImageFileInput.accept = 'image/*';
            imageFormGroup.appendChild(aboutImageFileInput);
            console.log('aboutImageFile created successfully');
        } else {
            console.log('about-image-editor container not found');
        }
    } else {
        console.log('aboutImageFile already exists.');
        
        // Even if it exists, check for duplicate labels and remove them
        const imageEditorContainer = document.querySelector('.about-image-editor');
        if (imageEditorContainer) {
            const allLabels = imageEditorContainer.querySelectorAll('label');
            const imageLabels = Array.from(allLabels).filter(label => 
                label.getAttribute('for') === 'aboutImageFile' || 
                label.textContent.includes('Upload New Image') ||
                label.textContent.includes('上传新图片')
            );
            
            if (imageLabels.length > 1) {
                console.log('Found duplicate image labels, removing extras...');
                // Keep only the first one, remove the rest
                for (let i = 1; i < imageLabels.length; i++) {
                    imageLabels[i].remove();
                    console.log('Removed duplicate label:', imageLabels[i].textContent);
                }
            }
        }
    }
    
    console.log('recreateAboutUsElements finished.');
}

// About Us Management
function loadAboutContent() {
    const aboutData = JSON.parse(localStorage.getItem('aboutContent')) || getDefaultAboutContent();
    
    // Check if elements exist before setting values
    const titleInput = document.getElementById('aboutTitle');
    const titleInputZh = document.getElementById('aboutTitleZh');
    const descInput = document.getElementById('aboutDescription');
    const descInputZh = document.getElementById('aboutDescriptionZh');
    const imagePreview = document.getElementById('aboutImagePreview');
    
    if (titleInput && titleInputZh && descInput && descInputZh) {
        // Always set both English and Chinese values
        titleInput.value = aboutData.title;
        titleInputZh.value = aboutData.titleZh;
        descInput.value = aboutData.description;
        descInputZh.value = aboutData.descriptionZh;
    }
    
    if (imagePreview) {
        imagePreview.src = aboutData.image;
    }
    
    // Update the visible input fields based on current language
    updateAboutFormDisplay();
}

// Update About Us form display based on current language
function updateAboutFormDisplay() {
    const titleInput = document.getElementById('aboutTitle');
    const titleInputZh = document.getElementById('aboutTitleZh');
    const descInput = document.getElementById('aboutDescription');
    const descInputZh = document.getElementById('aboutDescriptionZh');
    const imageFileInput = document.getElementById('aboutImageFile');
    
    console.log('Looking for About Us elements:');
    console.log('aboutTitle:', titleInput);
    console.log('aboutTitleZh:', titleInputZh);
    console.log('aboutDescription:', descInput);
    console.log('aboutDescriptionZh:', descInputZh);
    console.log('aboutImageFile:', imageFileInput);
    
    // Check if elements exist before proceeding
    if (!titleInput || !titleInputZh || !descInput || !descInputZh) {
        console.log('Some About Us form elements not found, completely rebuilding section...');
        rebuildAboutUsSection();
        return;
    }
    
    // Check if image file input exists
    if (!imageFileInput) {
        console.log('aboutImageFile not found, completely rebuilding section...');
        rebuildAboutUsSection();
        return;
    }
    
    console.log('All About Us elements found, updating display for language:', currentLanguage);
    
    // Force all inputs to be visible first, regardless of previous state
    titleInput.style.display = 'block';
    titleInputZh.style.display = 'block';
    descInput.style.display = 'block';
    descInputZh.style.display = 'block';
    
    // Ensure image file input is always visible
    imageFileInput.style.display = 'block';
    imageFileInput.style.visibility = 'visible';
    imageFileInput.style.opacity = '1';
    console.log('Force showed aboutImageFile');
    
    if (currentLanguage === 'zh') {
        // Show Chinese inputs and populate with Chinese content
        titleInput.style.display = 'none';
        titleInputZh.style.display = 'block';
        descInput.style.display = 'none';
        descInputZh.style.display = 'block';
        
        // Get the data
        const aboutData = JSON.parse(localStorage.getItem('aboutContent')) || getDefaultAboutContent();
        titleInputZh.value = aboutData.titleZh || aboutData.title;
        descInputZh.value = aboutData.descriptionZh || aboutData.description;
        
        // Update image upload label to Chinese
        const imageLabel = document.querySelector('label[for="aboutImageFile"]');
        if (imageLabel) {
            imageLabel.textContent = '上传新图片';
        }
        
        // Update static text elements to Chinese
        const textContentTitle = document.getElementById('textContentTitle');
        if (textContentTitle) textContentTitle.textContent = '文本内容';
        
        const titleLabel = document.getElementById('titleLabel');
        if (titleLabel) titleLabel.textContent = '标题';
        
        const descriptionLabel = document.getElementById('descriptionLabel');
        if (descriptionLabel) descriptionLabel.textContent = '描述';
        
        const saveButton = document.getElementById('saveButton');
        if (saveButton) saveButton.textContent = '保存文本更改';
        
        const rightSideImageTitle = aboutImageEditor.querySelector('h3');
        if (rightSideImageTitle) rightSideImageTitle.textContent = '右侧图片';
        
        const saveImageButton = aboutImageEditor.querySelector('button[onclick="saveAboutImage()"]');
        if (saveImageButton) saveImageButton.textContent = '保存图片';
        
        console.log('Chinese inputs displayed, title:', titleInputZh.value);
    } else {
        // Show English inputs and populate with English content
        titleInput.style.display = 'block';
        titleInputZh.style.display = 'none';
        descInput.style.display = 'block';
        descInputZh.style.display = 'none';
        
        // Get the data
        const aboutData = JSON.parse(localStorage.getItem('aboutContent')) || getDefaultAboutContent();
        titleInput.value = aboutData.title;
        descInput.value = aboutData.description;
        
        // Update image upload label to English
        const imageLabel = document.querySelector('label[for="aboutImageFile"]');
        if (imageLabel) {
            imageLabel.textContent = 'Upload New Image';
        }
        
        // Update static text elements to English
        const textContentTitle = document.getElementById('textContentTitle');
        if (textContentTitle) textContentTitle.textContent = 'Text Content';
        
        const titleLabel = document.getElementById('titleLabel');
        if (titleLabel) titleLabel.textContent = 'Title';
        
        const descriptionLabel = document.getElementById('descriptionLabel');
        if (descriptionLabel) descriptionLabel.textContent = 'Description';
        
        const saveButton = document.getElementById('saveButton');
        if (saveButton) saveButton.textContent = 'Save Text Changes';
        
        const rightSideImageTitle = aboutImageEditor.querySelector('h3');
        if (rightSideImageTitle) rightSideImageTitle.textContent = 'Right Side Image';
        
        const saveImageButton = aboutImageEditor.querySelector('button[onclick="saveAboutImage()"]');
        if (saveImageButton) saveImageButton.textContent = 'Save Image';
        
        console.log('English inputs displayed, title:', titleInput.value);
    }
}

function getDefaultAboutContent() {
    return {
        title: 'About Elegant Curtains',
        titleZh: '关于优雅窗帘',
        description: 'We are a family-owned business with over 20 years of experience in creating beautiful window treatments. Our commitment to quality and customer satisfaction has made us the trusted choice for homeowners throughout the region.',
        descriptionZh: '我们是一家家族企业，拥有超过20年制作精美窗帘的经验。我们对质量和客户满意度的承诺使我们成为整个地区房主的值得信赖的选择。',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFib3V0IFVzPC90ZXh0Pjwvc3ZnPg=='
    };
}

function saveAboutText() {
    const aboutData = JSON.parse(localStorage.getItem('aboutContent')) || getDefaultAboutContent();
    
    // Check if elements exist before reading values
    const titleInput = document.getElementById('aboutTitle');
    const titleInputZh = document.getElementById('aboutTitleZh');
    const descInput = document.getElementById('aboutDescription');
    const descInputZh = document.getElementById('aboutDescriptionZh');
    
    if (titleInput && titleInputZh && descInput && descInputZh) {
        // Save both English and Chinese content
        aboutData.title = titleInput.value;
        aboutData.titleZh = titleInputZh.value;
        aboutData.description = descInput.value;
        aboutData.descriptionZh = descInputZh.value;
        
        localStorage.setItem('aboutContent', JSON.stringify(aboutData));
        
        const message = currentLanguage === 'zh' ? '关于我们文本内容保存成功！' : 'About Us text content saved successfully!';
        alert(message);
    } else {
        console.log('About Us form elements not found, cannot save');
    }
}

function saveAboutImage() {
    const fileInput = document.getElementById('aboutImageFile');
    
    if (!fileInput) {
        console.log('About Us image file input not found, retrying...');
        // Retry after a short delay
        setTimeout(saveAboutImage, 100);
        return;
    }
    
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select an image file.');
        return;
    }
    
    console.log('About Us image file found, processing...');
    
    // In a real application, you would upload the file to a server
    // For now, we'll simulate by creating a local URL
    const reader = new FileReader();
    reader.onload = function(e) {
        const aboutData = JSON.parse(localStorage.getItem('aboutContent')) || getDefaultAboutContent();
        aboutData.image = e.target.result;
        
        localStorage.setItem('aboutContent', JSON.stringify(aboutData));
        
        const imagePreview = document.getElementById('aboutImagePreview');
        if (imagePreview) {
            imagePreview.src = e.target.result;
            console.log('About Us image preview updated');
        }
        alert('About Us image saved successfully!');
    };
    reader.readAsDataURL(file);
}

// Form submission handlers
document.getElementById('productSeriesForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const productSeries = JSON.parse(localStorage.getItem('productSeries')) || getDefaultProductSeries();
    
    // Get image from file input or use default
    const imageFile = document.getElementById('productSeriesImage');
    let imageData = '';
    
    if (imageFile.files && imageFile.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageData = e.target.result;
            saveProductSeries();
        };
        reader.readAsDataURL(imageFile.files[0]);
    } else {
        // Use default image if no file selected
        imageData = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5ldyBQcm9kdWN0PC90ZXh0Pjwvc3ZnPg==';
        saveProductSeries();
    }
    
    function saveProductSeries() {
        const newSeries = {
            name: document.getElementById('productSeriesName').value,
            nameZh: document.getElementById('productSeriesNameZh').value,
            description: document.getElementById('productSeriesDescription').value,
            descriptionZh: document.getElementById('productSeriesDescriptionZh').value,
            category: document.getElementById('productSeriesCategory').value,
            image: imageData
        };
        
        if (e.target.dataset.editIndex !== undefined) {
            // Edit existing
            const index = parseInt(e.target.dataset.editIndex);
            productSeries[index] = newSeries;
        } else {
            // Add new
            productSeries.push(newSeries);
        }
        
        localStorage.setItem('productSeries', JSON.stringify(productSeries));
        loadProductSeries();
        closeProductSeriesModal();
        
        alert('Product series saved successfully!');
    }
});

document.getElementById('galleryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const gallery = JSON.parse(localStorage.getItem('gallery')) || getDefaultGallery();
    
    // Get image from file input or use default
    const imageFile = document.getElementById('galleryImage');
    let imageData = '';
    
    if (imageFile.files && imageFile.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageData = e.target.result;
            saveGalleryItem();
        };
        reader.readAsDataURL(imageFile.files[0]);
    } else {
        // Use default image if no file selected
        imageData = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5ldyBHYWxsZXJ5PC90ZXh0Pjwvc3ZnPg==';
        saveGalleryItem();
    }
    
    function saveGalleryItem() {
        const newItem = {
            title: document.getElementById('galleryTitle').value,
            titleZh: document.getElementById('galleryTitleZh').value,
            description: document.getElementById('galleryDescription').value,
            descriptionZh: document.getElementById('galleryDescriptionZh').value,
            image: imageData
        };
        
        if (e.target.dataset.editIndex !== undefined) {
            // Edit existing
            const index = parseInt(e.target.dataset.editIndex);
            gallery[index] = newItem;
        } else {
            // Add new
            gallery.push(newItem);
        }
        
        localStorage.setItem('gallery', JSON.stringify(gallery));
        loadGallery();
        closeGalleryModal();
        
        alert('Gallery item saved successfully!');
    }
});

document.getElementById('backgroundForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const backgrounds = JSON.parse(localStorage.getItem('backgroundImages')) || getDefaultBackgrounds();
    
    // Get image from file input or use default
    const imageFile = document.getElementById('backgroundImage');
    let imageData = '';
    
    if (imageFile.files && imageFile.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageData = e.target.result;
            saveBackgroundImage();
        };
        reader.readAsDataURL(imageFile.files[0]);
    } else {
        // Use default image if no file selected
        imageData = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5ldyBCYWNrZ3JvdW5kPC90ZXh0Pjwvc3ZnPg==';
        saveBackgroundImage();
    }
    
    function saveBackgroundImage() {
        const newBackground = {
            image: imageData,
            order: parseInt(document.getElementById('backgroundOrder').value)
        };
        
        if (e.target.dataset.editIndex !== undefined) {
            // Edit existing
            const index = parseInt(e.target.dataset.editIndex);
            backgrounds[index] = newBackground;
        } else {
            // Add new
            backgrounds.push(newBackground);
        }
        
        localStorage.setItem('backgroundImages', JSON.stringify(backgrounds));
        loadBackgroundImages();
        closeBackgroundModal();
        
        alert('Background image saved successfully!');
    }
});

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
};

// Reset About Us content to default values
function resetAboutUsContent() {
    console.log('Resetting About Us content to default values...');
    const defaultContent = getDefaultAboutContent();
    localStorage.setItem('aboutContent', JSON.stringify(defaultContent));
    console.log('About Us content reset to:', defaultContent);
    
    // Reload the content
    loadAboutContent();
}

// Force show all form elements in a modal
function forceShowModalElements(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.log('Modal not found:', modalId);
        return;
    }
    
    console.log('Force showing all elements in modal:', modalId);
    
    // Force show all form elements
    const allFormElements = modal.querySelectorAll('input, select, textarea, label, .form-group');
    allFormElements.forEach(element => {
        element.style.display = 'block';
        element.style.visibility = 'visible';
        element.style.opacity = '1';
        element.style.height = 'auto';
        element.style.width = 'auto';
        console.log('Force showed element:', element.id || element.className, element.type || element.tagName);
    });
    
    // Also check for any hidden containers
    const hiddenContainers = modal.querySelectorAll('[style*="display: none"], [style*="visibility: hidden"]');
    hiddenContainers.forEach(container => {
        container.style.display = 'block';
        container.style.visibility = 'visible';
        console.log('Force showed hidden container:', container.id || container.className);
    });
    
    // Ensure all input containers are visible
    const inputContainers = modal.querySelectorAll('[id*="Inputs"]');
    inputContainers.forEach(container => {
        container.style.display = 'block';
        container.style.visibility = 'visible';
        console.log('Force showed input container:', container.id);
    });
    
    // Specifically ensure all input fields are visible
    const modalInputs = modal.querySelectorAll('input[type="text"], input[type="file"], textarea, select');
    modalInputs.forEach(input => {
        input.style.display = 'block';
        input.style.visibility = 'visible';
        input.style.opacity = '1';
        console.log('Force showed input field:', input.id, input.type);
    });
    
    // Remove any inline styles that might be hiding elements
    const elementsWithInlineStyles = modal.querySelectorAll('[style]');
    elementsWithInlineStyles.forEach(element => {
        if (element.style.display === 'none') {
            element.style.display = 'block';
            console.log('Removed display:none from:', element.id || element.className);
        }
        if (element.style.visibility === 'hidden') {
            element.style.visibility = 'visible';
            console.log('Removed visibility:hidden from:', element.id || element.className);
        }
    });
    
    // Specifically handle language input containers
    const langInputContainers = modal.querySelectorAll('[id*="Inputs"]');
    langInputContainers.forEach(container => {
        container.style.display = 'block';
        container.style.visibility = 'visible';
        container.style.opacity = '1';
        console.log('Force showed language input container:', container.id);
        
        // Also ensure all child inputs in these containers are visible
        const childInputs = container.querySelectorAll('input, textarea');
        childInputs.forEach(child => {
            child.style.display = 'block';
            child.style.visibility = 'visible';
            child.style.opacity = '1';
            console.log('Force showed child input in container:', container.id, 'input:', child.id);
        });
    });
}

// Function to ensure all modal inputs are visible
function ensureModalInputsVisible(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.log('Modal not found for input visibility:', modalId);
        return;
    }
    
    console.log('Ensuring all inputs are visible in modal:', modalId);
    
    // Force show all input containers
    const inputContainers = modal.querySelectorAll('[id*="Inputs"]');
    inputContainers.forEach(container => {
        container.style.display = 'block';
        container.style.visibility = 'visible';
        container.style.opacity = '1';
        console.log('Force showed input container:', container.id);
        
        // Also ensure all child inputs are visible
        const childInputs = container.querySelectorAll('input, textarea');
        childInputs.forEach(child => {
            child.style.display = 'block';
            child.style.visibility = 'visible';
            child.style.opacity = '1';
            console.log('Force showed child input:', child.id, 'in container:', container.id);
        });
    });
    
    // Force show all individual inputs
    const allInputs = modal.querySelectorAll('input, textarea, select');
    allInputs.forEach(input => {
        input.style.display = 'block';
        input.style.visibility = 'visible';
        input.style.opacity = '1';
        console.log('Force showed input:', input.id, input.type);
    });
    
    // Remove any inline styles that might be hiding elements
    const elementsWithStyles = modal.querySelectorAll('[style]');
    elementsWithStyles.forEach(element => {
        if (element.style.display === 'none') {
            element.style.display = 'block';
            console.log('Removed display:none from:', element.id || element.className);
        }
        if (element.style.visibility === 'hidden') {
            element.style.visibility = 'visible';
            console.log('Removed visibility:hidden from:', element.id || element.className);
        }
    });
}

// Function to check and recreate missing modal elements
function checkAndRecreateModalElements(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.log('Modal not found for element check:', modalId);
        return;
    }
    
    console.log('Checking modal elements for:', modalId);
    
    if (modalId === 'productSeriesModal') {
        // Check for product series specific elements
        const nameInput = document.getElementById('productSeriesName');
        const nameZhInput = document.getElementById('productSeriesNameZh');
        const descInput = document.getElementById('productSeriesDescription');
        const descZhInput = document.getElementById('productSeriesDescriptionZh');
        
        console.log('Product series elements check:');
        console.log('productSeriesName:', nameInput);
        console.log('productSeriesNameZh:', nameZhInput);
        console.log('productSeriesDescription:', descInput);
        console.log('productSeriesDescriptionZh:', descZhInput);
        
        // If any are missing, recreate the entire form structure
        if (!nameInput || !nameZhInput || !descInput || !descZhInput) {
            console.log('Some product series elements are missing, recreating form...');
            recreateProductSeriesForm();
        }
    } else if (modalId === 'galleryModal') {
        // Check for gallery specific elements
        const titleInput = document.getElementById('galleryTitle');
        const titleZhInput = document.getElementById('galleryTitleZh');
        const descInput = document.getElementById('galleryDescription');
        const descZhInput = document.getElementById('galleryDescriptionZh');
        
        console.log('Gallery elements check:');
        console.log('galleryTitle:', titleInput);
        console.log('galleryTitleZh:', titleZhInput);
        console.log('galleryDescription:', descInput);
        console.log('galleryDescriptionZh:', descZhInput);
        
        // If any are missing, recreate the entire form structure
        if (!titleInput || !titleZhInput || !descInput || !descZhInput) {
            console.log('Some gallery elements are missing, recreating form...');
            recreateGalleryForm();
        }
    }
}

// Function to recreate product series form
function recreateProductSeriesForm() {
    console.log('Recreating product series form...');
    
    const form = document.getElementById('productSeriesForm');
    if (!form) {
        console.log('Product series form not found');
        return;
    }
    
    // Clear existing form content completely
    form.innerHTML = '';
    
    // Wait a moment for DOM to clear, then rebuild
    setTimeout(() => {
        // Recreate the form structure with current language
        form.innerHTML = `
            <div class="form-group">
                <label id="seriesNameLabel">${currentLanguage === 'zh' ? '系列名称' : 'Series Name'}</label>
                <div id="seriesNameInputs">
                    <input type="text" id="productSeriesName" placeholder="${currentLanguage === 'zh' ? '英文名称' : 'English name'}" required class="lang-input" data-lang="en">
                    <input type="text" id="productSeriesNameZh" placeholder="${currentLanguage === 'zh' ? '中文名称' : 'Chinese name'}" required class="lang-input" data-lang="zh" style="display: none;">
                </div>
            </div>
            <div class="form-group">
                <label id="seriesDescriptionLabel">${currentLanguage === 'zh' ? '描述' : 'Description'}</label>
                <div id="seriesDescriptionInputs">
                    <textarea id="productSeriesDescription" placeholder="${currentLanguage === 'zh' ? '英文描述' : 'English description'}" required class="lang-input" data-lang="en"></textarea>
                    <textarea id="productSeriesDescriptionZh" placeholder="${currentLanguage === 'zh' ? '中文描述' : 'Chinese description'}" required class="lang-input" data-lang="zh" style="display: none;"></textarea>
                </div>
            </div>
            <div class="form-group">
                <label for="productSeriesImage">${currentLanguage === 'zh' ? '图片' : 'Image'}</label>
                <div class="custom-file-upload">
                    <input type="file" id="productSeriesImage" accept="image/*" required style="display: none;">
                    <button type="button" class="btn btn-upload" onclick="document.getElementById('productSeriesImage').click()">
                        ${currentLanguage === 'zh' ? '选择文件' : 'Choose File'}
                    </button>
                    <span class="file-name" id="productSeriesImageName">
                        ${currentLanguage === 'zh' ? '未选择任何文件' : 'No file chosen'}
                    </span>
                </div>
            </div>
            <div class="form-group">
                <label for="productSeriesCategory">${currentLanguage === 'zh' ? '分类' : 'Category'}</label>
                <select id="productSeriesCategory" required>
                    <option value="blackout">${currentLanguage === 'zh' ? '遮光窗帘' : 'Blackout Curtains'}</option>
                    <option value="roller">${currentLanguage === 'zh' ? '卷帘' : 'Roller Blinds'}</option>
                    <option value="sheer">${currentLanguage === 'zh' ? '优雅薄纱' : 'Sheer Elegance'}</option>
                    <option value="roman">${currentLanguage === 'zh' ? '罗马帘' : 'Roman Shades'}</option>
                    <option value="drapery">${currentLanguage === 'zh' ? '优雅窗帘' : 'Elegant Drapery'}</option>
                    <option value="layered">${currentLanguage === 'zh' ? '分层装饰' : 'Layered Treatments'}</option>
                    <option value="moisture">${currentLanguage === 'zh' ? '防潮面料' : 'Moisture Resistant'}</option>
                    <option value="valances">${currentLanguage === 'zh' ? '经典帷幔' : 'Classic Valances'}</option>
                </select>
            </div>
            <button type="submit" class="btn btn-save">${currentLanguage === 'zh' ? '保存产品系列' : 'Save Product Series'}</button>
            <button type="button" class="btn btn-cancel" onclick="closeProductSeriesModal()">${currentLanguage === 'zh' ? '取消' : 'Cancel'}</button>
        `;
        
        // Add event listener for file selection after a brief delay
        setTimeout(() => {
            const fileInput = form.querySelector('#productSeriesImage');
            if (fileInput) {
                fileInput.addEventListener('change', function() {
                    const fileName = this.files[0] ? this.files[0].name : '';
                    const fileNameDisplay = form.querySelector('#productSeriesImageName');
                    if (fileNameDisplay) {
                        fileNameDisplay.textContent = fileName || (currentLanguage === 'zh' ? '未选择任何文件' : 'No file chosen');
                    }
                });
            }
        }, 50);
        
    }, 10);
    
    console.log('Product series form recreated');
}

// Function to recreate gallery form
function recreateGalleryForm() {
    console.log('Recreating gallery form...');
    
    const form = document.getElementById('galleryForm');
    if (!form) {
        console.log('Gallery form not found');
        return;
    }
    
    // Clear existing form content completely
    form.innerHTML = '';
    
    // Wait a moment for DOM to clear, then rebuild
    setTimeout(() => {
        // Recreate the form structure with current language
        form.innerHTML = `
            <div class="form-group">
                <label id="galleryTitleLabel">${currentLanguage === 'zh' ? '标题' : 'Title'}</label>
                <div id="galleryTitleInputs">
                    <input type="text" id="galleryTitle" placeholder="${currentLanguage === 'zh' ? '英文标题' : 'English title'}" required class="lang-input" data-lang="en">
                    <input type="text" id="galleryTitleZh" placeholder="${currentLanguage === 'zh' ? '中文标题' : 'Chinese title'}" required class="lang-input" data-lang="zh" style="display: none;">
                </div>
            </div>
            <div class="form-group">
                <label id="galleryDescriptionLabel">${currentLanguage === 'zh' ? '描述' : 'Description'}</label>
                <div id="galleryDescriptionInputs">
                    <textarea id="galleryDescription" placeholder="${currentLanguage === 'zh' ? '英文描述' : 'English description'}" required class="lang-input" data-lang="en"></textarea>
                    <textarea id="galleryDescriptionZh" placeholder="${currentLanguage === 'zh' ? '中文描述' : 'Chinese description'}" required class="lang-input" data-lang="zh" style="display: none;"></textarea>
                </div>
            </div>
            <div class="form-group">
                <label for="galleryImage">${currentLanguage === 'zh' ? '图片' : 'Image'}</label>
                <div class="custom-file-upload">
                    <input type="file" id="galleryImage" accept="image/*" required style="display: none;">
                    <button type="button" class="btn btn-upload" onclick="document.getElementById('galleryImage').click()">
                        ${currentLanguage === 'zh' ? '选择文件' : 'Choose File'}
                    </button>
                    <span class="file-name" id="galleryImageName">
                        ${currentLanguage === 'zh' ? '未选择任何文件' : 'No file chosen'}
                    </span>
                </div>
            </div>
            <button type="submit" class="btn btn-save">${currentLanguage === 'zh' ? '保存画廊项目' : 'Save Gallery Item'}</button>
            <button type="button" class="btn btn-cancel" onclick="closeGalleryModal()">${currentLanguage === 'zh' ? '取消' : 'Cancel'}</button>
        `;
        
        // Add event listener for file selection after a brief delay
        setTimeout(() => {
            const fileInput = form.querySelector('#galleryImage');
            if (fileInput) {
                fileInput.addEventListener('change', function() {
                    const fileName = this.files[0] ? this.files[0].name : '';
                    const fileNameDisplay = form.querySelector('#galleryImageName');
                    if (fileNameDisplay) {
                        fileNameDisplay.textContent = fileName || (currentLanguage === 'zh' ? '未选择任何文件' : 'No file chosen');
                    }
                });
            }
        }, 50);
        
    }, 10);
    
    console.log('Gallery form recreated');
}

// Function to completely rebuild the About Us section
function rebuildAboutUsSection() {
    console.log('Completely rebuilding About Us section...');
    
    const aboutTextEditor = document.querySelector('.about-text-editor');
    const aboutImageEditor = document.querySelector('.about-image-editor');
    
    if (!aboutTextEditor || !aboutImageEditor) {
        console.log('About Us containers not found');
        return;
    }
    
    // Clear existing content completely
    aboutTextEditor.innerHTML = '';
    aboutImageEditor.innerHTML = '';
    
    // Wait a moment for DOM to clear, then rebuild
    setTimeout(() => {
        // Rebuild text editor
        aboutTextEditor.innerHTML = `
            <h3 id="textContentTitle">${currentLanguage === 'zh' ? '文本内容' : 'Text Content'}</h3>
            <div class="form-group">
                <label id="titleLabel">${currentLanguage === 'zh' ? '标题' : 'Title'}</label>
                <div id="titleInputs">
                    <input type="text" id="aboutTitle" placeholder="${currentLanguage === 'zh' ? '英文标题' : 'English title'}" class="lang-input" data-lang="en">
                    <input type="text" id="aboutTitleZh" placeholder="${currentLanguage === 'zh' ? '中文标题' : 'Chinese title'}" class="lang-input" data-lang="zh" style="display: none;">
                </div>
            </div>
            <div class="form-group">
                <label id="descriptionLabel">${currentLanguage === 'zh' ? '描述' : 'Description'}</label>
                <div id="descriptionInputs">
                    <textarea id="aboutDescription" placeholder="${currentLanguage === 'zh' ? '英文描述' : 'English description'}" class="lang-input" data-lang="en"></textarea>
                    <textarea id="aboutDescriptionZh" placeholder="${currentLanguage === 'zh' ? '中文描述' : 'Chinese description'}" class="lang-input" data-lang="zh" style="display: none;"></textarea>
                </div>
            </div>
            <button class="btn btn-save" id="saveButton" onclick="saveAboutText()">${currentLanguage === 'zh' ? '保存文本更改' : 'Save Text Changes'}</button>
        `;
        
        // Rebuild image editor with custom file upload
        aboutImageEditor.innerHTML = `
            <h3>${currentLanguage === 'zh' ? '右侧图片' : 'Right Side Image'}</h3>
            <img id="aboutImagePreview" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIjk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFib3V0IFVzPC90ZXh0Pjwvc3ZnPg==" alt="About Us" class="about-image-preview">
            <div class="form-group">
                <label for="aboutImageFile">${currentLanguage === 'zh' ? '上传新图片' : 'Upload New Image'}</label>
                <div class="custom-file-upload">
                    <input type="file" id="aboutImageFile" accept="image/*" style="display: none;">
                    <button type="button" class="btn btn-upload" onclick="document.getElementById('aboutImageFile').click()">
                        ${currentLanguage === 'zh' ? '选择文件' : 'Choose File'}
                    </button>
                    <span class="file-name" id="aboutImageFileName">
                        ${currentLanguage === 'zh' ? '未选择任何文件' : 'No file chosen'}
                    </span>
                </div>
            </div>
            <button class="btn btn-save" onclick="saveAboutImage()">${currentLanguage === 'zh' ? '保存图片' : 'Save Image'}</button>
        `;
        
        // Add event listener for file selection after a brief delay
        setTimeout(() => {
            const fileInput = aboutImageEditor.querySelector('#aboutImageFile');
            if (fileInput) {
                fileInput.addEventListener('change', function() {
                    const fileName = this.files[0] ? this.files[0].name : '';
                    const fileNameDisplay = aboutImageEditor.querySelector('#aboutImageFileName');
                    if (fileNameDisplay) {
                        fileNameDisplay.textContent = fileName || (currentLanguage === 'zh' ? '未选择任何文件' : 'No file chosen');
                    }
                });
            }
            
            // Load the content into the newly created elements
            loadAboutContent();
        }, 50);
        
    }, 10);
    
    console.log('About Us section completely rebuilt');
}
