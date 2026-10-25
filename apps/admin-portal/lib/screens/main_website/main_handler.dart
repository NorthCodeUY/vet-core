// Importación del framework fundamental de interfaz gráfica de Flutter
import 'package:flutter/material.dart';

// Inyección de dependencias reactiva mediante el patrón Provider
import 'package:provider/provider.dart';

// <!> RESOLUCIÓN DE IMPORTS: Vinculación con el nuevo paquete 'admin_portal'
import 'package:admin_portal/core/theme/app_colors.dart';
import 'package:admin_portal/screens/login/login_handler.dart';
import 'package:admin_portal/services/api_service.dart';

// Vistas secundarias y controladores de pantalla del portal
import '../add_clients/add_clients.dart';
import '../clients/clients_handler.dart';
import '../clients/clients_screen.dart';
import '../deposits/deposits_screen.dart';
import '../payments/payments_handler.dart';
import '../payments/payments_screen.dart';
import 'notification_modal.dart';

/// Contenedor Principal (Shell / Dashboard Master Layout).
///
/// Este componente actúa como el núcleo visual de la aplicación web/desktop.
/// Implementa una arquitectura dividida en dos ejes:
/// 1. Eje Superior: Barra de navegación fija (TopBar) con acciones globales.
/// 2. Eje Inferior: Menú lateral persistente (Sidebar) y área de contenido dinámico.
///
/// Utiliza un [StatefulWidget] debido a que el árbol de vistas secundario
/// muta en memoria sin necesidad de destruir el layout contenedor.
class MainHandler extends StatefulWidget {
  /// Constructor constante para optimizar el árbol de widgets en compilación.
  const MainHandler({super.key});

  @override
  State<MainHandler> createState() => _MainHandlerState();
}

/// Estado mutable asociado al layout [MainHandler].
///
/// Coordina la vista hija activa, el título dinámico y la sincronización
/// visual del botón seleccionado en la barra lateral.
class _MainHandlerState extends State<MainHandler> {
  // Widget que se renderiza actualmente en el área de trabajo central
  Widget _currentChild = const Center(
    child: Text('Bienvenido al Portal Administrativo'),
  );

  // Título textual dinámico que se refleja en la TopBar superior
  String _currentTitle = 'Panel de Control';

  // Mapa de banderas booleanas para gestionar el estado de selección única (Mutex)
  final Map<String, bool> _selectedMenuItem = {
    'Clientes': false,
    'Agregar Cliente': false,
    'Pagos': false,
    'Depósito': false,
  };

  // Instancia única del servicio HTTP para interactuar con la API REST de FastAPI
  final ApiService _apiService = ApiService();

  /// Actualiza la pantalla montada en el área de trabajo principal.
  ///
  /// * [newContent]: El widget que reemplazará el contenido actual.
  /// * [title]: El texto que se reflejará en la barra superior.
  /// * [menuItemKey]: La clave del menú lateral que debe quedar activa.
  void _changeContent(Widget newContent, String title, String menuItemKey) {
    // Notifica al framework que el estado interno ha mutado para redibujar la UI
    setState(() {
      // Reemplaza el widget hijo renderizado en pantalla
      _currentChild = newContent;
      // Actualiza el título visible en la barra superior
      _currentTitle = title;
      // Actualiza visualmente qué botón del menú lateral está activo
      _updateButtonSelection(menuItemKey);
    });
  }

  /// Garantiza la exclusión mutua en los botones de navegación del menú.
  ///
  /// Pone todos los ítems en `false` y activa únicamente el elemento coincidente.
  void _updateButtonSelection(String selectedKey) {
    // Desactiva la selección de todos los elementos registrados
    _selectedMenuItem.updateAll((key, value) => false);
    // Si la clave existe en el mapa, la establece como seleccionada
    if (_selectedMenuItem.containsKey(selectedKey)) {
      _selectedMenuItem[selectedKey] = true;
    }
  }

