import type { IntegrationId } from "./integrations";

type IconProps = { className?: string };

/** Instructure Canvas — a ring of dots (white, sits on a red tile). */
export function CanvasIcon({ className = "" }: IconProps) {
  const dots = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
    return {
      cx: 12 + Math.cos(angle) * 7.4,
      cy: 12 + Math.sin(angle) * 7.4,
      r: i % 2 === 0 ? 1.7 : 1.15,
    };
  });
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="#fff">
      <circle cx="12" cy="12" r="2.4" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx.toFixed(2)} cy={d.cy.toFixed(2)} r={d.r} />
      ))}
    </svg>
  );
}

/** Gmail — the four-color envelope. */
export function GmailIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M4 19h2.6v-7.5L12 15.6l5.4-4.1V19H20a1 1 0 0 0 1-1V7.3l-9 6.8-9-6.8V18a1 1 0 0 0 1 1Z"
      />
      <path fill="#34A853" d="M4 19h2.6v-7.5L3 8.8V18a1 1 0 0 0 1 1Z" />
      <path fill="#FBBC04" d="M17.4 11.5V19H20a1 1 0 0 0 1-1V8.8l-3.6 2.7Z" />
      <path
        fill="#EA4335"
        d="M3 7.3 12 14l9-6.7V6.2a1.2 1.2 0 0 0-1.9-1L12 10.6 4.9 5.2A1.2 1.2 0 0 0 3 6.2Z"
      />
    </svg>
  );
}

/** Google Calendar — colored corners with a blue 31. */
export function GoogleCalendarIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="3" fill="#fff" stroke="#e8eaed" />
      <path d="M4 7a3 3 0 0 1 3-3h.5v3.5H4Z" fill="#4285F4" />
      <path d="M20 7a3 3 0 0 0-3-3h-.5v3.5H20Z" fill="#EA4335" />
      <path d="M4 17a3 3 0 0 0 3 3h.5v-3.5H4Z" fill="#34A853" />
      <path d="M20 17a3 3 0 0 1-3 3h-.5v-3.5H20Z" fill="#FBBC04" />
      <text
        x="12"
        y="15.4"
        textAnchor="middle"
        fontSize="7.4"
        fontWeight="700"
        fontFamily="Arial, Helvetica, sans-serif"
        fill="#4285F4"
      >
        31
      </text>
    </svg>
  );
}

/** Discord — the Clyde mark (white, sits on a blurple tile). */
export function DiscordIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="#fff">
      <path d="M20.317 4.369A19.79 19.79 0 0 0 15.432 3c-.21.375-.45.88-.617 1.28a18.27 18.27 0 0 0-5.63 0A12.6 12.6 0 0 0 8.56 3a19.7 19.7 0 0 0-4.885 1.37C.534 9.06-.32 13.636.106 18.147a19.9 19.9 0 0 0 6.063 3.058 14.6 14.6 0 0 0 1.296-2.12 12.9 12.9 0 0 1-2.04-.978c.171-.126.339-.257.5-.392a14.2 14.2 0 0 0 12.15 0c.163.139.331.27.5.392-.652.386-1.336.714-2.043.98.374.743.808 1.452 1.296 2.119a19.8 19.8 0 0 0 6.066-3.058c.5-5.232-.838-9.766-3.519-13.779ZM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.42 0-1.334.955-2.42 2.157-2.42 1.21 0 2.176 1.096 2.157 2.42 0 1.335-.955 2.42-2.157 2.42Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.42 0-1.334.955-2.42 2.157-2.42 1.21 0 2.176 1.096 2.157 2.42 0 1.335-.946 2.42-2.157 2.42Z" />
    </svg>
  );
}

/** GroupMe — a friendly speech bubble with a smiley. */
export function GroupMeIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#fff"
        d="M6 3.5h12A2.5 2.5 0 0 1 20.5 6v8a2.5 2.5 0 0 1-2.5 2.5h-7.6L6 20.2V16A2.5 2.5 0 0 1 3.5 14V6A2.5 2.5 0 0 1 6 3.5Z"
      />
      <circle cx="9.4" cy="10" r="1.2" fill="#00AFF0" />
      <circle cx="14.6" cy="10" r="1.2" fill="#00AFF0" />
      <path
        d="M9 12.4a3.4 3.4 0 0 0 6 0"
        fill="none"
        stroke="#00AFF0"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Notion — the wordmark N. */
export function NotionIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="#111">
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447Zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933Zm14.337.745c.093.42 0 .84-.42.887l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952l1.448.327s0 .84-1.168.84l-3.222.187c-.094-.187 0-.654.326-.747l.842-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933l3.215-.18Z" />
    </svg>
  );
}

export const INTEGRATION_ICONS: Record<
  IntegrationId,
  (props: IconProps) => JSX.Element
> = {
  canvas: CanvasIcon,
  gmail: GmailIcon,
  google_calendar: GoogleCalendarIcon,
  discord: DiscordIcon,
  groupme: GroupMeIcon,
  notion: NotionIcon,
};
