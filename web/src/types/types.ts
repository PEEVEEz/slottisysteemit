export type Bonus = {
  id: string;
  game: string;
  bet: number;
  payout?: number;
};

export type Hunt = {
  id: string;
  name: string;
  start: number;

  bonuses?: Bonus[];
};

export type UpdateHunt = {
  id: string;
  name: string;
  start: number;
};
