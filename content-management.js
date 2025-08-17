// Content Management System JavaScript

// 防抖函数，用于优化频繁的重新加载
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 防抖版本的加载函数
const debouncedLoadGallery = debounce(loadGallery, 300);
const debouncedLoadBackgroundImages = debounce(loadBackgroundImages, 300);
const debouncedLoadProductSeries = debounce(loadProductSeries, 300);

// Global variables
let currentLanguage = 'en';
let currentUser = null;

// Initialize content management system
document.addEventListener('DOMContentLoaded', function() {
    console.log('Content Management System initializing...');
    
    // Initialize language switcher
    initializeLanguageSwitcher();
    
    // Wait for the page to be completely ready before attempting to load content
    function waitForPageReady() {
        // Check if the page is fully loaded and rendered
        if (document.readyState === 'complete') {
            console.log('Page is completely loaded, starting content initialization...');
            startContentInitialization();
        } else {
            console.log('Page not fully loaded yet, waiting...');
            setTimeout(waitForPageReady, 100);
        }
    }
    
    function startContentInitialization() {
        // Use a more reliable method to wait for DOM to be fully ready
        function waitForElements(maxRetries = 3) {
            const requiredElements = [
                'productSeriesGrid',
                'galleryGrid', 
                'backgroundSlideshow'
            ];
            
            let missingElements = [];
            requiredElements.forEach(id => {
                const element = document.getElementById(id);
                if (!element) {
                    missingElements.push(id);
                    console.error(`Required element not found: ${id}`);
                } else {
                    console.log(`Found element: ${id}`);
                }
            });
            
            if (missingElements.length === 0) {
                console.log('All required elements found, loading content...');
                loadContent();
                
                // Ensure About Us elements exist (single attempt)
                setTimeout(() => {
                    ensureAboutUsElementsExist();
                }, 100);
                
                // Ensure add buttons are visible
                setTimeout(() => {
                    ensureAddButtonsVisible();
                }, 200);
            } else {
                console.error('Missing required elements:', missingElements);
                
                // Check if we've exceeded max retries
                if (maxRetries <= 0) {
                    console.error('Max retries exceeded. Attempting to recreate elements...');
                    if (attemptElementRecreation()) {
                        console.log('Elements recreated successfully, now loading content...');
                        setTimeout(() => {
                            loadContent();
                            setTimeout(() => {
                                ensureAboutUsElementsExist();
                            }, 100);
                        }, 200);
                    } else {
                        console.error('Failed to recreate elements, attempting to load content anyway...');
                        loadContent();
                    }
                    return;
                }
                
                console.log(`Retrying in 500ms... (${maxRetries} retries left)`);
                
                // Retry with longer delay and decrement counter
                setTimeout(() => waitForElements(maxRetries - 1), 500);
            }
        }
        
        // Start waiting for elements with longer initial delay
        setTimeout(waitForElements, 300);
    }
    
    // Start waiting for page to be ready with longer initial delay
    setTimeout(waitForPageReady, 200);
});

// Backup initialization using window.onload
window.addEventListener('load', function() {
    console.log('Window load event fired - checking if content was loaded...');
    
    // Check if content was already loaded
    const productSeriesGrid = document.getElementById('productSeriesGrid');
    const galleryGrid = document.getElementById('galleryGrid');
    const backgroundSlideshow = document.getElementById('backgroundSlideshow');
    
    if (productSeriesGrid && productSeriesGrid.children.length === 0) {
        console.log('Content not loaded yet, attempting to load now...');
        // Ensure grids are ready first
        if (ensureGridsReady()) {
            loadContent();
        } else {
            console.log('Grids not ready, attempting to recreate...');
            if (attemptElementRecreation()) {
                setTimeout(() => loadContent(), 200);
            }
        }
    } else if (galleryGrid && galleryGrid.children.length === 0) {
        console.log('Gallery content not loaded, loading now...');
        loadGallery();
    } else if (backgroundSlideshow && backgroundSlideshow.children.length === 0) {
        console.log('Background content not loaded, loading now...');
        loadBackgroundImages();
    } else {
        console.log('Content already loaded or grids have children');
        
        // Ensure add buttons are visible even if content is already loaded
        ensureAddButtonsVisible();
    }
});

// Function to attempt element recreation when elements are missing
function attemptElementRecreation() {
    console.log('Attempting to recreate missing elements...');
    
    try {
        // Try to find the main content sections using more specific selectors
        const productSection = document.querySelector('.content-section:nth-child(1)');
        const gallerySection = document.querySelector('.content-section:nth-child(2)');
        const backgroundSection = document.querySelector('.content-section:nth-child(3)');
        
        console.log('Container search results:');
        console.log('- Product section:', productSection);
        console.log('- Gallery section:', gallerySection);
        console.log('- Background section:', backgroundSection);
        
        let elementsRecreated = 0;
        
        if (productSection && !document.getElementById('productSeriesGrid')) {
            console.log('Found product section, attempting to recreate grid...');
            const newGrid = document.createElement('div');
            newGrid.id = 'productSeriesGrid';
            newGrid.className = 'content-grid';
            newGrid.innerHTML = '<!-- Product series items will be loaded here -->';
            
            // Find the content-section-body within the product section
            const productBody = productSection.querySelector('.content-section-body');
            if (productBody) {
                // Remove any existing grid first
                const existingGrid = productBody.querySelector('#productSeriesGrid');
                if (existingGrid) {
                    existingGrid.remove();
                }
                productBody.appendChild(newGrid);
                console.log('Recreated productSeriesGrid');
                elementsRecreated++;
            } else {
                console.error('Could not find product section body');
            }
        }
        
        if (gallerySection && !document.getElementById('galleryGrid')) {
            console.log('Found gallery section, attempting to recreate grid...');
            const newGrid = document.createElement('div');
            newGrid.id = 'galleryGrid';
            newGrid.className = 'content-grid';
            newGrid.innerHTML = '<!-- Gallery items will be loaded here -->';
            
            // Find the content-section-body within the gallery section
            const galleryBody = gallerySection.querySelector('.content-section-body');
            if (galleryBody) {
                // Remove any existing grid first
                const existingGrid = galleryBody.querySelector('#galleryGrid');
                if (existingGrid) {
                    existingGrid.remove();
                }
                galleryBody.appendChild(newGrid);
                console.log('Recreated galleryGrid');
                elementsRecreated++;
            } else {
                console.error('Could not find gallery section body');
            }
        }
        
        if (backgroundSection && !document.getElementById('backgroundSlideshow')) {
            console.log('Found background section, attempting to recreate slideshow...');
            const newSlideshow = document.createElement('div');
            newSlideshow.id = 'backgroundSlideshow';
            newSlideshow.className = 'background-slideshow';
            newSlideshow.innerHTML = '<!-- Background images will be loaded here -->';
            
            // Find the content-section-body within the background section
            const backgroundBody = backgroundSection.querySelector('.content-section-body');
            if (backgroundBody) {
                // Remove any existing slideshow first
                const existingSlideshow = backgroundBody.querySelector('#backgroundSlideshow');
                if (existingSlideshow) {
                    existingSlideshow.remove();
                }
                backgroundBody.appendChild(newSlideshow);
                console.log('Recreated backgroundSlideshow');
                elementsRecreated++;
            } else {
                console.error('Could not find background section body');
            }
        }
        
        if (elementsRecreated > 0) {
            console.log(`Successfully recreated ${elementsRecreated} elements`);
            return true;
        } else {
            console.error('Failed to recreate any elements');
            return false;
        }
        
    } catch (error) {
        console.error('Error during element recreation:', error);
        return false;
    }
}

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
        
        // Check if we're already rebuilding to avoid infinite loops
        if (window.isRebuildingAboutUs) {
            console.log('Already rebuilding About Us section, skipping...');
            return;
        }
        
        window.isRebuildingAboutUs = true;
        rebuildAboutUsSection();
        
        // Reset flag after a delay
        setTimeout(() => {
            window.isRebuildingAboutUs = false;
        }, 1000);
    } else {
        console.log('All About Us elements found successfully');
        // Load content into existing elements
        loadAboutContent();
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
    
    // Only refresh content if this is not the initial load
    if (document.readyState === 'complete') {
        refreshAllContent();
    }
    
    // Update modal form visibility if any modals are open
    updateModalFormVisibility();
}

