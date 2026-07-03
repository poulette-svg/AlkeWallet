# Alke Wallet 💼

Alke Wallet es el Front-end de una billetera digital (fintech) desarrollada para permitir a los usuarios gestionar sus activos financieros de manera segura, rápida y conveniente. El proyecto resuelve la necesidad de brindar una interfaz intuitiva para administrar fondos digitales, realizar envíos de dinero y visualizar el historial de movimientos.

## 🚀 Características y Funcionalidades

- **Registro e Inicio de Sesión**: Los usuarios pueden crear una cuenta y acceder de manera segura.
- **Dashboard Resumen**: Vista rápida del saldo actual y acceso a funcionalidades principales.
- **Gestión de Fondos**: Interfaz para simular depósitos inmediatos a la cuenta.
- **Transferencias Dinámicas**: Envío de dinero a otros contactos con búsqueda inteligente y autocompletado de destinatarios.
- **Historial de Transacciones**: Registro completo de ingresos y egresos con filtros dinámicos.

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Semántica y estructura robusta.
- **CSS3 (Custom Properties)**: Paleta de colores, diseño responsive adaptado a estilo fintech y variables globales.
- **JavaScript (Vanilla)**: Lógica de negocio (simulación de base de datos con LocalStorage), validaciones de formularios y manejo de estado.
- **Bootstrap 5**: Sistema de grillas, modales, alertas y componentes responsivos para acelerar la maquetación.
- **jQuery**: Manipulación eficiente del DOM, efectos visuales y autocompletado de contactos.
- **Font Awesome**: Íconos de alta calidad para mejorar la UI.

## 📸 Vistas de la Aplicación

*(Coloca aquí las imágenes de tu proyecto sustituyendo las URLs o rutas de ejemplo)*

1. **Pantalla de Login**
   ![Login](ruta/a/tu/imagen-login.png)
2. **Menú Principal (Dashboard)**
   ![Dashboard](ruta/a/tu/imagen-menu.png)
3. **Depósitos**
   ![Depósito](ruta/a/tu/imagen-deposito.png)
4. **Envío de Dinero (con Autocompletado)**
   ![Envío de Dinero](ruta/a/tu/imagen-envio.png)
5. **Historial de Transacciones**
   ![Historial](ruta/a/tu/imagen-transacciones.png)

## 💻 Instrucciones para correr el proyecto localmente

1. Clona este repositorio en tu máquina local:
   ```bash
   git clone https://github.com/tu-usuario/alke-wallet.git
   ```
2. Ingresa al directorio del proyecto:
   ```bash
   cd alke-wallet
   ```
3. No es necesario instalar dependencias de Node, ya que utiliza CDN para Bootstrap y jQuery.
4. Puedes usar una extensión como **Live Server** en Visual Studio Code o simplemente abrir el archivo `index.html` en tu navegador preferido.
5. El sistema viene con cuentas precargadas de prueba:
   - **Email:** `test@alke.com` / **Contraseña:** `123456`
   - **Email:** `maria@gmail.com` / **Contraseña:** `123456`

## 🔮 Aprendizajes y Mejoras Futuras

- **Implementación de Pantalla de Retiros**: Añadir una vista visual específica (`withdraw.html`) para complementar el ciclo financiero, aunque la lógica base para descontar saldo ya está lista en el código.
- **Integración con Back-End**: Cambiar la persistencia de datos (actualmente en `LocalStorage`) por una API REST real con base de datos.
- **Seguridad y JWT**: Añadir autenticación por tokens (JSON Web Tokens) para mejorar la seguridad en sesiones concurrentes.
- **Modo Oscuro**: Implementar un toggle para diseño "Dark Mode", aprovechando las variables nativas de CSS que ya están configuradas.

---
*Desarrollado como parte del Módulo 2 de Desarrollo Front-end.*
