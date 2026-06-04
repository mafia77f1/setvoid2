import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppLogo } from '@/components/LoadingScreen';

/**
 * Global SETVOID footer — logo + copyright. Hidden on immersive screens.
 * Footer sits ABOVE the BottomNav (which already pads pages with pb-24).
 */
const HIDDEN_PREFIXES = ['/dungeon', '/battle', '/penalty', '/onboarding', '/auth'];

export const AppFooter = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  if (HIDDEN_PREFIXES.some(p => pathname.startsWith(p))) return null;

  return (
    <footer className="w-full border-t border-primary/10 bg-card/60 backdrop-blur-md px-4 py-3 mt-8 mb-20">
      <div className="flex items-center justify-between gap-2 max-w-xl mx-auto">
        <div className="flex items-center gap-2">
          <AppLogo className="h-5 w-auto" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
            SETVOID
          </span>
        </div>
        <p className="text-[9px] text-muted-foreground tracking-wider">
          © {new Date().getFullYear()} · {t('common.title') || 'SETVOID'}
        </p>
      </div>
    </footer>
  );
};
