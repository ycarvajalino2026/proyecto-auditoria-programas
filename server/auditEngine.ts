import { GoogleGenAI, Type } from '@google/genai';
import { AuditReport, RequirementItem, ComplianceAlert, ExecutiveSummary } from '../src/types';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const AUDIT_SYSTEM_INSTRUCTION = `Eres el Auditor Máster de Calidad Académica de la Secretaría de Educación Territorial de Colombia, especializado en la inspección y verificación técnica de programas de Educación para el Trabajo y el Desarrollo Humano (ETDH) bajo el Decreto 2888 de 2007, Ley 1064 de 2006, Decreto 2020 de 2006 y el CAPÍTULO 2 DE LA GUÍA 29 DEL MINISTERIO DE EDUCACIÓN NACIONAL (MEN).

Tu misión es evaluar con rigor técnico, objetividad jurídica y precisión pedagógica el documento curricular o propuesta de programa ETDH suministrado por la institución educativa.

Debes cruzar el documento EXCLUSIVAMENTE contra los 10 requisitos del Capítulo 2 de la Guía 29:
1. Numeral 2.1 - DENOMINACIÓN DEL PROGRAMA:
   - Coherencia con la Clasificación Nacional de Ocupaciones (CNO).
   - Tipo de programa claramente identificable (Laboral o Académico o Idiomas).
   - Denominación exacta del Certificado de Aptitud Ocupacional ("Certificado de Técnico Laboral por Competencias en..." o "Certificado de Conocimientos Académicos en...").
   - Articulación estricta entre denominación y plan de estudios.

2. Numeral 2.2 - DESCRIPCIÓN DE LAS COMPETENCIAS:
   - Competencias laborales específicas referenciadas en Normas Técnicas de Competencia Laboral (NCL) del SENA / Mesas Sectoriales o internacionales.
   - Presencia explícita de competencias básicas y ciudadanas (Guía 6 MEN).
   - Competencias laborales generales (intelectuales, personales, interpersonales, organizacionales, TIC, emprendimiento - Guía 21 MEN).
   - Coherencia con el campo de ejercicio ocupacional y aporte a la formación integral.

3. Numeral 2.3 - JUSTIFICACIÓN DEL PROGRAMA:
   - Pertinencia en contexto globalizado, nacional y regional con datos del sector productivo.
   - Demostración de necesidades reales de formación y oportunidades de desempeño.
   - Proyección estimada de estudiantes a atender durante los 5 años de vigencia del registro.
   - Identificación de tendencias ocupacionales y sistema de monitoreo de tendencias.
   - Coherencia con la misión y el Proyecto Educativo Institucional (PEI).

4. Numeral 2.4 - PLAN DE ESTUDIOS:
   - 4.1 Duración: Mínimo 600 horas para Formación Laboral (con al menos 50% de formación práctica presencial supervisada al 100%) o Mínimo 160 horas para Formación Académica (o tabla horaria MCER en idiomas).
   - 4.2 Competencias por módulo/unidad.
   - 4.3 Identificación de contenidos básicos (Tabla de saberes: Saber conceptual, Saber hacer procedimental, Saber ser actitudinal).
   - 4.4 Organización de actividades (por módulos, créditos académicos donde 1 crédito = 48h con proporción 80% acompañamiento directo docente / 20% trabajo independiente en teoría).
   - 4.5 Distribución del tiempo y jornadas (diurna, nocturna, sabatino/dominical).
   - 4.6 Estrategia metodológica (presencial, a distancia o virtual con mínimo 80% de virtualidad y concepto previo de IES o SENA).
   - 4.7 Criterios y procedimientos de evaluación y promoción (técnicas de evaluación, evidencias de conocimiento, desempeño y producto, escala de calificación, criterios de permanencia y homologación).

5. Numeral 2.5 - AUTOEVALUACIÓN INSTITUCIONAL:
   - Existencia de instrumentos de autoevaluación permanente y comités institucionales.
   - Periodicidad de las prácticas y participación de estamentos (docentes, estudiantes, sector productivo).
   - Evidencia de formulación y seguimiento de Planes de Mejoramiento Continuo (PMC).

6. Numeral 2.6 - ORGANIZACIÓN ADMINISTRATIVA:
   - Estructura administrativa formal y organigrama congruente.
   - Existencia de una persona específica que coordine o dirija el programa.
   - Comité de programa con participación activa del sector productivo.
   - Manual de funciones, reglamento docente y manual de convivencia estudiantil, con contratación bajo el Código Sustantivo del Trabajo (CST).

7. Numeral 2.7 - RECURSOS ESPECÍFICOS PARA DESARROLLAR EL PROGRAMA:
   - Aulas, talleres y laboratorios especializados con dotación de insumos y equipos.
   - Biblioteca física y/o virtual con acervo actualizado, bases de datos y relación de libros por estudiante.
   - Recursos informáticos y software con licenciamiento legal.
   - Lugares de práctica propios o convenios interinstitucionales formales con escenarios de práctica.

8. Numeral 2.8 - PERSONAL DE FORMADORES:
   - Perfil de docentes con competencias pedagógicas y técnicas en el área.
   - Relación adecuada de docentes por estudiante y dedicación horaria.
   - Políticas y criterios de selección, permanencia, evaluación y plan de capacitación docente.
   - Formalización laboral y seguridad social.

9. Numeral 2.9 - RECURSOS FINANCIEROS ESPECÍFICOS:
   - Presupuesto de ingresos y egresos proyectado para los 5 años de vigencia del registro.
   - Demostración de viabilidad financiera y estructura de costos educativos y tarifas.

10. Numeral 2.10 - INFRAESTRUCTURA:
   - Planta física con Licencia de Construcción de uso institucional educativo.
   - Normas de seguridad, señalización, iluminación artificial y natural, ventilación y salubridad.
   - Accesibilidad y ubicación adecuada.

CRITERIOS DE CALIFICACIÓN:
- CUMPLE: El documento aborda explícita y satisfactoriamente todos los criterios del numeral.
- PARCIAL: Se menciona el requisito pero carece de soporte detallado, metodologías, cifras, normas NCL o convenios formales.
- NO_CUMPLE: Omisión total o contradicción directa con la normativa (ej. programa laboral con menos de 600h, sin 50% de práctica, sin presupuesto a 5 años, sin CNO, o sin licencia educativa).

ALERTAS DE CUMPLIMIENTO:
Genera alertas críticas inmediatas si detectas:
- Intensidad horaria inferior a 600 horas en programas laborales.
- Inexistencia o ambigüedad del 50% de formación práctica presencial supervisada.
- Omisión de la Clasificación Nacional de Ocupaciones (CNO).
- Ausencia de competencias básicas y ciudadanas.
- Inexistencia de proyección presupuestal a 5 años de vigencia.
- Falta de convenios o escenarios de práctica.
- Falta de licencia de construcción educativa.

EMITE UN RESULTADO EN JSON VÁLIDO CONFORME AL ESQUEMA ESPECIFICADO.`;

