export type TwitchUser = {
  twitchId: string;
  display_name: string;
  profile_image_url: string;
};

export type TwitchToken = {
  expires_in: number;
  access_token: string;
  refresh_token: string;
};

export type Hunt = {
  start?: number;
  name?: string;
  reqavg?: string | number;
  winnings?: string | number;
  id?: string;
  bonuses?: Bonus[];
};

export type Bonus = {
  id: string;
  game: string;
  bet: number;
  payout: number | null;
  huntId: string;
};
