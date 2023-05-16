import axios from "axios";

const uploadImageByUrl = async (
  storageDir: string,
  imageUrl: string,
  imageName: string
) => {
  let extension = "jpg";
  try {
    const imageBuffer = await axios
      .get(imageUrl, { responseType: "arraybuffer" })
      .then((res) => {
        // extension = res.headers["content-type"]?.split("/")[1];
        return Buffer.from(res.data, "utf-8");
      });

    const url = `${process.env.STORAGE_URL}/${storageDir}/${imageName}.${extension}`;

    const config = {
      headers: {
        AccessKey: process.env.STORAGE_ACCESS_KEY,
        "Content-Type": "application/octet-stream",
      },
    };

    const result = await axios.put(url, imageBuffer, config);

    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default uploadImageByUrl;