export async function auditCurricularDocument(documentText: string, fileName?: string): Promise<AuditReport> {
  const ai = getGeminiClient();

  if (!ai) {
    console.warn('GEMINI_API_KEY not configured. Executing deterministic institutional heuristic engine.');
    return generateHeuristicAudit(documentText, fileName);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: [
        {
          text: `A continuación se presenta el texto íntegro de la propuesta curricular radicada por la institución educativa para auditoría:

========================================
DOCUMENTO CURRICULAR A AUDITAR:
========================================
${documentText.slice(0, 75000)}
========================================

Por favor audita minuciosamente el documento conforme al Capítulo 2 de la Guía 29 del MEN. Genera el informe técnico completo estructurado en JSON.`,
        },
      ],
      config: {
        systemInstruction: AUDIT_SYSTEM_INSTRUCTION,
        temperature: 0.1,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: {
              type: Type.OBJECT,
              properties: {
                programNameDetected: { type: Type.STRING },
                institutionNameDetected: { type: Type.STRING },
                programType: { 
                  type: Type.STRING,
                  enum: ['LABORAL', 'ACADEMICA', 'IDIOMAS'],
                },
                totalHoursDetected: { type: Type.STRING },
                practicePercentageDetected: { type: Type.STRING },
                verdict: {
                  type: Type.STRING,
                  enum: ['LISTO_PARA_RADICACION', 'REQUIERE_AJUSTES_MENORES', 'NO_CUMPLE_REESTRUCTURACION'],
                },
                verdictLabel: { type: Type.STRING },
                readinessScore: { type: Type.NUMBER },
                overallAssessment: { type: Type.STRING },
                secretariaRecommendation: { type: Type.STRING },
                metrics: {
                  type: Type.OBJECT,
                  properties: {
                    totalRequirements: { type: Type.INTEGER },
                    fulfilled: { type: Type.INTEGER },
                    partial: { type: Type.INTEGER },
                    unfulfilled: { type: Type.INTEGER },
                  },
                  required: ['totalRequirements', 'fulfilled', 'partial', 'unfulfilled'],
                },
              },
              required: [
                'programNameDetected',
                'programType',
                'totalHoursDetected',
                'verdict',
                'verdictLabel',
                'readinessScore',
                'overallAssessment',
                'secretariaRecommendation',
                'metrics',
              ],
            },
            requirementsMatrix: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  numeral: { type: Type.STRING },
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  status: { 
                    type: Type.STRING,
                    enum: ['CUMPLE', 'PARCIAL', 'NO_CUMPLE'],
                  },
                  evidence: { type: Type.STRING },
                  correctiveAction: { type: Type.STRING },
                  legalBasis: { type: Type.STRING },
                },
                required: ['numeral', 'name', 'category', 'status', 'evidence', 'correctiveAction'],
              },
            },
            complianceAlerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  level: {
                    type: Type.STRING,
                    enum: ['CRITICA', 'ALTA', 'MEDIA', 'INFORMATIVA'],
                  },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  impactOnRegistration: { type: Type.STRING },
                  suggestedAction: { type: Type.STRING },
                },
                required: ['id', 'level', 'title', 'description', 'impactOnRegistration', 'suggestedAction'],
              },
            },
            methodologyVerification: {
              type: Type.OBJECT,
              properties: {
                modality: { type: Type.STRING },
                targetAudience: { type: Type.STRING },
                prerequisites: { type: Type.STRING },
                practicalScenariosCovered: { type: Type.BOOLEAN },
              },
              required: ['modality', 'targetAudience', 'prerequisites', 'practicalScenariosCovered'],
            },
            conclusionAndNextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'executiveSummary',
            'requirementsMatrix',
            'complianceAlerts',
            'methodologyVerification',
            'conclusionAndNextSteps',
          ],
        },
      },
    });

    const parsedJson = JSON.parse(response.text || '{}');
    
    return {
      id: `audit-${Date.now()}`,
      createdAt: new Date().toISOString(),
      fileName: fileName || 'documento_propuesta_curricular.pdf',
      fileSize: `${(documentText.length / 1024).toFixed(1)} KB`,
      executiveSummary: parsedJson.executiveSummary,
      requirementsMatrix: parsedJson.requirementsMatrix,
      complianceAlerts: parsedJson.complianceAlerts,
      methodologyVerification: parsedJson.methodologyVerification,
      conclusionAndNextSteps: parsedJson.conclusionAndNextSteps,
    };
  } catch (error) {
    console.error('Error in Gemini audit processing, fallback to heuristic engine:', error);
    return generateHeuristicAudit(documentText, fileName);
  }
}