// Force refresh all dynamic content to reflect language changes
function refreshAllContent() {
    console.log('Refreshing all content for language change...');
    
    // Refresh product series display
    const productSeriesGrid = document.getElementById('productSeriesGrid');
    if (productSeriesGrid) {
        if (typeof loadProductSeries === 'function') {
            loadProductSeries();
        } else {
            console.error('loadProductSeries function not found');
        }
    }
    
    // Refresh gallery display
    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid) {
        if (typeof loadGallery === 'function') {
            loadGallery();
        } else {
            console.error('loadGallery function not found');
        }
    }
    
    // Refresh background images display
    const backgroundSlideshow = document.getElementById('backgroundSlideshow');
    if (backgroundSlideshow) {
        if (typeof loadBackgroundImages === 'function') {
            loadBackgroundImages();
        } else {
            console.error('loadBackgroundImages function not found');
        }
    }
    
    // Refresh About Us content
    if (typeof loadAboutContent === 'function') {
        loadAboutContent();
    } else {
        console.error('loadAboutContent function not found');
    }
}

// Initialize language switcher
function initializeLanguageSwitcher() {
    // Set default language without triggering content refresh
    currentLanguage = 'en';
    console.log('Language switcher initialized with default language:', currentLanguage);
    
    // Update active button state
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === 'en') {
            btn.classList.add('active');
        }
    });
    
    // Update static text elements without refreshing content
    updatePageLanguage('en');
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
    console.log('loadContent: Starting to load all content...');
    
    try {
        // Check if all required elements exist
        const productSeriesGrid = document.getElementById('productSeriesGrid');
        const galleryGrid = document.getElementById('galleryGrid');
        const backgroundSlideshow = document.getElementById('backgroundSlideshow');
        
        console.log('Element status check:');
        console.log('- productSeriesGrid:', productSeriesGrid ? 'Found' : 'Not found');
        console.log('- galleryGrid:', galleryGrid ? 'Found' : 'Not found');
        console.log('- backgroundSlideshow:', backgroundSlideshow ? 'Found' : 'Not found');
        
        // If elements are missing, try to find their containers and recreate them
        let shouldProceed = true;
        
        if (!productSeriesGrid) {
            console.error('Product series grid element not found');
            shouldProceed = false;
        }
        
        if (!galleryGrid) {
            console.error('Gallery grid element not found');
            shouldProceed = false;
        }
        
        if (!backgroundSlideshow) {
            console.error('Background slideshow element not found');
            shouldProceed = false;
        }
        
        if (!shouldProceed) {
            console.log('Some elements are missing. Attempting to recreate them...');
            attemptElementRecreation();
            return;
        }
        
        if (shouldProceed) {
            console.log('All required elements found, proceeding with content loading...');
            
            // Load product series
            console.log('Loading product series...');
            if (typeof loadProductSeries === 'function') {
                loadProductSeries();
            } else {
                console.error('loadProductSeries function not found');
            }
            
            // Load gallery
            console.log('Loading gallery...');
            if (typeof loadGallery === 'function') {
                loadGallery();
            } else {
                console.error('loadGallery function not found');
            }
            
            // Load background images
            console.log('Loading background images...');
            if (typeof loadBackgroundImages === 'function') {
                loadBackgroundImages();
            } else {
                console.error('loadBackgroundImages function not found');
            }
            
            console.log('loadContent: All content loaded successfully');
        }
        
    } catch (error) {
        console.error('Error in loadContent:', error);
    }
    
    // 确保新增按钮可见
    setTimeout(() => {
        ensureAddButtonsVisible();
    }, 100);
}

