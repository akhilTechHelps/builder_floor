import mongoose from 'mongoose';
const { Schema } = mongoose;
import validator from './validator.js';


const propertiesSchema = new Schema( {
  city: String,
  sectorNumber: String,
  plotNumber: String,
  size: Number,
  facing: String,
  accommodation: String,
  parkFacing: Boolean,
  corner: Boolean,
  floor: String,
  possession: String,
  title: String,
  detailTitle: String,
  description: String,
  builderName: String,
  builderContact: Number,
  price: Number,
  address: String,
  editor_choice: Boolean,
  category: String,
  state: String,
  images: Array,
  thumbnails: Array,
  imageType: String,
  folder: String,
  channelPartner: String,
  channelContact: Number,
  thumbnailName: String
},  {timestamps:true}
  )

const properties = mongoose.model("properties", propertiesSchema);

export default properties;
