// 快速更新产品系列 - 直接复制粘贴到浏览器控制台执行

(function() {
    console.log('🚀 开始批量更新产品系列...');
    
    // 新的产品系列数据
    const newProductData = [
        {
            name: 'Smart Zebra Blinds',
            description: 'Featuring alternating sheer and opaque stripes, the smart zebra blind allows flexible light and privacy control via motor and app. Perfect for modern living rooms and offices.',
            image: 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(`<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#3498db"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" dy=".3em">Smart Zebra</text></svg>`)))
        },
        {
            name: 'Smart Roller Shades',
            description: 'Sleek and minimal, the smart roller shade supports remote and scheduled control, automatically adjusting to sunlight. Ideal for living rooms and balconies.',
            image: 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(`<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#e74c3c"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" dy=".3em">Smart Roller</text></svg>`)))
        },
        {
            name: 'Smart Venetian Blinds',
            description: 'With motorized slat adjustment, the smart venetian blind offers flexible light direction control, providing shade while maintaining airflow. Ideal for studies and offices.',
            image: 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(`<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#27ae60"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" dy=".3em">Smart Venetian</text></svg>`)))
        },
        {
            name: 'Smart Honeycomb Shades',
            description: 'Featuring a cellular design, the smart honeycomb shade provides excellent insulation. Controlled via voice or app, it is energy-efficient and perfect for bedrooms and sunrooms.',
            image: 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(`<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#9b59b6"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" dy=".3em">Smart Honeycomb</text></svg>`)))
        }
    ];
    
    try {
        // 保存到localStorage
        localStorage.setItem('productSeries', JSON.stringify(newProductData));
        console.log('✅ 产品系列更新成功！');
        console.log('更新了', newProductData.length, '个产品系列');
        
        // 显示更新后的数据
        newProductData.forEach((series, index) => {
            console.log(`${index + 1}. ${series.name}`);
            console.log(`   描述: ${series.description}`);
        });
        
        // 如果当前在内容管理页面，刷新显示
        if (typeof updateStorageCounts === 'function') {
            updateStorageCounts();
            console.log('✅ 内容管理页面显示已刷新');
        }
        
        // 如果当前在首页，刷新显示
        if (typeof loadProductSeriesContent === 'function') {
            loadProductSeriesContent();
            console.log('✅ 首页产品系列显示已刷新');
        }
        
        // 提示用户刷新页面
        console.log('💡 如果页面显示没有更新，请刷新页面');
        
    } catch (error) {
        console.error('❌ 更新产品系列失败:', error);
    }
})();
