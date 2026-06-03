import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { MANA_STONE_ACTIONS, type ManaStoneAction } from '@/lib/marketItems';

interface ManaStoneModalProps {
  show: boolean;
  onClose: () => void;
  /** Consume the stone in game state. Should return true on success. */
  onConsume: () => boolean;
}

/**
 * Mana Stone Action Modal
 * - Stone is consumed immediately upon confirming an action.
 * - Exit Gate is disabled unless the player is currently inside a gate.
 *   We detect "inside a gate" via the current route (/dungeon or /battle).
 */
export const ManaStoneModal = ({ show, onClose, onConsume }: ManaStoneModalProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [picked, setPicked] = useState<ManaStoneAction | null>(null);

  const insideGate =
    location.pathname.startsWith('/dungeon') ||
    location.pathname.startsWith('/battle');

  if (!show) return null;

  const handleConfirm = () => {
    if (!picked) return;
    if (picked === 'exit_gate' && !insideGate) {
      toast({ title: t('common.warningTitle'), description: t('manaStone.exitGateOnly'), variant: 'destructive' });
      return;
    }
    if (!onConsume()) return;
    toast({ title: t('manaStone.consumed'), description: t(`manaStone.actions.${picked}.name`) });
    onClose();

    // Side-effects per action
    switch (picked) {
      case 'exit_gate':
        navigate('/gates');
        break;
      case 'name_change':
        navigate('/profile');
        break;
      case 'ability_development':
        navigate('/abilities');
        break;
      case 'grand_mission':
        navigate('/grand-quest');
        break;
      case 'system_chat':
        // Placeholder: a dedicated System Chat surface can be wired later.
        navigate('/');
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-md w-full bg-gradient-to-b from-slate-900 to-black border-2 border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.4)] animate-in zoom-in-95">
        <button
          onClick={onClose}
          aria-label={t('common.close')}
          className="absolute top-2 right-2 p-2 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-5 border-b border-cyan-500/20 text-center">
          <div className="text-4xl mb-2">🔮</div>
          <h2 className="text-lg font-black text-cyan-300 tracking-widest uppercase">
            {t('manaStone.title')}
          </h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            {t('manaStone.subtitle')}
          </p>
        </div>

        <div className="p-4 space-y-2 max-h-[55vh] overflow-y-auto">
          {MANA_STONE_ACTIONS.map(({ id, icon }) => {
            const disabled = id === 'exit_gate' && !insideGate;
            const selected = picked === id;
            return (
              <button
                key={id}
                disabled={disabled}
                onClick={() => setPicked(id)}
                className={cn(
                  'w-full text-start p-3 border transition-all flex items-start gap-3',
                  disabled
                    ? 'opacity-40 cursor-not-allowed bg-slate-900/40 border-slate-800'
                    : selected
                      ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'bg-black/40 border-white/10 hover:border-cyan-500/40'
                )}
              >
                <div className="w-10 h-10 aspect-square flex items-center justify-center text-2xl bg-black/60 border border-white/10 shrink-0">
                  {disabled ? <Lock className="w-4 h-4 text-slate-500" /> : icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">
                    {t(`manaStone.actions.${id}.name`)}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {disabled ? t('manaStone.exitGateOnly') : t(`manaStone.actions.${id}.desc`)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-cyan-500/20 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest hover:bg-white/5"
          >
            {t('manaStone.cancel')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!picked}
            className={cn(
              'flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all',
              picked
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white active:scale-95'
                : 'bg-slate-800 text-slate-500'
            )}
          >
            {t('manaStone.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};