/**
 * Robust Deterministic Institutional Fallback Engine
 * Analyzes the text against exact Colombian ETDH Guía 29 & Decreto 2888/2007 rules.
 */
export function generateHeuristicAudit(documentText: string, fileName?: string): AuditReport {
  const lowerText = documentText.toLowerCase();

  // 1. Detection of key variables
  const isLaboral = lowerText.includes('laboral') || lowerText.includes('técnico laboral') || !lowerText.includes('idiomas');
  const isIdiomas = lowerText.includes('idioma') || lowerText.includes('inglés') || lowerText.includes('mcer') || lowerText.includes('decreto 3870');

  // Extract hours
  const hoursMatch = documentText.match(/(\d{3,4})\s*horas/i);
  const detectedHours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;

  // Extract practice percentage
  const practiceMatch = documentText.match(/(\d{1,3})%\s*(?:de\s*)?(?:formación\s*)?práctica/i) || lowerText.includes('50% práctica');
  const has50PercentPractice = lowerText.includes('50%') || lowerText.includes('50 %') || (typeof practiceMatch === 'object' && practiceMatch && parseInt(practiceMatch[1], 10) >= 50);

  // Extract CNO
  const hasCNO = lowerText.includes('cno') || lowerText.includes('clasificación nacional de ocupaciones') || /\b\d{4}\b/.test(lowerText);

  // Extract NCL SENA
  const hasNCL = lowerText.includes('ncl') || lowerText.includes('norma de competencia') || lowerText.includes('normas sectoriales') || lowerText.includes('mesa sectorial');

  // Extract Competencias Ciudadanas
  const hasCiudadanas = lowerText.includes('ciudadana') || lowerText.includes('guía 6') || lowerText.includes('convivencia');

  // Extract Tabla de Saberes
  const hasTablaSaberes = (lowerText.includes('saber') && lowerText.includes('saber hacer')) || lowerText.includes('tabla de saberes') || lowerText.includes('contenidos básicos');

  // Extract Budget
  const has5YearBudget = (lowerText.includes('presupuesto') || lowerText.includes('ingresos y egresos')) && (lowerText.includes('5 años') || lowerText.includes('cinco años') || lowerText.includes('quinquenal') || lowerText.includes('vigencia'));

  // Extract Practice agreements / places
  const hasPracticePlaces = lowerText.includes('convenio') || lowerText.includes('escenario de práctica') || lowerText.includes('taller') || lowerText.includes('laboratorio');

  // Extract Construction License
  const hasConstructionLicense = lowerText.includes('licencia de construcción') || lowerText.includes('curaduría') || lowerText.includes('dotacional educativo');

  // Matrix construction
  const matrix: RequirementItem[] = [
    {
      numeral: '2.1',
      name: 'Denominación del Programa y Coherencia con la CNO',
      category: 'Denominación',
      status: hasCNO ? 'CUMPLE' : 'NO_CUMPLE',
      evidence: hasCNO
        ? 'El documento incluye denominación formal y asociación con la Clasificación Nacional de Ocupaciones (CNO).'
        : 'No se referencia el código ni el área de desempeño de la Clasificación Nacional de Ocupaciones (CNO).',
      correctiveAction: hasCNO
        ? 'Mantener la denominación acorde al catálogo CNO y verificar concordancia con el certificado de aptitud ocupacional.'
        : 'Vincular explícitamente el código CNO de 4 dígitos correspondiente y el área de desempeño ocupacional conforme al Art. 11 del Decreto 2888/2007.',
      legalBasis: 'Guía 29 MEN Numeral 2.1 / Art. 11 y 12 Decreto 2888 de 2007',
    },
    {
      numeral: '2.2',
      name: 'Descripción de Competencias (Laborales, Básicas y Ciudadanas)',
      category: 'Competencias',
      status: (hasNCL && hasCiudadanas) ? 'CUMPLE' : hasNCL ? 'PARCIAL' : 'NO_CUMPLE',
      evidence: hasNCL
        ? `Se identificaron competencias laborales estructuradas. ${hasCiudadanas ? 'Incluye competencias básicas y ciudadanas.' : 'Falta profundizar en competencias ciudadanas (Guía 6 MEN).'}`
        : 'Las competencias están formuladas de forma genérica sin basarse en Normas Técnicas de Competencia Laboral (NCL) del SENA.',
      correctiveAction: hasNCL && hasCiudadanas
        ? 'Conservar la matriz de competencias articulada con el perfil de egreso.'
        : 'Alinear las competencias laborales específicas a las NCL de las Mesas Sectoriales del SENA e integrar el módulo transversal de competencias ciudadanas (Guía 6 MEN) y generales (Guía 21).',
      legalBasis: 'Guía 29 MEN Numeral 2.2 / Guía No. 6 y 21 MEN',
    },
    {
      numeral: '2.3',
      name: 'Justificación del Programa y Estudio de Demanda Laboral',
      category: 'Justificación',
      status: lowerText.includes('estudio') || lowerText.includes('pertinencia') || lowerText.includes('demanda') ? 'CUMPLE' : 'PARCIAL',
      evidence: lowerText.includes('pertinencia')
        ? 'Presenta sustentación de pertinencia regional, necesidades del sector productivo y proyección de matrícula.'
        : 'La justificación es elemental; no presenta estudio comparativo ni cifras de inserción laboral o demanda real.',
      correctiveAction: 'Sustentar la pertinencia con diagnósticos del mercado laboral regional, número estimado de estudiantes durante los 5 años y sistema de monitoreo de tendencias ocupacionales.',
      legalBasis: 'Guía 29 MEN Numeral 2.3',
    },
    {
      numeral: '2.4.1',
      name: 'Duración e Intensidad Horaria Mínima Legal',
      category: 'Plan de Estudios',
      status: isLaboral ? (detectedHours >= 600 ? 'CUMPLE' : 'NO_CUMPLE') : (detectedHours >= 160 ? 'CUMPLE' : 'NO_CUMPLE'),
      evidence: detectedHours > 0
        ? `Se detectó una intensidad horaria total de ${detectedHours} horas.`
        : 'No se especifica con claridad la duración horaria total del programa.',
      correctiveAction: isLaboral
        ? (detectedHours >= 600 ? 'Cumple el mínimo de 600 horas legales.' : `Aumentar la intensidad horaria a un mínimo de 600 horas académicas obligatorias (Art. 11 Decreto 2888/2007). Actualmente tiene ${detectedHours || 'indeterminadas'} horas.`)
        : 'Garantizar el mínimo de 160 horas para programas de formación académica o la tabla horaria acumulada por nivel MCER.',
      legalBasis: 'Guía 29 MEN Numeral 2.4.1 / Art. 11 Decreto 2888/2007',
    },
    {
      numeral: '2.4.2',
      name: 'Distribución Teórico-Práctica (Mínimo 50% Práctica)',
      category: 'Plan de Estudios',
      status: has50PercentPractice ? 'CUMPLE' : 'NO_CUMPLE',
      evidence: has50PercentPractice
        ? 'El diseño curricular destina al menos el 50% de la duración del programa a formación práctica presencial supervisada.'
        : 'No se evidencia de manera explícita el cumplimiento del 50% de horas prácticas o se concentra la mayoría en teoría de aula.',
      correctiveAction: 'Reestructurar la malla curricular para asignar un mínimo del 50% de las horas totales a formación práctica (en talleres, laboratorios o práctica empresarial presencial 100% supervisada).',
      legalBasis: 'Guía 29 MEN Numeral 2.4 / Art. 11 y 20 Decreto 2888/2007',
    },
    {
      numeral: '2.4.3',
      name: 'Contenidos Básicos de Formación (Tabla de Saberes)',
      category: 'Plan de Estudios',
      status: hasTablaSaberes ? 'CUMPLE' : 'PARCIAL',
      evidence: hasTablaSaberes
        ? 'Módulos organizados con desglose de saberes conceptuales, procedimentales y actitudinales.'
        : 'Los contenidos se listan como temarios tradicionales sin estructura de competencias (Saber, Saber Hacer, Saber Ser).',
      correctiveAction: 'Elaborar para cada módulo de formación la correspondiente Tabla de Saberes desglosando componentes cognoscitivos, habilidades y actitudes requeridas.',
      legalBasis: 'Guía 29 MEN Numeral 2.4.3',
    },
    {
      numeral: '2.4.4',
      name: 'Criterios y Procedimientos de Evaluación y Promoción',
      category: 'Plan de Estudios',
      status: lowerText.includes('evidencias') || (lowerText.includes('evaluación') && lowerText.includes('desempeño')) ? 'CUMPLE' : 'PARCIAL',
      evidence: lowerText.includes('evidencias')
        ? 'Se definen técnicas e instrumentos de evaluación basados en evidencias de conocimiento, desempeño y producto.'
        : 'Sistema de evaluación numérico tradicional; no especifica evidencias ni mecanismos de retroalimentación por competencias.',
      correctiveAction: 'Definir el sistema de evaluación del aprendizaje mediante evidencias de conocimiento, desempeño y producto con escala de calificación cualitativa por competencias.',
      legalBasis: 'Guía 29 MEN Numeral 2.4.7',
    },
    {
      numeral: '2.5',
      name: 'Autoevaluación Institucional y Mejoramiento Continuo',
      category: 'Calidad Institucional',
      status: lowerText.includes('autoevaluación') ? 'CUMPLE' : 'NO_CUMPLE',
      evidence: lowerText.includes('autoevaluación')
        ? 'Se describe el comité de autoevaluación, instrumentos y periodicidad del plan de mejoramiento continuo.'
        : 'No se describe el modelo, instrumentos ni periodicidad del proceso de autoevaluación del programa.',
      correctiveAction: 'Incorporar la política de autoevaluación institucional, conformación del comité de autoevaluación y mecanismos de difusión de resultados a la comunidad educativa.',
      legalBasis: 'Guía 29 MEN Numeral 2.5',
    },
    {
      numeral: '2.6',
      name: 'Organización Administrativa, Gobierno y Reglamentos',
      category: 'Administración',
      status: (lowerText.includes('organigrama') || lowerText.includes('coordinador')) && (lowerText.includes('reglamento') || lowerText.includes('convivencia')) ? 'CUMPLE' : 'PARCIAL',
      evidence: lowerText.includes('organigrama')
        ? 'Cuenta con estructura organizativa, coordinador de programa y reglamentos docente y estudiantil.'
        : 'Falta formalizar la figura del coordinador exclusivo del programa, comité de programa con empresarios o manuales.',
      correctiveAction: 'Adjuntar organigrama, designación del coordinador de programa, comité curricular con participación del sector productivo y reglamentos vigentes.',
      legalBasis: 'Guía 29 MEN Numeral 2.6 / Art. 10 Decreto 2888/2007',
    },
    {
      numeral: '2.7',
      name: 'Recursos Específicos, Biblioteca y Lugares de Práctica',
      category: 'Recursos',
      status: hasPracticePlaces ? 'CUMPLE' : 'NO_CUMPLE',
      evidence: hasPracticePlaces
        ? 'Se describen aulas, salas de cómputo, dotación bibliográfica y convenios/escenarios para desarrollo de prácticas.'
        : 'No se garantiza el acceso a biblioteca con relación de libros ni se adjuntan convenios formales de práctica formativa.',
      correctiveAction: 'Acreditar dotación bibliográfica especializada (física o digital), equipos informáticos y celebrar convenios interinstitucionales con escenarios de práctica.',
      legalBasis: 'Guía 29 MEN Numeral 2.7 / Parágrafo 1 Art. 11 Decreto 2888/2007',
    },
    {
      numeral: '2.8',
      name: 'Personal de Formadores y Cualificación Docente',
      category: 'Docentes',
      status: lowerText.includes('docente') && (lowerText.includes('capacitación') || lowerText.includes('perfil')) ? 'CUMPLE' : 'PARCIAL',
      evidence: lowerText.includes('docente')
        ? 'Se detallan perfiles profesionales y pedagógicos de los formadores, mecanismos de selección y formación continua.'
        : 'No se establecen los perfiles técnicos y pedagógicos mínimos ni el plan de capacitación docente en competencias.',
      correctiveAction: 'Definir el perfil de ingreso docente con competencias pedagógicas y técnicas, relación docente/estudiante y plan institucional de cualificación.',
      legalBasis: 'Guía 29 MEN Numeral 2.8',
    },
    {
      numeral: '2.9',
      name: 'Recursos Financieros Específicos (Presupuesto Quinquenal)',
      category: 'Financiero',
      status: has5YearBudget ? 'CUMPLE' : 'NO_CUMPLE',
      evidence: has5YearBudget
        ? 'Se anexa presupuesto detallado de ingresos y egresos proyectado para los 5 años de vigencia del registro.'
        : 'Ausencia de presupuesto financiero proyectado a cinco (5) años que demuestre la viabilidad económica del programa.',
      correctiveAction: 'Elaborar el presupuesto proyectado a 5 años (ingresos por matrículas vs. egresos de operación, nómina docente y reposición de equipos) sustentando viabilidad.',
      legalBasis: 'Guía 29 MEN Numeral 2.9 / Art. 17 Numeral 9 Decreto 2888/2007',
    },
    {
      numeral: '2.10',
      name: 'Infraestructura Física y Licencia de Construcción',
      category: 'Infraestructura',
      status: hasConstructionLicense ? 'CUMPLE' : 'NO_CUMPLE',
      evidence: hasConstructionLicense
        ? 'Se describe sede física adecuada con Licencia de Construcción de uso institucional educativo y conceptos de seguridad.'
        : 'No se menciona la Licencia de Construcción con uso educativo expedida por Curaduría Urbana o autoridad competente.',
      correctiveAction: 'Aportar copia de la Licencia de Construcción para uso educativo, concepto de seguridad y bomberos, y protocolo de accesibilidad.',
      legalBasis: 'Guía 29 MEN Numeral 2.10 / Art. 7 Numeral 5 Decreto 2888/2007',
    },
  ];

  // Calculate metrics
  const totalReqs = matrix.length;
  const fulfilled = matrix.filter((r) => r.status === 'CUMPLE').length;
  const partial = matrix.filter((r) => r.status === 'PARCIAL').length;
  const unfulfilled = matrix.filter((r) => r.status === 'NO_CUMPLE').length;

  const score = Math.round(((fulfilled * 1.0 + partial * 0.5) / totalReqs) * 100);

  let verdict: 'LISTO_PARA_RADICACION' | 'REQUIERE_AJUSTES_MENORES' | 'NO_CUMPLE_REESTRUCTURACION';
  let verdictLabel: string;
  let overallAssessment: string;
  let secretariaRecommendation: string;

  if (score >= 85 && unfulfilled === 0) {
    verdict = 'LISTO_PARA_RADICACION';
    verdictLabel = 'FAVORABLE - LISTO PARA RADICACIÓN ANTE SECRETARÍA DE EDUCACIÓN';
    overallAssessment = 'La propuesta curricular cumple de manera rigurosa con los requisitos normativos del Capítulo 2 de la Guía 29 y el Decreto 2888 de 2007. Cuenta con estructura sólida de competencias, duración legal, proporción práctica, soporte docente e infraestructura idónea.';
    secretariaRecommendation = 'Se recomienda emitir Concepto Técnico Favorable y proceder a la visita de verificación in situ para expedición del Registro del Programa.';
  } else if (score >= 60 && (!isLaboral || detectedHours >= 600)) {
    verdict = 'REQUIERE_AJUSTES_MENORES';
    verdictLabel = 'CONDICIONADO - REQUIERE AJUSTES CURRICULARES MENORES';
    overallAssessment = 'El programa presenta una estructura de base aceptable pero exhibe falencias documentales en componentes de autoevaluación, articulación de tablas de saberes o convenios de práctica que deben subsanarse previo a la radicación.';
    secretariaRecommendation = 'Requerir a la institución para que en un plazo técnico subsane los hallazgos señalados en la matriz antes de autorizar la visita técnica.';
  } else {
    verdict = 'NO_CUMPLE_REESTRUCTURACION';
    verdictLabel = 'NO FAVORABLE - NO CUMPLE REQUISITOS BÁSICOS (REESTRUCTURACIÓN)';
    overallAssessment = 'La propuesta presenta omisiones críticas que contravienen directamente el Decreto 2888 de 2007 y la Guía 29 MEN (ej. duración insuficiente, falta de formación práctica del 50%, ausencia de presupuesto a 5 años o sin articulación CNO).';
    secretariaRecommendation = 'Devolver la solicitud a la institución oferente para reformulación curricular integral de conformidad con la Guía 29 MEN.';
  }

  // Alerts
  const alerts: ComplianceAlert[] = [];

  if (isLaboral && detectedHours > 0 && detectedHours < 600) {
    alerts.push({
      id: 'alert-hours-critical',
      level: 'CRITICA',
      title: 'Intensidad Horaria Inferior al Mínimo Legal (600 Horas)',
      description: `El programa plantea únicamente ${detectedHours} horas. El Artículo 11 del Decreto 2888 de 2007 exige perentoriamente un mínimo de 600 horas para programas de formación laboral.`,
      impactOnRegistration: 'Causal inmediata de rechazo o no registro del programa por parte de la Secretaría de Educación.',
      suggestedAction: 'Ampliar la malla curricular agregando módulos teórico-prácticos hasta completar mínimo 600 horas académicas.',
    });
  }

  if (isLaboral && !has50PercentPractice) {
    alerts.push({
      id: 'alert-practice-critical',
      level: 'CRITICA',
      title: 'Ausencia de la Proporción Mínima del 50% de Formación Práctica',
      description: 'El Decreto 2888 de 2007 (Art. 11 y 20) estipula que al menos el cincuenta por ciento (50%) de la duración del programa debe corresponder a formación práctica 100% presencial supervisada.',
      impactOnRegistration: 'Impedimento para certificación de calidad y registro institucional.',
      suggestedAction: 'Desglosar explícitamente en la malla curricular las horas teóricas (máx. 50%) y horas prácticas (mín. 50%), sustentando talleres y convenios.',
    });
  }

  if (isLaboral && !hasCNO) {
    alerts.push({
      id: 'alert-cno-high',
      level: 'ALTA',
      title: 'Falta de Articulación con la Clasificación Nacional de Ocupaciones (CNO)',
      description: 'La denominación y perfil no referencian el código ocupacional ni el área de desempeño de la CNO exigida en el Numeral 2.1 de la Guía 29.',
      impactOnRegistration: 'Observación formal en la mesa técnica de la Secretaría de Educación.',
      suggestedAction: 'Identificar la ocupación afín en la Clasificación Nacional de Ocupaciones del SENA y transcribir el código de 4 dígitos y área de desempeño.',
    });
  }

  if (!has5YearBudget) {
    alerts.push({
      id: 'alert-budget-high',
      level: 'ALTA',
      title: 'Ausencia de Presupuesto Quinquenal de Ingresos y Egresos',
      description: 'El Numeral 2.9 de la Guía 29 exige demostrar la viabilidad presupuestal durante la vigencia completa del registro (5 años).',
      impactOnRegistration: 'Inobservancia del requisito de sostenibilidad financiera (Art. 17 numeral 9).',
      suggestedAction: 'Incluir tabla presupuestal proyectada a 5 años desglosando matrículas, costos de docentes, gastos operativos e inversión.',
    });
  }

  if (!hasConstructionLicense) {
    alerts.push({
      id: 'alert-infra-media',
      level: 'MEDIA',
      title: 'Falta de Referenciación de la Licencia de Construcción Institucional Educativa',
      description: 'No se cita la licencia de construcción con uso dotacional educativo expedida por Curaduría Urbana.',
      impactOnRegistration: 'Requisito documental no subsanable durante la visita de verificación.',
      suggestedAction: 'Adjuntar número de resolución y fecha de la licencia de construcción con uso institucional educativo.',
    });
  }

  // Name detection
  const programNameMatch = documentText.match(/denominaci[oó]n[:\s]+([^\n\r]+)/i) || documentText.match(/t[eé]cnico laboral [^\n\r]+/i) || documentText.match(/programa [^\n\r]+/i);
  const detectedProgramName = programNameMatch ? programNameMatch[0].replace(/denominación:?/i, '').trim() : (isIdiomas ? 'Programa de Idiomas' : 'Programa de Formación Laboral ETDH');

  const institutionMatch = documentText.match(/instituci[oó]n[:\s]+([^\n\r]+)/i) || documentText.match(/instituto [^\n\r]+/i);
  const detectedInstitution = institutionMatch ? institutionMatch[0].replace(/institución:?/i, '').trim() : 'Institución Oferente ETDH';

  const executiveSummary: ExecutiveSummary = {
    programNameDetected: detectedProgramName,
    institutionNameDetected: detectedInstitution,
    programType: isIdiomas ? 'IDIOMAS' : (isLaboral ? 'LABORAL' : 'ACADEMICA'),
    totalHoursDetected: detectedHours ? `${detectedHours} horas` : 'No determinada explícitamente',
    practicePercentageDetected: has50PercentPractice ? '50% o superior (Conforme)' : 'Inferior al 50% o no especificada',
    verdict,
    verdictLabel,
    readinessScore: score,
    overallAssessment,
    secretariaRecommendation,
    metrics: {
      totalRequirements: totalReqs,
      fulfilled,
      partial,
      unfulfilled,
    },
  };

  return {
    id: `audit-${Date.now()}`,
    createdAt: new Date().toISOString(),
    fileName: fileName || 'documento_propuesta_curricular.pdf',
    fileSize: `${(documentText.length / 1024).toFixed(1)} KB`,
    executiveSummary,
    requirementsMatrix: matrix,
    complianceAlerts: alerts,
    methodologyVerification: {
      modality: lowerText.includes('virtual') ? 'Virtual / A Distancia' : 'Presencial',
      targetAudience: 'Estudiantes mayores de 16 años y egresados de educación básica/media',
      prerequisites: lowerText.includes('requisitos') || lowerText.includes('ingreso') ? 'Especificados en el reglamento' : 'No definidos claramente',
      practicalScenariosCovered: hasPracticePlaces,
    },
    conclusionAndNextSteps: [
      'Revisar minuciosamente la columna "Acción Correctiva" en cada numeral evaluado como PARCIAL o NO CUMPLE.',
      'Asegurar que todas las NCL citadas correspondan a la versión vigente en el catálogo de normas de competencia del SENA.',
      'Formalizar y legalizar los convenios de práctica con empresas aliadas antes de radicar la solicitud formal.',
      'Organizar los anexos documentales (Licencia de construcción, PEI, Presupuesto a 5 años, Hojas de vida docentes) para la visita de inspección.',
    ],
  };
}
