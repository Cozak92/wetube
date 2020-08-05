import routes from "./routes";
import multer from "multer"
import multerS3 from "multer-s3"
import aws from "aws-sdk"
import dotenv from "dotenv"
import Video from "./models/video"
dotenv.config();


aws.config.update({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_PRIVATE_KEY,
    "region": "ap-northeast-2" 
});

const s3 = new aws.S3();
const params = {
    Bucket: 'netube/check',
    Key: process.env.AWS_KEY,
    Body: "HelloWorld"
};
s3.putObject(params, function (err, res) {
    if (err) {
        console.log("Error uploading data: ", err);
    } else {
        console.log("✅  Successfully connected to AWS S3");
    }
})


const multerVideo = multer({
    storage: multerS3({
        s3:s3,
        acl:"public-read",
        bucket:"netube/videos"
    })
})
const multerAvatar = multer({
    storage: multerS3({
        s3:s3,
        acl:"public-read",
        bucket:"netube/avatars"
    })
})



export const localMiddleware = (req, res, next) =>{
    res.locals.siteName = "NeTube";
    res.locals.routes = routes;
    res.locals.loggedUser = req.user || null;
    
    
    next();

};

export const onlyPublic = (req,res,next) =>{
    if (req.user){
        res.redirect(routes.home);   
    }
    else{
        next();
    }
}

export const onlyPrivate = (req,res,next) =>{
    if (!req.user){
        res.redirect(routes.home)
    }
    else{
        next();
    }
}
export const uploadVideo = multerVideo.single("videoFile")
export const uploadAvatar = multerAvatar.single("avatar")