/**
 * Send Money Logic (sendmoney.html).
 * Autocomplete searches, dynamic modal confirmations, contacts manager.
 */

$(document).ready(() => {
  const user = App.currentUser;
  if (!user) return; // Auth checks handle redirects

  const updateBalanceDisplay = () => {
    $('#current-balance-display').text(App.formatCurrency(user.balance));
  };
  updateBalanceDisplay();

  let selectedRecipient = null;
  const sendConfirmModal = new bootstrap.Modal(document.getElementById('modal-confirm-send'));
  const addContactModal = new bootstrap.Modal(document.getElementById('modal-add-contact'));

  $('#btn-open-add-contact').on('click', (e) => {
    e.preventDefault();
    $('#form-add-contact')[0].reset();
    $('.invalid-feedback').text('').hide();
    $('.aw-input').removeClass('is-invalid');
    addContactModal.show();
  });

  // Lógica de autocompletado: filtra contactos en tiempo real mientras el usuario escribe
  $('#contact-search').on('input', function() {
    const query = $(this).val().toLowerCase().trim();
    const resultsBox = $('#autocomplete-results');
    resultsBox.empty().hide();

    if (query.length < 1) return;


    const contacts = WalletStorage.getContacts();
    
    // Filter matches
    const matches = contacts.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.email.toLowerCase().includes(query)
    );

    if (matches.length > 0) {
      const html = matches.map(c => `
        <div class="aw-autocomplete-item" data-id="${c.id}" data-name="${c.name}" data-email="${c.email}" data-alias="${c.alias}">
          <span class="name">${c.name}</span>
          <span class="email">${c.email} • ${c.alias}</span>
        </div>
      `).join('');

      resultsBox.html(html).show();
    }
  });

  // Select contact from autocomplete results
  $(document).on('click', '.aw-autocomplete-item', function() {
    const id = $(this).data('id');
    const name = $(this).data('name');
    const email = $(this).data('email');
    const alias = $(this).data('alias');

    selectRecipient({ id, name, email, alias });
  });

  // Select recipient helper
  const selectRecipient = (recipient) => {
    selectedRecipient = recipient;
    
    // Fill in view details
    $('#recipient-name-display').text(recipient.name);
    $('#recipient-email-display').text(recipient.email);
    $('#recipient-alias-display').text(recipient.alias);

    // Hide input, show details card
    $('#contact-search').closest('.aw-input-group').hide();
    $('#recipient-details-box').removeClass('d-none').show();
    $('#autocomplete-results').hide().empty();
    $('#contact-search').val('');
  };

  // Clear selected recipient
  $('#btn-clear-recipient').on('click', () => {
    selectedRecipient = null;
    $('#recipient-details-box').hide().addClass('d-none');
    $('#contact-search').closest('.aw-input-group').fadeIn(200);
  });

  // Close autocomplete list if clicked outside
  $(document).on('click', (e) => {
    if (!$(e.target).closest('.aw-input-group').length) {
      $('#autocomplete-results').hide();
    }
  });

  // Helper to validate email format
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validación de la transferencia
  $('#form-send').on('submit', (e) => {
    e.preventDefault();
    $('#contact-search-error').text('').hide();
    $('#contact-search').removeClass('is-invalid');
    $('#send-amount-error').text('').hide();
    $('#send-amount').removeClass('is-invalid');

    const amountStr = $('#send-amount').val();
    const amount = parseInt(amountStr, 10);
    const searchVal = $('#contact-search').val().trim();

    // Check if recipient is selected
    if (!selectedRecipient) {
      // Allow raw input if they entered a valid email directly
      if (searchVal && isValidEmail(searchVal)) {
        selectedRecipient = {
          name: searchVal,
          email: searchVal,
          alias: 'Destinatario Externo'
        };
      } else {
        $('#contact-search-error').text('Debes buscar y seleccionar un contacto o ingresar un correo electrónico válido.').show();
        $('#contact-search').addClass('is-invalid');
        return;
      }
    }

    // Validate amount
    if (!amountStr || isNaN(amount) || amount <= 0) {
      $('#send-amount-error').text('Ingresa un monto válido mayor a 0.').show();
      $('#send-amount').addClass('is-invalid');
      return;
    }

    if (amount > user.balance) {
      $('#send-amount-error').text('Saldo insuficiente para realizar esta transferencia.').show();
      $('#send-amount').addClass('is-invalid');
      return;
    }

    // Prepare confirmation modal
    $('#modal-recipient-name').text(selectedRecipient.name);
    $('#modal-recipient-email').text(selectedRecipient.email);
    $('#modal-send-total').text(App.formatCurrency(amount));

    // Show Confirmation Modal
    sendConfirmModal.show();
  });

  // Confirm sending money
  $('#btn-confirm-send-submit').on('click', () => {
    sendConfirmModal.hide();

    try {
      // Execute in storage layer
      WalletStorage.sendMoney(selectedRecipient.email, parseInt($('#send-amount').val(), 10));

      // Reset Form
      $('#form-send')[0].reset();
      $('#btn-clear-recipient').click(); // Clear selections

      // Sync active user balance
      const updatedUser = WalletStorage.getCurrentUser();
      user.balance = updatedUser.balance;
      updateBalanceDisplay();

      // Toast feedback
      App.showToast('¡Transferencia realizada con éxito!', 'success');

      // Redirect
      setTimeout(() => {
        window.location.href = 'menu.html';
      }, 1500);

    } catch (err) {
      App.showToast(err.message, 'danger');
    }
  });

  // Creación de un nuevo contacto de manera rápida
  $('#form-add-contact').on('submit', (e) => {
    e.preventDefault();
    $('.invalid-feedback').text('').hide();
    $('.aw-input').removeClass('is-invalid');

    const name = $('#contact-name').val().trim();
    const email = $('#contact-email').val().trim();
    const alias = $('#contact-alias').val().trim();
    let hasError = false;

    if (!name) {
      $('#contact-name-error').text('El nombre es obligatorio.').show();
      $('#contact-name').addClass('is-invalid');
      hasError = true;
    }

    if (!email) {
      $('#contact-email-error').text('El correo es obligatorio.').show();
      $('#contact-email').addClass('is-invalid');
      hasError = true;
    } else if (!isValidEmail(email)) {
      $('#contact-email-error').text('Ingresa un correo válido.').show();
      $('#contact-email').addClass('is-invalid');
      hasError = true;
    }

    if (!alias) {
      $('#contact-alias-error').text('El alias es obligatorio.').show();
      $('#contact-alias').addClass('is-invalid');
      hasError = true;
    }

    if (hasError) return;

    try {
      // Create contact
      const contact = WalletStorage.addContact(name, email, alias);
      
      // Auto select contact for current transaction
      selectRecipient(contact);
      
      addContactModal.hide();
      App.showToast('Contacto guardado con éxito.', 'success');
    } catch (err) {
      App.showToast(err.message, 'danger');
      $('#contact-email').addClass('is-invalid');
      $('#contact-email-error').text(err.message).show();
    }
  });

  App.injectBottomBar('send');
});
