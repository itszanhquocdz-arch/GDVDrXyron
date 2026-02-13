// ===================================
// SCAM CHECKER LOGIC
// ===================================

‘use strict’;

// ===================================
// MOCK DATABASE
// ===================================
const scamDatabase = {
phones: [
{ number: ‘0987654321’, level: ‘danger’, reports: 47, type: ‘Giả danh công an’, desc: ‘Giả danh công an, yêu cầu chuyển tiền để “xác minh tài khoản”’ },
{ number: ‘0912345678’, level: ‘danger’, reports: 89, type: ‘Lừa đảo đầu tư’, desc: ‘Mời đầu tư tiền ảo, hứa lợi nhuận 300%/tháng’ },
{ number: ‘0898765432’, level: ‘warning’, reports: 23, type: ‘Spam quảng cáo’, desc: ‘Gọi spam bán bảo hiểm, vay tiền liên tục’ },
{ number: ‘0965432109’, level: ‘danger’, reports: 156, type: ‘Giả danh ngân hàng’, desc: ‘Nhắn tin giả mạo thông báo ngân hàng để lấy OTP’ },
],
websites: [
{ url: ‘shopee-vn.online’, level: ‘danger’, reports: 189, type: ‘Website giả mạo’, desc: ‘Giả mạo Shopee để lấy thông tin thẻ ATM’ },
{ url: ‘tiki-sale.com’, level: ‘danger’, reports: 234, type: ‘Website giả mạo’, desc: ‘Giả mạo Tiki, bán hàng giả, nhận tiền không giao hàng’ },
{ url: ‘vietcombank-check.net’, level: ‘danger’, reports: 412, type: ‘Phishing ngân hàng’, desc: ‘Giả mạo trang đăng nhập Vietcombank’ },
{ url: ‘lazada-flashsale.xyz’, level: ‘warning’, reports: 67, type: ‘Website đáng ngờ’, desc: ‘Domain mới tạo, giá rẻ bất thường’ },
],
banks: [
{ account: ‘0123456789’, bank: ‘VCB’, level: ‘warning’, reports: 23, name: ‘Nguyễn Văn A’, desc: ‘Nhận tiền đặt cọc nhưng không giao hàng’ },
{ account: ‘9876543210’, bank: ‘TCB’, level: ‘danger’, reports: 91, name: ‘Trần Thị B’, desc: ‘STK nhận tiền lừa đảo đầu tư đa cấp’ },
{ account: ‘1122334455’, bank: ‘MB’, level: ‘warning’, reports: 34, name: ‘Lê Văn C’, desc: ‘Bán hàng online không uy tín, nhiều khách phàn nàn’ },
],
social: [
{ url: ‘facebook.com/scammer123’, level: ‘danger’, reports: 78, type: ‘Facebook lừa đảo’, desc: ‘Clone tài khoản người quen để vay tiền’ },
{ url: ‘zalo.me/0987654321’, level: ‘warning’, reports: 45, type: ‘Zalo spam’, desc: ‘Nhắn tin rao bán hàng giả, không rõ nguồn gốc’ },
]
};

// ===================================
// VALIDATION FUNCTIONS
// ===================================
const validatePhone = (phone) => {
const cleaned = phone.replace(/\D/g, ‘’);
return cleaned.length === 10 && /^0[0-9]{9}$/.test(cleaned);
};

const validateWebsite = (url) => {
try {
const cleanUrl = url.startsWith(‘http’) ? url : `https://${url}`;
new URL(cleanUrl);
return true;
} catch {
return false;
}
};

const validateBankAccount = (account) => {
const cleaned = account.replace(/\D/g, ‘’);
return cleaned.length >= 6 && cleaned.length <= 20;
};

// ===================================
// DETECT INPUT TYPE
// ===================================
const detectType = (input) => {
const cleaned = input.trim();

```
// Phone number
if (/^0[0-9]{9}$/.test(cleaned.replace(/\D/g, ''))) {
    return 'phone';
}

// Website URL
if (cleaned.includes('.') && (cleaned.includes('http') || cleaned.includes('www') || cleaned.includes('.com') || cleaned.includes('.vn'))) {
    return 'website';
}

// Social media
if (cleaned.includes('facebook') || cleaned.includes('zalo') || cleaned.includes('fb.com')) {
    return 'social';
}

// Bank account (numbers only, longer than phone)
if (/^[0-9]{6,20}$/.test(cleaned.replace(/\D/g, ''))) {
    return 'bank';
}

return 'unknown';
```

};

