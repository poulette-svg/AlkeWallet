# Alke Wallet 💸

Hola, este es mi proyecto final para el Módulo 2 del bootcamp. Es el front-end de una billetera digital (tipo fintech) diseñada para ser súper fácil de usar y segura desde la vista del usuario. 

La idea principal de este proyecto fue llevar a la práctica todo lo que aprendimos sobre estructuración web, diseño de interfaces y lógica con JavaScript puro, simulando cómo funcionaría una aplicación real donde los usuarios manejan su dinero.

## ¿Qué puedes hacer aquí?
- **Crear tu cuenta e iniciar sesión**: Sistema básico para entrar a tu perfil de manera segura.
- **Ver tu saldo en tiempo real**: Un dashboard principal con tu dinero disponible y accesos rápidos a las funciones.
- **Depositar dinero**: Simulación para recargar fondos a tu cuenta virtual.
- **Enviar dinero a tus contactos**: Diseñé un buscador inteligente que autocompleta el nombre de a quién le envías para hacerlo más dinámico.
- **Historial de movimientos**: Para no perder detalle de en qué gastas y qué recibes, filtrando por ingresos o egresos.

## ¿Cómo lo construí?
Decidí mantener las cosas simples pero efectivas, usando tecnologías clave sin depender de frameworks pesados para afianzar bien las bases:
- **HTML5 & CSS3**: Para maquetar todo. Usé variables globales (Custom Properties) en CSS para mantener la paleta de colores muy consistente con la temática de las apps financieras.
- **JavaScript (Vanilla)**: Aquí está la magia. Para simular la base de datos usé `LocalStorage`, así la app realmente guarda tus depósitos, transferencias, contactos y saldo mientras navegas o recargas la página.
- **Bootstrap 5**: Me apoyé bastante en sus modales, alertas y grillas para agilizar el diseño responsivo.
- **jQuery**: Lo utilicé puntualmente para ciertas animaciones sutiles, manejar el DOM más rápido y hacer funcionar el autocompletado de contactos en tiempo real.

## Vistas del proyecto
<img width="1919" height="944" alt="image" src="https://github.com/user-attachments/assets/06c2387b-aa0d-418c-8664-2ca64d80fab8" />
<img width="1917" height="944" alt="image" src="https://github.com/user-attachments/assets/7f586a46-bc1d-4b90-ace2-03b2d138f9bb" />
<img width="1917" height="944" alt="image" src="https://github.com/user-attachments/assets/6e2ebd86-c38a-463f-b3b1-21318d674121" />
<img width="398" height="857" alt="image" src="https://github.com/user-attachments/assets/a06834bd-c310-4555-aa8b-401520c24dad" />
<img width="398" height="856" alt="image" src="https://github.com/user-attachments/assets/d737f5c6-85bc-4031-9c2a-bca0e8df9d9e" />








- Login / Registro
- Dashboard principal
- Pantalla de depósito
- Pantalla de transferencias
- Historial completo

## Si quieres probarlo en tu compu:
1. Clona el repo: `git clone https://github.com/poulette-svg/AlkeWallet.git`
2. Abre la carpeta en VS Code y lanza el archivo `index.html` con la extensión Live Server.
3. Puedes crearte una cuenta nueva ahí mismo o usar esta de prueba que dejé preconfigurada:
   - Correo: `test@alke.com`
   - Clave: `123456`

## Cosas que me gustaría agregar a futuro
El proyecto cumple su objetivo, pero me quedé con ganas de implementar un par de ideas que seguro haré más adelante:
- Una vista dedicada específicamente para el "Retiro" de dinero (la lógica base ya la dejé lista en el código JS, solo falta armar la interfaz visual).
- Conectar todo esto a un Backend de verdad con una base de datos real.
- Modo oscuro. Ya dejé las bases listas con variables en CSS, solo sería armar el switch.

