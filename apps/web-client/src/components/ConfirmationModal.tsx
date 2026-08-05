// apps/web-client/src/components/ConfirmationModal.tsx

import React from 'react';
import { X } from 'lucide-react';

/**
 * Interfaz que define las props del componente ConfirmationModal.
 */
interface ConfirmationModalProps {
  isOpen: boolean;                // Controla la visibilidad del modal.
  onClose: () => void;            // Función para cerrar el modal.
  onConfirm: () => void;          // Función que se ejecuta al confirmar la acción.
  title: string;                  // Título del modal.
  message: string | React.ReactNode; // Mensaje principal del modal (puede ser JSX).
  confirmButtonText: string;      // Texto para el botón de confirmación.
  cancelButtonText?: string;      // Texto opcional para el botón de cancelación (default "Cancelar").
  confirmButtonColor?: 'red' | 'green' | 'blue'; // Color para el botón de confirmación.
  icon?: React.ReactNode;         // Icono opcional a mostrar en el modal.
}

/**
 * Componente de modal de confirmación reusable.
 * Proporciona un diálogo elegante y personalizable para acciones que requieren confirmación,
 * reemplazando el `window.confirm` nativo del navegador.
 *
 * @param {ConfirmationModalProps} props - Propiedades para configurar el modal.
 * @returns {React.FC} Un componente modal.
 */
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText,
  cancelButtonText = 'Cancelar',
  confirmButtonColor = 'red',
  icon,
}) => {
  if (!isOpen) return null;

  /* Clases CSS dinámicas para el botón de confirmación según el color */
  const confirmButtonClasses = {
    red: 'bg-vete-error text-vete-card-white hover:bg-vete-error/90 shadow-red-500/20',
    green: 'bg-vete-tertiary text-vete-card-white hover:bg-vete-tertiary/90 shadow-green-500/20',
    blue: 'bg-vete-primary text-vete-card-white hover:bg-vete-primary/90 shadow-blue-500/20',
  };

  return (
    <>
      {/* Overlay del modal */}
      <div
        className={`
          fixed inset-0 z-[200] bg-vete-overlay/70 backdrop-blur-sm
          transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        aria-hidden={!isOpen}
      />

      {/* Contenido del modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`
          fixed inset-0 z-[210] flex items-center justify-center p-4
          transition-transform ease-out duration-300
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
        `}
      >
        <div className={`
          bg-vete-card-white rounded-2xl shadow-xl max-w-sm w-full p-6
          flex flex-col gap-5
        `}>
          {/* Encabezado del modal */}
          <div className="flex justify-between items-center pb-3 border-b border-vete-light-border">
            <h3 id="modal-title" className="text-xl font-bold text-vete-text-light flex items-center gap-2">
              {icon && <span className="text-vete-text-muted">{icon}</span>}
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-vete-light-border transition-colors focus:outline-none focus:ring-2 focus:ring-vete-primary"
              aria-label="Cerrar modal"
            >
              <X size={20} className="text-vete-text-muted" />
            </button>
          </div>

          {/* Cuerpo del mensaje */}
          <div className="text-vete-text-light text-base leading-relaxed">
            {message}
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-3 border-t border-vete-light-border">
            <button
              onClick={onClose}
              className={`
                px-5 py-2 rounded-xl text-vete-text-muted font-semibold
                hover:bg-vete-light-border transition-colors
                focus:outline-none focus:ring-2 focus:ring-vete-primary
              `}
              aria-label={cancelButtonText}
            >
              {cancelButtonText}
            </button>
            <button
              onClick={onConfirm}
              className={`
                px-5 py-2 rounded-xl font-semibold transition-all
                shadow-md hover:shadow-lg active:scale-98
                focus:outline-none focus:ring-2 focus:ring-vete-primary
                ${confirmButtonClasses[confirmButtonColor]}
              `}
              aria-label={confirmButtonText}
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};