import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    imageUrl : {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    albumId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Album",
    },
    imageName: {
        type: String,
        required: true
    },
    tags: [{
        type: String
    }],
    person: {
        type: String
    },
    isFavorite: {
        type: Boolean,
        default: false
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    size: {
        type: Number,
        required: true
    }
},{timestamps: true})

export const Image = mongoose.model('Image', imageSchema, "photoManagerFolder")