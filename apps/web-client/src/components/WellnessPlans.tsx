import React from 'react';
import './WellnessPlans.css';

const plans = [
  {
    id: 'preventiva',
    title: 'Salud Preventiva',
    description: 'Lo esencial para mantener a tu mascota sana y protegida mes a mes.',
    features: ['Consultas ilimitadas', 'Vacunación anual'],
    highlight: false,
  },
  {
    id: 'proteccion',
    title: 'Protección',
    description: 'Cobertura ampliada para mayor tranquilidad ante imprevistos.',
    features: ['Beneficios Preventiva', '20% dcto en cirugías'],
    highlight: true, // Esta es la tarjeta azul
  },
  {
    id: 'familia',
    title: 'Familia',
    description: 'Plan ideal para hogares con múltiples mascotas.',
    features: ['Cobertura para 2+ mascotas', 'Prioridad en urgencias'],
    highlight: false,
  },
  {
    id: 'senior',
    title: 'Senior',
    description: 'Cuidados especializados para los años dorados de tu compañero.',
    features: ['Chequeo geriátrico anual', 'Análisis clínicos incluidos'],
    highlight: false,
  },
];

const WellnessPlans = () => {
  const handleConsultar = (planTitle) => {
    const phone = "5989XXXXXXX"; // Número de Valeria
    const message = encodeURIComponent(`Hola! Vengo de la web y me gustaría consultar por el plan: ${planTitle}`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <section className="plans-section">
      <h2 className="plans-title">Programas de Bienestar Animal</h2>
      <p className="plans-subtitle">Planes diseñados para asegurar la salud preventiva de tus animales a lo largo de toda su vida.</p>
      
      <div className="plans-container">
        {plans.map((plan) => (
          <div key={plan.id} className={`plan-card ${plan.highlight ? 'highlight' : ''}`}>
            <h3 className="plan-card-title">{plan.title}</h3>
            <p className="plan-card-description">{plan.description}</p>
            <ul className="plan-features">
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <span className="check-icon">✓</span> {feature}
                </li>
              ))}
            </ul>
            <button 
              className="consult-btn" 
              onClick={() => handleConsultar(plan.title)}
            >
              Consultar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WellnessPlans;