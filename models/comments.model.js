import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    comment: {
        type: String,
        required: true
    },
    imageData: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
},{timestamps: true})

export const Comment = mongoose.model("Comment", commentSchema, "photoManagerComments")