// Content Management System JavaScript

// Global language state
let currentLanguage = 'en';

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadContent();
    initializeLanguageSwitcher();
});

// Language switching functionality
function switchLanguage(lang) {
    console.log('Switching language to:', lang); // Debug log
    currentLanguage = lang;
    
    // Update active button state
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[data-lang="${lang}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Update page content based on language
    updatePageLanguage(lang);
    
    // Reload all content to reflect language change
    loadContent();
    
    // Force refresh of all dynamic content
    refreshAllContent();
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
    
    // Refresh about content display
    loadAboutContent();
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
            '上传新图片': 'Upload New Image'
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
            'Add New Product Series': '添加新产品系列',
            'Add New Gallery Item': '添加新画廊项目',
            'Add New Background Image': '添加新背景图片',
            'Gallery Management': '画廊管理',
            'Homepage Background Images': '首页背景图片',
            'About Us Page Management': '关于我们页面管理',
            'Text Content': '文本内容',
            'Title': '标题',
            'Description': '描述',
            'Save Text Changes': '保存文本更改',
            'Right Side Image': '右侧图片',
            'Upload New Image': '上传新图片'
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
}

// Update form input visibility based on current language
function updateFormInputVisibility(lang) {
    // Hide all language inputs first
    const allLangInputs = document.querySelectorAll('.lang-input');
    allLangInputs.forEach(input => {
        input.style.display = 'none';
    });
    
    // Show only inputs for current language
    const currentLangInputs = document.querySelectorAll(`.lang-input[data-lang="${lang}"]`);
    currentLangInputs.forEach(input => {
        input.style.display = 'block';
    });
    
    // Update required attributes
    if (lang === 'zh') {
        // For Chinese, make Chinese inputs required and English inputs not required
        document.querySelectorAll('.lang-input[data-lang="zh"]').forEach(input => {
            input.required = true;
        });
        document.querySelectorAll('.lang-input[data-lang="en"]').forEach(input => {
            input.required = false;
        });
    } else {
        // For English, make English inputs required and Chinese inputs not required
        document.querySelectorAll('.lang-input[data-lang="en"]').forEach(input => {
            input.required = true;
        });
        document.querySelectorAll('.lang-input[data-lang="zh"]').forEach(input => {
            input.required = false;
        });
    }
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
                <button class="btn btn-edit" onclick="editProductSeries(${index})">${currentLanguage === 'zh' ? '编辑' : 'Edit'}</button>
                <button class="btn btn-delete" onclick="deleteProductSeries(${index})">${currentLanguage === 'zh' ? '删除' : 'Delete'}</button>
            </div>
        `;
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
    
    if (editIndex !== null) {
        title.textContent = currentLanguage === 'zh' ? '编辑产品系列' : 'Edit Product Series';
        const productSeries = JSON.parse(localStorage.getItem('productSeries')) || getDefaultProductSeries();
        const series = productSeries[editIndex];
        
        document.getElementById('productSeriesName').value = series.name;
        document.getElementById('productSeriesNameZh').value = series.nameZh || '';
        document.getElementById('productSeriesDescription').value = series.description;
        document.getElementById('productSeriesDescriptionZh').value = series.descriptionZh || '';
        document.getElementById('productSeriesCategory').value = series.category;
        
        form.dataset.editIndex = editIndex;
    } else {
        title.textContent = currentLanguage === 'zh' ? '添加新产品系列' : 'Add New Product Series';
        form.reset();
        delete form.dataset.editIndex;
    }
    
    modal.style.display = 'block';
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
                <button class="btn btn-edit" onclick="editGalleryItem(${index})">${currentLanguage === 'zh' ? '编辑' : 'Edit'}</button>
                <button class="btn btn-delete" onclick="deleteGalleryItem(${index})">${currentLanguage === 'zh' ? '删除' : 'Delete'}</button>
            </div>
        `;
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
        
        document.getElementById('galleryTitle').value = item.title;
        document.getElementById('galleryTitleZh').value = item.titleZh || '';
        document.getElementById('galleryDescription').value = item.description;
        document.getElementById('galleryDescriptionZh').value = item.descriptionZh || '';
        
        form.dataset.editIndex = editIndex;
    } else {
        title.textContent = currentLanguage === 'zh' ? '添加新画廊项目' : 'Add New Gallery Item';
        form.reset();
        delete form.dataset.editIndex;
    }
    
    modal.style.display = 'block';
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

// About Us Management
function loadAboutContent() {
    const aboutData = JSON.parse(localStorage.getItem('aboutContent')) || getDefaultAboutContent();
    
    // Always set both English and Chinese values
    document.getElementById('aboutTitle').value = aboutData.title;
    document.getElementById('aboutTitleZh').value = aboutData.titleZh;
    document.getElementById('aboutDescription').value = aboutData.description;
    document.getElementById('aboutDescriptionZh').value = aboutData.descriptionZh;
    
    document.getElementById('aboutImagePreview').src = aboutData.image;
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
    
    // Save both English and Chinese content
    aboutData.title = document.getElementById('aboutTitle').value;
    aboutData.titleZh = document.getElementById('aboutTitleZh').value;
    aboutData.description = document.getElementById('aboutDescription').value;
    aboutData.descriptionZh = document.getElementById('aboutDescriptionZh').value;
    
    localStorage.setItem('aboutContent', JSON.stringify(aboutData));
    
    const message = currentLanguage === 'zh' ? '关于我们文本内容保存成功！' : 'About Us text content saved successfully!';
    alert(message);
}

function saveAboutImage() {
    const fileInput = document.getElementById('aboutImageFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select an image file.');
        return;
    }
    
    // In a real application, you would upload the file to a server
    // For now, we'll simulate by creating a local URL
    const reader = new FileReader();
    reader.onload = function(e) {
        const aboutData = JSON.parse(localStorage.getItem('aboutContent')) || getDefaultAboutContent();
        aboutData.image = e.target.result;
        
        localStorage.setItem('aboutContent', JSON.stringify(aboutData));
        
        document.getElementById('aboutImagePreview').src = e.target.result;
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
