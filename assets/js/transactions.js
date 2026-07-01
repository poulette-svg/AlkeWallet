/**
 * Transactions History Logic (transactions.html).
 * Loads transaction array, applies status filters, dynamically formats list rows.
 */

$(document).ready(() => {
  const user = App.currentUser;
  if (!user) return; // Auth checks handle redirects

  // 1. Render Current Balance
  $('#transactions-balance-display').text(App.formatCurrency(user.balance));

  let currentFilter = 'all'; // 'all', 'incomes', 'expenses'
  const transactions = WalletStorage.getTransactions();

  // 2. Render function based on current filter
  const renderTransactions = () => {
    const container = $('#transactions-list-container');
    
    // Clear previous items but keep the placeholder element
    container.find('.aw-transaction-row').remove();
    $('#no-transactions-placeholder').hide();

    // Apply Filter
    let filteredTx = transactions;
    if (currentFilter === 'incomes') {
      filteredTx = transactions.filter(t => t.type === 'deposit' || t.type === 'receive');
    } else if (currentFilter === 'expenses') {
      filteredTx = transactions.filter(t => t.type === 'withdraw' || t.type === 'send');
    }

    // Check empty state
    if (filteredTx.length === 0) {
      $('#no-transactions-placeholder').show();
      return;
    }

    // Render list
    const html = filteredTx.map(tx => {
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
          typeText = `Transferido a ${tx.counterpart}`;
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
  };

  // 3. Set Filter Buttons handlers
  $('#filter-all').on('click', function() {
    $('.aw-filter-btn').removeClass('active');
    $(this).addClass('active');
    currentFilter = 'all';
    renderTransactions();
  });

  $('#filter-incomes').on('click', function() {
    $('.aw-filter-btn').removeClass('active');
    $(this).addClass('active');
    currentFilter = 'incomes';
    renderTransactions();
  });

  $('#filter-expenses').on('click', function() {
    $('.aw-filter-btn').removeClass('active');
    $(this).addClass('active');
    currentFilter = 'expenses';
    renderTransactions();
  });

  // 4. Initial Render
  renderTransactions();

  // 5. Inject bottom bar (active page: 'transactions')
  App.injectBottomBar('transactions');
});
