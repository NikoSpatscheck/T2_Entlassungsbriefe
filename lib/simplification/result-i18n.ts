import { TargetLanguage } from "@/lib/simplification/settings";

export type ResultLabels = {
  pageTitle: string;
  pageIntro: string;
  emptyTitle: string;
  emptyMessage: string;
  homeAction: string;
  newDocumentAction: string;
  spokenSummaryTitle: string;
  nextStepsAndFollowUpTitle: string;
  secondaryDiagnosesTitle: string;
  whatToLookOutForTitle: string;
  anythingToTakeCareOfTitle: string;
  doctorQuestionsTitle: string;
  medicationsTitle: string;
  glossaryTitle: string;
  importantDisclaimerTitle: string;
  noGlossaryNeeded: string;
  descriptionLabel: string;
  purposeLabel: string;
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
    spokenSummaryTitle: "Zusammenfassung zum Vorlesen",
    nextStepsAndFollowUpTitle: "Nächste Schritte und Nachsorge",
    secondaryDiagnosesTitle: "Nebendiagnosen",
    whatToLookOutForTitle: "Worauf Sie achten sollten",
    anythingToTakeCareOfTitle: "Was Sie beachten sollten",
    doctorQuestionsTitle: "Fragen für Ihre Ärztin oder Ihren Arzt",
    medicationsTitle: "Medikamente",
    glossaryTitle: "Begriffe einfach erklärt",
    importantDisclaimerTitle: "Wichtiger Hinweis",
    noGlossaryNeeded: "Es sind keine zusätzlichen Begriffserklärungen nötig.",
    descriptionLabel: "Beschreibung",
    purposeLabel: "Zweck",
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
    spokenSummaryTitle: "Spoken summary",
    nextStepsAndFollowUpTitle: "Next steps and follow-up",
    secondaryDiagnosesTitle: "Secondary diagnoses",
    whatToLookOutForTitle: "What to look out for",
    anythingToTakeCareOfTitle: "Anything to take care of",
    doctorQuestionsTitle: "Questions for your doctor",
    medicationsTitle: "Medication",
    glossaryTitle: "Medical terms explained simply",
    importantDisclaimerTitle: "Important disclaimer",
    noGlossaryNeeded: "No additional term explanations are needed.",
    descriptionLabel: "Description",
    purposeLabel: "Purpose",
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
    spokenSummaryTitle: "朗读摘要",
    nextStepsAndFollowUpTitle: "下一步与随访",
    secondaryDiagnosesTitle: "次要诊断",
    whatToLookOutForTitle: "需要留意的情况",
    anythingToTakeCareOfTitle: "需要特别注意的事项",
    doctorQuestionsTitle: "可向医生咨询的问题",
    medicationsTitle: "用药",
    glossaryTitle: "医学术语简明解释",
    importantDisclaimerTitle: "重要提示",
    noGlossaryNeeded: "无需额外术语解释。",
    descriptionLabel: "说明",
    purposeLabel: "目的",
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
    spokenSummaryTitle: "Sesli özet",
    nextStepsAndFollowUpTitle: "Sonraki adımlar ve takip",
    secondaryDiagnosesTitle: "İkincil tanılar",
    whatToLookOutForTitle: "Dikkat edilmesi gerekenler",
    anythingToTakeCareOfTitle: "Özen gösterilmesi gerekenler",
    doctorQuestionsTitle: "Doktorunuza sorabileceğiniz sorular",
    medicationsTitle: "İlaçlar",
    glossaryTitle: "Tıbbi terimler basit anlatım",
    importantDisclaimerTitle: "Önemli bilgilendirme",
    noGlossaryNeeded: "Ek terim açıklamasına gerek yok.",
    descriptionLabel: "Açıklama",
    purposeLabel: "Amaç",
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
    spokenSummaryTitle: "Resumen para lectura en voz alta",
    nextStepsAndFollowUpTitle: "Próximos pasos y seguimiento",
    secondaryDiagnosesTitle: "Diagnósticos secundarios",
    whatToLookOutForTitle: "Qué señales vigilar",
    anythingToTakeCareOfTitle: "Qué debe cuidar",
    doctorQuestionsTitle: "Preguntas para su médico",
    medicationsTitle: "Medicación",
    glossaryTitle: "Términos médicos explicados de forma simple",
    importantDisclaimerTitle: "Aviso importante",
    noGlossaryNeeded: "No se necesitan explicaciones adicionales de términos.",
    descriptionLabel: "Descripción",
    purposeLabel: "Propósito",
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
