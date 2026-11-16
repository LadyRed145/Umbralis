/** Símbolo original de Umbralis: umbral gótico, cosmos y libro abierto. */
export default function BrandMark({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 88 88" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="umbralis-metal" x1="14" y1="8" x2="74" y2="79" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F8DFB1" /><stop offset=".48" stopColor="#BA8A56" /><stop offset="1" stopColor="#F3C98D" />
        </linearGradient>
        <radialGradient id="umbralis-void" cx="0" cy="0" r="1" gradientTransform="translate(44 44) rotate(90) scale(36 28)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A764CD" stopOpacity=".76" /><stop offset=".42" stopColor="#482465" stopOpacity=".73" /><stop offset="1" stopColor="#120F22" />
        </radialGradient>
      </defs>
      <path d="M9 79V37C9 16 24 5 44 5s35 11 35 32v42H9Z" fill="#130F20" stroke="url(#umbralis-metal)" strokeWidth="2.7" />
      <path d="M17 72V38c0-16 12-26 27-26s27 10 27 26v34" stroke="url(#umbralis-metal)" strokeWidth="1" opacity=".7" />
      <path d="M23 70V39c0-13 9-21 21-21s21 8 21 21v31H23Z" fill="url(#umbralis-void)" stroke="#C09BDE" strokeOpacity=".5" strokeWidth=".8" />
      <path d="m44 23 3.8 13L60 40l-12.2 3.7L44 57l-3.8-13.3L28 40l12.2-4L44 23Z" fill="#E5C49B" opacity=".95" />
      <circle cx="44" cy="40" r="12" stroke="#DDB9F0" strokeOpacity=".42" />
      <path d="M13 68q16-7 31 3 15-10 31-3v9q-16-5-31 4-15-9-31-4v-9Z" fill="#1A1425" stroke="url(#umbralis-metal)" strokeWidth="1.7" />
      <path d="M44 70v11M18 72q13-3 26 3m26-3q-13-3-26 3" stroke="url(#umbralis-metal)" strokeWidth="1.1" />
    </svg>
  );
}
