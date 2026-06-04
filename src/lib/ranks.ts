// Shared rank calculation - single source of truth
// Thresholds: E(1-9), D(10-19), C(20-34), B(35-49), A(50+)

export interface RankData {
  name: string;
  title: string;
  gradient: string;
  glow: string;
  textColor: string;
  borderColor: string;
  auraColor: string;
  border: string;
  bg: string;
  text: string;
}

export const getRankFromLevel = (level: number): RankData => {
  if (level >= 50) return {
    name: 'A',
    title: 'A-Rank Hunter',
    gradient: 'from-orange-500 via-amber-400 to-yellow-500',
    glow: 'shadow-[0_0_80px_rgba(245,158,11,0.4)]',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/50',
    auraColor: 'rgba(245,158,11,0.15)',
    border: 'border-orange-400',
    bg: 'bg-orange-400/10',
    text: 'text-orange-400',
  };
  if (level >= 35) return {
    name: 'B',
    title: 'B-Rank Hunter',
    gradient: 'from-purple-500 via-violet-400 to-fuchsia-500',
    glow: 'shadow-[0_0_60px_rgba(168,85,247,0.35)]',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/50',
    auraColor: 'rgba(168,85,247,0.12)',
    border: 'border-purple-400',
    bg: 'bg-purple-400/10',
    text: 'text-purple-400',
  };
  if (level >= 20) return {
    name: 'C',
    title: 'C-Rank Hunter',
    gradient: 'from-blue-500 via-cyan-400 to-blue-600',
    glow: 'shadow-[0_0_50px_rgba(59,130,246,0.3)]',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/40',
    auraColor: 'rgba(59,130,246,0.1)',
    border: 'border-blue-400',
    bg: 'bg-blue-400/10',
    text: 'text-blue-400',
  };
  if (level >= 10) return {
    name: 'D',
    title: 'D-Rank Hunter',
    gradient: 'from-yellow-500 via-amber-400 to-orange-400',
    glow: 'shadow-[0_0_30px_rgba(234,179,8,0.2)]',
    textColor: 'text-yellow-400',
    borderColor: 'border-yellow-500/30',
    auraColor: 'rgba(234,179,8,0.06)',
    border: 'border-green-400',
    bg: 'bg-green-400/10',
    text: 'text-green-400',
  };
  return {
    name: 'E',
    title: 'E-Rank Hunter',
    gradient: 'from-slate-400 via-gray-300 to-slate-500',
    glow: '',
    textColor: 'text-slate-400',
    borderColor: 'border-slate-600/30',
    auraColor: 'rgba(148,163,184,0.05)',
    border: 'border-gray-400',
    bg: 'bg-gray-400/10',
    text: 'text-gray-400',
  };
};

export const getRankLetter = (totalLevel: number): string => {
  if (totalLevel >= 50) return 'A';
  if (totalLevel >= 35) return 'B';
  if (totalLevel >= 20) return 'C';
  if (totalLevel >= 10) return 'D';
  return 'E';
};
