/**
 * Authentication Logic for login.html.
 * Handles validation, UI toggles, and interaction with WalletStorage.
 */

$(document).ready(() => {
  // Views toggle triggers
  $('#toggle-register').on('click', (e) => {
    e.preventDefault();
    $('#login-view').fadeOut(200, () => {
      $('#register-view').fadeIn(200);
      clearValidationErrors();
    });
  });

  $('#toggle-login').on('click', (e) => {
    e.preventDefault();
    $('#register-view').fadeOut(200, () => {
      $('#login-view').fadeIn(200);
      clearValidationErrors();
    });
  });

  // Clear all validation errors
  const clearValidationErrors = () => {
    $('.invalid-feedback').text('').hide();
    $('.aw-input').removeClass('is-invalid');
  };

  // Helper to validate email format
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Handle Login Submit
  $('#form-login').on('submit', (e) => {
    e.preventDefault();
    clearValidationErrors();

    const email = $('#login-email').val().trim();
    const password = $('#login-password').val();
    let hasError = false;

    // Validate email
    if (!email) {
      $('#login-email-error').text('El correo electrónico es obligatorio.').show();
      $('#login-email').addClass('is-invalid');
      hasError = true;
    } else if (!isValidEmail(email)) {
      $('#login-email-error').text('Ingresa un correo electrónico válido.').show();
      $('#login-email').addClass('is-invalid');
      hasError = true;
    }

    // Validate password
    if (!password) {
      $('#login-password-error').text('La contraseña es obligatoria.').show();
      $('#login-password').addClass('is-invalid');
      hasError = true;
    }

    if (hasError) return;

    // Execute login in storage layer
    const user = WalletStorage.login(email, password);

    if (user) {
      App.showToast(`¡Hola de nuevo, ${user.name}! Iniciando sesión...`, 'success');
      setTimeout(() => {
        window.location.href = 'menu.html';
      }, 1500);
    } else {
      App.showToast('Credenciales incorrectas. Inténtalo de nuevo.', 'danger');
      $('#login-password').addClass('is-invalid');
    }
  });

  // Handle Register Submit
  $('#form-register').on('submit', (e) => {
    e.preventDefault();
    clearValidationErrors();

    const name = $('#register-name').val().trim();
    const email = $('#register-email').val().trim();
    const password = $('#register-password').val();
    let hasError = false;

    // Validate name
    if (!name) {
      $('#register-name-error').text('El nombre es obligatorio.').show();
      $('#register-name').addClass('is-invalid');
      hasError = true;
    }

    // Validate email
    if (!email) {
      $('#register-email-error').text('El correo electrónico es obligatorio.').show();
      $('#register-email').addClass('is-invalid');
      hasError = true;
    } else if (!isValidEmail(email)) {
      $('#register-email-error').text('Ingresa un correo electrónico válido.').show();
      $('#register-email').addClass('is-invalid');
      hasError = true;
    }

    // Validate password
    if (!password) {
      $('#register-password-error').text('La contraseña es obligatoria.').show();
      $('#register-password').addClass('is-invalid');
      hasError = true;
    } else if (password.length < 6) {
      $('#register-password-error').text('La contraseña debe tener al menos 6 caracteres.').show();
      $('#register-password').addClass('is-invalid');
      hasError = true;
    }

    if (hasError) return;

    try {
      // Execute registration in storage layer
      const newUser = WalletStorage.register(name, email, password);
      App.showToast('¡Registro exitoso! Recibiste un regalo de bienvenida.', 'success');
      setTimeout(() => {
        window.location.href = 'menu.html';
      }, 1500);
    } catch (error) {
      App.showToast(error.message, 'danger');
      $('#register-email').addClass('is-invalid');
      $('#register-email-error').text(error.message).show();
    }
  });
});
