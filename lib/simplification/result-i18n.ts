import { TargetLanguage } from "@/lib/simplification/settings";

export type ResultLabels = {
  pageTitle: string;
  pageIntro: string;
  emptyTitle: string;
  emptyMessage: string;
  homeAction: string;
  newDocumentAction: string;
  quickSummaryTitle: string;
  reasonForVisitTitle: string;
  keyFindingsTitle: string;
  treatmentsTitle: string;
  nextStepsTitle: string;
  warningSignsTitle: string;
  followUpTitle: string;
  doctorQuestionsTitle: string;
  medicationsTitle: string;
  glossaryTitle: string;
  noGlossaryNeeded: string;
  medicationPurposeLabel: string;
  medicationInstructionLabel: string;
  readSummaryLabel: string;
  preparingAudioLabel: string;
  replayAudioLabel: string;
  readAgainLabel: string;
  noAudioSummaryLabel: string;
  audioPlaybackErrorLabel: string;
};

export const RESULT_LABELS: Record<TargetLanguage, ResultLabels> = {
  de: {
    pageTitle: "Ihre verständliche Erklärung ist bereit",
    pageIntro: "Nehmen Sie sich Zeit. Wir haben die wichtigsten Informationen in klaren Abschnitten für Sie aufbereitet.",
    emptyTitle: "Noch kein Ergebnis verfügbar",
    emptyMessage: "Bitte starten Sie zuerst mit einem Entlassungsbrief. Danach sehen Sie Ihre vereinfachte Erklärung hier.",
    homeAction: "Zur Startseite",
    newDocumentAction: "Neues Dokument vereinfachen",
    quickSummaryTitle: "Kurze Zusammenfassung",
    reasonForVisitTitle: "Grund für den Krankenhausaufenthalt",
    keyFindingsTitle: "Wichtige Befunde",
    treatmentsTitle: "Behandlungen im Krankenhaus",
    nextStepsTitle: "Nächste Schritte",
    warningSignsTitle: "Warnzeichen",
    followUpTitle: "Nachsorge",
    doctorQuestionsTitle: "Fragen für Ihre Ärztin oder Ihren Arzt",
    medicationsTitle: "Medikamente",
    glossaryTitle: "Begriffe einfach erklärt",
    noGlossaryNeeded: "Es sind keine zusätzlichen Begriffserklärungen nötig.",
    medicationPurposeLabel: "Wofür",
    medicationInstructionLabel: "Einnahmehinweis",
    readSummaryLabel: "Zusammenfassung vorlesen",
    preparingAudioLabel: "Wird vorbereitet...",
    replayAudioLabel: "Noch einmal abspielen",
    readAgainLabel: "Erneut vorlesen",
    noAudioSummaryLabel: "Es ist keine kurze Zusammenfassung zum Vorlesen verfügbar.",
    audioPlaybackErrorLabel: "Die Audio-Wiedergabe hat nicht funktioniert. Bitte versuchen Sie es erneut.",
  },
  en: {
    pageTitle: "Your easy-to-understand explanation is ready",
    pageIntro: "Take your time. We prepared the most important information in clear sections for you.",
    emptyTitle: "No result available yet",
    emptyMessage: "Please start with a discharge letter first. Your simplified explanation will appear here afterwards.",
    homeAction: "Back to home",
    newDocumentAction: "Simplify another document",
    quickSummaryTitle: "Short summary",
    reasonForVisitTitle: "Reason for hospital visit",
    keyFindingsTitle: "Key findings",
    treatmentsTitle: "Treatments in hospital",
    nextStepsTitle: "Next steps",
    warningSignsTitle: "Warning signs",
    followUpTitle: "Follow-up care",
    doctorQuestionsTitle: "Questions for your doctor",
    medicationsTitle: "Medication",
    glossaryTitle: "Medical terms explained simply",
    noGlossaryNeeded: "No additional term explanations are needed.",
    medicationPurposeLabel: "Purpose",
    medicationInstructionLabel: "How to take it",
    readSummaryLabel: "Read summary aloud",
    preparingAudioLabel: "Preparing...",
    replayAudioLabel: "Play again",
    readAgainLabel: "Read again",
    noAudioSummaryLabel: "No short summary is available for read-aloud.",
    audioPlaybackErrorLabel: "Audio playback failed. Please try again.",
  },
  zh: {
    pageTitle: "您的简化说明已准备好",
    pageIntro: "请慢慢阅读。我们已将最重要的信息整理成清晰的章节。",
    emptyTitle: "暂无结果",
    emptyMessage: "请先上传或输入出院信。之后，简化说明会显示在这里。",
    homeAction: "返回首页",
    newDocumentAction: "简化另一份文件",
    quickSummaryTitle: "简要总结",
    reasonForVisitTitle: "住院原因",
    keyFindingsTitle: "重要检查结果",
    treatmentsTitle: "住院期间治疗",
    nextStepsTitle: "下一步",
    warningSignsTitle: "警示症状",
    followUpTitle: "后续随访",
    doctorQuestionsTitle: "可向医生咨询的问题",
    medicationsTitle: "用药",
    glossaryTitle: "医学术语简明解释",
    noGlossaryNeeded: "无需额外术语解释。",
    medicationPurposeLabel: "用途",
    medicationInstructionLabel: "服用说明",
    readSummaryLabel: "朗读总结",
    preparingAudioLabel: "正在准备...",
    replayAudioLabel: "再次播放",
    readAgainLabel: "重新朗读",
    noAudioSummaryLabel: "没有可供朗读的简短总结。",
    audioPlaybackErrorLabel: "音频播放失败，请重试。",
  },
  tr: {
    pageTitle: "Sadeleştirilmiş açıklamanız hazır",
    pageIntro: "Lütfen sakince inceleyin. En önemli bilgileri sizin için açık bölümlere ayırdık.",
    emptyTitle: "Henüz sonuç yok",
    emptyMessage: "Lütfen önce bir taburcu mektubu ile başlayın. Sadeleştirilmiş açıklamanız burada görünecek.",
    homeAction: "Ana sayfaya dön",
    newDocumentAction: "Başka bir belgeyi sadeleştir",
    quickSummaryTitle: "Kısa özet",
    reasonForVisitTitle: "Hastane başvuru nedeni",
    keyFindingsTitle: "Önemli bulgular",
    treatmentsTitle: "Hastanede uygulanan tedaviler",
    nextStepsTitle: "Sonraki adımlar",
    warningSignsTitle: "Uyarı belirtileri",
    followUpTitle: "Kontrol ve takip",
    doctorQuestionsTitle: "Doktorunuza sorabileceğiniz sorular",
    medicationsTitle: "İlaçlar",
    glossaryTitle: "Tıbbi terimler basit anlatım",
    noGlossaryNeeded: "Ek terim açıklamasına gerek yok.",
    medicationPurposeLabel: "Ne için",
    medicationInstructionLabel: "Kullanım talimatı",
    readSummaryLabel: "Özeti sesli oku",
    preparingAudioLabel: "Hazırlanıyor...",
    replayAudioLabel: "Tekrar oynat",
    readAgainLabel: "Yeniden sesli oku",
    noAudioSummaryLabel: "Sesli okuma için kısa özet yok.",
    audioPlaybackErrorLabel: "Ses oynatma başarısız oldu. Lütfen tekrar deneyin.",
  },
  es: {
    pageTitle: "Su explicación simplificada está lista",
    pageIntro: "Tómese su tiempo. Hemos preparado la información más importante en secciones claras.",
    emptyTitle: "Todavía no hay resultado",
    emptyMessage: "Primero cargue o pegue una carta de alta. Después verá aquí su explicación simplificada.",
    homeAction: "Volver al inicio",
    newDocumentAction: "Simplificar otro documento",
    quickSummaryTitle: "Resumen breve",
    reasonForVisitTitle: "Motivo de la visita al hospital",
    keyFindingsTitle: "Hallazgos importantes",
    treatmentsTitle: "Tratamientos en el hospital",
    nextStepsTitle: "Próximos pasos",
    warningSignsTitle: "Señales de alerta",
    followUpTitle: "Seguimiento",
    doctorQuestionsTitle: "Preguntas para su médico",
    medicationsTitle: "Medicación",
    glossaryTitle: "Términos médicos explicados de forma simple",
    noGlossaryNeeded: "No se necesitan explicaciones adicionales de términos.",
    medicationPurposeLabel: "Para qué sirve",
    medicationInstructionLabel: "Cómo tomarla",
    readSummaryLabel: "Leer resumen en voz alta",
    preparingAudioLabel: "Preparando...",
    replayAudioLabel: "Reproducir de nuevo",
    readAgainLabel: "Leer otra vez",
    noAudioSummaryLabel: "No hay un resumen breve disponible para lectura en voz alta.",
    audioPlaybackErrorLabel: "La reproducción de audio falló. Inténtelo de nuevo.",
  },
};

export function getResultLabels(language: TargetLanguage): ResultLabels {
  return RESULT_LABELS[language] ?? RESULT_LABELS.de;
}
