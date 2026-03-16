import os
import base64
from pypdf import PdfReader
import fitz  # pymupdf
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def extract_text_with_pypdf(pdf_file) -> str:
    try:
        reader = PdfReader(pdf_file)
        text_pages = []

        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text_pages.append(page_text)

        return "\n".join(text_pages).strip()

    except Exception:
        return ""


def render_pdf_pages_to_base64_images(pdf_path: str, max_pages: int = 3) -> list[str]:
    doc = fitz.open(pdf_path)
    images_b64 = []

    for page_num in range(min(len(doc), max_pages)):
        page = doc.load_page(page_num)
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # higher resolution
        img_bytes = pix.tobytes("png")
        img_b64 = base64.b64encode(img_bytes).decode("utf-8")
        images_b64.append(img_b64)

    return images_b64


def extract_text_with_vision(pdf_path: str, max_pages: int = 3) -> str:
    images_b64 = render_pdf_pages_to_base64_images(pdf_path, max_pages=max_pages)

    content = [
        {
            "type": "input_text",
            "text": (
                "Extrahiere den medizinischen Text aus diesen PDF-Seiten so originalgetreu wie möglich. "
                "Lasse keine medizinisch relevanten Inhalte weg. "
                "Gib nur den erkannten Text zurück, ohne Einleitung, ohne Zusammenfassung."
            )
        }
    ]

    for img_b64 in images_b64:
        content.append(
            {
                "type": "input_image",
                "image_url": f"data:image/png;base64,{img_b64}"
            }
        )

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=[
            {
                "role": "user",
                "content": content
            }
        ]
    )

    return response.output_text.strip()


def extract_text_from_pdf(pdf_file) -> str:
    """
    First try normal PDF text extraction.
    If that fails or returns empty text, fall back to vision-based extraction.
    """
    text = extract_text_with_pypdf(pdf_file)

    if text and len(text.strip()) > 50:
        return text.strip()

    # fallback only works reliably with file path
    if isinstance(pdf_file, str):
        vision_text = extract_text_with_vision(pdf_file)
        return vision_text.strip()

    return text.strip()