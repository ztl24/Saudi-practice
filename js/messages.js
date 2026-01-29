// 最终方案：Twikoo 留言板
// 部署平台：Zeabur (国内访问佳，且自带数据库)

function initTwikoo() {
    // ============================================
    // ⚠️ 开发者必填区 (DEVELOPER CONFIGURATION) ⚠️
    // 请填入你在 Zeabur 部署成功后获得的网址
    // 例如: https://twikoo-xyz.zeabur.app
    // ============================================
    const TWIKOO_ENV_ID = 'https://saudipractice.zeabur.app';
    // ============================================

    if (!TWIKOO_ENV_ID || TWIKOO_ENV_ID.includes('请填入')) {
        showConfigInstruction();
        return;
    }

    twikoo.init({
        envId: TWIKOO_ENV_ID,
        el: '#tcomment',
        lang: 'zh-CN',
    }).then(() => {
        // Twikoo 加载完成后执行自定义逻辑
        customizeTwikooUI();
    });
}

function customizeTwikooUI() {
    // 使用定时器或 MutationObserver 确保 DOM 加载
    const observer = new MutationObserver((mutations, obs) => {
        const container = document.getElementById('tcomment');
        if (!container) return;

        // 1. 隐藏图片上传按钮 (通常是 .tk-action-icon 或者是其中的 SVG)
        // 尝试找到图片上传的按钮。通常它是一个带有特定图标的按钮。
        // 由于没有具体的类名，我们尝试查找所有 action-icon 并通过内容判断，或者直接隐藏所有非表情的图标如果只需要文本和emoji
        const actionIcons = container.querySelectorAll('.tk-action-icon');
        actionIcons.forEach(icon => {
            // 这里是一个假设的判断，如果找不到特定类名，可能如果不小心隐藏了表情按钮
            // 往往图片上传按钮包含类似 <path d="... image path ...">
            // 或者我们可以尝试隐藏 .tk-image-upload 类 (如果有)
            // 更稳妥的方式：隐藏除了表情按钮之外的按钮，或者如果用户确定是“黄色小图片标识”，
            // 通常是第二个按钮 (第一个是表情，第二个是图片)

            // 安全起见，我们尝试查找包含 'image' 相关的属性或 SVG
            if (icon.innerHTML.includes('<svg') && !icon.innerHTML.includes('face')) {
                // 简单的启发式：表情按钮通常有笑脸 path，图片按钮通常是山或图片形状
                // 但为了精准，我们也可以通过位置判断。通常图片是第二个。
            }
            // 简单暴力法：隐藏第二个 action icon (索引 1)，假设布局是 [表情] [图片]
        });

        // 更精准的 CSS 注入方式 (如果不依赖 JS 查找 DOM)
        // 注入样式标签来隐藏图片按钮
        const style = document.createElement('style');
        style.innerHTML = `
            /* 尝试定位图片上传按钮 */
            .tk-action-icon:nth-child(2) { display: none !important; }
            /* 或者如果有特定类名 */
            .tk-action-icon.__image { display: none !important; }
        `;
        container.appendChild(style);


        // 2. 修改 Placeholder
        const textarea = container.querySelector('textarea.el-textarea__inner');
        if (textarea) {
            textarea.setAttribute('placeholder', '仅支持文本与emoji / Only text and emoji supported');
            // 停止观察，以免重复执行（除非 Twikoo 动态重绘很频繁）
            // obs.disconnect(); 
            // 注意：Twikoo 点击评论后可能会重置输入框，所以最好保持观察或监听特定事件
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function showConfigInstruction() {
    const container = document.getElementById('tcomment');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; color: var(--sand-gold); padding: 50px;">
                <h3 style="font-size: 1.5rem; margin-bottom: 20px;">🚀 最后一步</h3>
                <p style="color: #ccc; margin-bottom: 20px; line-height: 1.8;">
                    请去 <strong>Zeabur</strong> 部署 Twikoo 服务，<br>
                    获得一个 <code>https://...</code> 开头的网址，<br>
                    然后把它填入 <code>js/messages.js</code> 文件中。
                </p>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', initTwikoo);
