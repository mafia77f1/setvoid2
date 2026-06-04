import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BottomNav } from '@/components/BottomNav';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useGameState } from '@/hooks/useGameState';
import { Zap, Swords, Target, ArrowUp, Lock, Sparkles, Cpu, ShieldAlert, Hourglass, Coins, Diamond } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const SKILL_LEVEL_MULTIPLIERS = [1, 1.3, 1.6, 2.0, 2.5, 3.0] as const;
const SKILL_TIME_REDUCERS = [0, 0.05, 0.1, 0.15, 0.2, 0.25] as const;
// تم تعديل التكاليف: أول 3 مستويات (المؤشر 0، 1، 2) لا تطلب أحجار
const STONE_COSTS = [0, 0, 0, 10, 25, 50] as const;
const GOLD_COSTS = [0, 200, 500, 1200, 3000, 7000] as const;
const RANK_LABELS = ['I', 'II', 'III', 'IV', 'V', 'VI'] as const;
const MAX_SKILL_LEVEL = 6;

type SkillId = 'basicAttack' | 'thunderDash' | 'daggerStrike';
type SkillLevels = Record<SkillId, number>;
type SkillColor = 'silver' | 'blue' | 'violet';

const STORAGE_KEY = 'battle_skill_levels';

const getBaseDamage = (strengthLevel: number): number => {
  if (strengthLevel <= 1) return 1;
  if (strengthLevel <= 10) return Math.max(1, Math.floor(Math.pow(1000, (strengthLevel - 1) / 9)));
  return Math.floor(1000 + Math.pow(strengthLevel - 10, 0.7) * 100);
};

const loadSkillLevels = (): SkillLevels => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { basicAttack: 1, thunderDash: 1, daggerStrike: 1, ...JSON.parse(stored) };
  } catch { }
  return { basicAttack: 1, thunderDash: 1, daggerStrike: 1 };
};

const saveSkillLevels = (levels: SkillLevels) => localStorage.setItem(STORAGE_KEY, JSON.stringify(levels));

