// 最终方案：Twikoo 留言板
// 部署平台：Zeabur (国内访问佳，且自带数据库)

function initTwikoo() {
    // ============================================
    // ⚠️ 开发者必填区 (DEVELOPER CONFIGURATION) ⚠️
    // 请填入你在 Zeabur 部署成功后获得的网址
    // 例如: https://twikoo-xyz.zeabur.app
    // ============================================
    const TWIKOO_ENV_ID = 'https://sjcl.clusters.zeabur.com';
    // ============================================

    if (!TWIKOO_ENV_ID || TWIKOO_ENV_ID.includes('请填入')) {
        showConfigInstruction();
        return;
    }

    twikoo.init({
        envId: TWIKOO_ENV_ID,
        el: '#tcomment',
        lang: 'zh-CN',
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
