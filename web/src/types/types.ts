export type Bonus = {
  _id: string;
  game: string;
  bet: number;
  payout?: number;
};

export type Hunt = {
  _id: string;
  name: string;
  start: number;
};