// Product Series Management
function loadProductSeries() {
    const grid = document.getElementById('productSeriesGrid');
    
    if (!grid) {
        console.log('Product series grid element not found');
        return;
    }
    
    // 添加加载状态
    grid.classList.add('loading');
    
    try {
        const productSeries = JSON.parse(localStorage.getItem('productSeries')) || getDefaultProductSeries();
        
        // 使用DocumentFragment来批量添加元素，减少重排
        const fragment = document.createDocumentFragment();
        
        productSeries.forEach((series, index) => {
            // 安全检查：确保series存在且具有必要的属性
            if (!series || typeof series !== 'object') {
                console.warn(`Product series at index ${index} is invalid:`, series);
                return; // 跳过无效的项目
            }
            
            // 检查必要的属性是否存在
            if (!series.name || !series.description) {
                console.warn(`Product series at index ${index} is missing required properties:`, series);
                return; // 跳过缺少必要属性的项目
            }
            
            // Ensure image source is valid
            const imageSrc = series.image || getDefaultProductImage();
            
            if (!imageSrc || imageSrc === 'undefined') {
                console.warn(`Invalid image source for product series ${index + 1}, using default`);
                return; // Skip this item if no valid image source
            }
            
            const item = document.createElement('div');
            item.className = 'content-item';
            
            // Display content based on current language
            const displayName = currentLanguage === 'zh' ? (series.nameZh || series.name) : series.name;
            const displayDescription = currentLanguage === 'zh' ? (series.descriptionZh || series.description) : series.description;
            
            item.innerHTML = `
                <img src="${imageSrc}" alt="${displayName}" loading="lazy" onerror="this.src='${getDefaultProductImage()}'">
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
            
            fragment.appendChild(item);
        });
        
        // 清空网格并添加所有项目
        grid.innerHTML = '';
        grid.appendChild(fragment);
        
        console.log(`Product series loaded successfully: ${productSeries.length} items`);
        
    } catch (error) {
        console.error('Error loading product series:', error);
        // 显示错误状态
        grid.innerHTML = '<div class="content-item"><p>Error loading product series content</p></div>';
    } finally {
        // 恢复网格状态
        setTimeout(() => {
            grid.classList.remove('loading');
        }, 100);
    }
}

// Function to get default product image
function getDefaultProductImage() {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIjk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2R1Y3QgSW1hZ2U8L3RleHQ+PC9zdmc+';
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
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNsYXNzaWMgVmFsYW5jZXM8L3RleHQ+PC9zdmc+',
            category: 'valances'
        },
        {
            name: 'Smart Home Integration',
            nameZh: '智能家居集成',
            description: 'Advanced fabrics with smart home technology integration',
            descriptionZh: '集成智能家居技术的高级面料',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlNtYXJ0IEhvbWUgSW50ZWdyYXRpb248L3RleHQ+PC9zdmc+',
            category: 'smart'
        },
        {
            name: 'Eco-Friendly Materials',
            nameZh: '环保材料',
            description: 'Sustainable and environmentally friendly curtain materials',
            descriptionZh: '可持续和环保的窗帘材料',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVjby1GcmllbmRseSBNYXRlcmlhbHM8L3RleHQ+PC9zdmc+',
            category: 'eco'
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
    
    // Wait for form elements to be ready
    setTimeout(() => {
        if (editIndex !== null) {
            title.textContent = currentLanguage === 'zh' ? '编辑产品系列' : 'Edit Product Series';
            const productSeries = JSON.parse(localStorage.getItem('productSeries')) || getDefaultProductSeries();
            const series = productSeries[editIndex];
            
            if (series) {
                // Check if form elements exist before setting values
                const nameInput = document.getElementById('productSeriesName');
                const nameZhInput = document.getElementById('productSeriesNameZh');
                const descInput = document.getElementById('productSeriesDescription');
                const descZhInput = document.getElementById('productSeriesDescriptionZh');
                const categoryInput = document.getElementById('productSeriesCategory');
                
                if (nameInput && nameZhInput && descInput && descZhInput && categoryInput) {
                    nameInput.value = series.name || '';
                    nameZhInput.value = series.nameZh || '';
                    descInput.value = series.description || '';
                    descZhInput.value = series.descriptionZh || '';
                    categoryInput.value = series.category || 'blackout';
                    console.log('Product series data loaded for editing:', series);
                } else {
                    console.error('Product series form elements not found');
                    showNotification('产品系列表单元素缺失', 'error');
                    return;
                }
                
                form.dataset.editIndex = editIndex;
            } else {
                console.error('Product series not found at index:', editIndex);
                showNotification('产品系列数据无效', 'error');
                return;
            }
        } else {
            title.textContent = currentLanguage === 'zh' ? '添加新产品系列' : 'Add New Product Series';
            form.reset();
            delete form.dataset.editIndex;
        }
        
        // Ensure all inputs are visible
        ensureModalInputsVisible('productSeriesModal');
        
        // Update the language-specific visibility
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
        }, 50);
        
        // Show the modal
        modal.style.display = 'block';
        
    }, 100); // Wait for form recreation to complete
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
        try {
            const productSeries = JSON.parse(localStorage.getItem('productSeries')) || getDefaultProductSeries();
            productSeries.splice(index, 1);
            localStorage.setItem('productSeries', JSON.stringify(productSeries));
            
            // 确保网格容器存在
            const grid = document.getElementById('productSeriesGrid');
            if (!grid) {
                console.error('Product series grid not found after deletion, attempting to recreate...');
                attemptElementRecreation();
                setTimeout(() => loadProductSeries(), 200);
            } else {
                loadProductSeries();
            }
            
            console.log('Product series deleted successfully, remaining items:', productSeries.length);
        } catch (error) {
            console.error('Error deleting product series:', error);
            alert(currentLanguage === 'zh' ? '删除失败，请重试' : 'Deletion failed, please try again');
        }
    }
}

// Gallery Management
function loadGallery() {
    const grid = document.getElementById('galleryGrid');
    
    if (!grid) {
        console.log('Gallery grid element not found');
        return;
    }
    
    // 添加加载状态
    grid.classList.add('loading');
    
    try {
        const gallery = JSON.parse(localStorage.getItem('gallery')) || getDefaultGallery();
        
        // 使用DocumentFragment来批量添加元素，减少重排
        const fragment = document.createDocumentFragment();
        
        gallery.forEach((item, index) => {
            // 安全检查：确保item存在且具有必要的属性
            if (!item || typeof item !== 'object') {
                console.warn(`Gallery item at index ${index} is invalid:`, item);
                return; // 跳过无效的项目
            }
            
            // 检查必要的属性是否存在
            if (!item.title || !item.description || !item.image) {
                console.warn(`Gallery item at index ${index} is missing required properties:`, item);
                return; // 跳过缺少必要属性的项目
            }
            
            const galleryItem = document.createElement('div');
            galleryItem.className = 'content-item';
            
            // Display content based on current language
            const displayTitle = currentLanguage === 'zh' ? (item.titleZh || item.title) : item.title;
            const displayDescription = currentLanguage === 'zh' ? (item.descriptionZh || item.description) : item.description;
            
            galleryItem.innerHTML = `
                <img src="${item.image}" alt="${displayTitle}" loading="lazy">
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
            
            fragment.appendChild(galleryItem);
        });
        
        // 清空网格并添加所有项目
        grid.innerHTML = '';
        grid.appendChild(fragment);
        
        console.log(`Gallery loaded successfully: ${gallery.length} items`);
        
    } catch (error) {
        console.error('Error loading gallery:', error);
        // 显示错误状态
        grid.innerHTML = '<div class="content-item"><p>Error loading gallery content</p></div>';
    } finally {
        // 恢复网格状态
        setTimeout(() => {
            grid.classList.remove('loading');
        }, 100);
    }
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
    
    if (!modal || !title || !form) {
        console.error('Gallery modal elements not found');
        return;
    }
    
    // Check and recreate missing elements if necessary
    checkAndRecreateModalElements('galleryModal');
    
    // Wait for form elements to be ready
    setTimeout(() => {
        if (editIndex !== null) {
            title.textContent = currentLanguage === 'zh' ? '编辑画廊项目' : 'Edit Gallery Item';
            const gallery = JSON.parse(localStorage.getItem('gallery')) || getDefaultGallery();
            const item = gallery[editIndex];
            
            if (item) {
                // Check if elements exist before setting values
                const titleInput = document.getElementById('galleryTitle');
                const titleZhInput = document.getElementById('galleryTitleZh');
                const descInput = document.getElementById('galleryDescription');
                const descZhInput = document.getElementById('galleryDescriptionZh');
                
                if (titleInput) titleInput.value = item.title || '';
                if (titleZhInput) titleZhInput.value = item.titleZh || '';
                if (descInput) descInput.value = item.description || '';
                if (descZhInput) descZhInput.value = item.descriptionZh || '';
                
                form.dataset.editIndex = editIndex;
                console.log('Gallery item data loaded for editing:', item);
            } else {
                console.error('Gallery item not found at index:', editIndex);
                showNotification('画廊项目数据无效', 'error');
                return;
            }
        } else {
            title.textContent = currentLanguage === 'zh' ? '添加新画廊项目' : 'Add New Gallery Item';
            form.reset();
            delete form.dataset.editIndex;
        }
        
        // Ensure all inputs are visible
        ensureModalInputsVisible('galleryModal');
        
        // Update the language-specific visibility
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
        }, 50);
        
        // Show the modal
        modal.style.display = 'block';
        
    }, 100); // Wait for form recreation to complete
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
        try {
            const gallery = JSON.parse(localStorage.getItem('gallery')) || getDefaultGallery();
            gallery.splice(index, 1);
            localStorage.setItem('gallery', JSON.stringify(gallery));
            
            // 确保网格容器存在
            const grid = document.getElementById('galleryGrid');
            if (!grid) {
                console.error('Gallery grid not found after deletion, attempting to recreate...');
                attemptElementRecreation();
                setTimeout(() => loadGallery(), 200);
            } else {
                loadGallery();
            }
            
            console.log('Gallery item deleted successfully, remaining items:', gallery.length);
        } catch (error) {
            console.error('Error deleting gallery item:', error);
            alert(currentLanguage === 'zh' ? '删除失败，请重试' : 'Deletion failed, please try again');
        }
    }
}

// Background Images Management
function loadBackgroundImages() {
    const slideshow = document.getElementById('backgroundSlideshow');
    
    if (!slideshow) {
        console.log('Background slideshow element not found');
        return;
    }
    
    // 添加加载状态
    slideshow.classList.add('loading');
    
    try {
        const backgrounds = JSON.parse(localStorage.getItem('backgroundImages')) || getDefaultBackgrounds();
        console.log('Loading background images:', backgrounds.length, 'items');
        
        // 使用DocumentFragment来批量添加元素，减少重排
        const fragment = document.createDocumentFragment();
        
        backgrounds.forEach((bg, index) => {
            // Ensure image source is valid
            let imageSrc = bg.image || getDefaultBackgroundImage();
            
            if (!imageSrc || imageSrc === 'undefined') {
                console.warn(`Invalid image source for background ${index + 1}, using default`);
                imageSrc = getDefaultBackgroundImage();
            }
            
            const item = document.createElement('div');
            item.className = 'background-item';
            item.innerHTML = `
                <img src="${imageSrc}" alt="Background ${index + 1}" loading="lazy" onerror="this.src='${getDefaultBackgroundImage()}'">
                <div class="item-overlay">
                    <div class="item-controls">
                        <button class="btn btn-edit" onclick="editBackgroundImage(${index})">${currentLanguage === 'zh' ? '编辑' : 'Edit'}</button>
                        <button class="btn btn-delete" onclick="deleteBackgroundImage(${index})">${currentLanguage === 'zh' ? '删除' : 'Delete'}</button>
                    </div>
                </div>
            `;
            fragment.appendChild(item);
            console.log(`Loaded background ${index + 1}:`, imageSrc);
        });
        
        // 清空幻灯片并添加所有项目
        slideshow.innerHTML = '';
        slideshow.appendChild(fragment);
        
        console.log('Background images loaded successfully');
        
    } catch (error) {
        console.error('Error loading background images:', error);
        // 显示错误状态
        slideshow.innerHTML = '<div class="background-item"><p>Error loading background images</p></div>';
    } finally {
        // 恢复幻灯片状态
        setTimeout(() => {
            slideshow.classList.remove('loading');
        }, 100);
    }
}

