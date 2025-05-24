import jwt from 'jsonwebtoken'
export const authMiddleware = async(req,res,next) => {
    try{
        const token = req.cookies.access_token

        if(!token){
            res.status(400).json({message: "Token is missing!"})
        } 

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verifyToken
        next()
    }catch(error){
        console.log(error.message) 
        res.status(500).json({error: "internal server error", errorMessage: error.message})
    }
}