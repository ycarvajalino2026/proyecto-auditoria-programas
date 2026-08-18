import React, { useState } from 'react';
import { Copy, Check, Download, Printer, RotateCcw, Share2, FileCheck } from 'lucide-react';
import { AuditReport } from '../types';

interface ReportActionsBarProps {
  report: AuditReport;
  onReset: () => void;
}

export const ReportActionsBar: React.FC<ReportActionsBarProps> = ({ report, onReset }) => {
  const [copied, setCopied] = useState(false);

  const generateMarkdownReport = (): string => {
    const { executiveSummary, requirementsMatrix, complianceAlerts, methodologyVerification, conclusionAndNextSteps } = report;
    
    let md = `# INFORME TÉCNICO DE AUDITORÍA ACADÉMICA INSTITUCIONAL (ETDH)\n`;
    md += `## VERIFICACIÓN DE REQUISITOS BÁSICOS - CAPÍTULO 2 (GUÍA 29 MEN)\n\n`;
    md += `**Fecha de Auditoría:** ${new Date(report.createdAt).toLocaleString('es-CO')}\n`;
    md += `**Documento Evaluado:** ${report.fileName || 'Propuesta Curricular'}\n`;
    md += `**Programa Detectado:** ${executiveSummary.programNameDetected}\n`;
    if (executiveSummary.institutionNameDetected) {
      md += `**Institución:** ${executiveSummary.institutionNameDetected}\n`;
    }
    md += `**Tipo de Programa:** ${executiveSummary.programType}\n`;
    md += `**Intensidad Horaria:** ${executiveSummary.totalHoursDetected}\n`;
    md += `**Índice de Conformidad:** ${executiveSummary.readinessScore}%\n`;
    md += `**Veredicto Oficial:** ${executiveSummary.verdictLabel}\n\n`;
    
    md += `------------------------------------------------------------\n`;
    md += `### 1. RESUMEN EJECUTIVO Y DIAGNÓSTICO INSTITUCIONAL\n`;
    md += `${executiveSummary.overallAssessment}\n\n`;
    md += `**Recomendación Técnica para Secretaría de Educación:**\n`;
    md += `${executiveSummary.secretariaRecommendation}\n\n`;
    md += `**Métricas:** Cumplidos: ${executiveSummary.metrics.fulfilled} | Parciales: ${executiveSummary.metrics.partial} | No Cumplidos: ${executiveSummary.metrics.unfulfilled} (Total: ${executiveSummary.metrics.totalRequirements})\n\n`;

    md += `------------------------------------------------------------\n`;
    md += `### 2. ALERTAS DE CUMPLIMIENTO Y OMISIONES CRÍTICAS\n`;
    if (complianceAlerts.length === 0) {
      md += `No se identificaron omisiones críticas de causal de no registro.\n\n`;
    } else {
      complianceAlerts.forEach((a, i) => {
        md += `#### ${i + 1}. [${a.level}] ${a.title}\n`;
        md += `- **Descripción:** ${a.description}\n`;
        md += `- **Impacto en Registro:** ${a.impactOnRegistration}\n`;
        md += `- **Acción Inmediata Requerida:** ${a.suggestedAction}\n\n`;
      });
    }

    md += `------------------------------------------------------------\n`;
    md += `### 3. MATRIZ DE REQUISITOS (CAPÍTULO 2 - GUÍA 29 MEN)\n\n`;
    md += `| Requisito Exigido | Estado | Evidencia Encontrada | Acción Correctiva |\n`;
    md += `| :--- | :---: | :--- | :--- |\n`;
    requirementsMatrix.forEach((r) => {
      md += `| **${r.numeral} ${r.name}** | **${r.status}** | ${r.evidence.replace(/\n/g, ' ')} | ${r.correctiveAction.replace(/\n/g, ' ')} |\n`;
    });

    md += `\n------------------------------------------------------------\n`;
    md += `### 4. CONCLUSIONES Y PRÓXIMOS PASOS\n`;
    conclusionAndNextSteps.forEach((c, idx) => {
      md += `${idx + 1}. ${c}\n`;
    });

    md += `\n*Informe emitido en observancia del Decreto 2888 de 2007, Decreto 2020 de 2006 y Guía No. 29 del Ministerio de Educación Nacional de Colombia.*`;
    return md;
  };

  const handleCopyReport = async () => {
    try {
      const text = generateMarkdownReport();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Error copying report to clipboard:', err);
    }
  };

  const handleDownloadFile = () => {
    const text = generateMarkdownReport();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Informe_Auditoria_Guia29_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900 text-white rounded-xl shadow-md border border-slate-800 p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
          <FileCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">
            Acciones y Exportación del Informe Técnico
          </h4>
          <p className="text-xs text-slate-400">
            Copia el dictamen formal o descárgalo para remitir al comité curricular o radicar.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Main Required Button: Copiar Informe */}
        <button
          type="button"
          onClick={handleCopyReport}
          className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition shadow-sm active:scale-95 ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>¡Informe Copiado al Portapapeles!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copiar Informe</span>
            </>
          )}
        </button>

        {/* Download file */}
        <button
          type="button"
          onClick={handleDownloadFile}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          title="Descargar en formato Markdown / Texto"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>Descargar (.md)</span>
        </button>

        {/* Print / Save PDF */}
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          title="Imprimir o guardar como PDF"
        >
          <Printer className="w-4 h-4 text-slate-400" />
          <span>Imprimir / PDF</span>
        </button>

        {/* Reset / New Audit */}
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <span>Nueva Auditoría</span>
        </button>
      </div>
    </div>
  );
};