// Function to get default background image
function getDefaultBackgroundImage() {
    // Create a simple colored rectangle SVG
    const svg = `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#34495e"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" dy=".3em">Background</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

function getDefaultBackgrounds() {
    return [
        {
            image: (() => {
                const svg = `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#3498db"/>
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" dy=".3em">Background 1</text>
                </svg>`;
                return 'data:image/svg+xml;base64,' + btoa(svg);
            })(),
            order: 1
        },
        {
            image: (() => {
                const svg = `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#e67e22"/>
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" dy=".3em">Background 2</text>
                </svg>`;
                return 'data:image/svg+xml;base64,' + btoa(svg);
            })(),
            order: 2
        },
        {
            image: (() => {
                const svg = `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#9b59b6"/>
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" dy=".3em">Background 3</text>
                </svg>`;
                return 'data:image/svg+xml;base64,' + btoa(svg);
            })(),
            order: 3
        }
    ];
}

function openBackgroundModal(editIndex = null) {
    const modal = document.getElementById('backgroundModal');
    const form = document.getElementById('backgroundForm');
    
    if (!modal || !form) {
        console.log('Background modal or form not found');
        return;
    }
    
    if (editIndex !== null) {
        const backgrounds = JSON.parse(localStorage.getItem('backgroundImages')) || getDefaultBackgrounds();
        const bg = backgrounds[editIndex];
        
        if (bg) {
            // Set form data if editing
            form.dataset.editIndex = editIndex;
            console.log('Editing background image at index:', editIndex);
        }
    } else {
        // Reset form for new background
        form.reset();
        delete form.dataset.editIndex;
        console.log('Adding new background image');
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
        try {
            const backgrounds = JSON.parse(localStorage.getItem('backgroundImages')) || getDefaultBackgrounds();
            backgrounds.splice(index, 1);
            localStorage.setItem('backgroundImages', JSON.stringify(backgrounds));
            
            // 确保容器存在
            const slideshow = document.getElementById('backgroundSlideshow');
            if (!slideshow) {
                console.error('Background slideshow not found after deletion, attempting to recreate...');
                attemptElementRecreation();
                setTimeout(() => loadBackgroundImages(), 200);
            } else {
                loadBackgroundImages();
            }
            
            console.log('Background image deleted successfully, remaining items:', backgrounds.length);
        } catch (error) {
            console.error('Error deleting background image:', error);
            alert(currentLanguage === 'zh' ? '删除失败，请重试' : 'Deletion failed, please try again');
        }
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
    try {
        console.log('Loading About Us content...');
        
        const aboutData = JSON.parse(localStorage.getItem('aboutContent')) || getDefaultAboutContent();
        
        // Update title inputs
        const titleInput = document.getElementById('aboutTitle');
        const titleInputZh = document.getElementById('aboutTitleZh');
        if (titleInput) titleInput.value = aboutData.title;
        if (titleInputZh) titleInputZh.value = aboutData.titleZh;
        
        // Update description inputs
        const descInput = document.getElementById('aboutDescription');
        const descInputZh = document.getElementById('aboutDescriptionZh');
        if (descInput) descInput.value = aboutData.description;
        if (descInputZh) descInputZh.value = aboutData.descriptionZh;
        
        // Update image preview
        const imagePreview = document.getElementById('aboutImagePreview');
        if (imagePreview) {
            const aboutImage = localStorage.getItem('aboutImage');
            if (aboutImage) {
                imagePreview.src = aboutImage;
            } else {
                imagePreview.src = aboutData.image;
            }
        }
        
        console.log('About Us content loaded successfully');
        
    } catch (error) {
        console.error('Error loading About Us content:', error);
    }
}

// Function to update About Us form display based on current language
function updateAboutFormDisplay() {
    console.log('Updating About Us form display for language:', currentLanguage);
    
    const titleInput = document.getElementById('aboutTitle');
    const titleInputZh = document.getElementById('aboutTitleZh');
    const descInput = document.getElementById('aboutDescription');
    const descInputZh = document.getElementById('aboutDescriptionZh');
    const imageFileInput = document.getElementById('aboutImageFile');
    
    // Check if elements exist
    if (!titleInput || !titleInputZh || !descInput || !descInputZh || !imageFileInput) {
        console.log('Some About Us form elements not found, completely rebuilding section...');
        rebuildAboutUsSection();
        return;
    }
    
    // Update input visibility based on current language
    if (currentLanguage === 'zh') {
        titleInput.style.display = 'none';
        titleInputZh.style.display = 'block';
        descInput.style.display = 'none';
        descInputZh.style.display = 'block';
        
        titleInput.required = false;
        titleInputZh.required = true;
        descInput.required = false;
        descInputZh.required = true;
    } else {
        titleInput.style.display = 'block';
        titleInputZh.style.display = 'none';
        descInput.style.display = 'block';
        descInputZh.style.display = 'none';
        
        titleInput.required = true;
        titleInputZh.required = false;
        descInput.required = true;
        descInputZh.required = false;
    }
    
    // Update static text elements to Chinese/English
    const textContentTitle = document.getElementById('textContentTitle');
    if (textContentTitle) {
        textContentTitle.textContent = currentLanguage === 'zh' ? '文本内容' : 'Text Content';
    }
    
    const titleLabel = document.getElementById('titleLabel');
    if (titleLabel) {
        titleLabel.textContent = currentLanguage === 'zh' ? '标题' : 'Title';
    }
    
    const descriptionLabel = document.getElementById('descriptionLabel');
    if (descriptionLabel) {
        descriptionLabel.textContent = currentLanguage === 'zh' ? '描述' : 'Description';
    }
    
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.textContent = currentLanguage === 'zh' ? '保存文本更改' : 'Save Text Changes';
    }
    
    // Update image editor section text
    const aboutImageEditor = document.querySelector('.about-image-editor');
    if (aboutImageEditor) {
        const imageTitle = aboutImageEditor.querySelector('h3');
        if (imageTitle) {
            imageTitle.textContent = currentLanguage === 'zh' ? '右侧图片' : 'Right Side Image';
        }
        
        const uploadLabel = aboutImageEditor.querySelector('label[for="aboutImageFile"]');
        if (uploadLabel) {
            uploadLabel.textContent = currentLanguage === 'zh' ? '上传新图片' : 'Upload New Image';
        }
        
        const chooseFileBtn = aboutImageEditor.querySelector('.btn-upload');
        if (chooseFileBtn) {
            chooseFileBtn.textContent = currentLanguage === 'zh' ? '选择文件' : 'Choose File';
        }
        
        const fileNameDisplay = aboutImageEditor.querySelector('#aboutImageFileName');
        if (fileNameDisplay && !fileNameDisplay.textContent.includes('.')) {
            fileNameDisplay.textContent = currentLanguage === 'zh' ? '未选择任何文件' : 'No file chosen';
        }
        
        const saveImageBtn = aboutImageEditor.querySelector('.btn-save');
        if (saveImageBtn) {
            saveImageBtn.textContent = currentLanguage === 'zh' ? '保存图片' : 'Save Image';
        }
    }
    
    console.log('About Us form display updated successfully');
}

function getDefaultAboutContent() {
    return {
        title: 'About WHL Elegant Curtains',
        titleZh: '关于WHL优雅窗帘',
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

// Function to save about us image with compression
async function saveAboutImage() {
    const fileInput = document.getElementById('aboutImageFile');
    
    if (!fileInput) {
        console.log('About Us image file input not found, retrying...');
        // Retry after a short delay
        setTimeout(saveAboutImage, 100);
        return;
    }
    
    const file = fileInput.files[0];
    
    if (!file) {
        showNotification('请选择图片文件', 'error');
        return;
    }
    
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
        showNotification(validation.error, 'error');
        return;
    }
    
    try {
        // Check storage usage before processing
        const currentUsage = getStorageUsage();
        if (currentUsage > 5 * 1024 * 1024) { // If over 5MB
            console.log('Storage usage high, performing aggressive cleanup...');
            cleanupOldData();
        }
        
        // Compress image
        const compressedDataUrl = await compressImage(file, 2000, 1400, 0.95);
        
        // Check if compressed image is still too large
        if (compressedDataUrl.length > 5000000) { // If over 5MB
            showNotification('压缩后图片文件仍过大，请选择更小的图片', 'warning');
            return;
        }
        
        // Try to save to localStorage
        try {
            localStorage.setItem('aboutImage', compressedDataUrl);
            showNotification('关于我们图片保存成功', 'success');
            
            // Update preview
            const preview = document.getElementById('aboutImagePreview');
            if (preview) {
                preview.src = compressedDataUrl;
            }
            
            // Clear file input
            fileInput.value = '';
            
            // Clear file name display
            const fileNameDisplay = document.getElementById('aboutImageFileName');
            if (fileNameDisplay) {
                fileNameDisplay.textContent = currentLanguage === 'zh' ? '未选择任何文件' : 'No file chosen';
            }
            
        } catch (storageError) {
            if (storageError.name === 'QuotaExceededError') {
                console.log('Storage quota exceeded, cleaning up and retrying...');
                cleanupOldData();
                
                // Try again
                localStorage.setItem('aboutImage', compressedDataUrl);
                showNotification('关于我们图片保存成功（已清理旧数据）', 'success');
                
                // Update preview
                const preview = document.getElementById('aboutImagePreview');
                if (preview) {
                    preview.src = compressedDataUrl;
                }
                
                // Clear file input
                fileInput.value = '';
                
                // Clear file name display
                const fileNameDisplay = document.getElementById('aboutImageFileName');
                if (fileNameDisplay) {
                    fileNameDisplay.textContent = currentLanguage === 'zh' ? '未选择任何文件' : 'No file chosen';
                }
            } else {
                throw storageError;
            }
        }
        
    } catch (error) {
        console.error('保存关于我们图片时出错:', error);
        showNotification('保存图片时出错，请重试', 'error');
    }
}

// Handle product series form submission
document.addEventListener('submit', function(e) {
    if (e.target.id === 'productSeriesForm') {
        e.preventDefault();
        console.log('Product series form submitted!');
        
        const name = document.getElementById('productSeriesName');
        const nameZh = document.getElementById('productSeriesNameZh');
        const description = document.getElementById('productSeriesDescription');
        const descriptionZh = document.getElementById('productSeriesDescriptionZh');
        const category = document.getElementById('productSeriesCategory');
        const imageFile = document.getElementById('productSeriesImage');
        
        console.log('Form elements found:', {
            name: name ? 'Found' : 'Missing',
            nameZh: nameZh ? 'Found' : 'Missing',
            description: description ? 'Found' : 'Missing',
            descriptionZh: descriptionZh ? 'Found' : 'Missing',
            category: category ? 'Found' : 'Missing',
            imageFile: imageFile ? 'Found' : 'Missing'
        });
        
        if (!name || !nameZh || !description || !descriptionZh || !category || !imageFile) {
            showNotification('表单元素缺失，请刷新页面重试', 'error');
            return;
        }
        
        const nameValue = name.value.trim();
        const nameZhValue = nameZh.value.trim();
        const descriptionValue = description.value.trim();
        const descriptionZhValue = descriptionZh.value.trim();
        const categoryValue = category.value;
        const imageFileValue = imageFile.files[0];
        
        console.log('Form values:', {
            name: nameValue,
            nameZh: nameZhValue,
            description: descriptionValue,
            descriptionZh: descriptionZhValue,
            category: categoryValue,
            imageFile: imageFileValue ? imageFileValue.name : 'No file selected'
        });
        
        // Validate all fields
        if (!nameValue || !nameZhValue || !descriptionValue || !descriptionZhValue || !categoryValue) {
            showNotification('请填写所有产品系列信息字段', 'error');
            return;
        }
        
        if (!imageFileValue) {
            showNotification('请选择产品图片', 'error');
            return;
        }
        
        // Validate image file
        const validation = validateImageFile(imageFileValue);
        if (!validation.valid) {
            showNotification(validation.error, 'error');
            return;
        }
        
        console.log('All validation passed, processing product series...');
        
        // Process image and save
        processAndSaveProductSeries(nameValue, nameZhValue, descriptionValue, descriptionZhValue, categoryValue, imageFileValue);
    }
});

// Function to process and save product series with image compression
async function processAndSaveProductSeries(name, nameZh, description, descriptionZh, category, imageFile) {
    try {
        // Check storage usage before processing
        const currentUsage = getStorageUsage();
        if (currentUsage > 5 * 1024 * 1024) { // If over 5MB, clean up aggressively
            console.log('Storage usage high, performing aggressive cleanup...');
            cleanupOldData();
        }
        
        // Compress image
        const compressedDataUrl = await compressImage(imageFile, 2000, 1400, 0.95);
        
        // Check if compressed image is still too large
        if (compressedDataUrl.length > 5000000) { // If over 5MB
            showNotification('压缩后图片文件仍过大，请选择更小的图片', 'warning');
            return;
        }
        
        // Try to save to localStorage
        try {
            const existingSeries = JSON.parse(localStorage.getItem('productSeries') || '[]');
            
            // Check if we're editing an existing item
            const editIndex = document.getElementById('productSeriesForm').dataset.editIndex;
            
            if (editIndex !== undefined) {
                // Replace existing item
                const index = parseInt(editIndex);
                existingSeries[index] = {
                    id: existingSeries[index]?.id || Date.now(),
                    name: name,
                    nameZh: nameZh,
                    description: description,
                    descriptionZh: descriptionZh,
                    category: category,
                    image: compressedDataUrl,
                    timestamp: new Date().toISOString()
                };
                showNotification('产品系列更新成功', 'success');
            } else {
                // Add new item (but limit total items to prevent storage issues)
                if (existingSeries.length >= 4) {
                    // Remove oldest item to make room for new one
                    existingSeries.shift();
                }
                
                existingSeries.push({
                    id: Date.now(),
                    name: name,
                    nameZh: nameZh,
                    description: description,
                    descriptionZh: descriptionZh,
                    category: category,
                    image: compressedDataUrl,
                    timestamp: new Date().toISOString()
                });
                showNotification('产品系列保存成功', 'success');
            }
            
            localStorage.setItem('productSeries', JSON.stringify(existingSeries));
            closeProductSeriesModal();
            loadContent(); // Refresh the display
            
        } catch (storageError) {
            if (storageError.name === 'QuotaExceededError') {
                console.log('Storage quota exceeded, cleaning up and retrying...');
                cleanupOldData();
                
                // Try again with reduced data
                const existingSeries = JSON.parse(localStorage.getItem('productSeries') || '[]');
                // Keep only the most recent 2 items
                const reducedSeries = existingSeries.slice(-2);
                
                // Add the new item
                if (editIndex !== undefined) {
                    const index = parseInt(editIndex);
                    if (index < reducedSeries.length) {
                        reducedSeries[index] = {
                            id: reducedSeries[index]?.id || Date.now(),
                            name: name,
                            nameZh: nameZh,
                            description: description,
                            descriptionZh: descriptionZh,
                            category: category,
                            image: compressedDataUrl,
                            timestamp: new Date().toISOString()
                        };
                    }
                } else {
                    reducedSeries.push({
                        id: Date.now(),
                        name: name,
                        nameZh: nameZh,
                        description: description,
                        descriptionZh: descriptionZh,
                        category: category,
                        image: compressedDataUrl,
                        timestamp: new Date().toISOString()
                    });
                }
                
                localStorage.setItem('productSeries', JSON.stringify(reducedSeries));
                
                showNotification('产品系列保存成功（已清理旧数据）', 'success');
                closeProductSeriesModal();
                loadContent();
            } else {
                throw storageError;
            }
        }
        
    } catch (error) {
        console.error('保存产品系列时出错:', error);
        showNotification('保存产品系列时出错，请重试', 'error');
    }
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

// Handle gallery form submission
document.addEventListener('submit', function(e) {
    if (e.target.id === 'galleryForm') {
        e.preventDefault();
        console.log('Gallery form submitted!');
        
        const title = document.getElementById('galleryTitle');
        const titleZh = document.getElementById('galleryTitleZh');
        const description = document.getElementById('galleryDescription');
        const descriptionZh = document.getElementById('galleryDescriptionZh');
        const imageFile = document.getElementById('galleryImage');
        
        console.log('Form elements found:', {
            title: title ? 'Found' : 'Missing',
            titleZh: titleZh ? 'Found' : 'Missing',
            description: description ? 'Found' : 'Missing',
            descriptionZh: descriptionZh ? 'Found' : 'Missing',
            imageFile: imageFile ? 'Found' : 'Missing'
        });
        
        if (!title || !titleZh || !description || !descriptionZh || !imageFile) {
            showNotification('表单元素缺失，请刷新页面重试', 'error');
            return;
        }
        
        const titleValue = title.value.trim();
        const titleZhValue = titleZh.value.trim();
        const descriptionValue = description.value.trim();
        const descriptionZhValue = descriptionZh.value.trim();
        const imageFileValue = imageFile.files[0];
        
        console.log('Form values:', {
            title: titleValue,
            titleZh: titleZhValue,
            description: descriptionValue,
            descriptionZh: descriptionZhValue,
            imageFile: imageFileValue ? imageFileValue.name : 'No file selected'
        });
        
        // Validate all fields
        if (!titleValue || !descriptionValue) {
            showNotification('请填写英文标题和描述字段', 'error');
            return;
        }
        
        // Chinese fields are optional for new items, but should be filled for better user experience
        if (!titleZhValue || !descriptionZhValue) {
            console.log('Chinese fields are empty, using English values as fallback');
            // Use English values as fallback for Chinese fields
            const finalTitleZh = titleZhValue || titleValue;
            const finalDescriptionZh = descriptionZhValue || descriptionValue;
            
            // Update the form values
            titleZh.value = finalTitleZh;
            descriptionZh.value = finalDescriptionZh;
            
            // Use the final values for processing
            const processedTitleZh = finalTitleZh;
            const processedDescriptionZh = finalDescriptionZh;
            
            // Process with the final values
            processAndSaveGalleryItem(titleValue, processedTitleZh, descriptionValue, processedDescriptionZh, imageFileValue);
            return;
        }
        
        if (!imageFileValue) {
            showNotification('请选择图片文件', 'error');
            return;
        }
        
        // Validate image file
        const validation = validateImageFile(imageFileValue);
        if (!validation.valid) {
            showNotification(validation.error, 'error');
            return;
        }
        
        console.log('All validation passed, processing gallery item...');
        
        // Process image and save
        processAndSaveGalleryItem(titleValue, titleZhValue, descriptionValue, descriptionZhValue, imageFileValue);
    }
});

// Function to process and save gallery item with image compression
async function processAndSaveGalleryItem(title, titleZh, description, descriptionZh, imageFile) {
    try {
        // Check storage usage before processing
        const currentUsage = getStorageUsage();
        if (currentUsage > 5 * 1024 * 1024) { // If over 5MB, clean up aggressively
            console.log('Storage usage high, performing aggressive cleanup...');
            cleanupOldData();
        }
        
        // Compress image
        const compressedDataUrl = await compressImage(imageFile, 2000, 1400, 0.95);
        
        // Check if compressed image is still too large
        if (compressedDataUrl.length > 5000000) { // If over 5MB
            showNotification('压缩后图片文件仍过大，请选择更小的图片', 'warning');
            return;
        }
        
        // Check if we're editing an existing item - define editIndex at function level
        const editIndex = document.getElementById('galleryForm').dataset.editIndex;
        
        // Try to save to localStorage
        try {
            const existingGallery = JSON.parse(localStorage.getItem('gallery') || '[]');
            
            if (editIndex !== undefined && editIndex !== '') {
                // Replace existing item
                const index = parseInt(editIndex);
                if (index >= 0 && index < existingGallery.length) {
                    existingGallery[index] = {
                        id: existingGallery[index]?.id || Date.now(),
                        title: title,
                        titleZh: titleZh,
                        description: description,
                        descriptionZh: descriptionZh,
                        image: compressedDataUrl,
                        timestamp: new Date().toISOString()
                    };
                    showNotification('画廊项目更新成功', 'success');
                } else {
                    showNotification('编辑索引无效，将作为新项目添加', 'warning');
                    // Add as new item instead
                    if (existingGallery.length >= 5) {
                        existingGallery.shift();
                    }
                    existingGallery.push({
                        id: Date.now(),
                        title: title,
                        titleZh: titleZh,
                        description: description,
                        descriptionZh: descriptionZh,
                        image: compressedDataUrl,
                        timestamp: new Date().toISOString()
                    });
                    showNotification('画廊项目保存成功', 'success');
                }
            } else {
                // Add new item (but limit total items to prevent storage issues)
                if (existingGallery.length >= 5) {
                    // Remove oldest item to make room for new one
                    existingGallery.shift();
                }
                
                existingGallery.push({
                    id: Date.now(),
                    title: title,
                    titleZh: titleZh,
                    description: description,
                    descriptionZh: descriptionZh,
                    image: compressedDataUrl,
                    timestamp: new Date().toISOString()
                });
                showNotification('画廊项目保存成功', 'success');
            }
            
            localStorage.setItem('gallery', JSON.stringify(existingGallery));
            closeGalleryModal();
            loadContent(); // Refresh the display
            
        } catch (storageError) {
            if (storageError.name === 'QuotaExceededError') {
                console.log('Storage quota exceeded, cleaning up and retrying...');
                cleanupOldData();
                
                // Try again with reduced data
                const existingGallery = JSON.parse(localStorage.getItem('gallery') || '[]');
                // Keep only the most recent 2 items
                const reducedGallery = existingGallery.slice(-2);
                
                // Add the new item - use the same editIndex logic
                if (editIndex !== undefined && editIndex !== '') {
                    const index = parseInt(editIndex);
                    if (index >= 0 && index < reducedGallery.length) {
                        reducedGallery[index] = {
                            id: reducedGallery[index]?.id || Date.now(),
                            title: title,
                            titleZh: titleZh,
                            description: description,
                            descriptionZh: descriptionZh,
                            image: compressedDataUrl,
                            timestamp: new Date().toISOString()
                        };
                    } else {
                        // Add as new item if index is invalid
                        reducedGallery.push({
                            id: Date.now(),
                            title: title,
                            titleZh: titleZh,
                            description: description,
                            descriptionZh: descriptionZh,
                            image: compressedDataUrl,
                            timestamp: new Date().toISOString()
                        });
                    }
                } else {
                    reducedGallery.push({
                        id: Date.now(),
                        title: title,
                        titleZh: titleZh,
                        description: description,
                        descriptionZh: descriptionZh,
                        image: compressedDataUrl,
                        timestamp: new Date().toISOString()
                    });
                }
                
                localStorage.setItem('gallery', JSON.stringify(reducedGallery));
                
                showNotification('画廊项目保存成功（已清理旧数据）', 'success');
                closeGalleryModal();
                loadContent();
            } else {
                throw storageError;
            }
        }
        
    } catch (error) {
        console.error('保存画廊项目时出错:', error);
        showNotification('保存画廊项目时出错，请重试', 'error');
    }
}

document.getElementById('backgroundForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Use the new async saveBackgroundImage function
    saveBackgroundImage();
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

// Image compression and validation functions
function compressImage(file, maxWidth = 1600, maxHeight = 1200, quality = 0.9) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Calculate new dimensions while maintaining aspect ratio
                let { width, height } = img;
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width *= ratio;
                    height *= ratio;
                }
                
                // Set canvas dimensions
                canvas.width = width;
                canvas.height = height;
                
                // Enable high-quality rendering
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                
                // Remove any filters and ensure clean rendering
                ctx.filter = 'none';
                ctx.globalCompositeOperation = 'source-over';
                
                // Draw image
                ctx.drawImage(img, 0, 0, width, height);
                
                // Try to compress with different strategies
                let dataUrl;
                let fileSize;
                
                // Strategy 1: Try PNG first (lossless, but larger)
                try {
                    dataUrl = canvas.toDataURL('image/png');
                    fileSize = Math.ceil(dataUrl.length * 0.75); // Approximate size
                    
                    // If PNG is under 2MB, use it
                    if (fileSize < 2 * 1024 * 1024) {
                        console.log(`PNG compression successful: ${fileSize} bytes (${width}x${height})`);
                        resolve(dataUrl);
                        return;
                    }
                } catch (e) {
                    console.log('PNG compression failed, trying JPEG...');
                }
                
                // Strategy 2: Try JPEG with high quality
                try {
                    dataUrl = canvas.toDataURL('image/jpeg', quality);
                    fileSize = Math.ceil(dataUrl.length * 0.75);
                    
                    if (fileSize < 2 * 1024 * 1024) {
                        console.log(`JPEG compression successful: ${fileSize} bytes (${width}x${height})`);
                        resolve(dataUrl);
                        return;
                    }
                } catch (e) {
                    console.log('JPEG compression failed, trying lower quality...');
                }
                
                // Strategy 3: Reduce size and quality progressively
                let attempts = 0;
                const maxAttempts = 3;
                
                const tryCompression = () => {
                    attempts++;
                    const scaleFactor = 1 - (attempts * 0.1); // Reduce size by 10% each attempt
                    const qualityFactor = quality - (attempts * 0.1); // Reduce quality by 10% each attempt
                    
                    const newWidth = Math.floor(width * scaleFactor);
                    const newHeight = Math.floor(height * scaleFactor);
                    
                    canvas.width = newWidth;
                    canvas.height = newHeight;
                    ctx.drawImage(img, 0, 0, newWidth, newHeight);
                    
                    try {
                        dataUrl = canvas.toDataURL('image/jpeg', Math.max(0.5, qualityFactor));
                        fileSize = Math.ceil(dataUrl.length * 0.75);
                        
                        console.log(`Compression attempt ${attempts}: ${fileSize} bytes (${newWidth}x${newHeight})`);
                        
                        if (fileSize < 2 * 1024 * 1024 || attempts >= maxAttempts) {
                            resolve(dataUrl);
                            return;
                        }
                        
                        // Try again with smaller size
                        setTimeout(tryCompression, 100);
                        
                    } catch (e) {
                        console.error('Compression attempt failed:', e);
                        if (attempts >= maxAttempts) {
                            reject(new Error('Failed to compress image after multiple attempts'));
                        } else {
                            setTimeout(tryCompression, 100);
                        }
                    }
                };
                
                tryCompression();
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function validateImageFile(file) {
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        return { valid: false, error: '图片文件过大，请选择小于10MB的图片' };
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: '不支持的图片格式，请选择JPEG、PNG、GIF或WebP格式' };
    }
    
    return { valid: true };
}

function getStorageUsage() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length;
        }
    }
    return total;
}

// Function to clean up old data to save storage space
function cleanupOldData() {
    console.log('Cleaning up old data to save storage space...');
    
    try {
        // Get current storage usage
        const currentUsage = getStorageUsage();
        console.log('Current storage usage before cleanup:', currentUsage, 'bytes');
        
        // If storage is still high after initial cleanup, perform aggressive cleanup
        if (currentUsage > 3 * 1024 * 1024) { // If over 3MB
            console.log('Storage still high, performing aggressive cleanup...');
            
            // Keep only the most recent 1-2 items from each category
            const aggressiveCleanup = () => {
                // Background images - keep only 1
                const backgrounds = JSON.parse(localStorage.getItem('backgroundImages') || '[]');
                if (backgrounds.length > 1) {
                    const latestBackground = backgrounds[backgrounds.length - 1];
                    localStorage.setItem('backgroundImages', JSON.stringify([latestBackground]));
                    console.log('Kept only 1 background image');
                }
                
                // Gallery - keep only 2
                const gallery = JSON.parse(localStorage.getItem('gallery') || '[]');
                if (gallery.length > 2) {
                    const latestGallery = gallery.slice(-2);
                    localStorage.setItem('gallery', JSON.stringify(latestGallery));
                    console.log('Kept only 2 gallery items');
                }
                
                // Product series - keep only 3
                const productSeries = JSON.parse(localStorage.getItem('productSeries') || '[]');
                if (productSeries.length > 3) {
                    const latestProductSeries = productSeries.slice(-3);
                    localStorage.setItem('productSeries', JSON.stringify(latestProductSeries));
                    console.log('Kept only 3 product series');
                }
                
                // About us image - remove if exists
                if (localStorage.getItem('aboutUsImage')) {
                    localStorage.removeItem('aboutUsImage');
                    console.log('Removed about us image to save space');
                }
                
                // About us content - keep only essential text
                const aboutContent = JSON.parse(localStorage.getItem('aboutUs') || '{}');
                if (aboutContent.image) {
                    delete aboutContent.image;
                    localStorage.setItem('aboutUs', JSON.stringify(aboutContent));
                    console.log('Removed about us image content to save space');
                }
            };
            
            aggressiveCleanup();
            
            // Check storage again
            const newUsage = getStorageUsage();
            console.log('Storage usage after aggressive cleanup:', newUsage, 'bytes');
            
            // If still too high, force reset to defaults
            if (newUsage > 2 * 1024 * 1024) { // If still over 2MB
                console.log('Storage still too high, forcing reset to defaults...');
                localStorage.clear();
                console.log('All localStorage data cleared');
            }
        }
        
        console.log('Aggressive cleanup completed');
        
    } catch (error) {
        console.error('Error during cleanup:', error);
        // If cleanup fails, force clear everything
        try {
            localStorage.clear();
            console.log('Forced localStorage clear due to cleanup error');
        } catch (clearError) {
            console.error('Failed to clear localStorage:', clearError);
        }
    }
}

// Function to save background image with compression
async function saveBackgroundImage() {
    try {
        console.log('saveBackgroundImage: Starting...');
        
        const fileInput = document.getElementById('backgroundImageFile');
        const file = fileInput.files[0];
        
        if (!file) {
            showNotification('请选择图片文件', 'error');
            return;
        }
        
        console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
        
        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
            showNotification(validation.error, 'error');
            return;
        }
        
        // Check if we're editing an existing item - declare at function level
        const editIndex = document.getElementById('backgroundForm')?.dataset.editIndex;
        console.log('Edit index:', editIndex);
        
        try {
            // Check storage usage before processing
            const currentUsage = getStorageUsage();
            console.log('Current storage usage:', currentUsage, 'bytes');
            if (currentUsage > 5 * 1024 * 1024) { // If over 5MB
                console.log('Storage usage high, performing aggressive cleanup...');
                cleanupOldData();
            }
            
            // Compress image
            console.log('Compressing image...');
            const compressedDataUrl = await compressImage(file, 2000, 1400, 0.95);
            console.log('Image compressed, size:', compressedDataUrl.length, 'bytes');
            
            // Check if compressed image is still too large
            if (compressedDataUrl.length > 5000000) { // If over 5MB
                showNotification('压缩后图片文件仍过大，请选择更小的图片', 'warning');
                return;
            }
            
            // Try to save to localStorage
            try {
                const existingBackgrounds = JSON.parse(localStorage.getItem('backgroundImages') || '[]');
                
                // Check if we're editing an existing item
                const editIndex = document.getElementById('backgroundForm')?.dataset.editIndex;
                
                if (editIndex !== undefined) {
                    // Replace existing item
                    const index = parseInt(editIndex);
                                    existingBackgrounds[index] = {
                    id: existingBackgrounds[index]?.id || Date.now(),
                    image: compressedDataUrl,
                    order: 1,
                    timestamp: new Date().toISOString()
                };
                    showNotification('背景图片更新成功', 'success');
                } else {
                    // Add new item
                    existingBackgrounds.push({
                        id: Date.now(),
                        image: compressedDataUrl,
                        order: 1,
                        timestamp: new Date().toISOString()
                    });
                    showNotification('背景图片添加成功', 'success');
                }
                
                // Try to save with cleanup if needed
                let saveSuccessful = false;
                let attempts = 0;
                const maxAttempts = 3;
                
                const trySave = () => {
                    attempts++;
                    try {
                        localStorage.setItem('backgroundImages', JSON.stringify(existingBackgrounds));
                        saveSuccessful = true;
                        console.log('Background image saved successfully on attempt', attempts);
                    } catch (storageError) {
                        if (storageError.name === 'QuotaExceededError' && attempts < maxAttempts) {
                            console.log(`Storage quota exceeded on attempt ${attempts}, cleaning up and retrying...`);
                            cleanupOldData();
                            
                            // Wait a bit before retrying
                            setTimeout(trySave, 100);
                            return;
                        } else {
                            throw storageError;
                        }
                    }
                };
                
                trySave();
                
                if (saveSuccessful) {
                    closeBackgroundModal();
                    loadContent(); // Refresh the display
                }
                
            } catch (storageError) {
                if (storageError.name === 'QuotaExceededError') {
                    console.log('Storage quota exceeded, cleaning up and retrying...');
                    cleanupOldData();
                    
                    // Try one more time with aggressive cleanup
                    try {
                        // Keep only the current image
                        const minimalBackgrounds = [{
                            id: Date.now(),
                            image: compressedDataUrl,
                            order: 1,
                            timestamp: new Date().toISOString()
                        }];
                        
                        localStorage.setItem('backgroundImages', JSON.stringify(minimalBackgrounds));
                        showNotification('背景图片已保存（已清理旧数据）', 'success');
                        closeBackgroundModal();
                        loadContent();
                        
                    } catch (finalError) {
                        console.error('Final save attempt failed:', finalError);
                        showNotification('存储空间不足，无法保存图片。请删除一些旧图片后重试。', 'error');
                    }
                } else {
                    console.error('Error during image processing:', storageError);
                    showNotification('保存背景图片时出错: ' + storageError.message, 'error');
                }
            }
            
        } catch (error) {
            console.error('Error during image processing:', error);
            showNotification('图片处理时出错，请重试', 'error');
        }
        
    } catch (error) {
        console.error('保存背景图片时出错:', error);
        showNotification('保存图片时出错，请重试', 'error');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ffc107';
            notification.style.color = '#212529';
            break;
        default:
            notification.style.backgroundColor = '#17a2b8';
    }
    
    // Add close button styles
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: inherit;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
        opacity: 0.8;
    `;
    
    closeButton.addEventListener('mouseenter', () => {
        closeButton.style.opacity = '1';
    });
    
    closeButton.addEventListener('mouseleave', () => {
        closeButton.style.opacity = '0.8';
    });
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Function to toggle upload guidelines visibility
function toggleGuidelines() {
    const guidelinesContent = document.getElementById('guidelinesContent');
    if (guidelinesContent) {
        const isVisible = guidelinesContent.style.display !== 'none';
        guidelinesContent.style.display = isVisible ? 'none' : 'block';
        
        const toggleBtn = document.querySelector('.guidelines-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = isVisible ? '显示指南' : '隐藏指南';
        }
    }
}

// Function to update background preview
function updateBackgroundPreview() {
    const backgroundSlideshow = document.getElementById('backgroundSlideshow');
    if (backgroundSlideshow) {
        debouncedLoadBackgroundImages();
    }
}

// Image sharpening function to reduce blurriness
function sharpenImage(canvas, ctx) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    // Sharpening kernel
    const kernel = [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
    ];
    
    const newData = new Uint8ClampedArray(data);
    
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            for (let c = 0; c < 3; c++) { // RGB channels only
                let sum = 0;
                let kernelIndex = 0;
                
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const pixelIndex = ((y + ky) * width + (x + kx)) * 4 + c;
                        sum += data[pixelIndex] * kernel[kernelIndex];
                        kernelIndex++;
                    }
                }
                
                const pixelIndex = (y * width + x) * 4 + c;
                newData[pixelIndex] = Math.max(0, Math.min(255, sum));
            }
        }
    }
    
    const newImageData = new ImageData(newData, width, height);
    ctx.putImageData(newImageData, 0, 0);
}

