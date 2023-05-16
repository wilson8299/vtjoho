import axios from "axios";

const getChannelInfo = async (channelId: string) => {
  const res = await axios.get(`https://www.googleapis.com/youtube/v3/channels`, {
    params: {
      key: process.env.YT_API_KEY,
      id: channelId,
      part: "id,snippet,contentDetails,brandingSettings",
    },
  });

  return res.data;
};

const getVideoDetail = async (videoId: string) => {
  const res = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
    params: {
      key: process.env.YT_API_KEY,
      id: videoId,
      part: "id,snippet,contentDetails,statistics,localizations,player,status,liveStreamingDetails",
    },
  });
  return res.data;
};

const getPlaylist = async (playlistId: string) => {
  const res = await axios.get(`https://youtube.googleapis.com/youtube/v3/playlistItems`, {
    params: {
      key: process.env.YT_API_KEY,
      playlistId: playlistId,
      part: "id,snippet,contentDetails,status",
      maxResults: 50,
    },
  });

  return res.data;
};

export { getChannelInfo, getVideoDetail, getPlaylist };
