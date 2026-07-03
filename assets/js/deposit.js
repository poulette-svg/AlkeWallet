/**
 * Deposit Logic (deposit.html).
 * Form validations, Modal confirmations, WalletStorage transactions.
 */

$(document).ready(() => {
  const user = App.currentUser;
  if (!user) return; // Auth checking will redirect

  const updateBalanceDisplay = () => {
    $('#current-balance-display').text(App.formatCurrency(user.balance));
  };
  updateBalanceDisplay();

  let depositAmountValue = 0;
  const depositModal = new bootstrap.Modal(document.getElementById('modal-confirm-deposit'));

  // Interceptamos el submit para validar antes de invocar el modal
  $('#form-deposit').on('submit', (e) => {
    e.preventDefault();
    $('#deposit-amount-error').text('').hide();
    $('#deposit-amount').removeClass('is-invalid');

    const amountStr = $('#deposit-amount').val();
    const amount = parseInt(amountStr, 10);

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

    depositAmountValue = amount;
    $('#modal-total-display').text(App.formatCurrency(amount));

    depositModal.show();
  });

  // Una vez que el usuario confirma, aplicamos el impacto en el Storage
  $('#btn-confirm-submit').on('click', () => {
    depositModal.hide();

    try {
      const tx = WalletStorage.deposit(depositAmountValue);
      $('#deposit-amount').val('');
      
      // Es vital recargar el usuario desde el storage para reflejar su nuevo saldo real
      const updatedUser = WalletStorage.getCurrentUser();
      user.balance = updatedUser.balance; 
      updateBalanceDisplay();

      App.showToast(`Se depositaron ${App.formatCurrency(depositAmountValue)} correctamente.`, 'success');
      
      setTimeout(() => {
        window.location.href = 'menu.html';
      }, 1500);

    } catch (err) {
      App.showToast(err.message, 'danger');
    }
  });

  // Inyección del menú de navegación inferior
  App.injectBottomBar('deposit');
});
