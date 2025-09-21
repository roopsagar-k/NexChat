import { requestHandler } from "./requestHandler";

export const uploadImage = async (image: File) => {
  const key = Date.now().toString() + "-" + image.name;
  const res = await requestHandler({
    method: "GET",
    endpoint: "/api/storage/signed-url/put",
    params: {
      key: key,
      expiresIn: 3600,
    },
  });

  const signedUrl = res.data.url;
  try {
    const response = await fetch(signedUrl, {
      method: "PUT",
      body: image,
      headers: {
        "Content-Type": image.type || "application/octet-stream",
      },
    });
    console.log("response of image upload", response);
  } catch (error) {
    console.error("error of image upload", error);
  }

  return key;
};
