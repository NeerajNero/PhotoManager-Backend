import jwt from 'jsonwebtoken'
import axios from 'axios'
import { User } from '../models/user.model.js'

// to redirect here pass a link in frontend of the backend api containing google redirect link
// first step create a google redirect then once redirected check code in next step
export const googleAuth = async(req,res) => {
    try{
        res.redirect(`https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_AUTH_CLIENT_ID}&redirect_uri=http://localhost:${process.env.PORT}/auth/google/callback&response_type=code&scope=profile email`)
    }catch(error){
        console.log("unable to redirect,", error.message)
        res.status(500).json({error: "Internal server error", errorMessage: error.message})
    }
} 
// once code is recieved check and get userinfo and store it in DB.
export const googleAuthCallback = async(req,res) => {
    const {code} = req.query
        if(!code){
            return res.status(400).json({error: "No code provided!"})
        }
        let accessToken;
    try{
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: process.env.GOOGLE_AUTH_CLIENT_ID,
            client_secret: process.env.GOOGLE_AUTH_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: `http://localhost:${process.env.PORT}/auth/google/callback` 
        },{
            headers: {"Content-Type": 'application/x-www-form-urlencoded'}
        })
        accessToken = tokenResponse.data.access_token
        const userInfoRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {  
                'Authorization': `Bearer ${accessToken}`
        }})
        
        let user = await User.findOne({email: userInfoRes?.data?.email})

        if(!user){
            const newUser = {
                name: userInfoRes?.data?.name,
                profilePicture: userInfoRes?.data?.picture,
                email: userInfoRes?.data?.email
            }

            const createUser = new User(newUser);
            user = await createUser.save();
        }

        const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            picture: user.profilePicture
        }

        const jwt_token = jwt.sign(payload,process.env.JWT_SECRET, {expiresIn: '2h'})
        res.cookie("access_token", jwt_token, {maxAge: 2 * 60 * 60 * 1000})
        res.redirect('http://localhost:5000/dashboard')
    }catch(error){
        console.log("unable to login in callback,", error.message)
        res.status(500).json({error: "Internal server error", errorMessage: error.message})
    }
}

export const getUser = async(req,res) => {
    try{
        const user = req.user
        if(!user){
            return res.status(400).json("No user data available!")
        }
        const findUser = await User.findOne({email: user.email})
        if(!findUser){
            return res.status(400).json({error: "no user found"})
        }
        res.status(200).json({message: "user data fetched successfully", user})
    }catch(error){
        console.log("error occured while getting user data", error.message)
        res.status(500).json({error: "internal server error", errorMessage: error.message})
    }
}