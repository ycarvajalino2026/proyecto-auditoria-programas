import React from 'react';
import { AlertOctagon, AlertTriangle, Info, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import { ComplianceAlert } from '../types';

interface ComplianceAlertsSectionProps {
  alerts: ComplianceAlert[];
}

export const ComplianceAlertsSection: React.FC<ComplianceAlertsSectionProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center space-x-3 text-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-emerald-900">
              No se detectaron Alertas Críticas de Cumplimiento
            </h3>
            <p className="text-xs text-emerald-700 mt-0.5">
              El documento supera las verificaciones obligatorias de intensidad horaria mínima, formación práctica, CNO y presupuesto quinquenal.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const criticalAlerts = alerts.filter((a) => a.level === 'CRITICA');
  const highAlerts = alerts.filter((a) => a.level === 'ALTA');
  const otherAlerts = alerts.filter((a) => a.level !== 'CRITICA' && a.level !== 'ALTA');

  const getAlertBadge = (level: string) => {
    switch (level) {
      case 'CRITICA':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          cardBorder: 'border-l-4 border-l-rose-600 border-slate-200 bg-rose-50/40',
          icon: <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />,
          label: 'Alerta Crítica (Causal de No Registro)',
        };
      case 'ALTA':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          cardBorder: 'border-l-4 border-l-amber-500 border-slate-200 bg-amber-50/40',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          label: 'Alerta Alta (Requiere Ajuste Técnico)',
        };
      default:
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          cardBorder: 'border-l-4 border-l-blue-500 border-slate-200 bg-blue-50/30',
          icon: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
          label: 'Alerta Preventiva / Informativa',
        };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <h3 className="text-base font-bold tracking-tight">
            Alertas de Cumplimiento Normativo y Omisiones Críticas
          </h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 self-start sm:self-auto">
          {alerts.length} {alerts.length === 1 ? 'Observación detectada' : 'Observaciones detectadas'}
        </span>
      </div>

      <div className="p-6 space-y-4">
        {alerts.map((alert) => {
          const style = getAlertBadge(alert.level);
          return (
            <div
              key={alert.id}
              className={`rounded-lg p-4.5 border transition shadow-2xs ${style.cardBorder}`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-start space-x-2.5">
                  <div className="mt-0.5">{style.icon}</div>
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border mb-1 ${style.bg}`}>
                      {style.label}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {alert.title}
                    </h4>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 ml-7 leading-relaxed">
                {alert.description}
              </p>

              <div className="mt-3 ml-7 grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2.5 border-t border-slate-200/80">
                <div className="bg-white/80 p-2.5 rounded border border-slate-200 text-xs">
                  <span className="font-bold text-slate-900 block mb-0.5">
                    Impacto en el trámite de Registro:
                  </span>
                  <span className="text-slate-600">{alert.impactOnRegistration}</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded border border-slate-200 text-xs">
                  <span className="font-bold text-blue-900 block mb-0.5 flex items-center">
                    <ArrowRight className="w-3 h-3 text-blue-600 mr-1 shrink-0" />
                    Acción inmediata requerida:
                  </span>
                  <span className="text-slate-700 font-medium">{alert.suggestedAction}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
