import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  FileUp, 
  Sparkles, 
  Check, 
  AlertCircle, 
  ArrowRight,
  FileCode,
  Layers,
  HelpCircle
} from 'lucide-react';
import { SAMPLE_PROGRAMS } from '../data/samplePrograms';
import { SampleProgram } from '../types';

interface FileUploadZoneProps {
  onAudit: (data: { file?: File; text?: string; fileName?: string }) => void;
  isLoading: boolean;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onAudit, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [manualText, setManualText] = useState('');
  const [manualFileName, setManualFileName] = useState('propuesta_curricular.docx');
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setSelectedSampleId(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setSelectedSampleId(null);
    }
  };

  const handleSelectSample = (sample: SampleProgram) => {
    setSelectedSampleId(sample.id);
    setSelectedFile(null);
    setManualText(sample.fullText);
    setManualFileName(`${sample.id}.docx`);
    setActiveTab('text');
  };

  const handleExecuteAudit = () => {
    if (activeTab === 'upload' && selectedFile) {
      onAudit({ file: selectedFile, fileName: selectedFile.name });
    } else if (manualText.trim().length > 0) {
      onAudit({ text: manualText, fileName: manualFileName || 'documento_curricular.txt' });
    }
  };

  const isAuditReady = (activeTab === 'upload' && selectedFile !== null) || (manualText.trim().length > 30);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Top Header / Mode Switcher */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-800 flex items-center">
            <FileUp className="w-5 h-5 text-blue-600 mr-2" />
            Carga y Validación de Propuesta Curricular
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sube el documento del programa en formato PDF o Word (.docx), o utiliza una muestra precargada.
          </p>
        </div>

        <div className="flex bg-slate-200/80 p-0.5 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === 'upload'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Subir Archivo (.pdf, .docx)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === 'text'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pegar / Editar Texto
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Sample selector pills */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
              Casos de Prueba Curricular Rápidos (Guía 29):
            </span>
            <span className="text-[11px] text-slate-400">Clic para autocompletar</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {SAMPLE_PROGRAMS.map((sample) => {
              const isSelected = selectedSampleId === sample.id;
              return (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className={`text-left p-3 rounded-lg border transition-all relative ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                      sample.id.includes('conforme') 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : sample.id.includes('fallas')
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {sample.badge}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                  </div>
                  <div className="text-xs font-medium text-slate-800 line-clamp-1">
                    {sample.title}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                    {sample.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Upload File Drag and Drop */}
        {activeTab === 'upload' ? (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
            />

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                dragOver
                  ? 'border-blue-500 bg-blue-50/60 scale-[0.99]'
                  : selectedFile
                  ? 'border-emerald-400 bg-emerald-50/30'
                  : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/60'
              }`}
            >
              <div className="max-w-md mx-auto flex flex-col items-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3.5 transition ${
                  selectedFile 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {selectedFile ? (
                    <FileText className="w-7 h-7" />
                  ) : (
                    <UploadCloud className="w-7 h-7" />
                  )}
                </div>

                {selectedFile ? (
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mb-1">
                      Archivo Seleccionado
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 break-all">
                      {selectedFile.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Tamaño: {(selectedFile.size / 1024).toFixed(1)} KB • Clic para cambiar de archivo
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Arrastra y suelta tu propuesta aquí, o <span className="text-blue-600 underline">haz clic para buscar</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5">
                      Formatos admitidos: <strong>PDF (.pdf)</strong>, <strong>Word (.docx, .doc)</strong> o <strong>Texto (.txt)</strong>.
                    </p>
                    <div className="flex items-center justify-center space-x-3 mt-3 text-[11px] text-slate-400">
                      <span>✓ Verificación Cap. 2 Guía 29</span>
                      <span>•</span>
                      <span>✓ CNO y Normas SENA</span>
                      <span>•</span>
                      <span>✓ Máx 25 MB</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Tab 2: Manual Text Editor / Sample Text */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Contenido Curricular / Texto del PEI y Malla:
              </label>
              <span className="text-[11px] text-slate-400">
                {manualText.length} caracteres • {manualText.split(/\s+/).filter(Boolean).length} palabras
              </span>
            </div>
            <textarea
              value={manualText}
              onChange={(e) => {
                setManualText(e.target.value);
                setSelectedSampleId(null);
              }}
              placeholder="Pega aquí el contenido textual de la propuesta curricular (Justificación, Denominación, Competencias, Plan de Estudios, Infraestructura, Docentes, Presupuesto)..."
              rows={9}
              className="w-full text-xs sm:text-sm font-mono text-slate-800 bg-slate-50/70 border border-slate-200 rounded-lg p-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition leading-relaxed resize-y"
            />
          </div>
        )}

        {/* Action Button Section */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500 flex items-center">
            <HelpCircle className="w-4 h-4 text-slate-400 mr-1.5 shrink-0" />
            <span>El análisis cruzará automáticamente los 10 requisitos del Capítulo 2 de la Guía 29 MEN.</span>
          </div>

          <button
            type="button"
            disabled={!isAuditReady || isLoading}
            onClick={handleExecuteAudit}
            className={`inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-bold text-white transition-all shadow-md active:scale-[0.98] ${
              isAuditReady && !isLoading
                ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/25 cursor-pointer'
                : 'bg-slate-300 cursor-not-allowed opacity-75'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Auditando Requisitos Capítulo 2...
              </span>
            ) : (
              <span className="flex items-center">
                <span>Auditar Documento Curricular</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
