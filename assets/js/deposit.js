/**
 * Deposit Logic (deposit.html).
 * Form validations, Modal confirmations, WalletStorage transactions.
 */

$(document).ready(() => {
  const user = App.currentUser;
  if (!user) return; // Auth checking will redirect

  // 1. Render Current Balance
  const updateBalanceDisplay = () => {
    $('#current-balance-display').text(App.formatCurrency(user.balance));
  };
  updateBalanceDisplay();

  let depositAmountValue = 0;
  const depositModal = new bootstrap.Modal(document.getElementById('modal-confirm-deposit'));

  // 2. Handle Form Submission
  $('#form-deposit').on('submit', (e) => {
    e.preventDefault();
    $('#deposit-amount-error').text('').hide();
    $('#deposit-amount').removeClass('is-invalid');

    const amountStr = $('#deposit-amount').val();
    const amount = parseInt(amountStr, 10);

    // Validation
    if (!amountStr || isNaN(amount)) {
      $('#deposit-amount-error').text('El monto es obligatorio.').show();
      $('#deposit-amount').addClass('is-invalid');
      return;
    }

    if (amount < 1000) {
      $('#deposit-amount-error').text('El monto mínimo para depositar es $1.000 CLP.').show();
      $('#deposit-amount').addClass('is-invalid');
      return;
    }

    // Prepare Modal details
    depositAmountValue = amount;
    $('#modal-total-display').text(App.formatCurrency(amount));

    // Show Confirmation Modal
    depositModal.show();
  });

  // 3. Confirm and execute deposit
  $('#btn-confirm-submit').on('click', () => {
    depositModal.hide();

    try {
      // Execute operation in storage layer
      const tx = WalletStorage.deposit(depositAmountValue);
      
      // Clear input
      $('#deposit-amount').val('');
      
      // Reload active user from storage to get updated balance
      const updatedUser = WalletStorage.getCurrentUser();
      user.balance = updatedUser.balance; // Sync local object
      updateBalanceDisplay();

      // Show feedback
      App.showToast(`Se depositaron ${App.formatCurrency(depositAmountValue)} correctamente.`, 'success');
      
      // Redirect to main menu after delay
      setTimeout(() => {
        window.location.href = 'menu.html';
      }, 1500);

    } catch (err) {
      App.showToast(err.message, 'danger');
    }
  });

  // 4. Inject navigation bottom bar (active page: 'deposit')
  App.injectBottomBar('deposit');
});
