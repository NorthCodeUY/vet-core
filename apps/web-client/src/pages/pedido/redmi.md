┌─────────────────────────┐
                       │  isExpanded = false/true │ (El Interruptor)
                       └────────────┬────────────┘
             ┌──────────────────────┴──────────────────────┐
             ▼                                             ▼
   ESTADO CERRADO (false)                        ESTADO ABIERTO (true)
   ─────────────────────────────                 ─────────────────────────────
   1. Muestra la Barrita Resumen                 1. Muestra Flechita de repliegue
      (💵 Efectivo | 📍 Dirección)               2. Despliega los 2 sub-componentes:
   2. Oculta el panel grande                        • PaymentSelector (select grande)
                                                    • DeliveryAddressSection (botones)