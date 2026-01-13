import React from 'react';
import { ArrowLeft, Printer, FileText, FileEdit } from 'lucide-react';
import { SermonData } from '@/types/sermon';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
    sermon: SermonData;
    isOpen: boolean;
    onClose: () => void;
}

export const PreviewPDF: React.FC<Props> = ({ sermon, isOpen, onClose }) => {
    const { t } = useLanguage();
    if (!isOpen) return null;

    // Format Date
    let dateStr = "Data não definida";
    if (sermon.date) {
        const parts = sermon.date.split('-'); // YYYY-MM-DD
        if (parts.length === 3) dateStr = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    const handlePrint = () => window.print();

    const handleDownload = async (type: 'pdf' | 'docx') => {
        if (type === 'pdf') {
            try {
                const { jsPDF } = await import('jspdf');
                const doc = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                const margin = 20;
                const contentWidth = pageWidth - (margin * 2);
                let yPos = margin;

                // Helper to add page if needed
                const checkPageBreak = (neededSpace: number) => {
                    if (yPos + neededSpace > pageHeight - margin) {
                        doc.addPage();
                        yPos = margin;
                        return true;
                    }
                    return false;
                };

                // Helper to add text with wrapping
                const addText = (text: string, fontSize: number, isBold: boolean = false, isItalic: boolean = false, align: 'left' | 'center' | 'right' = 'left') => {
                    doc.setFontSize(fontSize);
                    doc.setFont('helvetica', isBold ? 'bold' : (isItalic ? 'italic' : 'normal'));

                    const lines = doc.splitTextToSize(text, contentWidth);
                    const lineHeight = fontSize * 0.4;

                    checkPageBreak(lines.length * lineHeight);

                    lines.forEach((line: string) => {
                        let xPos = margin;
                        if (align === 'center') xPos = pageWidth / 2;
                        if (align === 'right') xPos = pageWidth - margin;

                        doc.text(line, xPos, yPos, { align });
                        yPos += lineHeight;
                    });
                };

                // Title
                addText(sermon.title || t('sermon.title'), 18, true, false, 'center');
                yPos += 5;

                // Date and Theme
                addText(dateStr, 10, false, false, 'center');
                if (sermon.theme) {
                    yPos += 2;
                    addText(sermon.theme, 10, true, false, 'center');
                }
                yPos += 10;

                // Main Verse
                if (sermon.mainVerseText) {
                    doc.setDrawColor(79, 70, 229);
                    doc.setLineWidth(1);
                    const verseHeight = doc.splitTextToSize(`"${sermon.mainVerseText}"`, contentWidth - 10).length * 4.4;
                    doc.line(margin, yPos, margin, yPos + verseHeight + 5);

                    yPos += 3;
                    const savedX = margin + 5;
                    doc.setFontSize(11);
                    doc.setFont('helvetica', 'italic');
                    const verseLines = doc.splitTextToSize(`"${sermon.mainVerseText}"`, contentWidth - 10);
                    verseLines.forEach((line: string) => {
                        doc.text(line, savedX, yPos);
                        yPos += 4.4;
                    });
                    yPos += 2;
                    addText(`— ${sermon.mainVerse || t('sermon.verse')}`, 9, true, false, 'right');
                    yPos += 8;
                }

                // Objective
                if (sermon.objective) {
                    checkPageBreak(20);
                    doc.setFillColor(255, 251, 235);
                    const objHeight = doc.splitTextToSize(sermon.objective, contentWidth - 4).length * 4 + 12;
                    doc.rect(margin, yPos, contentWidth, objHeight, 'F');
                    yPos += 4;
                    addText(t('sermon.objective').toUpperCase(), 8, true);
                    yPos += 2;
                    addText(sermon.objective, 10);
                    yPos += 8;
                }

                // Introduction
                if (sermon.introOpening || sermon.introContext || sermon.introHook) {
                    checkPageBreak(20);
                    addText(`I. ${t('sermon.intro').toUpperCase()}`, 14, true);
                    yPos += 5;

                    if (sermon.introOpening) {
                        addText(t('sermon.introOpening'), 9, true);
                        yPos += 2;
                        addText(sermon.introOpening, 10);
                        yPos += 5;
                    }
                    if (sermon.introContext) {
                        addText(t('sermon.introContext'), 9, true);
                        yPos += 2;
                        addText(sermon.introContext, 10);
                        yPos += 5;
                    }
                    if (sermon.introHook) {
                        addText(t('sermon.introHook'), 9, true);
                        yPos += 2;
                        addText(sermon.introHook, 10);
                        yPos += 5;
                    }
                }

                // Exposition
                if (sermon.expoHistorical || sermon.expoCultural || sermon.expoAnalysis) {
                    checkPageBreak(20);
                    addText(`II. ${t('sermon.exposition').toUpperCase()}`, 14, true);
                    yPos += 5;

                    if (sermon.expoHistorical) {
                        addText(t('sermon.expoHistorical'), 9, true);
                        yPos += 2;
                        addText(sermon.expoHistorical, 10);
                        yPos += 5;
                    }
                    if (sermon.expoCultural) {
                        addText(t('sermon.expoCultural'), 9, true);
                        yPos += 2;
                        addText(sermon.expoCultural, 10);
                        yPos += 5;
                    }
                    if (sermon.expoAnalysis) {
                        addText(t('sermon.expoAnalysis'), 9, true);
                        yPos += 2;
                        addText(sermon.expoAnalysis, 10);
                        yPos += 5;
                    }
                }

                // Points
                if (sermon.points.length > 0) {
                    checkPageBreak(20);
                    addText(`III. ${t('sermon.points').toUpperCase()}`, 14, true);
                    yPos += 5;

                    sermon.points.forEach((point, index) => {
                        checkPageBreak(15);
                        addText(`${index + 1}. ${point.title}`, 12, true);
                        yPos += 3;
                        addText(point.content, 10);
                        yPos += 6;
                    });
                }

                // Applications
                if (sermon.appPersonal || sermon.appFamily || sermon.appChurch || sermon.appSociety) {
                    checkPageBreak(20);
                    addText(`IV. ${t('sermon.application').toUpperCase()}`, 14, true);
                    yPos += 5;

                    if (sermon.appPersonal) {
                        addText(t('sermon.appPersonal'), 9, true);
                        yPos += 2;
                        addText(sermon.appPersonal, 10);
                        yPos += 5;
                    }
                    if (sermon.appFamily) {
                        addText(t('sermon.appFamily'), 9, true);
                        yPos += 2;
                        addText(sermon.appFamily, 10);
                        yPos += 5;
                    }
                    if (sermon.appChurch) {
                        addText(t('sermon.appChurch'), 9, true);
                        yPos += 2;
                        addText(sermon.appChurch, 10);
                        yPos += 5;
                    }
                    if (sermon.appSociety) {
                        addText(t('sermon.appSociety'), 9, true);
                        yPos += 2;
                        addText(sermon.appSociety, 10);
                        yPos += 5;
                    }
                }

                // Conclusion
                if (sermon.concSummary || sermon.concAction || sermon.concPrayer) {
                    checkPageBreak(20);
                    addText(`V. ${t('sermon.conclusion').toUpperCase()}`, 14, true);
                    yPos += 5;

                    if (sermon.concSummary) {
                        addText(t('sermon.concSummary'), 9, true);
                        yPos += 2;
                        addText(sermon.concSummary, 10);
                        yPos += 5;
                    }
                    if (sermon.concAction) {
                        addText(t('sermon.concAction'), 9, true);
                        yPos += 2;
                        addText(sermon.concAction, 10);
                        yPos += 5;
                    }
                    if (sermon.concPrayer) {
                        addText(t('sermon.concPrayer'), 9, true);
                        yPos += 2;
                        addText(sermon.concPrayer, 10, false, true);
                        yPos += 5;
                    }
                }

                // Footer
                const totalPages = doc.getNumberOfPages();
                for (let i = 1; i <= totalPages; i++) {
                    doc.setPage(i);
                    doc.setFontSize(8);
                    doc.setFont('helvetica', 'normal');
                    doc.text(
                        'Gerado via Sermonia - Inteligência Pastoral',
                        pageWidth / 2,
                        pageHeight - 10,
                        { align: 'center' }
                    );
                }

                doc.save(`${sermon.title || 'sermon'}.pdf`);
            } catch (error) {
                console.error('Erro ao gerar PDF:', error);
                alert('Erro ao gerar PDF. Por favor, tente novamente.');
            }
        } else {
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [
                        new Paragraph({
                            text: sermon.title || t('sermon.title'),
                            heading: HeadingLevel.TITLE,
                            alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                            text: dateStr,
                            alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({ text: "" }),

                        // Main Verse
                        ...(sermon.mainVerseText ? [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `"${sermon.mainVerseText}"`,
                                        italics: true,
                                    }),
                                ],
                                alignment: AlignmentType.CENTER,
                            }),
                            new Paragraph({
                                text: `— ${sermon.mainVerse || t('sermon.verse')}`,
                                alignment: AlignmentType.RIGHT,
                            }),
                            new Paragraph({ text: "" }),
                        ] : []),

                        // Objective
                        ...(sermon.objective ? [
                            new Paragraph({
                                text: t('sermon.objective').toUpperCase(),
                                heading: HeadingLevel.HEADING_3,
                            }),
                            new Paragraph({
                                text: sermon.objective,
                            }),
                            new Paragraph({ text: "" }),
                        ] : []),

                        // Introduction
                        new Paragraph({
                            text: `I. ${t('sermon.intro').toUpperCase()}`,
                            heading: HeadingLevel.HEADING_1,
                        }),
                        ...(sermon.introOpening ? [
                            new Paragraph({ children: [new TextRun({ text: `${t('sermon.introOpening')}: `, bold: true }), new TextRun(sermon.introOpening)] }),
                        ] : []),
                        ...(sermon.introContext ? [
                            new Paragraph({ children: [new TextRun({ text: `${t('sermon.introContext')}: `, bold: true }), new TextRun(sermon.introContext)] }),
                        ] : []),
                        ...(sermon.introHook ? [
                            new Paragraph({ children: [new TextRun({ text: `${t('sermon.introHook')}: `, bold: true }), new TextRun(sermon.introHook)] }),
                        ] : []),
                        new Paragraph({ text: "" }),

                        // Exposition
                        new Paragraph({
                            text: `II. ${t('sermon.exposition').toUpperCase()}`,
                            heading: HeadingLevel.HEADING_1,
                        }),
                        ...(sermon.expoHistorical ? [
                            new Paragraph({ children: [new TextRun({ text: `${t('sermon.expoHistorical')}: `, bold: true }), new TextRun(sermon.expoHistorical)] }),
                        ] : []),
                        ...(sermon.expoCultural ? [
                            new Paragraph({ children: [new TextRun({ text: `${t('sermon.expoCultural')}: `, bold: true }), new TextRun(sermon.expoCultural)] }),
                        ] : []),
                        ...(sermon.expoAnalysis ? [
                            new Paragraph({ children: [new TextRun({ text: `${t('sermon.expoAnalysis')}: `, bold: true }), new TextRun(sermon.expoAnalysis)] }),
                        ] : []),
                        new Paragraph({ text: "" }),

                        // Points
                        new Paragraph({
                            text: `III. ${t('sermon.points').toUpperCase()}`,
                            heading: HeadingLevel.HEADING_1,
                        }),
                        ...(sermon.points || []).flatMap((p, i) => [
                            new Paragraph({
                                text: `${i + 1}. ${p.title}`,
                                heading: HeadingLevel.HEADING_2,
                            }),
                            new Paragraph({
                                text: p.content,
                            }),
                            new Paragraph({ text: "" }),
                        ]),

                        // Application
                        new Paragraph({
                            text: `IV. ${t('sermon.application').toUpperCase()}`,
                            heading: HeadingLevel.HEADING_1,
                        }),
                        ...(sermon.appPersonal ? [
                            new Paragraph({ children: [new TextRun({ text: `${t('sermon.appPersonal')}: `, bold: true }), new TextRun(sermon.appPersonal)] }),
                        ] : []),
                        ...(sermon.appFamily ? [
                            new Paragraph({ children: [new TextRun({ text: `${t('sermon.appFamily')}: `, bold: true }), new TextRun(sermon.appFamily)] }),
                        ] : []),
                        ...(sermon.appChurch ? [
                            new Paragraph({ children: [new TextRun({ text: `${t('sermon.appChurch')}: `, bold: true }), new TextRun(sermon.appChurch)] }),
                        ] : []),
                        ...(sermon.appSociety ? [
                            new Paragraph({ children: [new TextRun({ text: `${t('sermon.appSociety')}: `, bold: true }), new TextRun(sermon.appSociety)] }),
                        ] : []),
                        new Paragraph({ text: "" }),

                        // Conclusion
                        new Paragraph({
                            text: `V. ${t('sermon.conclusion').toUpperCase()}`,
                            heading: HeadingLevel.HEADING_1,
                        }),
                        ...(sermon.concSummary ? [
                            new Paragraph({ children: [new TextRun({ text: `${t('sermon.concSummary')}: `, bold: true }), new TextRun(sermon.concSummary)] }),
                        ] : []),
                        ...(sermon.concAction ? [
                            new Paragraph({ children: [new TextRun({ text: `${t('sermon.concAction')}: `, bold: true }), new TextRun(sermon.concAction)] }),
                        ] : []),
                        ...(sermon.concPrayer ? [
                            new Paragraph({ children: [new TextRun({ text: `${t('sermon.concPrayer')}: `, bold: true }), new TextRun(sermon.concPrayer)] }),
                        ] : []),
                    ],
                }],
            });

            Packer.toBlob(doc).then((blob) => {
                saveAs(blob, `${sermon.title || 'sermon'}.docx`);
            });
        }
    };

    return (
        <div id="print-modal-overlay" className="fixed inset-0 z-[100] bg-slate-900/90 overflow-y-auto print:bg-white print:static print:overflow-visible print:h-auto">
            <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 print:p-0 print:block print:h-auto print:w-full">

                {/* Barra de Ações */}
                <div className="w-full max-w-[210mm] flex justify-between items-center mb-6 sticky top-0 z-50 print:hidden">
                    <div className="text-white">
                        <h2 className="text-lg font-bold flex items-center gap-2"><Printer className="w-5 h-5" /> {t('sermon.printPreview')}</h2>
                        <p className="text-xs text-slate-400">{t('sermon.printPreviewDesc')}</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-bold flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" /> {t('common.back')}
                        </button>
                        <button onClick={() => handleDownload('docx')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm font-bold flex items-center gap-2 shadow-lg">
                            <FileEdit className="w-4 h-4" /> Baixar DOC
                        </button>
                        <button onClick={() => handleDownload('pdf')} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors text-sm font-bold flex items-center gap-2 shadow-lg">
                            <FileText className="w-4 h-4" /> Baixar PDF
                        </button>
                    </div>
                </div>

                {/* Folha A4 com suporte a múltiplas páginas */}
                <div
                    id="print-area"
                    style={{
                        width: '100%',
                        maxWidth: '210mm',
                        padding: '25mm',
                        margin: '0 auto',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                        fontFamily: 'serif', // Merriweather fallback
                        // Garante que o conteúdo quebre em páginas
                        pageBreakInside: 'auto',
                        pageBreakAfter: 'auto',
                        pageBreakBefore: 'auto'
                    }}
                >

                    {/* Cabeçalho Decorativo */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '4px double #cbd5e1' }}>
                        <div style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem auto', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #4f46e5, #9333ea)' }}>
                            <svg style={{ width: '2rem', height: '2rem', color: '#ffffff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.75rem', lineHeight: '1.25', color: '#0f172a' }}>{sermon.title || t('sermon.title')}</h1>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', fontFamily: 'sans-serif', marginTop: '0.75rem', color: '#475569' }}>
                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', backgroundColor: '#f1f5f9' }}>{dateStr}</span>
                            {sermon.theme && <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontWeight: '600', backgroundColor: '#eef2ff', color: '#4338ca' }}>{sermon.theme}</span>}
                        </div>
                    </div>

                    {/* Versículo Principal em Destaque */}
                    {sermon.mainVerseText && (
                        <div style={{ marginBottom: '2rem', padding: '1.5rem', borderLeft: '4px solid #4f46e5', borderTopRightRadius: '0.5rem', borderBottomRightRadius: '0.5rem', background: 'linear-gradient(to right, #eef2ff, #faf5ff)' }}>
                            <p style={{ fontSize: '1.125rem', fontStyle: 'italic', lineHeight: '1.625', textAlign: 'center', marginBottom: '0.5rem', color: '#1e293b' }}>
                                "{sermon.mainVerseText}"
                            </p>
                            <p style={{ textAlign: 'right', fontSize: '0.875rem', fontWeight: 'bold', color: '#4338ca' }}>
                                — {sermon.mainVerse || t('sermon.verse')}
                            </p>
                        </div>
                    )}

                    {/* Objetivo */}
                    {sermon.objective && (
                        <div style={{ marginBottom: '2rem', padding: '1.25rem', border: '1px solid #fde68a', borderRadius: '0.5rem', backgroundColor: '#fffbeb' }}>
                            <h3 style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', color: '#92400e' }}>{t('sermon.objective')}</h3>
                            <p style={{ lineHeight: '1.625', color: '#1e293b' }}>{sermon.objective}</p>
                        </div>
                    )}

                    {/* Introdução */}
                    {(sermon.introOpening || sermon.introContext || sermon.introHook) && (
                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'sans-serif', borderBottom: '2px solid #cbd5e1', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
                                <span style={{ width: '2rem', height: '2rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', backgroundColor: '#0f172a', color: '#ffffff' }}>I</span>
                                {t('sermon.intro')}
                            </h2>
                            <div style={{ paddingLeft: '1.5rem' }}>
                                {sermon.introOpening && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', color: '#4338ca' }}>{t('sermon.introOpening')}</h4>
                                        <p style={{ lineHeight: '1.625', color: '#334155' }}>{sermon.introOpening}</p>
                                    </div>
                                )}
                                {sermon.introContext && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', color: '#4338ca' }}>{t('sermon.introContext')}</h4>
                                        <p style={{ lineHeight: '1.625', color: '#334155' }}>{sermon.introContext}</p>
                                    </div>
                                )}
                                {sermon.introHook && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', color: '#4338ca' }}>{t('sermon.introHook')}</h4>
                                        <p style={{ lineHeight: '1.625', color: '#334155' }}>{sermon.introHook}</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Exposição Bíblica */}
                    {(sermon.expoHistorical || sermon.expoCultural || sermon.expoAnalysis || sermon.expoSupportVerses) && (
                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'sans-serif', borderBottom: '2px solid #cbd5e1', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
                                <span style={{ width: '2rem', height: '2rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', backgroundColor: '#0f172a', color: '#ffffff' }}>II</span>
                                {t('sermon.exposition')}
                            </h2>
                            <div style={{ paddingLeft: '1.5rem' }}>
                                {sermon.expoHistorical && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', color: '#4338ca' }}>{t('sermon.expoHistorical')}</h4>
                                        <p style={{ lineHeight: '1.625', color: '#334155' }}>{sermon.expoHistorical}</p>
                                    </div>
                                )}
                                {sermon.expoCultural && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', color: '#4338ca' }}>{t('sermon.expoCultural')}</h4>
                                        <p style={{ lineHeight: '1.625', color: '#334155' }}>{sermon.expoCultural}</p>
                                    </div>
                                )}
                                {sermon.expoAnalysis && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', color: '#4338ca' }}>{t('sermon.expoAnalysis')}</h4>
                                        <p style={{ lineHeight: '1.625', whiteSpace: 'pre-line', color: '#334155' }}>{sermon.expoAnalysis}</p>
                                    </div>
                                )}
                                {sermon.expoSupportVersesText && (
                                    <div style={{ marginTop: '0.75rem', padding: '1rem', borderLeft: '4px solid #3b82f6', backgroundColor: '#eff6ff' }}>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', color: '#1d4ed8' }}>{t('sermon.expoSupportVersesText')}</h4>
                                        <p style={{ fontSize: '0.875rem', fontStyle: 'italic', marginBottom: '0.25rem', color: '#334155' }}>{sermon.expoSupportVersesText}</p>
                                        {sermon.expoSupportVerses && <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#2563eb' }}>({sermon.expoSupportVerses})</p>}
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Desenvolvimento / Pontos Principais */}
                    {sermon.points.length > 0 && (
                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'sans-serif', borderBottom: '2px solid #cbd5e1', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
                                <span style={{ width: '2rem', height: '2rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', backgroundColor: '#0f172a', color: '#ffffff' }}>III</span>
                                {t('sermon.points')}
                            </h2>
                            <div style={{ paddingLeft: '1.5rem' }}>
                                {sermon.points.map((p, i) => (
                                    <div key={p.id} style={{ marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
                                            <span style={{ width: '1.5rem', height: '1.5rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', backgroundColor: '#4f46e5', color: '#ffffff' }}>{i + 1}</span>
                                            {p.title}
                                        </h3>
                                        <div style={{ lineHeight: '1.625', paddingLeft: '2rem', whiteSpace: 'pre-wrap', color: '#334155' }}>{p.content}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Aplicações Práticas */}
                    {(sermon.appPersonal || sermon.appFamily || sermon.appChurch || sermon.appSociety) && (
                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'sans-serif', borderBottom: '2px solid #cbd5e1', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
                                <span style={{ width: '2rem', height: '2rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', backgroundColor: '#0f172a', color: '#ffffff' }}>IV</span>
                                {t('sermon.application')}
                            </h2>
                            <div style={{ paddingLeft: '1.5rem' }}>
                                {sermon.appPersonal && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', color: '#4338ca' }}>{t('sermon.appPersonal')}</h4>
                                        <p style={{ lineHeight: '1.625', color: '#334155' }}>{sermon.appPersonal}</p>
                                    </div>
                                )}
                                {sermon.appFamily && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', color: '#4338ca' }}>{t('sermon.appFamily')}</h4>
                                        <p style={{ lineHeight: '1.625', color: '#334155' }}>{sermon.appFamily}</p>
                                    </div>
                                )}
                                {sermon.appChurch && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', color: '#4338ca' }}>{t('sermon.appChurch')}</h4>
                                        <p style={{ lineHeight: '1.625', color: '#334155' }}>{sermon.appChurch}</p>
                                    </div>
                                )}
                                {sermon.appSociety && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', color: '#4338ca' }}>{t('sermon.appSociety')}</h4>
                                        <p style={{ lineHeight: '1.625', color: '#334155' }}>{sermon.appSociety}</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Conclusão */}
                    {(sermon.concSummary || sermon.concAction || sermon.concPrayer) && (
                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'sans-serif', borderBottom: '2px solid #cbd5e1', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
                                <span style={{ width: '2rem', height: '2rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', backgroundColor: '#0f172a', color: '#ffffff' }}>V</span>
                                {t('sermon.conclusion')}
                            </h2>
                            <div style={{ paddingLeft: '1.5rem' }}>
                                {sermon.concSummary && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', color: '#4338ca' }}>{t('sermon.concSummary')}</h4>
                                        <p style={{ lineHeight: '1.625', color: '#334155' }}>{sermon.concSummary}</p>
                                    </div>
                                )}
                                {sermon.concAction && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', color: '#4338ca' }}>{t('sermon.concAction')}</h4>
                                        <p style={{ lineHeight: '1.625', fontWeight: '600', color: '#334155' }}>{sermon.concAction}</p>
                                    </div>
                                )}
                                {sermon.concPrayer && (
                                    <div style={{ padding: '1rem', borderLeft: '4px solid #9333ea', borderTopRightRadius: '0.5rem', borderBottomRightRadius: '0.5rem', backgroundColor: '#faf5ff' }}>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', color: '#7e22ce' }}>{t('sermon.concPrayer')}</h4>
                                        <p style={{ lineHeight: '1.625', fontStyle: 'italic', color: '#334155' }}>{sermon.concPrayer}</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Recursos e Notas Extras */}
                    {(sermon.notesImages || sermon.notesStats || sermon.notesQuotes || sermon.notesGeneral) && (
                        <section style={{ marginBottom: '2rem', borderTop: '2px dashed #cbd5e1', paddingTop: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'sans-serif', marginBottom: '1rem', color: '#334155' }}>{t('sermon.notes')}</h2>
                            <div style={{ fontSize: '0.875rem' }}>
                                {sermon.notesImages && (
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <h5 style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: '#475569' }}>{t('sermon.notesImages')}:</h5>
                                        <p style={{ lineHeight: '1.625', color: '#475569' }}>{sermon.notesImages}</p>
                                    </div>
                                )}
                                {sermon.notesStats && (
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <h5 style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: '#475569' }}>{t('sermon.notesStats')}:</h5>
                                        <p style={{ lineHeight: '1.625', color: '#475569' }}>{sermon.notesStats}</p>
                                    </div>
                                )}
                                {sermon.notesQuotes && (
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <h5 style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: '#475569' }}>{t('sermon.notesQuotes')}:</h5>
                                        <p style={{ lineHeight: '1.625', fontStyle: 'italic', color: '#475569' }}>{sermon.notesQuotes}</p>
                                    </div>
                                )}
                                {sermon.notesGeneral && (
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <h5 style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: '#475569' }}>{t('sermon.notesGeneral')}:</h5>
                                        <p style={{ lineHeight: '1.625', color: '#475569' }}>{sermon.notesGeneral}</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Rodapé Elegante */}
                    <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'sans-serif', color: '#94a3b8' }}>
                            <div style={{ width: '3rem', height: '1px', backgroundColor: '#cbd5e1' }}></div>
                            <span>Gerado via Sermonia - Inteligência Pastoral</span>
                            <div style={{ width: '3rem', height: '1px', backgroundColor: '#cbd5e1' }}></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
