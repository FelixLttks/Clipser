import { searchData } from "../App";
import { clip } from "../components/Clips";

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
      return getClips(
        channelId,
        searchData.startdate,
        searchData.enddate,
        searchData.clipscount
      );
    });
  } else
    return getClips(
      channelId,
      searchData.startdate,
      searchData.enddate,
      searchData.clipscount,
      true
    );
};

const getChannelId = async (
  channelName: string
): Promise<{ error: boolean; channelId: string }> => {
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
};

export default TwitchAPI;
