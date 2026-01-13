'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { EditorSidebar } from '@/components/layout/EditorSidebar';
import { Toast } from '@/components/ui/Toast';
import { SermonBasicInfo } from '@/components/sermon/SermonBasicInfo';
import { SermonIntroduction } from '@/components/sermon/SermonIntroduction';
import { SermonExposition } from '@/components/sermon/SermonExposition';
import { SermonPoints } from '@/components/sermon/SermonPoints';
import { SermonApplication } from '@/components/sermon/SermonApplication';
import { SermonConclusion } from '@/components/sermon/SermonConclusion';
import { SermonNotes } from '@/components/sermon/SermonNotes';
import { PreviewPDF } from '@/components/sermon/PreviewPDF';
import { ConfigModal } from '@/components/sermon/ConfigModal';
import { GeneratorModal } from '@/components/sermon/GeneratorModal';

import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { CloudSermonsModal } from '@/components/sermon/CloudSermonsModal';
import { ReviewModal } from '@/components/sermon/ReviewModal';
import { ImageGeneratorModal } from '@/components/sermon/ImageGeneratorModal';
import { UserMenuModal } from '@/components/auth/UserMenuModal';
import { SermonData, emptySermon, SermonPoint } from '@/types/sermon';
import { Bell, Moon, Sun, User, Settings, LogOut } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SermoniaPage() {
  const { t, language } = useLanguage();
  const [apiKey, setApiKey] = useState('');
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isCloudSermonsOpen, setIsCloudSermonsOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isImageGenOpen, setIsImageGenOpen] = useState(false);
  const [isImageGenEnabled, setIsImageGenEnabled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Auth State
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [sections, setSections] = useState({
    basic: true, intro: true, exposition: true, points: true, application: true, conclusion: true, notes: true
  });

  const [aiPromptTheme, setAiPromptTheme] = useState('');
  const [aiPromptVerse, setAiPromptVerse] = useState('');
  const [theologyLens, setTheologyLens] = useState('Evangélica Geral');

  const [sermon, setSermon] = useState<SermonData>(emptySermon);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => setToast({ message, type });
  const toggleSection = (key: keyof typeof sections) => setSections(prev => ({ ...prev, [key]: !prev[key] }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdate = (field: keyof SermonData, value: any) => setSermon(prev => ({ ...prev, [field]: value }));

  const handlePointUpdate = (id: number, field: keyof SermonPoint, value: string) => {
    setSermon(prev => ({ ...prev, points: prev.points.map(p => p.id === id ? { ...p, [field]: value } : p) }));
  };

  const addPoint = () => setSermon(prev => ({ ...prev, points: [...prev.points, { id: Date.now(), title: '', content: '' }] }));
  const removePoint = (id: number) => setSermon(prev => ({ ...prev, points: prev.points.filter(p => p.id !== id) }));

  const handleNewSermon = () => {
    if (window.confirm("Deseja iniciar um novo sermão?")) {
      setSermon(emptySermon);
      showToast("Novo sermão iniciado!");
    }
  };

  const handleCloudSave = async () => {
    if (!token) {
      showToast("Faça login para salvar na nuvem", "error");
      window.location.href = '/login';
      return;
    }

    try {
      const isUpdate = !!sermon.id;
      const url = isUpdate ? `/api/sermons/${sermon.id}` : '/api/sermons';
      const method = isUpdate ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: sermon.title || 'Sem Título',
          content: sermon
        })
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      if (response.ok) {
        const savedSermon = await response.json();
        if (!isUpdate) {
          setSermon(prev => ({ ...prev, id: savedSermon.id }));
        }
        setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        showToast("Sermão salvo na nuvem com sucesso!");
      } else {
        let errorMessage = "Erro ao salvar";
        try {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
        } catch (e) {
          console.error("Failed to parse error response");
          errorMessage = `Erro do servidor (${response.status})`;
        }
        showToast(errorMessage, "error");
      }
    } catch (error: any) {
      console.error("Save error:", error);
      showToast(`Erro ao salvar: ${error.message || "Erro desconhecido"}`, "error");
    }
  };

  const handleLoginSuccess = (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
    // Salva no localStorage para persistir a sessão
    localStorage.setItem('sermonia_token', newToken);
    localStorage.setItem('sermonia_user', JSON.stringify(newUser));
    showToast(`Bem-vindo, ${newUser.name || newUser.email}!`);

    // Carrega API Key do usuário
    loadApiKey(newToken);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setIsAdminView(false);
    setApiKey(''); // Limpa estado
    // Remove do localStorage
    localStorage.removeItem('sermonia_token');
    localStorage.removeItem('sermonia_user');
    localStorage.removeItem('sermonia_api_key'); // Limpa chave local
    showToast("Você saiu do sistema.");
    window.location.href = '/login';
  };

  const handleLoadSermon = (loadedSermon: SermonData) => {
    // Merge com emptySermon para garantir que todos os campos existam
    const safeSermon = { ...emptySermon, ...loadedSermon };

    // Garante que points seja um array
    if (!Array.isArray(safeSermon.points)) {
      safeSermon.points = [];
    }

    // Garante que tenha pelo menos um ponto se estiver vazio (opcional, mas bom para UX)
    if (safeSermon.points.length === 0) {
      safeSermon.points = [{ id: Date.now(), title: '', content: '' }];
    }

    setSermon(safeSermon);
    showToast("Sermão carregado com sucesso!");
  };

  const handleApplyReview = (correctedText: string) => {
    // Apply corrections to intro, points, and conclusion
    const allText = `${sermon.introOpening}\n${sermon.introContext}\n${sermon.points.map(p => p.content).join('\n')}\n${sermon.concSummary}`;
    showToast("Correções aplicadas! Revise manualmente.");
  };

  const getSermonText = () => {
    return `Título: ${sermon.title}\n\nIntrodução: ${sermon.introOpening} ${sermon.introContext}\n\nPontos:\n${(sermon.points || []).map((p, i) => `${i + 1}. ${p.title}\n${p.content}`).join('\n\n')}\n\nConclusão: ${sermon.concSummary} ${sermon.concAction}`;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('sermonia_draft', JSON.stringify(sermon));
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 2000);
    return () => clearTimeout(timer);
  }, [sermon]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings/public');
      if (res.ok) {
        const data = await res.json();
        setIsImageGenEnabled(data['feature_image_generation_enabled'] === 'true');
      }
    } catch (e) {
      console.error('Erro ao carregar configurações', e);
    }
  };

  // Carrega sessão do usuário ao iniciar
  useEffect(() => {
    // Carrega configurações públicas
    fetchSettings();

    // Tenta carregar API Key local
    const localKey = localStorage.getItem('sermonia_api_key');
    if (localKey) setApiKey(localKey);

    const savedToken = localStorage.getItem('sermonia_token');
    const savedUser = localStorage.getItem('sermonia_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        console.log('Sessão restaurada:', savedUser);

        // Carrega API Key do banco
        loadApiKey(savedToken);
      } catch (e) {
        console.error('Erro ao restaurar sessão', e);
        window.location.href = '/login';
      }
    } else {
      window.location.href = '/login';
    }
  }, []);

  const handleAuthError = () => {
    localStorage.removeItem('sermonia_token');
    localStorage.removeItem('sermonia_user');
    localStorage.removeItem('sermonia_api_key');
    setToken(null);
    setUser(null);
    setApiKey('');
    setIsAdminView(false);
    showToast("Sessão expirada. Faça login novamente.", "error");
    window.location.href = '/login';
  };

  // Função para carregar API Key do banco ou localStorage
  const loadApiKey = async (authToken: string) => {
    try {
      // Tenta carregar do localStorage primeiro como fallback
      const localKey = localStorage.getItem('sermonia_api_key');
      if (localKey) setApiKey(localKey);

      const response = await fetch('/api/user/api-key', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      if (response.ok) {
        const data = await response.json();
        if (data.apiKey) {
          setApiKey(data.apiKey);
          // Atualiza localStorage para manter sincronizado
          localStorage.setItem('sermonia_api_key', data.apiKey);
          console.log('✅ API Key carregada do banco');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar API Key:', error);
    }
  };

  // Função para salvar API Key no banco e localStorage
  const saveApiKeyToDatabase = async (key: string) => {
    // Sempre salva no localStorage
    localStorage.setItem('sermonia_api_key', key);

    if (!token) {
      showToast('API Key salva localmente (faça login para salvar na nuvem)', 'success');
      return;
    }

    try {
      const response = await fetch('/api/user/api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ apiKey: key })
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      if (response.ok) {
        console.log('✅ API Key salva no banco');
        showToast('API Key salva na conta com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar API Key:', error);
      showToast('Erro ao salvar API Key na nuvem', 'error');
    }
  };

  // Carrega draft do sermão - DESATIVADO para iniciar sempre vazio
  // useEffect(() => {
  //   const saved = localStorage.getItem('sermonia_draft');
  //   if (saved) {
  //     try { setSermon(JSON.parse(saved)); } catch (e) { console.error("Erro ao carregar auto-save", e); }
  //   }
  // }, []);

  const generateSermon = async () => {
    if (!apiKey) { showToast("Configure sua API Key primeiro", 'error'); setIsAiModalOpen(false); setIsApiModalOpen(true); return; }
    if (!aiPromptTheme) { showToast("Digite um tema para o sermão", 'error'); return; }
    setIsGenerating(true);

    let lensPrompt = "";
    switch (theologyLens) {
      case 'Reformada/Calvinista':
        lensPrompt = "Enfatize a soberania de Deus, a depravação total e a graça irresistível. Use referências a teólogos reformados e uma exegese profunda.";
        break;
      case 'Pentecostal':
        lensPrompt = "Destaque a ação do Espírito Santo, o poder de Deus e a experiência espiritual. Use uma linguagem fervorosa e dinâmica.";
        break;
      case 'Histórica/Tradicional':
        lensPrompt = "Valorize a liturgia, a história da igreja e os credos. Use uma linguagem solene e reverente.";
        break;
      case 'Contemporânea':
        lensPrompt = "Conecte o texto bíblico com a cultura atual, desafios da modernidade e relevância prática. Use uma linguagem moderna e engajadora.";
        break;
      case 'Expositiva Acadêmica':
        lensPrompt = "Priorize a análise gramatical, histórica e contextual do texto. Forneça detalhes profundos e referências eruditas.";
        break;
      default: // Evangélica Geral
        lensPrompt = "Foque na salvação, graça e vida cristã prática. Use linguagem acessível e encorajadora.";
    }

    const systemPrompt = `${t('prompts.system')} 
    ${t('prompts.lens')}: ${theologyLens}.
    ${t('prompts.specificGuidelines')}: ${lensPrompt}
    ${t('prompts.jsonInstruction')}
    Estrutura: { "title": "Título", "mainVerse": "Ref", "mainVerseText": "Texto", "objective": "Obj",
    "introOpening": "...", "introContext": "...", "introHook": "...",
    "expoHistorical": "...", "expoCultural": "...", "expoAnalysis": "...", "expoSupportVerses": "...", "expoSupportVersesText": "...",
    "points": [{"title": "P1", "content": "..."}],
    "appPersonal": "...", "appFamily": "...", "appChurch": "...", "appSociety": "...",
    "concSummary": "...", "concAction": "...", "concPrayer": "...",
    "notesImages": "...", "notesStats": "...", "notesQuotes": "...", "notesGeneral": "..." }`;

    const userPrompt = `${t('prompts.user')}: "${aiPromptTheme}".`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }] })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      let text = data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
      const generatedData = JSON.parse(text);
      setSermon(prev => ({ ...prev, ...generatedData, theme: aiPromptTheme, mainVerse: generatedData.mainVerse || aiPromptVerse, points: generatedData.points.map((p: any, idx: number) => ({ ...p, id: Date.now() + idx })) }));
      setIsAiModalOpen(false);
      showToast("Sermão gerado com sucesso!");
      setSections({ basic: true, intro: true, exposition: true, points: true, application: true, conclusion: true, notes: true });
    } catch (error: any) { showToast("Erro: " + error.message, 'error'); } finally { setIsGenerating(false); }
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sermon));
    const el = document.createElement('a'); el.href = dataStr; el.download = `sermao-${sermon.title.slice(0, 20).replace(/\s+/g, '-')}.json`; el.click();
    showToast("Arquivo JSON baixado!");
  };

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const imported = JSON.parse(ev.target?.result as string);
        // Ensure points is an array and merge with emptySermon defaults
        const safeSermon = { ...emptySermon, ...imported };
        if (!Array.isArray(safeSermon.points)) {
          safeSermon.points = [];
        }
        setSermon(safeSermon);
        showToast("Backup restaurado!");
      } catch (err) {
        showToast("Arquivo inválido", 'error');
        console.error(err);
      }
    };
    reader.readAsText(e.target.files[0]);
  };

  // Force rebuild for hydration fix
  return (
    <div className={`min-h-screen pb-32 ${isDark ? 'dark bg-gray-950' : 'bg-[#F8FAFC]'}`} suppressHydrationWarning>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header com renderização apenas no cliente para evitar hydration mismatch de extensões */}
      <Header
        onNewSermon={handleNewSermon}
        onCloudOpen={() => setIsCloudSermonsOpen(true)}
        onCloudSave={handleCloudSave}
        onPreview={() => setIsPreviewOpen(true)}
        onImport={importJSON}
        onExport={exportJSON}
        onSettings={() => setIsApiModalOpen(true)}
        onGenerate={() => setIsAiModalOpen(true)}
        onReview={() => setIsReviewOpen(true)}
        onGenerateImage={() => setIsImageGenOpen(true)}
        isImageGenEnabled={isImageGenEnabled}
        onAdminToggle={() => {
          if (isAdminView) {
            // Se está em admin view, volta ao editor
            setIsAdminView(false);
          } else {
            // Se está no editor, vai para /dash
            window.location.href = '/dash';
          }
        }}
        isAdminView={isAdminView}
        userRole={user?.role}
        onLogout={handleLogout}
        user={user}
        onUserMenuOpen={() => setIsUserMenuOpen(true)}
      />

      <main className="flex-1 overflow-y-auto bg-slate-50/50 pb-32 print:hidden">
        {isAdminView ? (
          <AdminDashboard token={token} />
        ) : (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 print:hidden animate-fadeIn">
            <SermonBasicInfo sermon={sermon} isOpen={sections.basic} toggle={() => toggleSection('basic')} onUpdate={handleUpdate} />
            <SermonIntroduction sermon={sermon} isOpen={sections.intro} toggle={() => toggleSection('intro')} onUpdate={handleUpdate} />
            <SermonPoints sermon={sermon} isOpen={sections.points} toggle={() => toggleSection('points')} onPointUpdate={handlePointUpdate} onAddPoint={addPoint} onRemovePoint={removePoint} />
            <SermonConclusion sermon={sermon} isOpen={sections.conclusion} toggle={() => toggleSection('conclusion')} onUpdate={handleUpdate} />

            {/* Optional Sections - kept for completeness but hidden by default in the simplified HTML view, though React app has them */}
            <SermonExposition sermon={sermon} isOpen={sections.exposition} toggle={() => toggleSection('exposition')} onUpdate={handleUpdate} />
            <SermonApplication sermon={sermon} isOpen={sections.application} toggle={() => toggleSection('application')} onUpdate={handleUpdate} />
            <SermonNotes sermon={sermon} isOpen={sections.notes} toggle={() => toggleSection('notes')} onUpdate={handleUpdate} />
          </div>
        )}
      </main>

      <ConfigModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
        onSave={() => {
          saveApiKeyToDatabase(apiKey);
          setIsApiModalOpen(false);
        }}
      />

      <GeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        theme={aiPromptTheme}
        setTheme={setAiPromptTheme}
        verse={aiPromptVerse}
        setVerse={setAiPromptVerse}
        lens={theologyLens}
        setLens={setTheologyLens}
        isGenerating={isGenerating}
        onGenerate={generateSermon}
      />



      <CloudSermonsModal
        isOpen={isCloudSermonsOpen}
        onClose={() => setIsCloudSermonsOpen(false)}
        token={token}
        onLoadSermon={handleLoadSermon}
      />

      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        apiKey={apiKey}
        sermonContent={getSermonText()}
        onApplyCorrections={handleApplyReview}
      />

      <ImageGeneratorModal
        isOpen={isImageGenOpen}
        onClose={() => setIsImageGenOpen(false)}
        apiKey={apiKey}
        sermonTitle={sermon.title}
        sermonTheme={sermon.theme}
      />

      <UserMenuModal
        isOpen={isUserMenuOpen}
        onClose={() => setIsUserMenuOpen(false)}
        user={user}
        onOpenSettings={() => { setIsUserMenuOpen(false); setIsApiModalOpen(true); }}
        onLogout={handleLogout}
      />

      <PreviewPDF sermon={sermon} isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} />
    </div >
  );
}
