import {asynchandler} from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import JWT from "jsonwebtoken";


    const generateAccessAndRefreshTokens = async(userID) => {
        try {
            await User.findById(userID);
            const accessToken = user.generateAccessTokens();
            const refreshToken = user.generateRefreshTokens();

            user.refreshToken = refreshToken
            user.save({ validateBeforeSave : false })

            return{ accessToken , refreshToken }

        } catch (error) {
            throw new ApiError(500,"Something went wrong while generating Access And Referesh Token ")
        }
    }

const registerUser = asynchandler( async (req,res) => {
    const {fullname , email ,username , password } = req.body 
        console.log("email:", email);



        if (
            [fullname,email,username,password].some((field) => 
            field?.trim() === "")
        ) {
            throw new ApiError(400, " app field are required")
        };

        const existedUser = await User.findOne({
            $or:[{ username },{ email }]
        });

            if (existedUser) {
                throw new ApiError(409, "User with email or Username already exists")
            };

           console.log("req.files: ", req.files);

                const avatarLocalPath = req.files?.avatar?.[0]?.path || null;
                let coverImageLocalPath = req.files?.coverImage?.[0]?.path || null;

                if (!avatarLocalPath) {
                throw new ApiError(400, "Avatar file is required");
                }

                // Agar coverImage hai to overwrite
                if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
                coverImageLocalPath = req.files.coverImage[0].path;
                }

                console.log("avatarLocalPath:", avatarLocalPath);
                console.log("coverImageLocalPath:", coverImageLocalPath);

            if (!avatarLocalPath) {
                throw new ApiError (400, " avatar file is required")
            }

            const user = await User.create({
                    fullname: req.body.fullname,
                    username: req.body.username.toLowerCase(),
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.files?.avatar?.[0]?.path,          // required
                    coverImage: req.files?.coverImage?.[0]?.path || "" // optional
});



            const createdUser = await User.findById(user._id).select(
                "-password -refreshToken"
            )

            if (!createdUser ) {
                throw new ApiError(500,"Something went wrong while registering the User")
            }

            return res.status(201).json(
                new ApiResponse(200, createdUser , "User registered successfully")
            )
} );


const loginUser = asynchandler(async (req ,res) => {
    const {email, username , password} = req.body

    if (!username && !email) {
        throw new ApiError (400 , "username or email is required")
    }

    const user = await User.findOne({
        $or : [{ username },{ email }]
    })

    if (!user) {
        throw new ApiError(404 , "user does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError (401 , "password incorrect ");
    };

    const {accessToken , refreshToken} = await 
    generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    };

    return res.
    status(200).
    cookie("accessToken" , accessToken , options).
    cookie("refreshToken", refreshToken , options)
    .json(
        new ApiResponse(200, {
            user : loggedInUser,accessToken , refreshToken
        },

        "user logged In successfully "
    )
    )
    


});

const logoutuser = asynchandler(async (req,res) => {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    refreshToken: undefined
                }
            },
            {
                new : true
            }
        )
        const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearcookie("accessToken", options)
    .clearcookie("refreshToken", options)
    .json(new ApiResponse(200 , {}, "User loggedOut successfully"))
})

const refreshAccessToken = asynchandler(async (req,res) => {
    const incomingRefreshtoken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshtoken) {
        throw new ApiError(401 , "unauthorized Request ")
    }

        JWT.verify(
            incomingRefreshtoken
        )

})


export {
    
    registerUser,
    loginUser,
    logoutuser

}
