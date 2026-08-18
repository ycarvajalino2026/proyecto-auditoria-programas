import React, { useState } from 'react';
import { X, BookOpen, Scale, FileText, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface Guia29ReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Guia29ReferenceModal: React.FC<Guia29ReferenceModalProps> = ({ isOpen, onClose }) => {
  const [activeNumeral, setActiveNumeral] = useState('2.1');

  if (!isOpen) return null;

  const numerals = [
    {
      id: '2.1',
      title: '2.1. Denominación del Programa',
      summary: 'Diferenciable como ETDH, articulado con CNO y certificado de aptitud ocupacional.',
      details: [
        'Debe indicar claramente el tipo de programa (Laboral o Académico) y el campo de formación ofrecido.',
        'Los programas de formación laboral deben tener una denominación coherente con las áreas de desempeño de la Clasificación Nacional de Ocupaciones (CNO).',
        'El Certificado de Aptitud Ocupacional otorgado debe ser: "Técnico Laboral por Competencias en..." (Formación Laboral) o "Conocimientos Académicos en..." (Formación Académica) según el Art. 12 del Decreto 2888/2007.',
        'Debe existir articulación y coherencia estricta entre la denominación y la malla curricular.',
      ],
      legal: 'Art. 11 y 12 Decreto 2888/2007 • CNO SENA',
    },
    {
      id: '2.2',
      title: '2.2. Descripción de las Competencias',
      summary: 'Laborales específicas (NCL SENA), básicas, ciudadanas y laborales generales.',
      details: [
        'Explicitar las competencias laborales específicas tomando como referente las Normas Técnicas de Competencia Laboral (NCL) definidas por las Mesas Sectoriales que lidera el SENA o normas internacionales.',
        'Asegurar el desarrollo integral incluyendo competencias básicas y ciudadanas (Guía No. 6 MEN).',
        'Incorporar competencias laborales generales (personales, intelectuales, interpersonales, organizacionales y para el emprendimiento - Guía No. 21 MEN).',
        'Coherencia directa con los campos de ejercicio ocupacional del futuro egresado.',
      ],
      legal: 'Guía 6 MEN • Guía 21 MEN • Mesas Sectoriales SENA',
    },
    {
      id: '2.3',
      title: '2.3. Justificación del Programa',
      summary: 'Pertinencia global/regional, proyección quinquenal de estudiantes y monitoreo laboral.',
      details: [
        'Sustentar la pertinencia en función de las necesidades reales de formación en el país y la región con apoyo del sector productivo.',
        'Establecer el número estimado de estudiantes que proyecta atender durante los cinco (5) años de vigencia del registro.',
        'Demostrar la existencia de oportunidades reales de desempeño y tendencias del ejercicio ocupacional.',
        'Contar con un sistema de monitoreo de tendencias ocupacionales y coherencia con el PEI.',
      ],
      legal: 'Art. 17 Numeral 3 Decreto 2888/2007',
    },
    {
      id: '2.4',
      title: '2.4. Plan de Estudios y Malla Curricular',
      summary: 'Mínimo 600h laboral con ≥50% práctica presencial; tabla de saberes y evaluación por evidencias.',
      details: [
        '4.1. Duración: Mínimo 600 horas para programas de formación laboral (Art. 11 Decreto 2888/2007) y mínimo 160 horas para formación académica.',
        'Formación Práctica: Al menos el 50% de la duración del programa debe corresponder a formación práctica presencial 100% supervisada por docentes.',
        '4.3. Tabla de Saberes: Identificación de contenidos básicos desglosados en Saber (conceptual), Saber Hacer (habilidades/procedimental) y Saber Ser (actitudinal).',
        '4.4. Créditos Académicos (Opcional): 1 crédito = 48 horas de trabajo (80% acompañamiento directo docente / 20% trabajo independiente en teoría).',
        '4.7. Criterios de Evaluación: Evaluación fundamentada en evidencias de conocimiento, desempeño y producto con periodicidad y escala definida.',
      ],
      legal: 'Art. 11, 17, 19 y 20 Decreto 2888/2007',
    },
    {
      id: '2.5',
      title: '2.5. Autoevaluación Institucional',
      summary: 'Instrumentos permanentes, comités activos y planes de mejoramiento continuo.',
      details: [
        'Existencia de instrumentos de autoevaluación permanente para el mejoramiento y actualización periódica de contenidos.',
        'Comités de autoevaluación formalmente constituidos con participación de directivos, docentes, estudiantes y egresados.',
        'Periodicidad definida de los ciclos evaluativos y difusión amplia y oportuna de los resultados a la comunidad educativa.',
      ],
      legal: 'Art. 17 Numeral 5 Decreto 2888/2007',
    },
    {
      id: '2.6',
      title: '2.6. Organización Administrativa',
      summary: 'Estructura formal, coordinador del programa, comité con sector productivo y reglamentos CST.',
      details: [
        'Estructura administrativa estable con organigrama congruente.',
        'Persona específica asignada que coordine o dirija el programa con dedicación idónea.',
        'Comité de programa para resolución de asuntos académicos y curriculares con participación activa del sector productivo.',
        'Manual de funciones, reglamento docente y manual de convivencia estudiantil con contratación sujeta al Código Sustantivo del Trabajo.',
      ],
      legal: 'Art. 10 y 17 Numeral 6 Decreto 2888/2007',
    },
    {
      id: '2.7',
      title: '2.7. Recursos Específicos del Programa',
      summary: 'Aulas, talleres dotados, biblioteca con libros/estudiante y convenios de práctica externa.',
      details: [
        'Número suficiente de aulas, laboratorios y talleres equipados con insumos, normas de seguridad e higiene.',
        'Biblioteca física o digital con acervo bibliográfico suficiente y actualizado en el campo del programa, indicando relación de libros por estudiante.',
        'Software y equipos informáticos con licencias legales.',
        'Lugares de práctica garantizados en campus o mediante convenios interinstitucionales vigentes con empresas (Parágrafo 1 Art. 11).',
      ],
      legal: 'Art. 17 Numeral 7 Decreto 2888/2007',
    },
    {
      id: '2.8',
      title: '2.8. Personal de Formadores',
      summary: 'Perfiles pedagógicos y técnicos, relación docente/estudiante y plan de capacitación.',
      details: [
        'Docentes con perfil técnico afín a la ocupación y competencias pedagógicas demostradas.',
        'Relación equilibrada de número de formadores por estudiantes.',
        'Políticas y criterios claros de selección, vinculación, evaluación del desempeño y permanencia docente.',
        'Plan institucional de capacitación docente en competencias y nuevas tecnologías.',
      ],
      legal: 'Art. 17 Numeral 8 Decreto 2888/2007',
    },
    {
      id: '2.9',
      title: '2.9. Recursos Financieros Específicos',
      summary: 'Presupuesto de ingresos y egresos proyectado para los 5 años de vigencia del registro.',
      details: [
        'Demostración de disponibilidad de recursos financieros que garanticen el adecuado funcionamiento del programa.',
        'Presupuesto quinquenal (5 años) detallado de ingresos (matrículas proyectadas) y egresos (nómina, insumos, mantenimiento, fondo de reposición).',
        'Estructura de costos educativos y tarifas coherente.',
      ],
      legal: 'Art. 17 Numeral 9 Decreto 2888/2007',
    },
    {
      id: '2.10',
      title: '2.10. Infraestructura Física',
      summary: 'Licencia de construcción educativa, sismorresistencia, ventilación, iluminación y seguridad.',
      details: [
        'Planta física con Licencia de Construcción aprobada para uso institucional educativo expedida por Curaduría.',
        'Cumplimiento de normas de seguridad, protección contra incendios (concepto bomberos), sismorresistencia e iluminación/ventilación adecuada.',
        'Ubicación accesible, señalización visible de todas las áreas y aislamiento de focos de ruido o contaminación.',
      ],
      legal: 'Art. 7 Numeral 5 y Art. 17 Decreto 2888/2007',
    },
  ];

  const currentItem = numerals.find((n) => n.id === activeNumeral) || numerals[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                Guía 29 MEN - Capítulo 2: Requisitos Básicos de Calidad ETDH
              </h3>
              <p className="text-xs text-slate-400">
                Marco normativo de verificación del Ministerio de Educación Nacional de Colombia (Decreto 2888 de 2007)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left sidebar numerals + Right content */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Numerals Selector */}
          <div className="md:col-span-4 border-r border-slate-200 overflow-y-auto p-3 bg-slate-50 space-y-1.5 max-h-56 md:max-h-full">
            {numerals.map((num) => {
              const isSelected = activeNumeral === num.id;
              return (
                <button
                  key={num.id}
                  onClick={() => setActiveNumeral(num.id)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition flex flex-col ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <span className="font-bold">{num.id}</span>
                  <span className={`text-[11px] truncate ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                    {num.title.replace(`${num.id}. `, '')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Numeral Details */}
          <div className="md:col-span-8 p-6 overflow-y-auto space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                  Numeral {currentItem.id}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {currentItem.legal}
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mt-1">
                {currentItem.title}
              </h4>
              <p className="text-xs text-slate-600 mt-1 font-medium italic">
                {currentItem.summary}
              </p>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Criterios de Verificación que Exige la Secretaría de Educación:
              </h5>
              <ul className="space-y-2">
                {currentItem.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mr-2 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50/80 rounded-lg p-3.5 border border-blue-200 text-xs text-blue-950">
              <div className="flex items-center space-x-1.5 font-bold mb-1">
                <Scale className="w-3.5 h-3.5 text-blue-700" />
                <span>Normatividad Vinculante:</span>
              </div>
              <p className="text-blue-900">
                {currentItem.legal}. El incumplimiento o formulación superficial de este numeral acarrea requerimiento técnico o concepto desfavorable de registro.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Fuente: Guía No. 29 MEN Colombia - Verificación de Requisitos Básicos ETDH
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            Cerrar Guía
          </button>
        </div>
      </div>
    </div>
  );
};
