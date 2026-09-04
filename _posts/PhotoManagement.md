
```dataviewjs
const imageExtensions = /\.(png|jpg|jpeg|gif|webp|svg)$/i;

// 1. 获取 img 目录下所有图片
const allImages = app.vault.getFiles().filter(file =>
    file.path.startsWith("img/") &&
    imageExtensions.test(file.path)
);

// 2. 获取 Vault 中可能包含图片引用的文本文件
const textExtensions = /\.(md|html|htm|liquid|css|scss|sass|js|ts|json|yaml|yml|xml|txt)$/i;

const textFiles = app.vault.getFiles().filter(file =>
    textExtensions.test(file.path)
);

// 3. 读取所有文本文件
const fileContents = new Map();

for (const file of textFiles) {
    try {
        const content = await app.vault.read(file);
        fileContents.set(file.path, content);
    } catch (e) {
        // 忽略无法读取的文件
    }
}

// 4. 判断每张图片是否被引用
const usedImages = [];
const unusedImages = [];

for (const image of allImages) {
    const imagePath = image.path;
    const imageName = image.name;

    let references = [];

    for (const [filePath, content] of fileContents) {

        // 完整路径匹配，例如：
        // img/foo.png
        // /img/foo.png
        // ../img/foo.png
        const normalizedPath = imagePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const pathRegex = new RegExp(
            `(?:^|["'(/\\s])${normalizedPath}(?:["')?#\\s]|$)`,
            "i"
        );

        // 文件名匹配
        // 用于处理：
        // ![](foo.png)
        // ![[foo.png]]
        // background-image: url(foo.png)
        const nameRegex = new RegExp(
            `(?:^|["'(/\\s])${imageName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:["')?#\\s]|$)`,
            "i"
        );

        if (pathRegex.test(content) || nameRegex.test(content)) {
            references.push(filePath);
        }
    }

    if (references.length > 0) {
        usedImages.push({
            image,
            references
        });
    } else {
        unusedImages.push(image);
    }
}

// 5. 显示统计
dv.header(2, "图片统计");

dv.paragraph(
    `文章：${dv.pages('"_posts"').length} 篇 ｜ ` +
    `图片：${allImages.length} 张 ｜ ` +
    `已引用：${usedImages.length} 张 ｜ ` +
    `未引用：${unusedImages.length} 张`
);

// 6. 显示完全没有引用的图片
dv.header(2, `未引用的图片（${unusedImages.length}）`);

if (unusedImages.length === 0) {
    dv.paragraph("🎉 所有图片都被引用了！");
} else {
    dv.table(
        ["文件名", "路径"],
        unusedImages.map(file => [
            file.name,
            file.path
        ])
    );
}
```

