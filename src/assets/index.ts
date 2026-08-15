// Centralized bundled asset imports ensuring 100% reliable loading across all hosting environments and base paths

import rhumbLabsLogo from './rhumb-labs-logo.png';
import rhumbLabsIcon from './rhumb-labs-icon.png';
import rhumbnavLogo from './rhumbnav-logo.png';
import rhumbnavComputer from './rhumbnav-computer.jpeg';
import rhumbnavAllFlights from './rhumbnav-all-flights.jpeg';
import rhumbnavLicense from './rhumbnav-license.jpeg';
import rhumbnavNav from './rhumbnav-nav.jpeg';
import rhumbnavNavActive from './rhumbnav-nav-active.jpeg';
import rhumbnavFpl from './rhumbnav-fpl.jpeg';
import rhumbnavWb from './rhumbnav-wb.jpeg';
import rhumbnavLogbookTablet from './rhumbnav-logbook-tablet.jpeg';
import rhumbnavPilotqr from './rhumbnav-pilotqr.jpeg';

import pogoLogo from './pogo/pogo-logo.png';
import pogoActiveSessionLight from './pogo/pogo-active-session-light.jpg';
import pogoActiveSessionDark from './pogo/pogo-active-session-dark.jpg';
import pogoSessionDetailLight from './pogo/pogo-session-detail-light.jpg';
import pogoSessionDetailDark from './pogo/pogo-session-detail-dark.jpg';
import pogoSummaryLight from './pogo/pogo-summary-light.jpg';
import pogoSummaryDark from './pogo/pogo-summary-dark.jpg';
import pogoHistoryLight from './pogo/pogo-history-light.jpg';
import pogoHistoryDark from './pogo/pogo-history-dark.jpg';
import pogoAchievementsLight from './pogo/pogo-achievements-light.jpg';
import pogoAchievementsDark from './pogo/pogo-achievements-dark.jpg';
import pogoHistoryTablet from './pogo/pogo-history-tablet.jpeg';

export const ASSETS = {
  // Rhumb Labs Company Branding
  'rhumb-labs-logo.png': rhumbLabsLogo,
  'rhumb-labs-icon.png': rhumbLabsIcon,
  'favicon.png': rhumbLabsIcon,

  // RhumbNav Assets
  'rhumbnav-logo.png': rhumbnavLogo,
  'rhumbnav-computer.jpeg': rhumbnavComputer,
  'rhumbnav-all-flights.jpeg': rhumbnavAllFlights,
  'rhumbnav-license.jpeg': rhumbnavLicense,
  'rhumbnav-nav.jpeg': rhumbnavNav,
  'rhumbnav-nav-active.jpeg': rhumbnavNavActive,
  'rhumbnav-fpl.jpeg': rhumbnavFpl,
  'rhumbnav-wb.jpeg': rhumbnavWb,
  'rhumbnav-logbook-tablet.jpeg': rhumbnavLogbookTablet,
  'rhumbnav-pilotqr.jpeg': rhumbnavPilotqr,

  // Pogo Assets
  'pogo/pogo-logo.png': pogoLogo,
  'pogo-logo.png': pogoLogo,
  'pogo/pogo-active-session-light.jpg': pogoActiveSessionLight,
  'pogo/pogo-active-session-dark.jpg': pogoActiveSessionDark,
  'pogo/pogo-session-detail-light.jpg': pogoSessionDetailLight,
  'pogo/pogo-session-detail-dark.jpg': pogoSessionDetailDark,
  'pogo/pogo-summary-light.jpg': pogoSummaryLight,
  'pogo/pogo-summary-dark.jpg': pogoSummaryDark,
  'pogo/pogo-history-light.jpg': pogoHistoryLight,
  'pogo/pogo-history-dark.jpg': pogoHistoryDark,
  'pogo/pogo-achievements-light.jpg': pogoAchievementsLight,
  'pogo/pogo-achievements-dark.jpg': pogoAchievementsDark,
  'pogo/pogo-history-tablet.jpeg': pogoHistoryTablet,
  'pogo-summary-light.jpg': pogoSummaryLight,
  'pogo-summary-dark.jpg': pogoSummaryDark,
  'pogo-active-session-light.jpg': pogoActiveSessionLight,
  'pogo-active-session-dark.jpg': pogoActiveSessionDark,
  'pogo-achievements-light.jpg': pogoAchievementsLight,
  'pogo-achievements-dark.jpg': pogoAchievementsDark,
} as const;

export type AssetKey = keyof typeof ASSETS;
