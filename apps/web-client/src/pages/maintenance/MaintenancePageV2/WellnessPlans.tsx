import React from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';

interface WellnessPlansProps {
  whatsappUrl: string;
}

export const WellnessPlans: React.FC<WellnessPlansProps> = ({ whatsappUrl }) => {
  const plans = [
    {
      title: 'Plan Básico',
      subtitle: 'Esencial preventivo',
      price: '$380',
      features: [
        '1 Consulta general mensual',
        'Vacunación anual al día',
        'Desparasitación interna trimestral'
      ],
      isPopular: false
    },
    {
      title: 'Plan Senior',
      subtitle: 'Para pacientes dorados',
      price: '$650',
      features: [
        '2 Consultas geriátricas mensuales',
        'Analítica sanguínea semestral',
        'Control cardiológico preventivo'
      ],
      isPopular: false
    },
    {
      title: 'Plan Familiar',
      subtitle: 'Hasta 2 mascotas',
      price: '$660',
      features: [
        'Consultas compartidas ilimitadas (urgencias menor)',
        'Vacunación completa dual',
        '25% off en baños y peluquería'
      ],
      isPopular: false
    },
    {
      title: 'Plan Premium',
      subtitle: 'Cobertura total 360°',
      price: '$1.100',
      features: [
        'Atención veterinaria domiciliaria sin cargo',
        'Chequeos de laboratorio completos trimestrales',
        'Baños sanitarios mensuales incluidos'
      ],
      isPopular: true
    }
  ];

  const referenceValues = [
    { title: 'Consulta General', price: '$350' },
    { title: 'Baños por Peso', price: 'Desde $280' },
    { title: 'Esquila y Baño', price: 'Desde $550' },
    { title: 'Urgencias (Horario hábil)', price: '$500' }
  ];

  return (
    <div className="p-6 sm:p-10 flex flex-col gap-10 bg-vete-surface">
      {/* Sección de Planes de Bienestar */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-vete-text-base">Planes de Bienestar</h2>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-vete-primary font-bold">Suscripción Mensual</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`flex flex-col justify-between p-5 bg-vete-soft/10 border border-vete-border-subtle rounded-2xl relative overflow-hidden transition-all hover:border-vete-primary/40 shadow-sm`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-vete-primary text-white text-[10px] tracking-wider uppercase px-3 py-1 rounded-bl-xl font-bold">
                  Más Completo
                </div>
              )}

              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-base text-vete-text-base">{plan.title}</h3>
                    <p className="text-xs text-vete-text-muted">{plan.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-xl text-vete-primary">{plan.price}</span>
                    <span className="text-[10px] text-vete-text-muted block">/ mes</span>
                  </div>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feat, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2 text-xs sm:text-sm text-vete-text-muted">
                      <CheckCircle size={16} className="text-vete-primary shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className={`w-full py-2.5 px-4 rounded-xl text-center text-xs sm:text-sm font-bold transition-all ${
                  plan.isPopular 
                    ? 'bg-vete-primary text-white hover:opacity-90 shadow-sm' 
                    : 'bg-vete-soft/40 text-vete-text-base hover:bg-vete-primary hover:text-white'
                }`}
              >
                Elegir {plan.title.replace('Plan ', '')}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Valores de Referencia (Servicios Sueltos) */}
      <div className="bg-vete-soft/20 p-5 sm:p-6 rounded-2xl border border-vete-border-subtle">
        <h3 className="font-bold text-base text-vete-text-base mb-4">Valores de Referencia (Servicios Sueltos)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {referenceValues.map((item, index) => (
            <div key={index} className="bg-vete-surface p-3.5 rounded-xl border border-vete-border-subtle shadow-sm">
              <span className="text-[10px] uppercase font-bold text-vete-text-muted block mb-1">{item.title}</span>
              <span className="font-bold text-base text-vete-text-base">{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Nota de Pie y CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-vete-border-subtle">
        <p className="text-xs text-vete-text-muted text-center sm:text-left max-w-md">
          Beneficios sujetos a agenda. Consúltanos por el plan ideal para tu mascota y descubre nuestras facilidades de pago locales en Salto.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-vete-primary text-white font-bold text-xs sm:text-sm hover:opacity-90 transition-all shadow-lg shadow-vete-primary/20 shrink-0"
        >
          <ExternalLink size={16} />
          <span>Consultar por WhatsApp</span>
        </a>
      </div>
    </div>
  );
};