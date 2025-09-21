import { asyncHandler } from "../services/helpers";
import ApiError from "../utils/api-error.utils";
import { ObjectStorage, SIGNED_ACCESS } from "../services/storage.service";
import ApiResponse from "../utils/api-response.utils";

const storage = new ObjectStorage();

export const getSignedUrlForGetAccess = asyncHandler(async (req, res) => {
  const { key, expires } = req.query;
  if (!key || typeof key !== "string") {
    throw ApiError.badRequest("Missing 'key' parameter");
  }

  const url = await storage.getSignedUrl(
    key,
    SIGNED_ACCESS.GET,
    expires ? Number(expires) : 3600
  );

  if (!url)
    throw ApiError.internal("Unable to generate signed URL at the moment!");

  return res.json(
    new ApiResponse(200, { url }, "Signed url generated successfully.")
  );
});

export const getSignedUrlForPutAccess = asyncHandler(async (req, res) => {
  const { key, expires } = req.query;
  if (!key || typeof key !== "string") {
    throw ApiError.badRequest("Missing 'key' parameter");
  }

  const url = await storage.getSignedUrl(
    key,
    SIGNED_ACCESS.PUT,
    expires ? Number(expires) : 3600
  );

  if (!url)
    throw ApiError.internal("Unable to generate signed URL at the moment!");

  return res.json(
    new ApiResponse(200, { url }, "Signed url generated successfully.")
  );
});
