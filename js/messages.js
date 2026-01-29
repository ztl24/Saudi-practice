// Message Board Logic using LocalStorage

const STORAGE_KEY = 'saudi_practice_guestbook_messages';

// Default messages to show if empty (Mock data)
// 第一次访问时显示一些默认留言，让页面看起来不那么冷清
const DEFAULT_MESSAGES = [
    {
        id: 1,
        name: 'Project Lead',
        content: '欢迎来到我们的沙特实践展示站！如果有任何建议，请在这里留言。Welcome to our Saudi practice showcase!',
        date: '2026-01-28 10:00:00'
    },
    {
        id: 2,
        name: 'Visitor A',
        content: '页面设计很有科技感，特别是粒子效果！The visual design is very futuristic.',
        date: '2026-01-29 14:20:00'
    }
];

// DOM Elements
const messageForm = document.getElementById('message-form');
const messagesList = document.getElementById('messages-list');
const usernameInput = document.getElementById('username');
const contentInput = document.getElementById('content');

// Helper: Get Current Date String
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Helper: Escape HTML to prevent XSS (Security for local demo too)
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Load Messages
function loadMessages() {
    let messages = localStorage.getItem(STORAGE_KEY);
    if (!messages) {
        // Initialize with default if completely empty
        messages = JSON.stringify(DEFAULT_MESSAGES);
        localStorage.setItem(STORAGE_KEY, messages);
    }
    return JSON.parse(messages);
}

// Save New Message
function saveMessage(name, content) {
    const messages = loadMessages();
    const newMessage = {
        id: Date.now(),
        name: name,
        content: content,
        date: getCurrentDate()
    };

    // Add to beginning of array
    messages.unshift(newMessage);

    // Persist
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));

    return newMessage;
}

// Render Single Message
function createMessageElement(msg) {
    const div = document.createElement('article');
    div.className = 'glass-card message-card';
    div.innerHTML = `
        <div class="message-header">
            <span class="message-author">${escapeHtml(msg.name)}</span>
            <span class="message-date">${escapeHtml(msg.date)}</span>
        </div>
        <div class="message-content">${escapeHtml(msg.content)}</div>
    `;
    return div;
}

// Render All Messages
function renderMessages() {
    const messages = loadMessages();
    messagesList.innerHTML = ''; // Clear current

    messages.forEach(msg => {
        const el = createMessageElement(msg);
        messagesList.appendChild(el);
    });
}

// Handle Form Submit
if (messageForm) {
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = usernameInput.value.trim();
        const content = contentInput.value.trim();

        if (name && content) {
            saveMessage(name, content);

            // Clear inputs
            usernameInput.value = '';
            contentInput.value = '';

            // Re-render
            renderMessages();

            // Optional: User feedback
            alert('留言发布成功！(Message Posted Successfully)');
        }
    });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderMessages();
});
