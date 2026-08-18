import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUploadZone } from './components/FileUploadZone';
import { ExecutiveSummaryCard } from './components/ExecutiveSummaryCard';
import { ComplianceAlertsSection } from './components/ComplianceAlertsSection';
import { RequirementsMatrixTable } from './components/RequirementsMatrixTable';
import { ReportActionsBar } from './components/ReportActionsBar';
import { Guia29ReferenceModal } from './components/Guia29ReferenceModal';
import { AuditReport } from './types';
import { 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  FileCheck2, 
  ArrowUpRight, 
  ChevronRight, 
  BookOpen, 
  ListChecks,
  Scale
} from 'lucide-react';

export default function App() {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [auditStep, setAuditStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isNormativaModalOpen, setIsNormativaModalOpen] = useState<boolean>(false);

  const handleAudit = async (data: { file?: File; text?: string; fileName?: string }) => {
    setIsLoading(true);
    setError(null);
    setAuditStep('Leyendo propuesta curricular...');

    try {
      let response: Response;

      if (data.file) {
        setAuditStep(`Extrayendo texto del archivo: ${data.file.name}...`);
        const formData = new FormData();
        formData.append('file', data.file);
        
        response = await fetch('/api/audit', {
          method: 'POST',
          body: formData,
        });
      } else {
        setAuditStep('Analizando diseño curricular contra el Capítulo 2 de la Guía 29 MEN...');
        response = await fetch('/api/audit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: data.text,
            fileName: data.fileName,
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error al procesar la auditoría.' }));
        throw new Error(errorData.error || `Error en el servidor (${response.status})`);
      }

      setAuditStep('Estructurando matriz de requisitos y alertas críticas...');
      const auditResult: AuditReport = await response.json();
      setReport(auditResult);

      // Smooth scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById('panel-resultados-auditoria');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } catch (err: any) {
      console.error('Audit execution error:', err);
      setError(err?.message || 'Ocurrió un error al auditar el documento curricular. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
      setAuditStep('');
    }
  };

  const handleReset = () => {
    setReport(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <Header onOpenNormativa={() => setIsNormativaModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Intro banner / quick guide info */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h2 className="text-base font-bold text-slate-900">
                  Auditoría Curricular Especializada para Programas ETDH
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                  Autor: Yesith Carvajalino
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                Herramienta de verificación técnica que contrasta la propuesta académica contra los 10 requisitos obligatorios del <strong>Capítulo 2 de la Guía 29</strong> del Ministerio de Educación Nacional de Colombia (Decreto 2888 de 2007, Ley 1064 de 2006 y Decreto 2020 de 2006). Desarrollado por <strong>Yesith Carvajalino</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              Vigencia Registro: 5 Años
            </span>
          </div>
        </div>

        {/* Error notification if any */}
        {error && (
          <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 text-rose-900 flex items-start space-x-3 shadow-xs animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <span className="font-bold block">Error en la auditoría curricular:</span>
              <span className="mt-0.5 block">{error}</span>
            </div>
          </div>
        )}

        {/* Upload & Form Section */}
        <section id="zona-de-carga">
          <FileUploadZone onAudit={handleAudit} isLoading={isLoading} />
        </section>

        {/* Loading overlay indicator */}
        {isLoading && (
          <div className="bg-white rounded-xl border border-blue-200 p-8 shadow-sm text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Auditando Requisitos del Capítulo 2 (Guía 29)
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                {auditStep || 'Cruzando documento con la normativa del Ministerio de Educación Nacional...'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400 pt-2">
              <span className="bg-slate-100 px-2 py-1 rounded">✓ CNO & NCL SENA</span>
              <span className="bg-slate-100 px-2 py-1 rounded">✓ 600h / 50% Prácticas</span>
              <span className="bg-slate-100 px-2 py-1 rounded">✓ Tabla de Saberes</span>
              <span className="bg-slate-100 px-2 py-1 rounded">✓ Presupuesto Quinquenal</span>
              <span className="bg-slate-100 px-2 py-1 rounded">✓ Licencia de Construcción</span>
            </div>
          </div>
        )}

        {/* RESULTS PANEL */}
        {report && !isLoading && (
          <section id="panel-resultados-auditoria" className="space-y-6 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-6 bg-blue-600 rounded-full" />
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Informe Oficial de Auditoría de Calidad Curricular
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Radicación y Evaluación Técnica
              </span>
            </div>

            {/* Top Report Actions Bar (with Copiar Informe) */}
            <ReportActionsBar report={report} onReset={handleReset} />

            {/* Executive Summary Card */}
            <ExecutiveSummaryCard summary={report.executiveSummary} />

            {/* Compliance Alerts Section */}
            <ComplianceAlertsSection alerts={report.complianceAlerts} />

            {/* 4-Column Requirements Matrix Table */}
            <RequirementsMatrixTable matrix={report.requirementsMatrix} />

            {/* Conclusion & Next Steps Card */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
                <ListChecks className="w-4 h-4 text-blue-600 mr-2" />
                Conclusiones y Ruta de Ajustes Curriculares
              </h3>
              <p className="text-xs text-slate-600">
                Puntos de verificación clave previos a la radicación formal del programa ante la Secretaría de Educación:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {report.conclusionAndNextSteps.map((step, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 flex items-start space-x-2.5 text-xs text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Report Actions Bar */}
            <ReportActionsBar report={report} onReset={handleReset} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-slate-700">Auditor ETDH</span> • Sistema de Verificación Capítulo 2 (Guía 29 MEN Colombia) • <span className="font-medium text-slate-700">Autor: Yesith Carvajalino</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-500">
            <span>Decreto 2888 de 2007</span>
            <span>•</span>
            <span>Ley 1064 de 2006</span>
            <span>•</span>
            <span>Decreto 2020 de 2006</span>
          </div>
        </div>
      </footer>

      {/* Guía 29 Reference Handbook Modal */}
      <Guia29ReferenceModal 
        isOpen={isNormativaModalOpen} 
        onClose={() => setIsNormativaModalOpen(false)} 
      />
    </div>
  );
}