  /// Cierra la sesión activa del usuario y revoca sus credenciales en FastAPI.
  ///
  /// Elimina por completo la pila de navegación previa para evitar que el
  /// usuario regrese al presionar el botón "Atrás" del sistema.
  Future<void> _logout() async {
    // Petición asíncrona al backend para invalidar tokens en el silo activo
    await _apiService.logout();

    // Verificación de resiliencia: Si el widget fue desmontado durante el await, se aborta
    if (!mounted) return;

    // Destruye toda la pila de navegación y posiciona el Login en la raíz
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (context) => const LoginHandler()),
      // El predicado 'false' asegura la eliminación total de rutas anteriores
      (Route<dynamic> route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    // <!> ZERO HARDCODING: Extracción directa de tokens semánticos del tema activo
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      // Estructura vertical global (TopBar arriba, Contenido debajo)
      body: Column(
        children: [
          // ==========================================
          // 1. BARRA SUPERIOR FIJA (TOPBAR)
          // ==========================================
          Container(
            height: 60, // Altura estándar para paneles administrativos
            color: colorScheme.primary, // Color institucional inyectado en runtime
            padding: const EdgeInsets.symmetric(horizontal: 20), // Margen interno horizontal
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween, // Distribuye a los extremos
              children: [
                // Título dinámico del módulo en foco
                Text(
                  _currentTitle,
                  style: theme.textTheme.titleMedium?.copyWith(
                    color: colorScheme.onPrimary, // Contraste automático según el tema
                    fontWeight: FontWeight.bold,
                  ),
                ),
                // Botones de acción rápida en la cabecera
                Row(
                  children: [
                    // Botón para desplegar el modal de notificaciones
                    IconButton(
                      tooltip: 'Notificaciones',
                      icon: Icon(
                        Icons.notifications_outlined,
                        color: colorScheme.onPrimary,
                      ),
                      onPressed: () {
                        // Despliega el diálogo modal de notificaciones
                        showDialog(
                          context: context,
                          builder: (context) => NotificationModal(),
                        );
                      },
                    ),
                    const SizedBox(width: 8), // Separador entre iconos
                    // Botón de menú contextual adicional
                    IconButton(
                      tooltip: 'Opciones del sistema',
                      icon: Icon(
                        Icons.more_vert,
                        color: colorScheme.onPrimary,
                      ),
                      onPressed: () {},
                    ),
                  ],
                ),
              ],
            ),
          ),

          // ==========================================
          // 2. CUERPO DIVIDIDO (SIDEBAR + WORKSPACE)
          // ==========================================
          Expanded(
            // Ocupa todo el alto vertical restante bajo la TopBar
            child: Row(
              children: [
                // ----------------------------------------
                // 2.1 MENÚ LATERAL (SIDEBAR DRAWER)
                // ----------------------------------------
                Container(
                  width: 260, // Ancho fijo óptimo para legibilidad en escritorio
                  color: colorScheme.surfaceContainerHighest, // Superficie neutral suave
                  child: Column(
                    children: [
                      const SizedBox(height: 24), // Espaciador superior

                      // Avatar del usuario actual
                      CircleAvatar(
                        radius: 36, // Radio de 72px de diámetro
                        backgroundColor: colorScheme.primaryContainer, // Tono suave de marca
                        child: Icon(
                          Icons.person,
                          size: 40,
                          color: colorScheme.onPrimaryContainer,
                        ),
                      ),
                      const SizedBox(height: 12),

                      // <!> DATO DINÁMICO: Placeholder tipado (libre de nombres quemados)
                      Text(
                        'Administrador',
                        style: theme.textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Línea divisoria sutil
                      const Divider(indent: 16, endIndent: 16),

                      // Botón: Módulo Clientes
                      // Inyecta el controlador ClientsHandler mediante ChangeNotifierProvider
                      _buildMenuButton(
                        title: 'Clientes',
                        icon: Icons.people_outline,
                        isSelected: _selectedMenuItem['Clientes'] ?? false,
                        onPressed: () {
                          _changeContent(
                            ChangeNotifierProvider(
                              // Crea el manejador pasando el servicio de conexión
                              create: (_) => ClientsHandler(_apiService),
                              child: const ClientsScreen(),
                            ),
                            'Gestión de Clientes',
                            'Clientes',
                          );
                        },
                      ),

                      // Botón: Módulo Registro de Cliente
                      _buildMenuButton(
                        title: 'Agregar Cliente',
                        icon: Icons.person_add_outlined,
                        isSelected: _selectedMenuItem['Agregar Cliente'] ?? false,
                        onPressed: () {
                          _changeContent(
                            AgregarClientesContent(),
                            'Nuevo Cliente',
                            'Agregar Cliente',
                          );
                        },
                      ),

                      // Botón: Módulo Pagos
                      // <!> CORRECCIÓN CONSTRUCTOR: PaymentsHandler instanciado sin argumentos
                      _buildMenuButton(
                        title: 'Pagos',
                        icon: Icons.payments_outlined,
                        isSelected: _selectedMenuItem['Pagos'] ?? false,
                        onPressed: () {
                          _changeContent(
                            ChangeNotifierProvider(
                              // Instancia limpia sin dependencias innecesarias en constructor
                              create: (_) => PaymentsHandler(),
                              child: const PaymentsScreen(),
                            ),
                            'Registro de Pagos',
                            'Pagos',
                          );
                        },
                      ),

                      // Botón: Módulo Depósitos
                      _buildMenuButton(
                        title: 'Depósito',
                        icon: Icons.account_balance_outlined,
                        isSelected: _selectedMenuItem['Depósito'] ?? false,
                        onPressed: () {
                          _changeContent(
                            DepositsScreen(),
                            'Depósitos Fiscales',
                            'Depósito',
                          );
                        },
                      ),

                      // Empuja el botón de salida hacia la parte inferior del menú
                      const Spacer(),

                      // Línea divisoria antes del botón destructivo
                      const Divider(indent: 16, endIndent: 16),

                      // Botón: Cierre de Sesión (Acción Destructiva / Logout)
                      _buildMenuButton(
                        title: 'Cerrar Sesión',
                        icon: Icons.logout,
                        isDestructive: true, // Aplica estilos semánticos de alerta/error
                        onPressed: _logout, // Dispara la invalidación de credenciales
                      ),
                      const SizedBox(height: 16), // Margen de seguridad inferior
                    ],
                  ),
                ),

                // ----------------------------------------
                // 2.2 ÁREA DE CONTENIDO (WORKSPACE)
                // ----------------------------------------
                Expanded(
                  // Consume todo el ancho horizontal disponible a la derecha
                  child: Container(
                    color: colorScheme.surface, // Fondo base limpio
                    padding: const EdgeInsets.all(24), // Margen interno de respiración
                    child: _currentChild, // Renderiza la pantalla seleccionada
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// Construye de forma reutilizable cada botón interactivo del menú lateral.
  ///
  /// * [title]: Texto visible de la opción.
  /// * [icon]: Icono representativo del módulo.
  /// * [onPressed]: Callback disparado al hacer clic.
  /// * [isSelected]: Indica si la pestaña se encuentra activa actualmente.
  /// * [isDestructive]: Aplica colores de advertencia (usado en Logout).
  Widget _buildMenuButton({
    required String title,
    required IconData icon,
    required VoidCallback onPressed,
    bool isSelected = false,
    bool isDestructive = false,
  }) {
    // Extracción contextual de colores y estilos tipográficos
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    // Variables de estilo contextual resueltas dinámicamente
    Color backgroundColor;
    Color foregroundColor;

    // <!> EVALUACIÓN SEMÁNTICA DE COLORES MATERIAL 3: Cero valores quemados
    if (isDestructive) {
      // Estado destructivo (Logout): Fondo suave de error y texto rojo semántico
      backgroundColor = colorScheme.errorContainer.withOpacity(0.4);
      foregroundColor = colorScheme.error;
    } else if (isSelected) {
      // Estado activo/seleccionado: Fondo primario corporativo y texto en contraste
      backgroundColor = colorScheme.primary;
      foregroundColor = colorScheme.onPrimary;
    } else {
      // Estado inactivo en reposo: Fondo transparente e icono/texto neutro
      backgroundColor = Colors.transparent;
      foregroundColor = colorScheme.onSurfaceVariant;
    }

    return Padding(
      // Margen exterior vertical y horizontal para separar los botones entre sí
      padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 12),
      child: SizedBox(
        width: double.infinity, // Ocupa todo el ancho interior del Sidebar
        height: 48, // Altura táctil ergonómica estándar
        child: TextButton.icon(
          style: TextButton.styleFrom(
            alignment: Alignment.centerLeft, // Alineación del contenido hacia la izquierda
            backgroundColor: backgroundColor, // Color de fondo calculado dinámicamente
            foregroundColor: foregroundColor, // Color de splash y feedback táctil
            padding: const EdgeInsets.symmetric(horizontal: 16), // Margen interno
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10), // Esquinas redondeadas suaves
            ),
          ),
          onPressed: onPressed, // Ejecución del callback provisto
          icon: Icon(
            icon,
            size: 22,
            color: foregroundColor, // Asegura que el icono coincida con el texto
          ),
          label: Text(
            title,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: foregroundColor,
              // Negrita si está seleccionado, regular si está inactivo
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ),
      ),
    );
  }
}