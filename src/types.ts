export type RequirementStatus = 'CUMPLE' | 'PARCIAL' | 'NO_CUMPLE';

export type ProgramType = 'LABORAL' | 'ACADEMICA' | 'IDIOMAS';

export type VerdictStatus = 
  | 'LISTO_PARA_RADICACION'
  | 'REQUIERE_AJUSTES_MENORES'
  | 'NO_CUMPLE_REESTRUCTURACION';

export interface RequirementItem {
  numeral: string; // e.g. "2.1", "2.2", "2.4.1", etc.
  name: string; // e.g. "Denominación del Programa y Coherencia CNO"
  category: string; // e.g. "Denominación", "Competencias", "Plan de Estudios", etc.
  status: RequirementStatus;
  evidence: string; // Brief quote or analysis of evidence found in the document
  correctiveAction: string; // Exact wording of what needs to be drafted or amended
  legalBasis?: string; // Reference to Decreto 2888/2007, Guía 29, etc.
}

export interface ComplianceAlert {
  id: string;
  level: 'CRITICA' | 'ALTA' | 'MEDIA' | 'INFORMATIVA';
  title: string;
  description: string;
  impactOnRegistration: string;
  suggestedAction: string;
}

export interface ExecutiveSummary {
  programNameDetected: string;
  institutionNameDetected?: string;
  programType: ProgramType;
  totalHoursDetected: number | string;
  practicePercentageDetected?: string;
  verdict: VerdictStatus;
  verdictLabel: string;
  readinessScore: number; // 0 - 100
  overallAssessment: string;
  secretariaRecommendation: string;
  metrics: {
    totalRequirements: number;
    fulfilled: number;
    partial: number;
    unfulfilled: number;
  };
}

export interface AuditReport {
  id: string;
  createdAt: string;
  fileName?: string;
  fileSize?: string;
  executiveSummary: ExecutiveSummary;
  requirementsMatrix: RequirementItem[];
  complianceAlerts: ComplianceAlert[];
  methodologyVerification: {
    modality: string;
    targetAudience: string;
    prerequisites: string;
    practicalScenariosCovered: boolean;
  };
  conclusionAndNextSteps: string[];
}

export interface SampleProgram {
  id: string;
  title: string;
  type: ProgramType;
  badge: string;
  description: string;
  fullText: string;
}
