// require ('dotenv').config({path:'/.env'})
import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";   // ✅ yaha import karo
import connectDB from "./db/index.js";

connectDB()
.then(() => {
    console.log('process.env.PORT: ', process.env.PORT);
    app.listen(process.env.PORT || 8000 , () => {
        console.log(`server is running on port : ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.log("MONGO DB CONNECTION FAILED !!!", err);
});


/*
const app = express()

(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("error:", error);
            throw error;
        })

            app.listen(process.env.PORT, () => {
                console.log(` App is listening on port ${process.env.PORT}`);
            })

    } catch (error) {
    console.log("ERROR",error);
    throw error;
    }
})()
    */


