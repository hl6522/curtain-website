# 网站图片目录

## 目录结构说明

```
images/
├── home/             # 首页图片
│   ├── hero-background.jpg    # 首页横幅背景
│   ├── curtain-closeup.jpg    # 窗帘特写
│   └── modern-home.jpg        # 现代家居
├── gallery/          # 产品展示图片
│   ├── elegant-living-room.jpg    # 客厅窗帘
│   ├── bedroom-curtains.jpg       # 卧室窗帘
│   ├── kitchen-window.jpg         # 厨房窗帘
│   ├── bathroom-curtains.jpg      # 浴室窗帘
│   ├── modern-living-room.jpg     # 现代客厅
│   └── master-bedroom.jpg         # 主卧室
├── products/         # 产品系列图片
│   ├── elegant-drapery.jpg        # 优雅窗帘
│   ├── modern-panels.jpg          # 现代面板
│   ├── classic-valances.jpg       # 经典帷幔
│   ├── blackout-curtains.jpg      # 遮光窗帘
│   ├── sheer-elegance.jpg         # 薄纱优雅
│   ├── layered-treatments.jpg     # 分层处理
│   ├── cafe-curtains.jpg          # 咖啡厅窗帘
│   ├── roman-shades.jpg           # 罗马帘
│   ├── roller-blinds.jpg          # 卷帘
│   ├── moisture-resistant.jpg     # 防潮系列
│   ├── privacy-sheers.jpg         # 隐私薄纱
│   ├── fabric-panels.jpg          # 面料面板
│   ├── professional-blinds.jpg    # 专业百叶窗
│   ├── study-curtains.jpg         # 书房窗帘
│   └── conference-room.jpg        # 会议室
├── about/            # 关于我们图片
│   └── showroom.jpg               # 展示厅
├── image_mapping.md  # 图片映射表
└── README.md         # 本文件
```

## 使用方法

### 1. 在HTML中引用图片

**HOME 页面图片:**
```html
<!-- 首页横幅背景 -->
<div class="hero" style="background-image: url('images/home/hero-background.jpg');">
```

**Gallery 图片:**
```html
<img src="images/gallery/elegant-living-room.jpg" alt="客厅窗帘">
```

**产品系列图片:**
```html
<img src="images/products/elegant-drapery.jpg" alt="优雅窗帘">
```

**关于我们图片:**
```html
<img src="images/about/showroom.jpg" alt="展示厅">
```

### 2. 在CSS中引用图片

```css
.hero-section {
    background-image: url('../images/home/hero-background.jpg');
}

.gallery-item {
    background-image: url('../images/gallery/elegant-living-room.jpg');
}
```

### 3. 在JavaScript中引用图片

```javascript
const imagePath = 'images/products/elegant-drapery.jpg';
document.getElementById('product-image').src = imagePath;
```

## 维护说明

### 添加新图片
1. 将图片文件放入相应的目录
2. 更新 `image_mapping.md` 文件
3. 在代码中使用相对路径引用

### 更新图片
1. 替换对应目录中的图片文件
2. 保持文件名不变，避免修改代码
3. 确保新图片尺寸与原图片一致

### 删除图片
1. 删除文件系统中的图片
2. 更新 `image_mapping.md` 文件
3. 检查并更新所有引用该图片的代码

## 图片规格

- **HOME 页面图片**: 
  - 横幅背景: 1200x600 像素
  - 特写图片: 800x500 像素
- **Gallery 图片**: 400x300 像素
- **产品系列图片**: 300x300 像素  
- **关于我们图片**: 500x400 像素

## 注意事项

1. 所有图片都来自 Unsplash，为免费商用图片
2. 图片已通过URL参数优化尺寸，减少加载时间
3. 建议定期更新图片以保持网站新鲜感
4. 图片文件名采用英文，便于维护和跨平台兼容
5. 使用相对路径引用图片，确保网站可移植性
6. HOME页面图片已集成到CSS背景中，提供更好的视觉效果

## 快速更新脚本

如需重新下载所有图片，可运行：
```powershell
.\download_images.ps1
```

这将重新下载所有图片到对应目录。
