/**
 * Dashboard Logic (menu.html).
 * Loads user data, formatting balance, listing recent transactions.
 */

$(document).ready(() => {
  const user = App.currentUser;
  if (!user) return; 

  // Renderizamos los datos de cabecera y calculamos un número de cuenta ficticio
  $('#user-display-name').text(user.name);
  $('#user-avatar').text(user.name.charAt(0).toUpperCase());
  
  const accountNum = `AW-${user.id.replace('u-', '')}-${user.email.length * 7}`;
  $('#user-account-number').text(accountNum);

  $('#wallet-balance').text(App.formatCurrency(user.balance));

  // Limitamos a los 3 últimos movimientos para no saturar el dashboard
  const transactions = WalletStorage.getTransactions();
  const container = $('#recent-transactions-container');

  if (transactions.length === 0) {
    $('#no-transactions-placeholder').show();
  } else {
    const recent = transactions.slice(0, 3);
    
    const html = recent.map(tx => {
      let iconClass = 'fa-solid fa-arrow-down-long';
      let iconColorClass = 'deposit';
      let typeSign = '+';
      let amountClass = 'plus';
      let typeText = '';

      switch (tx.type) {
        case 'deposit':
          iconClass = 'fa-solid fa-arrow-down-long';
          iconColorClass = 'deposit';
          typeSign = '+';
          amountClass = 'plus';
          typeText = 'Depósito recibido';
          break;
        case 'withdraw':
          iconClass = 'fa-solid fa-arrow-up-long';
          iconColorClass = 'withdraw';
          typeSign = '-';
          amountClass = 'minus';
          typeText = 'Retiro realizado';
          break;
        case 'send':
          iconClass = 'fa-solid fa-paper-plane';
          iconColorClass = 'send';
          typeSign = '-';
          amountClass = 'minus';
          typeText = `Enviado a ${tx.counterpart}`;
          break;
        case 'receive':
          iconClass = 'fa-solid fa-hand-holding-dollar';
          iconColorClass = 'receive';
          typeSign = '+';
          amountClass = 'plus';
          typeText = `Recibido de ${tx.counterpart}`;
          break;
      }

      return `
        <div class="aw-transaction-row">
          <div class="d-flex align-items-center">
            <div class="aw-transaction-icon ${iconColorClass}">
              <i class="${iconClass}"></i>
            </div>
            <div class="aw-transaction-info">
              <div class="aw-transaction-title">${typeText}</div>
              <div class="aw-transaction-date">${App.formatDate(tx.date)}</div>
            </div>
          </div>
          <div class="aw-transaction-amount ${amountClass}">
            ${typeSign}${App.formatCurrency(tx.amount)}
          </div>
        </div>
      `;
    }).join('');

    container.append(html);
  }

  App.injectBottomBar('menu');
});
