import type { AppKey } from "./data";
import {
  CanvasIcon,
  DiscordIcon,
  GmailIcon,
  GoogleCalendarIcon,
  GroupMeIcon,
  GithubIcon,
  SlackIcon,
} from "@/app/app/onboarding/icons";

/** Brand icon per app, reused from the onboarding integration icons. */
export const APP_ICON: Record<AppKey, (props: { className?: string }) => JSX.Element> = {
  canvas: CanvasIcon,
  gmail: GmailIcon,
  calendar: GoogleCalendarIcon,
  discord: DiscordIcon,
  groupme: GroupMeIcon,
  slack: SlackIcon,
  github: GithubIcon,
};
