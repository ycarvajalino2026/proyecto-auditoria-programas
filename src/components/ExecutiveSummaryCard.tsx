import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Building2, 
  GraduationCap, 
  Layers, 
  Award,
  CheckCircle,
  FileCheck2,
  TrendingUp,
  Percent
} from 'lucide-react';
import { ExecutiveSummary } from '../types';

interface ExecutiveSummaryCardProps {
  summary: ExecutiveSummary;
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({ summary }) => {
  const {
    programNameDetected,
    institutionNameDetected,
    programType,
    totalHoursDetected,
    practicePercentageDetected,
    verdict,
    verdictLabel,
    readinessScore,
    overallAssessment,
    secretariaRecommendation,
    metrics,
  } = summary;

  // Determine styles by verdict
  const getVerdictTheme = () => {
    switch (verdict) {
      case 'LISTO_PARA_RADICACION':
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
          badgeBg: 'bg-emerald-600 text-white',
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />,
          progressColor: 'bg-emerald-500',
          textColor: 'text-emerald-800',
          chipBg: 'bg-emerald-100/80 text-emerald-900 border-emerald-200',
        };
      case 'REQUIERE_AJUSTES_MENORES':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-950',
          badgeBg: 'bg-amber-600 text-white',
          icon: <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />,
          progressColor: 'bg-amber-500',
          textColor: 'text-amber-800',
          chipBg: 'bg-amber-100/80 text-amber-900 border-amber-200',
        };
      case 'NO_CUMPLE_REESTRUCTURACION':
      default:
        return {
          bg: 'bg-rose-50 border-rose-300 text-rose-950',
          badgeBg: 'bg-rose-600 text-white',
          icon: <XCircle className="w-6 h-6 text-rose-600 shrink-0" />,
          progressColor: 'bg-rose-500',
          textColor: 'text-rose-800',
          chipBg: 'bg-rose-100/80 text-rose-900 border-rose-200',
        };
    }
  };

  const theme = getVerdictTheme();

  return (
    <div className={`rounded-xl border shadow-sm p-6 ${theme.bg} transition-all`}>
      {/* Verdict Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-black/10">
        <div className="flex items-start space-x-3.5">
          <div className="mt-1">{theme.icon}</div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Diagnóstico de Calidad y Radicación (Guía 29 MEN)
            </span>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 mt-0.5">
              {verdictLabel}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800 shadow-2xs">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
                {programNameDetected}
              </span>
              {institutionNameDetected && (
                <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-md bg-white/80 border border-slate-200 text-slate-700">
                  <Building2 className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
                  {institutionNameDetected}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Global Compliance Score */}
        <div className="flex items-center space-x-4 bg-white/90 rounded-xl p-3.5 border border-slate-200/80 shadow-2xs shrink-0 self-start lg:self-center">
          <div className="text-right">
            <span className="text-[11px] font-semibold uppercase text-slate-500 block">
              Índice de Conformidad
            </span>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {readinessScore}%
            </span>
          </div>
          <div className="w-14 h-14 relative flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200"
                strokeWidth="3.8"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={readinessScore >= 80 ? 'text-emerald-500' : readinessScore >= 60 ? 'text-amber-500' : 'text-rose-500'}
                strokeDasharray={`${readinessScore}, 100`}
                strokeWidth="3.8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[11px] font-bold text-slate-700">
              Cap. 2
            </span>
          </div>
        </div>
      </div>

      {/* 4 Metric counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-black/10">
        <div className="bg-white/85 rounded-lg p-3 border border-emerald-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-emerald-800 uppercase flex items-center">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mr-1" />
            Cumple a Cabalidad
          </span>
          <span className="text-xl font-bold text-emerald-950 mt-1 block">
            {metrics.fulfilled} <span className="text-xs font-normal text-slate-500">de {metrics.totalRequirements}</span>
          </span>
        </div>

        <div className="bg-white/85 rounded-lg p-3 border border-amber-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-amber-800 uppercase flex items-center">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mr-1" />
            Cumplimiento Parcial
          </span>
          <span className="text-xl font-bold text-amber-950 mt-1 block">
            {metrics.partial} <span className="text-xs font-normal text-slate-500">requisitos</span>
          </span>
        </div>

        <div className="bg-white/85 rounded-lg p-3 border border-rose-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-rose-800 uppercase flex items-center">
            <XCircle className="w-3.5 h-3.5 text-rose-600 mr-1" />
            No Cumple / Omisión
          </span>
          <span className="text-xl font-bold text-rose-950 mt-1 block">
            {metrics.unfulfilled} <span className="text-xs font-normal text-slate-500">requisitos</span>
          </span>
        </div>

        <div className="bg-white/85 rounded-lg p-3 border border-blue-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-blue-800 uppercase flex items-center">
            <Clock className="w-3.5 h-3.5 text-blue-600 mr-1" />
            Intensidad Horaria
          </span>
          <span className="text-sm font-bold text-blue-950 mt-1 block truncate" title={String(totalHoursDetected)}>
            {totalHoursDetected}
          </span>
        </div>
      </div>

      {/* Key findings and Secretaria recommendation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div className="bg-white/90 rounded-lg p-4 border border-slate-200 shadow-2xs">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center">
            <FileCheck2 className="w-4 h-4 text-blue-600 mr-1.5" />
            Diagnóstico Técnico Institucional
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {overallAssessment}
          </p>
          {practicePercentageDetected && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center text-xs text-slate-600">
              <span className="font-semibold mr-1.5">Componente Práctico:</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-mono text-[11px]">
                {practicePercentageDetected}
              </span>
            </div>
          )}
        </div>

        <div className="bg-white/90 rounded-lg p-4 border border-slate-200 shadow-2xs">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center">
            <Award className="w-4 h-4 text-purple-600 mr-1.5" />
            Recomendación para Secretaría de Educación
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {secretariaRecommendation}
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center text-[11px] text-slate-500">
            <span>Base jurídica: Decreto 2888 de 2007 (Art. 8, 11, 17) & Guía 29 MEN</span>
          </div>
        </div>
      </div>
    </div>
  );
};