const Abilities = () => {
  const { t } = useTranslation();
  const { gameState, consumeItem, spendGold } = useGameState();
  const [skillLevels, setSkillLevels] = useState<SkillLevels>(loadSkillLevels);
  const [pendingUpgrade, setPendingUpgrade] = useState<SkillId | null>(null);

  const strengthLevel = gameState.levels.strength || 1;
  const baseDmg = getBaseDamage(strengthLevel);
  const hasDagger = (gameState.inventory || []).some(i => i.id === 'dagger' && i.quantity > 0);
  const coreStones = (gameState.inventory || []).find(i => i.id === 'enhancement_stone')?.quantity || 0;
  const gold = gameState.gold || 0;

  const skills = [
    { id: 'basicAttack', name: 'نصل الجليد الفضي', nameEn: 'Silver Ice Blade', icon: <Swords className="w-10 h-10" />, color: 'silver' as SkillColor, mpCost: 5, description: 'هجوم قياسي مشبع بمانا الجليد.', multiplier: 1, baseCastTime: 0.5, unlocked: true, tag: 'PHYSICAL' },
    { id: 'thunderDash', name: 'اندفاع البرق السماوي', nameEn: 'Celestial Thunder', icon: <Zap className="w-10 h-10" />, color: 'blue' as SkillColor, mpCost: 50, description: 'صعق الأعداء بمانا البرق الأزرق.', multiplier: 3, baseCastTime: 1.5, unlocked: true, tag: 'ULTIMATE' },
    { id: 'daggerStrike', name: 'اغتيال الظلال', nameEn: 'Shadow Assassination', icon: <Target className="w-10 h-10" />, color: 'violet' as SkillColor, mpCost: 25, description: 'طعنة تخترق الدفاعات السحرية.', multiplier: 2, baseCastTime: 1.0, unlocked: hasDagger, tag: 'STEALTH' },
  ];

  const requestUpgrade = (skillId: SkillId) => {
    const currentLevel = skillLevels[skillId] || 1;
    if (currentLevel >= MAX_SKILL_LEVEL) return;
    const stoneCost = STONE_COSTS[currentLevel];
    const goldCost = GOLD_COSTS[currentLevel];
    if (coreStones < stoneCost || gold < goldCost) {
      toast({ title: 'خطأ', description: 'موارد غير كافية', variant: 'destructive' });
      return;
    }
    setPendingUpgrade(skillId);
  };

  const confirmUpgrade = () => {
    if (!pendingUpgrade) return;
    const currentLevel = skillLevels[pendingUpgrade] || 1;
    spendGold(GOLD_COSTS[currentLevel]);
    if (STONE_COSTS[currentLevel] > 0) consumeItem('enhancement_stone', STONE_COSTS[currentLevel]);
    const newLevels = { ...skillLevels, [pendingUpgrade]: currentLevel + 1 };
    setSkillLevels(newLevels);
    saveSkillLevels(newLevels);
    setPendingUpgrade(null);
    toast({ title: 'تم الترقية!', description: 'أصبحت مهاراتك أقوى' });
  };

  const colors = {
    silver: { border: 'border-zinc-400', text: 'text-zinc-100', bg: 'from-zinc-900 to-black', bar: 'bg-zinc-400', shadow: 'shadow-zinc-500/20' },
    blue: { border: 'border-blue-500', text: 'text-blue-300', bg: 'from-blue-950 to-black', bar: 'bg-blue-500', shadow: 'shadow-blue-500/20' },
    violet: { border: 'border-purple-500', text: 'text-purple-300', bg: 'from-purple-950 to-black', bar: 'bg-purple-500', shadow: 'shadow-purple-500/20' },
  };

  return (
    <div className="min-h-screen bg-[#020408] text-white p-4 pb-32">
      <header className="flex flex-col items-center pt-8 mb-8">
        <div className="absolute top-4 right-4"><LanguageSwitcher /></div>
        <img src="/src/assets/SETVOIDUI.png" alt="SETVOID" className="h-16 w-auto mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
        <h1 className="text-2xl font-black italic tracking-[0.2em] text-white uppercase">Abilities</h1>
      </header>

      <main className="max-w-xl mx-auto space-y-6">
        {skills.map((skill) => {
          const level = skillLevels[skill.id] || 1;
          const style = colors[skill.color];
          const stoneCost = STONE_COSTS[level];
          const goldCost = GOLD_COSTS[level];

          return (
            <div key={skill.id} className={cn("relative p-5 rounded-2xl border bg-gradient-to-br overflow-hidden", style.border, style.bg, style.shadow)}>
              <div className="flex gap-4 items-center">
                <div className={cn("p-4 rounded-xl border", style.border)}>{skill.icon}</div>
                <div className="flex-1">
                  <h3 className="font-black text-lg">{skill.name}</h3>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{skill.tag} • LVL {level}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500">DMG</p>
                  <p className="font-black text-xl">{Math.floor(baseDmg * skill.multiplier * SKILL_LEVEL_MULTIPLIERS[level - 1])}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-5 gap-1">
                {[...Array(MAX_SKILL_LEVEL)].map((_, i) => (
                  <div key={i} className={cn("h-1.5 rounded-full", i < level ? style.bar : "bg-zinc-800")} />
                ))}
              </div>

              {level < MAX_SKILL_LEVEL ? (
                <button 
                  onClick={() => requestUpgrade(skill.id)}
                  className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 flex justify-between items-center px-4 transition-all"
                >
                  <span className="font-bold text-xs uppercase tracking-widest">Upgrade Rank {RANK_LABELS[level]}</span>
                  <div className="flex gap-4 text-xs font-black">
                    <span className="flex items-center gap-1 text-yellow-400"><Coins size={12}/> {goldCost}</span>
                    {stoneCost > 0 && <span className="flex items-center gap-1 text-blue-300"><Diamond size={12}/> {stoneCost}</span>}
                  </div>
                </button>
              ) : (
                <div className="mt-6 w-full py-3 text-center text-[10px] font-black uppercase text-zinc-600 bg-zinc-900/50 rounded-lg">Maxed</div>
              )}
            </div>
          );
        })}
      </main>

      <AlertDialog open={!!pendingUpgrade} onOpenChange={() => setPendingUpgrade(null)}>
        <AlertDialogContent className="bg-zinc-950 border border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الترقية</AlertDialogTitle>
            <AlertDialogDescription>هل أنت متأكد من ترقية هذه القدرة؟</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmUpgrade}>تأكيد</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <BottomNav />
    </div>
  );
};

export default Abilities;
