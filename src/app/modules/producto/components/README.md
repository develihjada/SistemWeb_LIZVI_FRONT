# Componentes de Productos

Este directorio contiene los componentes reutilizables para el módulo de productos.

## Modal de Éxito de Actualización (`modal-exito-actualizacion`)

### Descripción
Componente modal reutilizable para mostrar mensajes de éxito cuando se actualiza un producto correctamente.

### Uso

```html
<app-modal-exito-actualizacion 
    [isVisible]="showModal"
    [mensaje]="mensajeDelModal"
    titulo="¡Operación exitosa!"
    textoBoton="Continuar"
    (onConfirmar)="manejarConfirmacion()"
    (onCerrar)="cerrarModal()">
</app-modal-exito-actualizacion>
```

### Propiedades de Entrada (@Input)

- **isVisible** (boolean): Controla si el modal es visible o no
- **mensaje** (string): Mensaje a mostrar en el cuerpo del modal
- **titulo** (string): Título del modal (opcional, por defecto: "¡Actualización exitosa!")
- **textoBoton** (string): Texto del botón principal (opcional, por defecto: "Aceptar")

### Eventos de Salida (@Output)

- **onConfirmar**: Se emite cuando el usuario hace clic en el botón principal
- **onCerrar**: Se emite cuando el usuario hace clic en el botón "Cerrar"

### Ejemplo de Implementación

```typescript
export class MiComponente {
  showModal = false;
  mensajeModal = '';

  mostrarExito(mensaje: string) {
    this.mensajeModal = mensaje;
    this.showModal = true;
  }

  manejarConfirmacion() {
    this.showModal = false;
    // Lógica adicional (navegar, etc.)
  }

  cerrarModal() {
    this.showModal = false;
  }
}
```

### Características

- ✅ Diseño responsive
- ✅ Animaciones suaves de entrada/salida
- ✅ Icono de éxito integrado
- ✅ Dos opciones de botón (principal y secundario)
- ✅ Completamente reutilizable
- ✅ Estilos consistentes con el design system

---

### Notas de Desarrollo

- El componente es standalone y no requiere módulos adicionales
- Utiliza Tailwind CSS para los estilos
- Es compatible con Angular 17+
- Sigue las mejores prácticas de Angular para componentes reutilizables
