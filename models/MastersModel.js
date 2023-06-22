import mongoose from "mongoose"
const { Schema } = mongoose
import validator from "./validator.js"

const MastersSchema = new Schema(
  {
    Type: { type: String },

    Code: { type: Number },
    Value: { type: String },
    Tags: { type: String },
    Label: {type:String},
    Parentid: { type: Number },
  },
  { timestamps: true }
)

const Masters = mongoose.model("Masters", MastersSchema)

export default Masters
