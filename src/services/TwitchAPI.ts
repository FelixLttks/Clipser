import { searchData } from "../App";
import { clip } from "../components/Clips";

let channelId = "";
let cursor = "";

const fetchData = async (
  searchData: searchData,
  newSearch: boolean = true
): Promise<{ error: boolean; clips: clip[]; hasMore: boolean }> => {
  console.log("fetchData", searchData);
  if (newSearch || channelId === "") {
    cursor = "";
    return await getChannelId(searchData.channelname).then((data) => {
      if (data.error) {
        return { error: true, clips: [], hasMore: false };
      }
      channelId = data.channelId;
      return getClips(
        channelId,
        searchData.startdate,
        searchData.enddate,
        searchData.clipscount
      ).then((data) => {
        return { ...data, hasMore: cursor != undefined };
      });
    });
  } else {
    return getClips(
      channelId,
      searchData.startdate,
      searchData.enddate,
      searchData.clipscount,
      true
    ).then((data) => {
      return { ...data, hasMore: cursor != undefined };
    });
  }
};

const getChannelInfo = async (
  channelName: string
): Promise<{
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  created_at: string;
}> => {
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
    return {
      id: "",
      login: "",
      display_name: "",
      type: "",
      broadcaster_type: "",
      description: "",
      profile_image_url: "",
      offline_image_url: "",
      view_count: 0,
      created_at: "",
    };
  }

  const userData = await userResponse.json();
  return userData.data[0];
};

const getChannelId = async (
  channelName: string
): Promise<{ error: boolean; channelId: string }> => {
  const userData = await getChannelInfo(channelName);

  const channelId = userData.id;

  if (!channelId) {
    return { error: true, channelId: "" };
  }

  return { error: false, channelId: channelId };
};

const getClips = async (
  channelId: string,
  startDate: string,
  endDate: string,
  clipsCount: string,
  useCursor: boolean = false
): Promise<{ error: boolean; clips: clip[] }> => {
  let url =
    "&started_at=" +
    startDate +
    ":00.000Z&ended_at=" +
    endDate +
    ":00.000Z&first=" +
    clipsCount;
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
  cursor = clipsData.pagination.cursor;
  return { error: false, clips: clipsData.data };
};

const TwitchAPI = {
  fetchData,
  getChannelInfo,
};

export default TwitchAPI;
