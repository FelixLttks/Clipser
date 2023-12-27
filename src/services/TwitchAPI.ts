import { clip } from "../components/Clips";

type searchData = {
  channelname: string;
  startdate: string;
  enddate: string;
};

let channelId = "";
let cursor = "";

const fetchData = async (
  searchData: searchData,
  newSearch: boolean = true
): Promise<{ error: boolean; clips: clip[] }> => {
  console.log("fetchData", searchData);
  if (newSearch || channelId === "") {
    cursor = "";
    return await getChannelId(searchData.channelname).then((data) => {
      if (data.error) {
        return { error: true, clips: [] };
      }
      channelId = data.channelId;
      return getClips(channelId);
    });
  } else return getClips(channelId, true);
};

const getChannelId = async (
  channelName: string
): Promise<{ error: boolean; channelId: string }> => {
  console.log("getting channelId", channelName);
  const userResponse = await fetch(
    `https://api.twitch.tv/helix/users?login=${channelName}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer 5tzzpfdv1xyoy7av8ldq5klnot1gq2",
        "Client-Id": "e8rgtpz3xahkvm0tendd4xh7zzdtz2",
      },
    }
  );

  if (!userResponse.ok) {
    return { error: true, channelId: "" };
  }

  const userData = await userResponse.json();
  const channelId = userData.data[0]?.id;

  if (!channelId) {
    return { error: true, channelId: "" };
  }

  return { error: false, channelId: channelId };
};

const getClips = async (
  channelId: string,
  useCursor: boolean = false
): Promise<{ error: boolean; clips: clip[] }> => {
  console.log("getting clips", channelId);
  let url = "";
  if (useCursor) url += "&after=" + cursor;
  const clipsResponse = await fetch(
    `https://api.twitch.tv/helix/clips?broadcaster_id=${channelId}${url}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer 5tzzpfdv1xyoy7av8ldq5klnot1gq2",
        "Client-Id": "e8rgtpz3xahkvm0tendd4xh7zzdtz2",
      },
    }
  );
  if (!clipsResponse.ok) {
    return { error: true, clips: [] };
  }

  const clipsData = await clipsResponse.json();
  console.log(clipsData);
  cursor = clipsData.pagination.cursor;
  return { error: false, clips: clipsData.data };
};

const TwitchAPI = {
  fetchData,
};

export default TwitchAPI;
