/**
 * Shared Application Utilities (Auth checks, formatting, UI component injection).
 */

const App = (() => {
  // Check if user is logged in, redirect if not
  const checkAuth = () => {
    // Exclude login.html from check to prevent redirection loops
    const path = window.location.pathname;
    const isLoginPage = path.includes('login.html');
    const isIndexPage = path.endsWith('/') || path.includes('index.html');
    
    const user = WalletStorage.getCurrentUser();

    if (!user && !isLoginPage && !isIndexPage) {
      window.location.href = 'login.html';
      return null;
    }
    
    if (user && isLoginPage) {
      window.location.href = 'menu.html';
      return user;
    }

    return user;
  };

  // Format number to currency style (e.g., $150.000)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format ISO date to human readable date (e.g., 28 de junio, 2026)
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Inject a common navbar bottom menu for navigation
  const injectBottomBar = (activePage) => {
    const body = document.querySelector('body');
    if (!body) return;

    // Create the navigation container
    const nav = document.createElement('nav');
    nav.className = 'aw-bottom-bar';
    
    const items = [
      { id: 'menu', file: 'menu.html', label: 'Inicio', icon: 'fa-solid fa-house' },
      { id: 'deposit', file: 'deposit.html', label: 'Depositar', icon: 'fa-solid fa-wallet' },
      { id: 'send', file: 'sendmoney.html', label: 'Enviar', icon: 'fa-solid fa-paper-plane' },
      { id: 'transactions', file: 'transactions.html', label: 'Movimientos', icon: 'fa-solid fa-clock-rotate-left' }
    ];

    nav.innerHTML = items.map(item => {
      const isActive = activePage === item.id ? 'active' : '';
      return `
        <a href="${item.file}" class="aw-nav-item ${isActive}">
          <i class="${item.icon}"></i>
          <span>${item.label}</span>
        </a>
      `;
    }).join('') + `
      <a href="#" id="aw-btn-logout" class="aw-nav-item">
        <i class="fa-solid fa-right-from-bracket text-danger"></i>
        <span class="text-danger">Salir</span>
      </a>
    `;

    body.appendChild(nav);
    // Add extra padding at the bottom of the body so the nav doesn't cover content
    body.style.paddingBottom = '80px';

    // Set logout event
    document.getElementById('aw-btn-logout').addEventListener('click', (e) => {
      e.preventDefault();
      WalletStorage.logout();
      window.location.href = 'login.html';
    });
  };

  // Inject and show alert toast
  const showToast = (message, type = 'success') => {
    let toast = document.getElementById('aw-app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'aw-app-toast';
      toast.className = 'aw-toast';
      document.body.appendChild(toast);
    }

    // Set styling class based on type
    toast.className = `aw-toast ${type === 'success' ? 'success' : 'danger'}`;
    
    const icon = type === 'success' 
      ? '<i class="fa-solid fa-circle-check text-success" style="font-size: 1.25rem;"></i>' 
      : '<i class="fa-solid fa-circle-exclamation text-danger" style="font-size: 1.25rem;"></i>';

    toast.innerHTML = `
      ${icon}
      <div style="font-weight: 600; font-size: 0.9rem; color: var(--aw-text-main);">${message}</div>
    `;

    $(toast).fadeIn(300);
    
    setTimeout(() => {
      $(toast).fadeOut(300);
    }, 3500);
  };

  // Run initial Auth Check
  const currentUser = checkAuth();

  return {
    currentUser,
    formatCurrency,
    formatDate,
    injectBottomBar,
    showToast,
    logout: () => {
      WalletStorage.logout();
      window.location.href = 'login.html';
    }
  };
})();
