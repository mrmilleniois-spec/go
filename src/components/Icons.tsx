import type { ReactNode } from "react";

function I({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const IconHome = () => (
  <I>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h5v-6h4v6h5V9.5" />
  </I>
);

export const IconTrips = () => (
  <I>
    <path d="M12 21a9 9 0 0 1 0-18" />
    <path d="M12 3v9l7 4" />
  </I>
);

export const IconWallet = () => (
  <I>
    <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2H3z" />
    <path d="M3 8v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8" />
    <path d="M16 13h2" />
  </I>
);

export const IconAccount = () => (
  <I>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.2 3.6-6 8-6s8 1.8 8 6" />
  </I>
);

export const IconBriefcase = () => (
  <I>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
  </I>
);

export const IconChat = () => (
  <I>
    <path d="M4 5h16v11H9l-5 4z" />
  </I>
);

export const IconCall = () => (
  <I>
    <path d="M7.5 3h3l1.6 4-2 1.5c.9 1.8 2.2 3.1 4 4l1.5-2 4 1.6v3a1.8 1.8 0 0 1-2 1.8C9.8 16.6 5.4 12.2 5.7 5a1.8 1.8 0 0 1 1.8-2z" />
  </I>
);

export const IconChevronRight = () => (
  <I>
    <path d="M9 5l7 7-7 7" />
  </I>
);

export const IconChevronLeft = () => (
  <I>
    <path d="M15 5l-7 7 7 7" />
  </I>
);

export const IconChevronDown = () => (
  <I>
    <path d="M5 9l7 7 7-7" />
  </I>
);

export const IconX = () => (
  <I>
    <path d="M6 6l12 12M18 6L6 18" />
  </I>
);

export const IconPlus = () => (
  <I>
    <path d="M12 5v14M5 12h14" />
  </I>
);

export const IconMinus = () => (
  <I>
    <path d="M5 12h14" />
  </I>
);

export const IconSun = () => (
  <I>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
  </I>
);

export const IconMoon = () => (
  <I>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </I>
);

export const IconMonitor = () => (
  <I>
    <rect x="3" y="4" width="18" height="13" rx="2" />
    <path d="M9 21h6M12 17v4" />
  </I>
);

export const IconGlobe = () => (
  <I>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
  </I>
);

export const IconLogout = () => (
  <I>
    <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </I>
);

export const IconTrash = () => (
  <I>
    <path d="M4 7h16" />
    <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    <path d="M6 7l1 13h10l1-13" />
    <path d="M10 11v6M14 11v6" />
  </I>
);

export const IconBell = () => (
  <I>
    <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </I>
);

export const IconShield = () => (
  <I>
    <path d="M12 3l7 3v5c0 4.6-3 8.2-7 10-4-1.8-7-5.4-7-10V6z" />
    <path d="M9 12l2 2 4-4" />
  </I>
);

export const IconTag = () => (
  <I>
    <path d="M3 11.5 11.5 3H21v9.5L12.5 21z" />
    <circle cx="15.5" cy="8.5" r="1.5" />
  </I>
);

export const IconCard = () => (
  <I>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M3 10h18M7 15h3" />
  </I>
);

export const IconCalendar = () => (
  <I>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </I>
);

export const IconChart = () => (
  <I>
    <path d="M5 20v-6M10 20V8M15 20v-9M20 20V4" />
    <path d="M2 20h20" />
  </I>
);

export const IconMotorcycle = () => (
  <I>
    <circle cx="6.5" cy="17" r="2.5" />
    <circle cx="18" cy="17" r="2.5" />
    <path d="M6.5 17h4L15 8h3l-3 6H11" />
  </I>
);

export const IconCar = () => (
  <I>
    <path d="M5 13l1.5-4A2 2 0 0 1 8.4 8h7.2a2 2 0 0 1 1.9 1l1.5 4" />
    <path d="M4 13h16a1 1 0 0 1 1 1v3H3v-3a1 1 0 0 1 1-1z" />
    <circle cx="7.5" cy="17.2" r="1.3" />
    <circle cx="16.5" cy="17.2" r="1.3" />
  </I>
);

export const IconPin = () => (
  <I>
    <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </I>
);

export const IconCheck = () => (
  <I>
    <path d="M5 13l4 4L19 7" />
  </I>
);

export const IconClock = () => (
  <I>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </I>
);

export const IconAlert = () => (
  <I>
    <path d="M12 3l9 16H3z" />
    <path d="M12 9v4M12 16.5v.5" />
  </I>
);

export const IconInfo = () => (
  <I>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 7.5v.5" />
  </I>
);

export const IconPencil = () => (
  <I>
    <path d="M4 20l1-4L17 4l3 3L8 19z" />
    <path d="M14 6l3 3" />
  </I>
);

export const IconArrowRight = () => (
  <I>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </I>
);

export const IconTrendUp = () => (
  <I>
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </I>
);

export const IconUser = () => (
  <I>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.2 3.6-6 8-6s8 1.8 8 6" />
  </I>
);

export const IconArrowLeft = () => (
  <I>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </I>
);