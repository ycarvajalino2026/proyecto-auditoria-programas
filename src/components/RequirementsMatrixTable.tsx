import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Search, 
  Filter, 
  Layers, 
  Check, 
  FileSpreadsheet,
  Quote,
  Wrench,
  BookOpen
} from 'lucide-react';
import { RequirementItem, RequirementStatus } from '../types';

interface RequirementsMatrixTableProps {
  matrix: RequirementItem[];
}

export const RequirementsMatrixTable: React.FC<RequirementsMatrixTableProps> = ({ matrix }) => {
  const [filterStatus, setFilterStatus] = useState<RequirementStatus | 'TODOS'>('TODOS');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMatrix = matrix.filter((item) => {
    const matchesStatus = filterStatus === 'TODOS' || item.status === filterStatus;
    const matchesQuery = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.numeral.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.evidence.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.correctiveAction.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesQuery;
  });

  const getStatusBadge = (status: RequirementStatus) => {
    switch (status) {
      case 'CUMPLE':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
            Cumple
          </span>
        );
      case 'PARCIAL':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600 shrink-0" />
            Parcial
          </span>
        );
      case 'NO_CUMPLE':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600 shrink-0" />
            No Cumple
          </span>
        );
    }
  };

  const countByStatus = {
    TODOS: matrix.length,
    CUMPLE: matrix.filter((m) => m.status === 'CUMPLE').length,
    PARCIAL: matrix.filter((m) => m.status === 'PARCIAL').length,
    NO_CUMPLE: matrix.filter((m) => m.status === 'NO_CUMPLE').length,
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Table Header & Filtering controls */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Matriz de Requisitos - Verificación Capítulo 2 (Guía 29)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Evaluación detallada ítem por ítem según las disposiciones del Decreto 2888 de 2007 y orientaciones de la Guía 29 MEN.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterStatus('TODOS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                filterStatus === 'TODOS'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Todos ({countByStatus.TODOS})
            </button>
            <button
              onClick={() => setFilterStatus('CUMPLE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                filterStatus === 'CUMPLE'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              Cumple ({countByStatus.CUMPLE})
            </button>
            <button
              onClick={() => setFilterStatus('PARCIAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                filterStatus === 'PARCIAL'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
            >
              Parcial ({countByStatus.PARCIAL})
            </button>
            <button
              onClick={() => setFilterStatus('NO_CUMPLE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                filterStatus === 'NO_CUMPLE'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
              }`}
            >
              No Cumple ({countByStatus.NO_CUMPLE})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por numeral (ej. 2.1, 2.4), palabra clave, evidencia o acción correctiva..."
            className="w-full pl-10 pr-4 py-2 bg-white text-xs sm:text-sm text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
          />
        </div>
      </div>

      {/* 4-Column Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/90 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
              <th className="py-3.5 px-4 w-1/4">
                1. Requisito Exigido (Capítulo 2)
              </th>
              <th className="py-3.5 px-4 w-28 text-center">
                2. Estado
              </th>
              <th className="py-3.5 px-4 w-1/3">
                3. Evidencia Encontrada (Cita / Hallazgo)
              </th>
              <th className="py-3.5 px-4 w-1/3">
                4. Acción Correctiva (Qué falta redactar)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
            {filteredMatrix.length > 0 ? (
              filteredMatrix.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <tr 
                    key={`${item.numeral}-${index}`} 
                    className={`transition-colors hover:bg-slate-50/80 ${
                      item.status === 'NO_CUMPLE' 
                        ? 'bg-rose-50/20' 
                        : item.status === 'PARCIAL' 
                        ? 'bg-amber-50/20' 
                        : isEven ? 'bg-white' : 'bg-slate-50/40'
                    }`}
                  >
                    {/* Col 1: Requisito Exigido */}
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-center space-x-1.5 mb-1">
                        <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-xs font-bold">
                          {item.numeral}
                        </span>
                        {item.category && (
                          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <div className="font-semibold text-slate-900 leading-snug">
                        {item.name}
                      </div>
                      {item.legalBasis && (
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center">
                          <BookOpen className="w-3 h-3 text-slate-400 mr-1 shrink-0" />
                          <span>{item.legalBasis}</span>
                        </div>
                      )}
                    </td>

                    {/* Col 2: Estado */}
                    <td className="py-4 px-4 align-top text-center">
                      <div className="flex justify-center">
                        {getStatusBadge(item.status)}
                      </div>
                    </td>

                    {/* Col 3: Evidencia Encontrada */}
                    <td className="py-4 px-4 align-top text-slate-700">
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                        <div className="flex items-start space-x-1.5">
                          <Quote className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5 rotate-180" />
                          <p className="text-xs leading-relaxed italic text-slate-800">
                            {item.evidence}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Col 4: Acción Correctiva */}
                    <td className="py-4 px-4 align-top">
                      <div className={`p-2.5 rounded-lg border ${
                        item.status === 'CUMPLE'
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                          : item.status === 'PARCIAL'
                          ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                          : 'bg-rose-50/80 border-rose-200 text-rose-950'
                      }`}>
                        <div className="flex items-start space-x-1.5">
                          <Wrench className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            item.status === 'CUMPLE' 
                              ? 'text-emerald-600' 
                              : item.status === 'PARCIAL' 
                              ? 'text-amber-600' 
                              : 'text-rose-600'
                          }`} />
                          <p className="text-xs leading-relaxed font-medium">
                            {item.correctiveAction}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="py-10 text-center text-slate-500 text-sm">
                  No se encontraron requisitos que coincidan con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count indicator */}
      <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span>
          Mostrando {filteredMatrix.length} de {matrix.length} requisitos auditados del Capítulo 2 (Guía 29).
        </span>
        <span className="text-[11px] text-slate-400">
          Documento Base: Decreto 2888/2007 • Decreto 2020/2006 • MEN Colombia
        </span>
      </div>
    </div>
  );
};
