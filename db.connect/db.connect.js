import mongoose from 'mongoose'

export const initializeDatabase = async() => {
    const MONGO_DB_URI = process.env.MONGO_DB_URI
    try{
        const connection = await mongoose.connect(MONGO_DB_URI)
        if(connection){
            console.log("Connection to database was successfull!")
        }
    }catch(error){
        console.log("unable to connect to DB", error.message)
    }
}