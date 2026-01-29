// Message Board Logic - Explicit Developer Mode
// Only requires the developer to fill in keys once.

// ============================================
// ⚠️ 开发者必填区 (DEVELOPER CONFIGURATION) ⚠️
// 请去 leancloud.app 注册并获取 keys
// ============================================
const APP_ID = '请在这里填入你的AppID';  // 例如: 'AbCdEfGhIjK...'
const APP_KEY = '请在这里填入你的AppKey'; // 例如: '123456...'
// ============================================


// Initialization
function init() {
    // Check if developer has configured the keys
    if (!APP_ID || APP_ID.includes('请在这里填入') || !APP_KEY || APP_KEY.includes('请在这里填入')) {
        showConfigInstruction();
        return;
    }

    // Initialize Valine (Public Cloud Message Board)
    activateValine(APP_ID, APP_KEY);
}

function activateValine(id, key) {
    new Valine({
        el: '#vcomments',
        appId: id,
        appKey: key,
        placeholder: '在星空下留下你的足迹...\nLeave your message under the stars...',
        avatar: 'monsterid', // Auto-generated nerdy avatar
        pageSize: 10,
        visitor: true, // Article reading count
        recordIP: true, // For safety
        enableQQ: true // Allow QQ avatar
    });
}

function showConfigInstruction() {
    const container = document.getElementById('vcomments');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; color: var(--sand-gold); padding: 40px;">
                <h3 style="font-size: 1.5rem; margin-bottom: 20px;">⚠️ 开发者配置未完成</h3>
                <p style="color: #ccc; margin-bottom: 20px;">
                    请打开 <code>js/messages.js</code> 文件，<br>
                    并在顶部的 <code>APP_ID</code> 和 <code>APP_KEY</code> 中<br>
                    填入你在 LeanCloud 申请的凭证。
                </p>
                <div style="font-size: 0.8rem; color: #666;">
                    (Please configure APP_ID and APP_KEY in js/messages.js to enable the message board)
                </div>
            </div>
        `;
    }
}

// Run
document.addEventListener('DOMContentLoaded', init);
