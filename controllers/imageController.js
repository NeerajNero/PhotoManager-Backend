import {Image} from '../models/imageUrl.model.js'
import cloudinary from '../config/cloudinary.config.js'
import path from 'path'

export const uploadImage = async(req,res) => {
    try{
        const file = req.file
        const userId = req?.body?.userId || null
        const imageName = req?.body?.imageName || null
        if(!file || !userId || !imageName){
            return res.status(400).json({message: "ImageName, userId & file is required!"})
        }
       
        const fileSize = file.size
        const extension = path.extname(file.originalname).toLowerCase()
        if(fileSize > 5 * 1024 * 1024) {
            return res.status(400).json({ error: 'File too large. Max 5MB allowed.' });
        }

        const allowedExt = ['.jpg', '.jpeg', '.png', '.gif']
        if(!allowedExt.includes(extension)){
             return res.status(400).json({ error: 'Invalid file type.' });
        }
        const imageRes = await cloudinary.uploader.upload(file?.path, {folder: "imageUploads"});
        console.log("after uploading to cloudinary")
        const newUpload = new Image({imageUrl: imageRes.secure_url, user: userId, size: fileSize, imageName})
        const saveNewUpload = await newUpload.save()

        if(!saveNewUpload)  {
            return res.status(400).json({message: "unable to save image to DB!!"})
        }
        const imageData = await Image.findById(saveNewUpload._id).populate("user")
        res.status(201).json({message: "Image uploaded successfully", imageData})
    }catch(error){
        console.log("error occured while uploading image", error.message)
        res.status(500).json({error: "internal server error", errorMessage: error.message})
    }
}

export const getImages = async(req,res) => {
    try{
        const {userId} = req?.query
        if(!userId){
            return res.status(400).json({error: "userid is required"})
        }
        const images = await Image.find({user: userId}).populate("user")
        if(images.length === 0){
            return res.status(404).json({message: "no images found"})
        }
        res.status(200).json({message: "fetched photos successfully!", images})
    }catch(error){
        console.log("error occured while fetching images", error.message)
        res.status(500).json({error: "internal server error", errorMessage: error.message})
    }
}

export const deleteImage = async(req,res) => {
    try{
        const {userId, imageId} = req.query
        const {id} = req.user
        
        if(!userId || !imageId) {
            return res.status(400).json({error: "imageId and userId is required!"})
        }
        const image = await Image.findById(imageId)

        if(!image){
            return res.status(400).json({error: "image not found!"})
        }

        if(image?._id !== id){
            res.status(400).json({error: "user is not authenticated to perform this operation!"})
        }
        const performDelete = await Image.findByIdAndDelete(imageId)

        if(!performDelete){
            res.status(400).json({error: "unable to delete image"})
        }
        res.status(400).json({message: "image deleted successfully!"})
    }catch(error){
        console.log("error occured while deleting image", error.message)
        res.status(500).json({error: "internal server error", errorMessage: error.message})
    }
}

export const updateFavourite = async(req,res) => {
    try{
        const {imageId} = req?.body

        if(!imageId) {
            return res.status(400).json({error: "imageId is required!"})
        }

        const updateImageFavourite = await Image.findByIdAndUpdate(imageId, {$bit : {isFavorite: {xor : 1}}}, {new: true})

        if(!updateImageFavourite){
            return res.status(400).json({error: "unable to update favourite!"})
        }

        res.status(200).json({message: "status updated"})
    }catch(error){
        console.log("error occured while staring image", error.message)
        res.status(500).json({error: "internal server error", errorMessage: error.message})
    }
}

export const addTags = async(req,res) => {
    try{
        const {imageId} = req?.params
        const {tag} = req?.body

        if(!imageId || !tag){
            return res.status(400).json({error: "imageId and tag is required!"})
        }

        const addTags = await Image.findByIdAndUpdate(imageId, {$push: {tags: tag}})
        if(!addTags){
            return res.status(400).json({error: "unable to add Tag!"})
        }
        res.status(200).json({message: "tag added successfully!"})
    }catch(error){
        console.log("error occured while adding tags", error.message)
        res.status(500).json({error: "internal server error", errorMessage: error.message})
    }
}

