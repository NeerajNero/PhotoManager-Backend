import { Album } from "../models/album.model.js";
import { Image } from "../models/imageUrl.model.js";
import { User } from "../models/user.model.js";

export const createAlbum = async(req,res) => {
    try{
        const {id} = req.user
        const {albumName, albumDescription} = req.body

        if(!albumName || !albumDescription){
            return res.status(400).json({error: "unable to create album"})
        }

        const newAlbum = new Album({owner: id, albumName, albumDescription})
        const saveNewAlbum = await newAlbum.save()

        if(!saveNewAlbum){
            return res.status(400).json({error: "unable to save album"})
        }

        res.status(201).json({message: "album created successfully", album: saveNewAlbum})
    }catch(error){
        console.log("error occured while creating album", error.message)
        res.status(500).json({error: "internal server error", errorMessage: error.message})
    }
}

export const updateDescription = async(req,res) => {
    try{
        const {id} = req.user
        const {description} = req.body
        const {albumId} = req.params

        if(!albumId || !description){
            return res.status(400).json({error: "AlbumId and Description is required!"})
        }
        const album = await Album.findById(albumId)

        if(!album) {
            return res.status(404).json({error: "album not found!"})
        }

        if(album.owner.toString() !== id){
            return res.status(401).json({error: "You are not the right owner to perform this operation!"})
        }

        const updateAlbum = await Album.findByIdAndUpdate(albumId, {$set: {description}})

        if(!updateAlbum){
            return res.status(400).json({error: "unable to update description!"})
        }

        res.status(201).json({message: "description updated successfully"})
    }catch(error){
        console.log("error occured while updating description!", error.message)
        res.status(500).json({error: "internal server error", errorMessage: error.message})
    }
}

export const deleteAlbum = async(req,res) => {
    try{
        const {id} = req.user
        const {albumId} = req.params

        if(!albumId) {
            return res.status(400).json({error: "albumId is required"})
        }

        const album = await Album.findById(albumId)

        if(!album){
            return res.status(404).json({error: "no album found!"})
        }
        if(album.owner.toString() !== id.toString()) {
            return res.status(403).json({error: "You do not have permission to delete this album.!"})
        }

        const albumDelete = await Album.findByIdAndDelete(albumId)

        if(!albumDelete){
            return res.status(400).json({error: "unable to delete album!"})
        }
            await Image.updateMany({albumId},{$pull: {albumId}})
        res.status(200).json({message: "Album deleted successfully!"})
    }catch(error){
        console.log("error occured while deleting album!", error.message)
        res.status(500).json({error: "internal server error", errorMessage: error.message})
    }
}

export const shareWithOthers = async(req,res) => {
    try{
        const {albumId} = req.params
        const {id} = req.user
        const {userEmail} = req.body

        if(!albumId || !userEmail) {
            return res.status(400).json({error: "AlbumId and userEmail is required!"})
        }

        const album = await Album.findById(albumId)

        if(!album){
            return res.status(404).json({error: "no album found"})
        }

        const user = await User.findOne({email: userEmail})
        if(!user){
            return res.status(404).json({error: "user not found!"})
        }
        if(album.owner.toString() !== id){
            return res.status(403).json({error: "You dont have the permission to share this album with others"})
        }

        const shareAlbum = await Album.findByIdAndUpdate(albumId, {$addToSet: {sharedUser: userEmail}})

        if(!shareAlbum){
            return res.status(400).json({error: "error occured while sharing Album!"})
        }

        res.status(200).json({message: "image shared successfully!"})
    }catch(error){
        console.log("error occured while sharing album!", error.message)
        res.status(500).json({error: "internal server error", errorMessage: error.message})
    }
}

export const getAlbums = async(req,res) => {
    try{    
        const {id} = req.user
        const albums = await Album.find({owner: id}).populate("owner", "-profilePicture")

        if(albums.length === 0){
            return res.status(404).json({error: "no albums found!"})
        }
        res.status(200).json({message: "albums fetched succesfully!", albums})
    }catch(error){
        console.log("error occured while fetching albums!", error.message)
        res.status(500).json({error: "internal server error", errorMessage: error.message})
    }
}