// Function to ensure grids are ready for adding new items
function ensureGridsReady() {
    console.log('Ensuring all grids are ready for adding new items...');
    
    const grids = [
        { id: 'productSeriesGrid', name: 'Product Series Grid' },
        { id: 'galleryGrid', name: 'Gallery Grid' },
        { id: 'backgroundSlideshow', name: 'Background Slideshow' }
    ];
    
    let gridsReady = true;
    
    grids.forEach(grid => {
        const element = document.getElementById(grid.id);
        if (!element) {
            console.error(`${grid.name} not found, attempting to recreate...`);
            if (attemptElementRecreation()) {
                console.log(`${grid.name} recreated successfully`);
            } else {
                console.error(`Failed to recreate ${grid.name}`);
                gridsReady = false;
            }
        } else {
            console.log(`${grid.name} is ready`);
        }
    });
    
    if (gridsReady) {
        console.log('All grids are ready for adding new items');
        return true;
    } else {
        console.error('Some grids are not ready');
        return false;
    }
}

// Function to refresh all content and ensure grids are ready
function refreshAllContentAndGrids() {
    console.log('Refreshing all content and ensuring grids are ready...');
    
    // First ensure grids exist
    if (ensureGridsReady()) {
        // Then load all content
        loadContent();
    } else {
        console.error('Failed to ensure grids are ready, attempting to load content anyway...');
        loadContent();
    }
}

// 在页面加载完成后确保所有新增按钮都可见
function ensureAddButtonsVisible() {
    console.log('确保新增按钮可见...');
    
    const addButtons = document.querySelectorAll('.btn-add');
    addButtons.forEach((btn, index) => {
        // 强制显示按钮
        btn.style.display = 'inline-block';
        btn.style.visibility = 'visible';
        btn.style.opacity = '1';
        
        // 确保按钮有正确的样式
        if (!btn.style.backgroundColor) {
            btn.style.backgroundColor = '#28a745';
        }
        if (!btn.style.color) {
            btn.style.color = 'white';
        }
        
        console.log(`按钮 ${index + 1} 已确保可见:`, btn);
    });
    
    // 检查按钮状态
    addButtons.forEach((btn, index) => {
        console.log(`按钮 ${index + 1} 状态:`, {
            display: btn.style.display,
            visibility: btn.style.visibility,
            opacity: btn.style.opacity,
            offsetWidth: btn.offsetWidth,
            offsetHeight: btn.offsetHeight,
            backgroundColor: btn.style.backgroundColor,
            color: btn.style.color
        });
    });
}
