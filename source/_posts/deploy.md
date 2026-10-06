---
title: 使用 GitHub Pages
---

搭建一个用 `hexo-theme-claude` 生成的静态博客，然后部署到 GitHub Pages。

### 1. **创建一个演示博客仓库**
```bash
# 创建新的 Hexo 项目
hexo init hexo-theme-claude-demo
cd hexo-theme-claude-demo
npm install
```

### 2. **安装主题**
```bash
git clone https://github.com/bojue/hexo-theme-claude.git themes/hexo-theme-claude
```

### 3. **配置 Hexo**
编辑根目录 `_config.yml`：
```yaml
title: hexo-theme-claude Demo
theme: hexo-theme-claude
url: https://bojue.github.io/hexo-theme-claude-demo
root: /hexo-theme-claude-demo/
```

### 4. **生成并部署**
```bash
# 安装 GitHub Pages 部署工具
npm install hexo-deployer-git --save

# 配置部署（在 _config.yml 末尾添加）
deploy:
  type: git
  repo: https://github.com/bojue/hexo-theme-claude-demo.git
  branch: gh-pages

# 生成并部署
hexo generate
hexo deploy
```
