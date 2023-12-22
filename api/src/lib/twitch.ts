import { env } from "./env";

type TwitchUser = {
  twitchId: string;
  display_name: string;
  profile_image_url: string;
};

export async function GetTwitchUserDataByAccessToken(
  token: string
): Promise<TwitchUser> {
  const response = await fetch("https://api.twitch.tv/helix/users", {
    headers: {
      Accept: "application/json",
      "Client-ID": "d6clz9a4gfzhtv3wq6sj1e6c4ei88d",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  const userData = data.data[0];

  return {
    twitchId: userData.id,
    display_name: userData.display_name,
    profile_image_url: userData.profile_image_url,
  };
}

type TwitchToken = {
  expires_in: number;
  access_token: string;
  refresh_token: string;
};

export async function GetTwitchUserToken(
  grant_type: "refresh_token" | "authorization_code",
  code: string
): Promise<TwitchToken> {
  const response = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      [grant_type === "authorization_code" ? "code" : "refresh_token"]: code,
      client_id: env.CLIENT_ID,
      redirect_uri: env.CALLBACK_URL,
      grant_type: grant_type,
      client_secret: env.CLIENT_SECRET,
    }).toString(),
  });

  const data = await response.json();

  return data;
}
