
export interface User {
  name: string;
  display: string;
  bal: number;
  rank: string;
  img: string;
  password?: string;
}

export interface BetRecord {
  id: string;
  game: string;
  user: string;
  rank: string;
  bet: number;
  multi: number;
  payout: number;
  timestamp: number;
  avatar: string;
}

export interface ChatMessage {
  id: string;
  user: string;
  display: string;
  avatar: string;
  text: string;
  rank: string;
  timestamp: number;
}

export enum GameID {
  HOME = 'home',
  EXCLUSIVES = 'exclusives',
  CRASH = 'crash',
  HIGHER_LOWER = 'higher',
  DICE = 'dice',
  MINES = 'mines',
  TOWER = 'tower',
  SLOTS = 'slots',
  PLINKO = 'plinko',
  LIMBO = 'limbo',
  COINFLIP = 'coinflip',
  WHEEL = 'wheel',
  LEADERBOARD = 'leaderboard',
  LANGUAGES = 'languages',
  PROFILE = 'profile',
  ADMIN = 'admin',
  BLOX_RUN = 'blox_run',
  VIP_LOUNGE = 'vip_lounge'
}
