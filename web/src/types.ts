export type Bonus = {
  id: number;
  game: string;
  bet: number;
  payout?: number;
};

export type Hunt = {
  id: number;
  name: string;
  start: string;
};
