import React from 'react';
import { ShieldCheck, BookOpen, Scale, Award, FileText, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onOpenNormativa: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNormativa }) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-400/20">
                  <Scale className="w-3 h-3 mr-1" />
                  SCAFT - MEN Colombia
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Decreto 2888/2007 • Ley 1064/2006
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                Auditor ETDH - Verificación Capítulo 2 (Guía 29)
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-normal">
                Sistema institucional de evaluación y auditoría técnica de propuestas curriculares de Formación para el Trabajo y el Desarrollo Humano
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start md:self-center">
            <button
              onClick={onOpenNormativa}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm active:scale-95"
              title="Consultar requisitos y numerales de la Guía 29"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Consultar Guía 29 (Cap. 2)</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
