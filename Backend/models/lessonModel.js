const mongoose=require('mongoose')
const lectureSchema=mongoose.Schema({
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course'
    },
    lessons: [
        {
            id:{type:String,required:true},
            title: { type: String, required: true },
            video_URL: { type: String, required: true} ,
            isPreview:{type:Boolean,default:false}
        }
    ],
    
})

module.exports=mongoose.model('Lecture',lectureSchema)