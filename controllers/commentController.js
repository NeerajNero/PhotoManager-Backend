import { Comment } from "../models/comments.model.js";

export const addComment = async(req,res) => {
    try{
        const {imageId} = req.params
        const {comment} = req.body
        const {id} = req.user

        if(!imageId || !comment){
            return res.status(400).json({error: "imageId and comment is required!"})
        }

        const addNewComment = new Comment({user: id, comment, imageData: imageId})
        const saveNewComment = await addNewComment.save()

        if(!saveNewComment){
            return res.status(400).json({error: "unable to add comment"})
        }
        return res.status(200).json({message: "comment added successfully", comment: saveNewComment})
    }catch(error){
        onsole.log("error occured while adding comment", error.message)
        res.status(500).json({error: "internal server error", errorMessage: error.message})
    }
}