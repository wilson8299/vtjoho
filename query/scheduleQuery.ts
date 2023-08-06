import axios from "axios";

const setSchedule = async (vidoeId: string, startTime: string) => {
  await axios.post(`${process.env.SCHEDULE_HOSTNAME}/job`, {
    videoId: vidoeId,
    startTime: startTime,
  });
};

const setThreeDayLives = async (lives: any[]) => {
  await axios.post(`${process.env.SCHEDULE_HOSTNAME}/threeday`, {
    lives: lives,
  });
};

const deleteSchedule = async (vidoeId: string) => {
  await axios.put(`${process.env.SCHEDULE_HOSTNAME}/job`, {
    videoId: vidoeId,
  });
};

const postAllMember = async (members: { id: string }[]) => {
  await axios.post(`${process.env.SCHEDULE_HOSTNAME}/allmember`, {
    members: members,
  });
};

export { setSchedule, setThreeDayLives, deleteSchedule, postAllMember };
