import { handleCreateTemplate, handleGetTemplateById, handleUpdateTemplate } from "./controllers/templates";
import { handleCreateUser, handleDeleteUser } from "./controllers/users";
import bodyParser from 'body-parser';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { ErrorResponse, SuccessResponse } from "./utils/statusmessage";
import { handleDeleteVideo, handleListVideo, handleUploadVideo} from "./controllers/videos";
import multer from 'multer';
import { handleDeleteImage, handleListImage, handleUploadImage } from "./controllers/images";
import { handleDeleteAudio, handleListAudio, handleUploadAudio } from "./controllers/audios";


const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


const app=express();
app.use(cors());
app.use(bodyParser.json());
dotenv.config();
app.listen(process.env.PORT,()=>{
console.log(`Server is listening on ${process.env.PORT}`)
})

//app.use(express.urlencoded(({extended:false})));


app.get("/",(req:any,res:any,next:unknown)=>
{
    try{
        if(!req) return res.send(new ErrorResponse())
        res.send(new SuccessResponse());
    }
    catch(err:unknown)
    {
        return res.send(new ErrorResponse());
    }
})
app.post('/create_user',handleCreateUser);
app.delete('/delete_user',handleDeleteUser);
app.post('/create_template',handleCreateTemplate);
app.get('/get_template_by_id/:template_id',handleGetTemplateById);
app.delete('/delete_element/:template_id/:element_id',handleUpdateTemplate);
app.get('/list_videos',handleListVideo);
app.get('/list_images',handleListImage);
app.get('/list_audios',handleListAudio);
app.post('/new_video',upload.single('newvideo'),handleUploadVideo);
app.post('/new_image',upload.single('newimage'),handleUploadImage);
app.post('/new_audio',upload.single('newaudio'),handleUploadAudio);
app.delete('/delete_video/:videoid',handleDeleteVideo);
app.delete('/delete_image/:imageid',handleDeleteImage);
app.delete('/delete_audio/:audioid',handleDeleteAudio);

