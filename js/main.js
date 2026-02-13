// ===================================
// MAIN JAVASCRIPT
// ===================================

‘use strict’;

// ===================================
// INIT AOS
// ===================================
document.addEventListener(‘DOMContentLoaded’, () => {
AOS.init({
duration: 800,
easing: ‘ease-out-cubic’,
once: true,
offset: 100
});
});

// ===================================
// ALERT BANNER
// ===================================
const alertClose = document.querySelector(’.alert-close’);
const alertBanner = document.querySelector(’.alert-banner’);

if (alertClose && alertBanner) {
alertClose.addEventListener(‘click’, () => {
alertBanner.style.display = ‘none’;
});
}

// ===================================
// MOBILE MENU
// ===================================
const mobileToggle = document.querySelector(’.mobile-toggle’);
const mobileMenu = document.querySelector(’.mobile-menu’);
const mobileLinks = document.querySelectorAll(’.mobile-link’);

if (mobileToggle) {
mobileToggle.addEventListener(‘click’, () => {
mobileMenu.classList.toggle(‘active’);
mobileToggle.classList.toggle(‘active’);

```
    const spans = mobileToggle.querySelectorAll('span');
    if (mobileToggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }
});
```

}

mobileLinks.forEach(link => {
link.addEventListener(‘click’, () => {
mobileMenu.classList.remove(‘active’);
mobileToggle.classList.remove(‘active’);
});
});

// ===================================
// SMOOTH SCROLL
// ===================================
document.querySelectorAll(‘a[href^=”#”]’).forEach(anchor => {
anchor.addEventListener(‘click’, function(e) {
e.preventDefault();
const target = document.querySelector(this.getAttribute(‘href’));
if (target) {
target.scrollIntoView({
behavior: ‘smooth’,
block: ‘start’
});
}
});
});

// ===================================
// NAVBAR ACTIVE LINK
// ===================================
const navLinks = document.querySelectorAll(’.nav-link’);
const sections = document.querySelectorAll(‘section[id]’);

window.addEventListener(‘scroll’, () => {
let current = ‘’;
sections.forEach(section => {
const sectionTop = section.offsetTop;
const sectionHeight = section.clientHeight;
if (scrollY >= (sectionTop - 200)) {
current = section.getAttribute(‘id’);
}
});

```
navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
    }
});
```

});

// ===================================
// CHART.JS - STATISTICS CHART
// ===================================
const ctx = document.getElementById(‘scamChart’);
if (ctx) {
new Chart(ctx, {
type: ‘line’,
data: {
labels: [‘T1’, ‘T2’, ‘T3’, ‘T4’, ‘T5’, ‘T6’, ‘T7’, ‘T8’, ‘T9’, ‘T10’, ‘T11’, ‘T12’],
datasets: [{
label: ‘Số case lừa đảo’,
data: [4200, 5100, 6300, 7100, 7800, 8200, 8900, 9500, 10200, 11100, 12400, 13800],
borderColor: ‘#DC2626’,
backgroundColor: ‘rgba(220, 38, 38, 0.1)’,
borderWidth: 3,
fill: true,
tension: 0.4
}]
},
options: {
responsive: true,
maintainAspectRatio: false,
plugins: {
legend: {
display: false
},
tooltip: {
backgroundColor: ‘#1F2937’,
titleColor: ‘#F9FAFB’,
bodyColor: ‘#F9FAFB’,
borderColor: ‘#DC2626’,
borderWidth: 1,
padding: 12,
displayColors: false,
callbacks: {
label: function(context) {
return context.parsed.y.toLocaleString() + ’ cases’;
}
}
}
},
scales: {
y: {
beginAtZero: true,
grid: {
color: ‘#E5E7EB’
},
ticks: {
callback: function(value) {
return (value / 1000) + ‘k’;
}
}
},
x: {
grid: {
display: false
}
}
}
}
});
}

// ===================================
// ANIMATED NUMBERS
// ===================================
const animateNumber = (element, target) => {
let current = 0;
const increment = target / 50;
const timer = setInterval(() => {
current += increment;
if (current >= target) {
element.textContent = target.toLocaleString();
clearInterval(timer);
} else {
element.textContent = Math.floor(current).toLocaleString();
}
}, 30);
};

const observerOptions = {
threshold: 0.5,
rootMargin: ‘0px’
};

const statsObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
const statNumbers = entry.target.querySelectorAll(’.stat-number’);
statNumbers.forEach(stat => {
const target = parseInt(stat.textContent.replace(/,/g, ‘’));
animateNumber(stat, target);
});
statsObserver.unobserve(entry.target);
}
});
}, observerOptions);