// ===================================
// SEARCH IN DATABASE
// ===================================
const searchDatabase = (input, type) => {
const cleaned = input.trim().toLowerCase().replace(/\D/g, ‘’);

```
switch(type) {
    case 'phone':
        return scamDatabase.phones.find(p => 
            p.number.replace(/\D/g, '') === cleaned
        );
    
    case 'website':
        const urlPattern = input.trim().toLowerCase().replace(/^https?:\/\//,  '').replace(/^www\./, '');
        return scamDatabase.websites.find(w => 
            w.url.toLowerCase().includes(urlPattern) || 
            urlPattern.includes(w.url.toLowerCase())
        );
    
    case 'bank':
        return scamDatabase.banks.find(b => 
            b.account === cleaned
        );
    
    case 'social':
        const socialPattern = input.trim().toLowerCase();
        return scamDatabase.social.find(s => 
            s.url.toLowerCase().includes(socialPattern) || 
            socialPattern.includes(s.url.toLowerCase())
        );
    
    default:
        return null;
}
```

};

// ===================================
// DISPLAY RESULT
// ===================================
const displayResult = (result, input, type) => {
const modal = document.getElementById(‘result-modal’);
const container = document.getElementById(‘result-container’);
const loading = document.getElementById(‘result-loading’);

```
// Show modal
modal.classList.add('active');
loading.style.display = 'flex';

// Simulate checking delay
setTimeout(() => {
    loading.style.display = 'none';
    
    if (result) {
        // Found in database - SCAM
        container.innerHTML = `
            <div class="result-header ${result.level}">
                <div class="result-icon">
                    ${result.level === 'danger' ? `
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    ` : `
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    `}
                </div>
                <h2 class="result-title">
                    ${result.level === 'danger' ? 'CẢNH BÁO: LỪA ĐẢO!' : 'CẢNH BÁO'}
                </h2>
                <p class="result-subtitle">Phát hiện trong cơ sở dữ liệu lừa đảo</p>
            </div>
            
            <div class="result-body">
                <div class="result-info-card">
                    <div class="info-row">
                        <span class="info-label">Thông tin:</span>
                        <span class="info-value mono">${input}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Loại:</span>
                        <span class="info-value">${getTypeLabel(type)}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Mức độ:</span>
                        <span class="badge-${result.level}">${result.level === 'danger' ? 'Nguy hiểm cao' : 'Cảnh báo'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Số báo cáo:</span>
                        <span class="info-value">${result.reports} người</span>
                    </div>
                </div>
                
                <div class="result-detail">
                    <h3>Chi tiết</h3>
                    <p><strong>Thủ đoạn:</strong> ${result.type}</p>
                    <p>${result.desc}</p>
                </div>
                
                <div class="result-warning">
                    <h4>⚠️ Khuyến nghị</h4>
                    <ul>
                        <li>Không chuyển tiền hoặc cung cấp thông tin cá nhân</li>
                        <li>Chặn và báo cáo với cơ quan chức năng</li>
                        <li>Cảnh báo người thân và bạn bè</li>
                        ${result.level === 'danger' ? '<li><strong>Nếu đã chuyển tiền, liên hệ ngân hàng và công an ngay!</strong></li>' : ''}
                    </ul>
                </div>
                
                <div class="result-actions">
                    <button class="btn-action primary" onclick="reportMore()">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/>
                        </svg>
                        Báo cáo thêm
                    </button>
                    <button class="btn-action secondary" onclick="shareWarning()">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M15 8a3 3 0 11-6 0 3 3 0 016 0zM6 10a2 2 0 11-4 0 2 2 0 014 0zM2.5 18h15a1 1 0 001-1v-1a3 3 0 00-3-3h-1.5a1 1 0 01-1-1v-1a3 3 0 00-6 0v1a1 1 0 01-1 1H4.5a3 3 0 00-3 3v1a1 1 0 001 1z"/>
                        </svg>
                        Chia sẻ cảnh báo
                    </button>
                </div>
            </div>
        `;
    } else {
        // Not found - SAFE
        container.innerHTML = `
            <div class="result-header safe">
                <div class="result-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h2 class="result-title">An toàn</h2>
                <p class="result-subtitle">Không tìm thấy trong cơ sở dữ liệu lừa đảo</p>
            </div>
            
            <div class="result-body">
                <div class="result-info-card">
                    <div class="info-row">
                        <span class="info-label">Thông tin kiểm tra:</span>
                        <span class="info-value mono">${input}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Loại:</span>
                        <span class="info-value">${getTypeLabel(type)}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Trạng thái:</span>
                        <span class="badge-safe">✓ Chưa có báo cáo</span>
                    </div>
                </div>
                
                <div class="result-note">
                    <h4>📌 Lưu ý quan trọng</h4>
                    <p>Việc không có trong database không đảm bảo 100% an toàn. Hãy luôn cảnh giác với:</p>
                    <ul>
                        <li>Yêu cầu chuyển tiền trước khi giao hàng</li>
                        <li>Giá cả thấp hơn thị trường bất thường</li>
                        <li>Yêu cầu cung cấp thông tin cá nhân, OTP, mật khẩu</li>
                        <li>Tài khoản mới tạo, không có lịch sử giao dịch</li>
                    </ul>
                </div>
                
                <div class="result-actions">
                    <button class="btn-action primary" onclick="reportSuspicious()">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/>
                        </svg>
                        Có dấu hiệu đáng ngờ? Báo cáo ngay
                    </button>
                </div>
            </div>
        `;
    }
}, 1500);
```

};

// ===================================
// GET TYPE LABEL
// ===================================
const getTypeLabel = (type) => {
const labels = {
‘phone’: ‘Số điện thoại’,
‘website’: ‘Website’,
‘bank’: ‘Tài khoản ngân hàng’,
‘social’: ‘Mạng xã hội’,
‘unknown’: ‘Không xác định’
};
return labels[type] || ‘Không xác định’;
};

// ===================================
// MAIN CHECK FUNCTION
// ===================================
const checkScam = () => {
const input = document.getElementById(‘main-search’).value.trim();
const typeSelect = document.getElementById(‘search-type’).value;

```
if (!input) {
    alert('Vui lòng nhập thông tin cần kiểm tra');
    return;
}

// Auto detect or use selected type
const type = typeSelect === 'auto' ? detectType(input) : typeSelect;

if (type === 'unknown') {
    alert('Không thể xác định loại thông tin. Vui lòng chọn loại cụ thể hoặc nhập lại.');
    return;
}

// Search in database
const result = searchDatabase(input, type);

// Display result
displayResult(result, input, type);
```

};

// ===================================
// ACTION FUNCTIONS
// ===================================
const reportMore = () => {
alert(‘Cảm ơn! Bạn sẽ được chuyển đến trang báo cáo để cung cấp thêm thông tin.’);
window.location.href = ‘#report’;
closeModal();
};

const shareWarning = () => {
const shareText = ‘Cảnh báo lừa đảo từ GDVDrXyron! Kiểm tra trước khi tin tưởng.’;
if (navigator.share) {
navigator.share({
title: ‘Cảnh báo lừa đảo’,
text: shareText,
url: window.location.href
});
} else {
alert(‘Chia sẻ cảnh báo này với bạn bè và người thân để bảo vệ họ!’);
}
};

const reportSuspicious = () => {
alert(‘Cảm ơn sự cảnh giác của bạn! Hãy báo cáo để giúp cộng đồng an toàn hơn.’);
window.location.href = ‘#report’;
closeModal();
};

const closeModal = () => {
document.getElementById(‘result-modal’).classList.remove(‘active’);
};

// ===================================
// EVENT LISTENERS
// ===================================
const btnCheck = document.getElementById(‘btn-check’);
if (btnCheck) {
btnCheck.addEventListener(‘click’, checkScam);
}

// Enter key to check
const mainSearch = document.getElementById(‘main-search’);
if (mainSearch) {
mainSearch.addEventListener(‘keypress’, (e) => {
if (e.key === ‘Enter’) {
checkScam();
}
});
}

// Close modal on overlay click
const modalOverlay = document.querySelector(’.modal-overlay’);
if (modalOverlay) {
modalOverlay.addEventListener(‘click’, closeModal);
}

const modalClose = document.querySelector(’.modal-close’);
if (modalClose) {
modalClose.addEventListener(‘click’, closeModal);
}

// ===================================
// ADD RESULT STYLES
// ===================================
const resultStyles = `

<style>
.result-header {
    text-align: center;
    padding: 2rem;
    border-radius: 12px 12px 0 0;
    margin: -2rem -2rem 2rem -2rem;
}

.result-header.danger {
    background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
    border-bottom: 3px solid #DC2626;
}

.result-header.warning {
    background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
    border-bottom: 3px solid #F59E0B;
}

.result-header.safe {
    background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%);
    border-bottom: 3px solid #10B981;
}

.result-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1rem;
}

.result-header.danger .result-icon svg {
    stroke: #DC2626;
    stroke-width: 2;
}

.result-header.warning .result-icon svg {
    stroke: #F59E0B;
    stroke-width: 2;
}

.result-header.safe .result-icon svg {
    stroke: #10B981;
    stroke-width: 2;
}

.result-title {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
}

.result-header.danger .result-title {
    color: #DC2626;
}

.result-header.warning .result-title {
    color: #F59E0B;
}

.result-header.safe .result-title {
    color: #10B981;
}

.result-subtitle {
    color: #6B7280;
    font-size: 1.125rem;
}

.result-body {
    padding: 0;
}

.result-info-card {
    background: #F9FAFB;
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
}

.info-row {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid #E5E7EB;
}

.info-row:last-child {
    border-bottom: none;
}

.info-label {
    color: #6B7280;
    font-weight: 500;
}

.info-value {
    font-weight: 600;
    color: #111827;
}

.info-value.mono {
    font-family: monospace;
    font-size: 1.125rem;
}

.badge-danger {
    padding: 0.375rem 0.75rem;
    background: rgba(220, 38, 38, 0.1);
    color: #DC2626;
    border-radius: 9999px;
    font-weight: 700;
    font-size: 0.875rem;
}

.badge-warning {
    padding: 0.375rem 0.75rem;
    background: rgba(245, 158, 11, 0.1);
    color: #F59E0B;
    border-radius: 9999px;
    font-weight: 700;
    font-size: 0.875rem;
}

.badge-safe {
    padding: 0.375rem 0.75rem;
    background: rgba(16, 185, 129, 0.1);
    color: #10B981;
    border-radius: 9999px;
    font-weight: 700;
    font-size: 0.875rem;
}

.result-detail, .result-warning, .result-note {
    padding: 1.5rem;
    background: #F9FAFB;
    border-radius: 12px;
    margin-bottom: 1.5rem;
}

.result-detail h3, .result-warning h4, .result-note h4 {
    margin-bottom: 1rem;
    font-weight: 700;
}

.result-detail p, .result-warning p, .result-note p {
    color: #6B7280;
    line-height: 1.7;
    margin-bottom: 0.75rem;
}

.result-warning ul, .result-note ul {
    margin-left: 1.5rem;
    color: #6B7280;
    line-height: 1.8;
}

.result-warning li {
    margin-bottom: 0.5rem;
}

.result-warning {
    background: #FEF3C7;
    border-left: 4px solid #F59E0B;
}

.result-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 2rem;
}

.btn-action {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.875rem 1.5rem;
    border-radius: 12px;
    font-weight: 600;
    transition: all 0.3s;
}

.btn-action.primary {
    background: #DC2626;
    color: white;
}

.btn-action.primary:hover {
    background: #B91C1C;
    transform: translateY(-2px);
}

.btn-action.secondary {
    background: #F3F4F6;
    color: #111827;
}

.btn-action.secondary:hover {
    background: #E5E7EB;
}
</style>

`;

document.head.insertAdjacentHTML(‘beforeend’, resultStyles);
