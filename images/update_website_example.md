# 更新网站图片路径示例

## 当前状态
网站目前使用 Unsplash 的远程图片URL，需要替换为本地图片路径以提高加载速度和稳定性。

## 需要更新的文件

### 1. index.html

#### Gallery 部分 (第99-139行)
**当前代码:**
```html
<img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop" alt="Elegant Living Room Curtains">
<img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop" alt="Bedroom Curtains">
<img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop" alt="Kitchen Window Treatment">
<img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop" alt="Bathroom Curtains">
<img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop" alt="Modern Living Room">
<img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop" alt="Master Bedroom">
```

**更新后:**
```html
<img src="images/gallery/elegant-living-room.jpg" alt="Elegant Living Room Curtains">
<img src="images/gallery/bedroom-curtains.jpg" alt="Bedroom Curtains">
<img src="images/gallery/kitchen-window.jpg" alt="Kitchen Window Treatment">
<img src="images/gallery/bathroom-curtains.jpg" alt="Bathroom Curtains">
<img src="images/gallery/modern-living-room.jpg" alt="Modern Living Room">
<img src="images/gallery/master-bedroom.jpg" alt="Master Bedroom">
```

#### 产品系列部分 (第162-372行)
**当前代码:**
```html
<img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop" alt="Elegant Drapery">
<img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=300&fit=crop" alt="Modern Panels">
<!-- ... 更多产品图片 ... -->
```

**更新后:**
```html
<img src="images/products/elegant-drapery.jpg" alt="Elegant Drapery">
<img src="images/products/modern-panels.jpg" alt="Modern Panels">
<!-- ... 更多产品图片 ... -->
```

#### 关于我们部分 (第486行)
**当前代码:**
```html
<img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop" alt="Our Showroom">
```

**更新后:**
```html
<img src="images/about/showroom.jpg" alt="Our Showroom">
```

## 批量替换方法

### 使用搜索替换工具

1. **Gallery 图片替换:**
   - 搜索: `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop`
   - 替换为: `images/gallery/elegant-living-room.jpg`

2. **产品图片替换:**
   - 搜索: `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop`
   - 替换为: `images/products/elegant-drapery.jpg`
   
   - 搜索: `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=300&fit=crop`
   - 替换为: `images/products/modern-panels.jpg`
   
   - 搜索: `https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop`
   - 替换为: `images/products/classic-valances.jpg`

3. **关于我们图片替换:**
   - 搜索: `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop`
   - 替换为: `images/about/showroom.jpg`

## 注意事项

1. **保持 alt 属性不变** - 这些属性对SEO和可访问性很重要
2. **检查图片尺寸** - 确保本地图片尺寸与原始URL参数一致
3. **测试加载** - 更新后测试网站确保所有图片正常显示
4. **备份原文件** - 更新前备份原始HTML文件

## 更新后的优势

1. **加载速度提升** - 本地图片加载更快
2. **稳定性增强** - 不依赖外部服务
3. **SEO优化** - 本地资源对搜索引擎更友好
4. **维护便利** - 图片集中管理，便于更新
5. **离线可用** - 网站可以在没有网络的情况下正常显示图片

