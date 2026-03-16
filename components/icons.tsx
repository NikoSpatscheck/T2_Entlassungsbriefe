import { type SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function TextIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <path d="M4 5.5h16" />
      <path d="M8 9h8" />
      <path d="M5 13h14" />
      <path d="M5 16.5h10" />
      <rect x="3" y="3" width="18" height="18" rx="3" />
    </svg>
  );
}

export function PdfIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <path d="M14 3v5h5" />
      <path d="M6 3h8l5 5v13H6z" />
      <path d="M8 15h2.5a1.5 1.5 0 0 1 0 3H8z" />
      <path d="M13 15v3" />
      <path d="M13 16.5h2a1.5 1.5 0 0 1 0 3" />
    </svg>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <path d="M8 6l1.5-2h5L16 6h2.5A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-8A2.5 2.5 0 0 1 5.5 6z" />
      <circle cx="12" cy="12.5" r="3.5" />
    </svg>
  );
}

export function SpeakerIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <path d="M11 5L7 9H4v6h3l4 4z" />
      <path d="M15 9a4 4 0 0 1 0 6" />
      <path d="M17.5 6.5a7.5 7.5 0 0 1 0 11" />
    </svg>
  );
}
