// 快速更新画廊案例 - 直接复制粘贴到浏览器控制台执行

(function() {
    console.log('🚀 开始批量更新画廊案例...');
    
    // 新的画廊案例数据
    const newGalleryData = [
        {
            title: 'Modern Living Room Transformation',
            description: 'A sophisticated living room featuring our smart zebra blinds with alternating sheer and opaque stripes. The motorized control allows seamless adjustment between privacy and natural light, creating the perfect ambiance for any occasion.',
            image: 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(`<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#3498db"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" dy=".3em">Living Room</text></svg>`)))
        },
        {
            title: 'Bathroom Zebra Blinds',
            description: 'Our smart zebra blinds in a modern bathroom setting, providing perfect privacy control while maintaining elegant aesthetics. The alternating sheer and opaque stripes offer flexible light management for intimate spaces.',
            image: 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(`<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#9b59b6"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" dy=".3em">Bathroom</text></svg>`)))
        },
        {
            title: 'Contemporary Office Space',
            description: 'Smart venetian blinds in a modern office setting, offering precise light direction control and automated adjustment. The motorized slats provide optimal working conditions while maintaining professional aesthetics.',
            image: 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(`<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#27ae60"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" dy=".3em">Office</text></svg>`)))
        }
    ];
    
    try {
        // 保存到localStorage
        localStorage.setItem('gallery', JSON.stringify(newGalleryData));
        console.log('✅ 画廊案例更新成功！');
        console.log('更新了', newGalleryData.length, '个案例');
        
        // 显示更新后的数据
        newGalleryData.forEach((item, index) => {
            console.log(`${index + 1}. ${item.title}`);
            console.log(`   描述: ${item.description}`);
        });
        
        // 如果当前在内容管理页面，刷新显示
        if (typeof updateStorageCounts === 'function') {
            updateStorageCounts();
            console.log('✅ 内容管理页面显示已刷新');
        }
        
        // 如果当前在首页，刷新显示
        if (typeof loadGalleryContent === 'function') {
            loadGalleryContent();
            console.log('✅ 首页画廊显示已刷新');
        }
        
        // 提示用户刷新页面
        console.log('💡 如果页面显示没有更新，请刷新页面');
        
    } catch (error) {
        console.error('❌ 更新画廊案例失败:', error);
    }
})();
