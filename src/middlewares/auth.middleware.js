import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// this middleware helps to get the id of the current user
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // find out the current user using cookies or using header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // check if the retrieved token is valid or not
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // verify the retrived token with saved token and then decode it
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // find the user having that decoded token and remove password and refresh token
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    // if the user is invalid then throw an error
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    // set the request user with the current user
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
