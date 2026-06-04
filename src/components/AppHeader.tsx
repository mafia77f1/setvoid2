import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User as UserIcon } from 'lucide-react';
import { AppLogo } from '@/components/LoadingScreen';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { cn } from '@/lib/utils';

/**
 * Global SETVOID header — logo, name, language selector, profile shortcut.
 * Hidden on immersive screens (dungeon, battle, penalty, onboarding).
 */
const HIDDEN_PREFIXES = ['/dungeon', '/battle', '/penalty', '/onboarding', '/auth'];

export const AppHeader = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  if (HIDDEN_PREFIXES.some(p => pathname.startsWith(p))) return null;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b border-primary/20 bg-card/85 backdrop-blur-xl',
        'flex items-center justify-between px-3 py-2 gap-2'
      )}
    >
      <Link to="/" className="flex items-center gap-2 min-w-0">
        <AppLogo className="h-7 w-auto shrink-0" />
        <span className="text-xs font-black tracking-[0.25em] uppercase text-primary truncate">
          SETVOID
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <Link
          to="/profile"
          aria-label={t('nav.profile')}
          className="p-2 border border-primary/20 hover:border-primary/40 transition-colors"
        >
          <UserIcon className="w-4 h-4 text-primary" />
        </Link>
      </div>
    </header>
  );
};
