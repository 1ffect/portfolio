# SHIQI 个人网站

## 上传并发布
1. 解压压缩包。
2. 在 https://github.com/1ffect/portfolio 点击 uploading an existing file（空仓库）或 Add file → Upload files。
3. 把 index.html、style.css、app.js、assets 文件夹一起拖入上传区域。不要上传 ZIP，也不要把外层文件夹作为网站根目录。
4. 点击 Commit changes。
5. 打开仓库 Settings → Pages。Source 选择 Deploy from a branch；Branch 选择 main；目录选择 / (root)，点击 Save。
6. 等待 GitHub 完成部署。Pages 页面显示 Visit site 后，通过它打开网站。

预期网址：https://1ffect.github.io/portfolio/

网页无需登录即可浏览。网站使用相对资源路径，支持 /portfolio/ 子目录。

## 文件
index.html：网页内容
style.css：样式
app.js：动画和视频播放
assets/：视频、封面与 GSAP 文件

GSAP 与 ScrollTrigger 保留官方文件头。许可：https://gsap.com/standard-license/
