import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
    albumName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        res: "User",
        required: true
    },
    sharedUser: [{
        type: String
    }]
},{timestamps: true})

export const Album = mongoose.model("Album", albumSchema, "photoManagerAlbums")