const heroStats = document.querySelector(’.hero-stats’);
if (heroStats) {
statsObserver.observe(heroStats);
}

// ===================================
// TYPE CARD CLICK
// ===================================
const typeCards = document.querySelectorAll(’.type-card’);
const mainSearch = document.getElementById(‘main-search’);
const searchType = document.getElementById(‘search-type’);

typeCards.forEach(card => {
card.addEventListener(‘click’, () => {
const title = card.querySelector(’.type-title’).textContent.toLowerCase();

```
    if (title.includes('điện thoại')) {
        searchType.value = 'phone';
        mainSearch.placeholder = 'Nhập số điện thoại...';
    } else if (title.includes('website')) {
        searchType.value = 'website';
        mainSearch.placeholder = 'Nhập địa chỉ website...';
    } else if (title.includes('ngân hàng')) {
        searchType.value = 'bank';
        mainSearch.placeholder = 'Nhập số tài khoản...';
    } else if (title.includes('xã hội')) {
        searchType.value = 'social';
        mainSearch.placeholder = 'Nhập link Facebook/Zalo...';
    }
    
    mainSearch.focus();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
```

});

// ===================================
// SEARCH TYPE CHANGE
// ===================================
if (searchType) {
searchType.addEventListener(‘change’, (e) => {
const type = e.target.value;
const placeholders = {
‘auto’: ‘Nhập số điện thoại, website, STK ngân hàng…’,
‘phone’: ‘Nhập số điện thoại…’,
‘website’: ‘Nhập địa chỉ website…’,
‘bank’: ‘Nhập số tài khoản ngân hàng…’,
‘social’: ‘Nhập link Facebook, Zalo…’
};
mainSearch.placeholder = placeholders[type];
});
}

// ===================================
// SCAM CARD DETAIL BUTTON
// ===================================
const btnDetails = document.querySelectorAll(’.btn-detail’);
btnDetails.forEach(btn => {
btn.addEventListener(‘click’, (e) => {
e.stopPropagation();
const scamCard = btn.closest(’.scam-card’);
const scamTitle = scamCard.querySelector(’.scam-title’).textContent;

```
    // Trigger check with this info
    mainSearch.value = scamTitle;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
        document.getElementById('btn-check').click();
    }, 500);
});
```

});

// ===================================
// SCROLL TO TOP
// ===================================
const scrollToTop = () => {
window.scrollTo({
top: 0,
behavior: ‘smooth’
});
};

// ===================================
// KEYBOARD SHORTCUTS
// ===================================
document.addEventListener(‘keydown’, (e) => {
// Ctrl/Cmd + K to focus search
if ((e.ctrlKey || e.metaKey) && e.key === ‘k’) {
e.preventDefault();
mainSearch.focus();
}

```
// ESC to close modal
if (e.key === 'Escape') {
    const modal = document.querySelector('.modal.active');
    if (modal) {
        modal.classList.remove('active');
    }
}
```

});

// ===================================
// PERFORMANCE LOGGING
// ===================================
window.addEventListener(‘load’, () => {
const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
console.log(`⚡ Page loaded in ${loadTime}ms`);
});

// ===================================
// CONSOLE MESSAGE
// ===================================
console.log(’%c🛡️ GDVDrXyron Scam Checker’, ‘color: #DC2626; font-size: 20px; font-weight: bold;’);
console.log(’%cBảo vệ cộng đồng khỏi lừa đảo’, ‘color: #6B7280; font-size: 12px;’);
