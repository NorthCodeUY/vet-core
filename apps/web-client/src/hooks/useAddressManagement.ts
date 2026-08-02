// apps/web-client/src/hooks/useAddressManagement.ts

import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Interfaz para representar una dirección guardada por el usuario.
 */
export interface UserAddress {
  id: string;         // Identificador único para cada dirección
  label: string;      // Etiqueta descriptiva (ej. "Casa", "Trabajo", "Mamá")
  addressLine: string; // Línea completa de la dirección (ej. "Av. Italia 1543, Montevideo")
  isDefault: boolean; // Indica si esta es la dirección predeterminada
  // Aquí se podrían agregar campos adicionales para futura integración con Google Maps
  // ejemplo: latitude?: number; longitude?: number; placeId?: string;
}

/**
 * Clave para almacenar las direcciones en localStorage.
 */
const STORAGE_KEY = 'veteUserAddresses';

/**
 * Hook personalizado para la gestión de direcciones de entrega del usuario.
 * Proporciona funcionalidad para añadir, editar, eliminar y seleccionar direcciones,
 * con persistencia en localStorage. Está preparado para futura integración con APIs de mapas.
 *
 * @returns {object} Un objeto con:
 *   - addresses: Lista de direcciones del usuario.
 *   - selectedAddress: La dirección actualmente seleccionada para el pedido.
 *   - addAddress: Función para agregar una nueva dirección.
 *   - updateAddress: Función para modificar una dirección existente.
 *   - deleteAddress: Función para eliminar una dirección.
 *   - selectAddress: Función para seleccionar una dirección como la actual para el pedido.
 *   - setDefaultAddress: Función para establecer una dirección como predeterminada.
 *   - isAddressListOpen: Estado para controlar la visibilidad del historial.
 *   - setIsAddressListOpen: Setter para el estado de visibilidad del historial.
 *   - toggleAddressList: Función para alternar la visibilidad del historial.
 */
export const useAddressManagement = () => {
  /* Estado reactivo para la lista de direcciones del usuario */
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  /* Estado reactivo para controlar la visibilidad del historial de direcciones */
  const [isAddressListOpen, setIsAddressListOpen] = useState(false);

  /**
   * Carga las direcciones guardadas desde localStorage al inicializar el hook.
   */
  useEffect(() => {
    try {
      const storedAddresses = localStorage.getItem(STORAGE_KEY);
      if (storedAddresses) {
        setAddresses(JSON.parse(storedAddresses));
      }
    } catch (error) {
      console.error("Error al cargar direcciones de localStorage:", error);
    }
  }, []);

  /**
   * Persiste las direcciones en localStorage cada vez que el estado 'addresses' cambia.
   */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    } catch (error) {
      console.error("Error al guardar direcciones en localStorage:", error);
    }
  }, [addresses]);

  /**
   * Dirección actualmente seleccionada para el pedido (la marcada como default, o la primera si no hay default).
   */
  const selectedAddress = useMemo(() => {
    const defaultAddr = addresses.find(addr => addr.isDefault);
    return defaultAddr || addresses[0] || null;
  }, [addresses]);

  /**
   * Agrega una nueva dirección a la lista.
   * La nueva dirección no es predeterminada por defecto; se espera que setDefaultAddress sea llamado después.
   *
   * @param {string} addressLine - La línea de dirección a guardar.
   * @param {string} [label] - Etiqueta opcional para la dirección.
   * @returns {string} El ID de la dirección recién agregada.
   */
  const addAddress = useCallback((addressLine: string, label?: string): string => {
    if (!addressLine.trim()) {
      throw new Error('La línea de dirección no puede estar vacía.');
    }
    const newId = `addr-${Date.now()}`;
    const newAddress: UserAddress = {
      id: newId,
      label: label || addressLine, // Usa la dirección como etiqueta si no se proporciona una
      addressLine,
      isDefault: false, // Por defecto, no es predeterminada; el llamador debe establecerla como tal.
    };
    setAddresses(prev => [...prev, newAddress]);
    return newId;
  }, []);

  /**
   * Actualiza una dirección existente.
   *
   * @param {string} id - ID de la dirección a actualizar.
   * @param {Partial<Omit<UserAddress, 'id'>>} updates - Objeto con los campos a modificar.
   */
  const updateAddress = useCallback((id: string, updates: Partial<Omit<UserAddress, 'id'>>) => {
    setAddresses(prev =>
      prev.map(addr =>
        addr.id === id ? { ...addr, ...updates } : addr
      )
    );
  }, []);

  /**
   * Elimina una dirección por su ID.
   * Si la dirección eliminada era la predeterminada, selecciona una nueva predeterminada si existe.
   *
   * @param {string} id - ID de la dirección a eliminar.
   */
  const deleteAddress = useCallback((id: string) => {
    setAddresses(prev => {
      const deletedWasDefault = prev.find(addr => addr.id === id)?.isDefault;
      const updatedAddresses = prev.filter(addr => addr.id !== id);

      // Si la dirección eliminada era la predeterminada y aún quedan direcciones,
      // establecer la primera dirección restante como predeterminada.
      if (deletedWasDefault && updatedAddresses.length > 0) {
        return updatedAddresses.map((addr, index) =>
          index === 0 ? { ...addr, isDefault: true } : { ...addr, isDefault: false }
        );
      }
      return updatedAddresses;
    });
  }, []);

  /**
   * Establece una dirección como la predeterminada. Desactiva el 'isDefault' de las demás.
   *
   * @param {string} id - ID de la dirección a establecer como predeterminada.
   */
  const setDefaultAddress = useCallback((id: string) => {
    setAddresses(prev =>
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  }, []);

  /**
   * Selecciona una dirección para el pedido actual (que es siempre la predeterminada en este modelo).
   *
   * @param {string} id - ID de la dirección a seleccionar.
   */
  const selectAddress = useCallback((id: string) => {
    setDefaultAddress(id); // En este modelo, seleccionar es lo mismo que establecer como predeterminada.
    setIsAddressListOpen(false); // Cierra el selector al seleccionar
  }, [setDefaultAddress]);

  /**
   * Alterna la visibilidad de la lista de direcciones guardadas.
   */
  const toggleAddressList = useCallback(() => {
    setIsAddressListOpen(prev => !prev);
  }, []);

  return {
    addresses,
    selectedAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    selectAddress,
    setDefaultAddress,
    isAddressListOpen,
    setIsAddressListOpen, // <-- Expuesto el setter
    toggleAddressList,
  };
};