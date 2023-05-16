import axios from "axios";
import FormData from "form-data";
const hosttest = `https://${process.env.NEXT_PUBLIC_VTJOHO_HOSTNAME}/api/rss`;
const setPubsubhubbub = async (channelId: string) => {
  var formData = new FormData();
  formData.append("hub.callback", hosttest);
  formData.append(
    "hub.topic",
    `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${channelId}`
  );
  formData.append("hub.verify", "async");
  formData.append("hub.mode", "subscribe");

  const data = await axios.post(`https://pubsubhubbub.appspot.com/subscribe`, formData, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  });

  return data;
};

const deletePubsubhubbub = async (channelId: string) => {
  var formData = new FormData();
  formData.append("hub.callback", `https://vtjoho.net/api/rss`);
  formData.append(
    "hub.topic",
    `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${channelId}`
  );
  formData.append("hub.verify", "async");
  formData.append("hub.mode", "unsubscribe");

  const data = await axios.post(`https://pubsubhubbub.appspot.com/subscribe`, formData, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  });

  return data;
};

export { setPubsubhubbub, deletePubsubhubbub };
