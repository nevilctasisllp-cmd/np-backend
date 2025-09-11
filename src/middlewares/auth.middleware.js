import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asynchandler } from "../utils/asynchandler";
import JWT from "jsonwebtoken";




    export const verifyJWT = asynchandler(async (req,res , next) => {
        try {
            const token = req.cookies?.accessToken || req.header
            ("Authorization")?.replace("Bearer ","")
    
            if (!token) {
                throw new ApiError(401,"Unauthorized request")
            }
    
            const decodedToken = JWT.verify(token , process.env.ACCESS_TOKEN_SECRET)
    
    
            const user = await User.findById(decodedToken?._id)
            .select("-password -refreshToken")
    
            if (!user) {
                throw new ApiError(401,"Invalid accessToken")
            }
    
            req.user = user;
            next()
    
        } catch (error) {
            throw new ApiError(401, error?.message || "Invalid AccessToken")
        }
        
    })