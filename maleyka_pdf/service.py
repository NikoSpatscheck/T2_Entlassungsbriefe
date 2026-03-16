from pdf_extract import extract_text_from_pdf
from llm import explain_discharge_letter


def _keep_medical_part_only(text: str) -> str:
    if not text:
        return ""

    medical_section_markers = [
        "1. Diagnosen",
        "Diagnosen",
        "Hauptdiagnose",
        "Anlass der Aufnahme",
        "Aufnahmegrund",
        "Einweisung",
        "Relevante Anamnese",
        "Klinischer Befund",
        "Verlauf",
        "Therapie",
        "Medikation",
    ]

    earliest_pos = None

    for marker in medical_section_markers:
        pos = text.find(marker)
        if pos != -1:
            if earliest_pos is None or pos < earliest_pos:
                earliest_pos = pos

    if earliest_pos is not None:
        return text[earliest_pos:].strip()

    return text.strip()


def explain_letter(pdf_input) -> dict:
    raw_text = extract_text_from_pdf(pdf_input)
    medical_text = _keep_medical_part_only(raw_text)
    result = explain_discharge_letter(medical_text)
    return result