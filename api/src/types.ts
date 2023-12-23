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
