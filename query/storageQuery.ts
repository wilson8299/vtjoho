import axios from "axios";

interface IImage {
  file: File;
  fileName: string;
  agency: string;
}

const uploadImageByUrl = async (
  storageDir: string,
  imageUrl: string,
  imageName: string
) => {
  let extension = "jpg";

  const imageBuffer = await axios
    .get(imageUrl, { responseType: "arraybuffer" })
    .then((res) => {
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
};

const uploadImageByBuffer = async (
  storageDir: string,
  imageName: string,
  imageBuffer: Buffer
) => {
  let extension = "jpg";

  const url = `${process.env.STORAGE_URL}/${storageDir}/${imageName}.${extension}`;

  const config = {
    headers: {
      AccessKey: process.env.STORAGE_ACCESS_KEY,
      "Content-Type": "application/octet-stream",
    },
  };

  const result = await axios.put(url, imageBuffer, config);

  return result;
};

const deleteImage = async (storageDir: string, imageName: string) => {
  let extension = "jpg";
  const url = `${process.env.STORAGE_URL}/${storageDir}/${imageName}.${extension}`;

  const config = {
    headers: {
      AccessKey: process.env.STORAGE_ACCESS_KEY,
    },
  };
  const result = await axios.delete(url, config);

  return result;
};

export { uploadImageByUrl, uploadImageByBuffer, deleteImage };
