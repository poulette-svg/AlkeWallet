/**
 * Data Access Layer (DAL) for Alke Wallet.
 * Only this file directly interacts with localStorage.
 */

const WalletStorage = (() => {
  // Claves para el manejo estructurado del LocalStorage
  const KEYS = {
    USERS: 'aw_users',
    TRANSACTIONS: 'aw_transactions',
    CONTACTS: 'aw_contacts',
    SESSION: 'aw_session_user_id'
  };

  // Helper to read from LocalStorage
  const read = (key, defaultValue = []) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  // Helper to write to LocalStorage
  const write = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // Ignored for now
    }
  };

  // Poblamos el storage con datos iniciales si es la primera vez que se abre la app
  const initSeedData = () => {
    const users = read(KEYS.USERS);
    if (users.length === 0) {
      // Create default user (password is simple "123456")
      const defaultUser = {
        id: 'u-1',
        name: 'Juan Pérez',
        email: 'test@alke.com',
        password: '123456',
        balance: 150000
      };
      
      const secondUser = {
        id: 'u-2',
        name: 'María López',
        email: 'maria@gmail.com',
        password: '123456',
        balance: 75000
      };

      write(KEYS.USERS, [defaultUser, secondUser]);

      // Seed Contacts for Juan Pérez
      const defaultContacts = [
        { id: 'c-1', userId: 'u-1', name: 'María López', email: 'maria@gmail.com', alias: 'maria.lopez.wallet' },
        { id: 'c-2', userId: 'u-1', name: 'Carlos Gómez', email: 'carlos@yahoo.com', alias: 'carlos.gomez.wallet' },
        { id: 'c-3', userId: 'u-1', name: 'Ana Silva', email: 'ana@outlook.com', alias: 'ana.silva.wallet' }
      ];
      write(KEYS.CONTACTS, defaultContacts);

      // Seed Transactions for Juan Pérez
      const defaultTransactions = [
        { id: 't-1', userId: 'u-1', type: 'deposit', amount: 50000, counterpart: 'Cajero Automático', date: '2026-06-25T10:30:00.000Z' },
        { id: 't-2', userId: 'u-1', type: 'send', amount: 20000, counterpart: 'María López', date: '2026-06-26T14:15:00.000Z' },
        { id: 't-3', userId: 'u-1', type: 'receive', amount: 120000, counterpart: 'Carlos Gómez', date: '2026-06-28T09:00:00.000Z' }
      ];
      write(KEYS.TRANSACTIONS, defaultTransactions);
    }
  };

  initSeedData();

  return {
    // Métodos de autenticación
    getCurrentUser: () => {
      const sessionUserId = localStorage.getItem(KEYS.SESSION);
      if (!sessionUserId) return null;
      const users = read(KEYS.USERS);
      return users.find(u => u.id === sessionUserId) || null;
    },

    login: (email, password) => {
      const users = read(KEYS.USERS);
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password);
      if (user) {
        localStorage.setItem(KEYS.SESSION, user.id);
        return user;
      }
      return null;
    },

    logout: () => {
      localStorage.removeItem(KEYS.SESSION);
    },

    register: (name, email, password) => {
      const users = read(KEYS.USERS);
      const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase().trim());
      if (exists) {
        throw new Error('El correo electrónico ya está registrado.');
      }

      const newUser = {
        id: `u-${Date.now()}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password,
        balance: 10000 // Regalo de bienvenida
      };

      users.push(newUser);
      write(KEYS.USERS, users);
      
      // Auto login after registration
      localStorage.setItem(KEYS.SESSION, newUser.id);
      return newUser;
    },

    // Operaciones financieras transaccionales
    deposit: (amount) => {
      const currentUser = WalletStorage.getCurrentUser();
      if (!currentUser) throw new Error('No hay una sesión de usuario activa.');
      if (amount <= 0 || isNaN(amount)) throw new Error('El monto a depositar debe ser mayor a 0.');

      // Update User Balance
      const users = read(KEYS.USERS);
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      users[userIndex].balance += amount;
      write(KEYS.USERS, users);

      // Record Transaction
      const transactions = read(KEYS.TRANSACTIONS);
      const newTransaction = {
        id: `t-${Date.now()}`,
        userId: currentUser.id,
        type: 'deposit',
        amount: amount,
        counterpart: 'Depósito propio',
        date: new Date().toISOString()
      };
      transactions.unshift(newTransaction); // Add to beginning
      write(KEYS.TRANSACTIONS, transactions);

      return newTransaction;
    },

    withdraw: (amount) => {
      const currentUser = WalletStorage.getCurrentUser();
      if (!currentUser) throw new Error('No hay una sesión de usuario activa.');
      if (amount <= 0 || isNaN(amount)) throw new Error('El monto a retirar debe ser mayor a 0.');
      if (currentUser.balance < amount) throw new Error('Saldo insuficiente para realizar el retiro.');

      // Update User Balance
      const users = read(KEYS.USERS);
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      users[userIndex].balance -= amount;
      write(KEYS.USERS, users);

      // Record Transaction
      const transactions = read(KEYS.TRANSACTIONS);
      const newTransaction = {
        id: `t-${Date.now()}`,
        userId: currentUser.id,
        type: 'withdraw',
        amount: amount,
        counterpart: 'Retiro en cajero',
        date: new Date().toISOString()
      };
      transactions.unshift(newTransaction);
      write(KEYS.TRANSACTIONS, transactions);

      return newTransaction;
    },

    sendMoney: (recipientEmail, amount) => {
      const currentUser = WalletStorage.getCurrentUser();
      if (!currentUser) throw new Error('No hay una sesión de usuario activa.');
      if (amount <= 0 || isNaN(amount)) throw new Error('El monto a enviar debe ser mayor a 0.');
      if (currentUser.balance < amount) throw new Error('Saldo insuficiente para completar la transferencia.');
      if (currentUser.email.toLowerCase() === recipientEmail.toLowerCase().trim()) {
        throw new Error('No puedes enviarte dinero a ti mismo.');
      }

      const users = read(KEYS.USERS);
      const senderIndex = users.findIndex(u => u.id === currentUser.id);
      
      // Check if recipient is a registered user in our database
      const recipient = users.find(u => u.email.toLowerCase() === recipientEmail.toLowerCase().trim());
      let recipientName = recipientEmail;

      if (recipient) {
        recipientName = recipient.name;
        // Credit the recipient
        const recipientIndex = users.findIndex(u => u.id === recipient.id);
        users[recipientIndex].balance += amount;
        
        // Record recipient's transaction
        const transactions = read(KEYS.TRANSACTIONS);
        transactions.unshift({
          id: `t-${Date.now()}-rec`,
          userId: recipient.id,
          type: 'receive',
          amount: amount,
          counterpart: currentUser.name,
          date: new Date().toISOString()
        });
        write(KEYS.TRANSACTIONS, transactions);
      } else {
        // Fallback: search in contacts list of current user to get their name
        const contacts = read(KEYS.CONTACTS);
        const contact = contacts.find(c => c.userId === currentUser.id && c.email.toLowerCase() === recipientEmail.toLowerCase().trim());
        if (contact) {
          recipientName = contact.name;
        }
      }

      // Debit the sender
      users[senderIndex].balance -= amount;
      write(KEYS.USERS, users);

      // Record sender's transaction
      const transactions = read(KEYS.TRANSACTIONS);
      const newTransaction = {
        id: `t-${Date.now()}-send`,
        userId: currentUser.id,
        type: 'send',
        amount: amount,
        counterpart: recipientName,
        date: new Date().toISOString()
      };
      transactions.unshift(newTransaction);
      write(KEYS.TRANSACTIONS, transactions);

      return newTransaction;
    },

    // Consultas y listados
    getTransactions: () => {
      const currentUser = WalletStorage.getCurrentUser();
      if (!currentUser) return [];
      const transactions = read(KEYS.TRANSACTIONS);
      return transactions
        .filter(t => t.userId === currentUser.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    getContacts: () => {
      const currentUser = WalletStorage.getCurrentUser();
      if (!currentUser) return [];
      const contacts = read(KEYS.CONTACTS);
      return contacts.filter(c => c.userId === currentUser.id);
    },

    addContact: (name, email, alias) => {
      const currentUser = WalletStorage.getCurrentUser();
      if (!currentUser) throw new Error('No hay una sesión de usuario activa.');
      if (!name || !email || !alias) throw new Error('Todos los campos del contacto son obligatorios.');

      const contacts = read(KEYS.CONTACTS);
      const exists = contacts.some(c => c.userId === currentUser.id && c.email.toLowerCase() === email.toLowerCase().trim());
      if (exists) {
        throw new Error('El contacto con este correo electrónico ya existe.');
      }

      const newContact = {
        id: `c-${Date.now()}`,
        userId: currentUser.id,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        alias: alias.trim()
      };

      contacts.push(newContact);
      write(KEYS.CONTACTS, contacts);
      return newContact;
    }
  };
})();
