import mongoose from "mongoose"
import Masters from "../models/MastersModel.js"

const getMastersList = async (req, res) => {
  try {
    const masters = await Masters.aggregate([
      {
        $group: {
          _id: "$Type",
          documents: {
            $push: {
              Code: "$Code",
              Value: "$Value",
              Tags: "$Tags",
              Label : "$Label",
              Parentid: "$Parentid",
            },
          },
        },
      },
    ])

    const data = masters.reduce((acc, cur) => {
      acc[cur._id] = cur.documents;
      return acc;
    }, {});

    res.status(200).json({ success: true, data: data })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

const updateMastersByID = async (req, res, next) => {
  try {
    let id = req.query.id
    let updateData = req.body
    const updatedData = await Masters.findByIdAndUpdate(id, { $set: updateData })
    res.status(200).json({ messgae: "Masters updated" })
  } catch (error) {
    res.status(400).json({ messgae: "An error Occoured" })
  }
}

const getMastersById = async (req, res, next) => {
  try {
    let id = req.query.id
    let data = await Masters.findById(id)
    res.status(200).json({ data })
  } catch (err) {
    res.status(400).json({ messgae: err.message })
  }
}

const deleteMastersById = async (req, res, next) => {
  try {
    let id = req.query.id
    const updatedData = await Masters.findByIdAndRemove(id)
    res.status(200).json({ messgae: "Masters deleted" })
  } catch (err) {
    res.status(400).json({ messgae: err.message })
  }
}

const deleteMastersByID = async (req, res, next) => {
  try {
    const id = req.params.id
    const result = await Masters.findByIdAndRemove(id)
    if (!result) {
      return res.status(404).json({ message: "Masters not found" })
    }
    res.status(200).json({ message: "Masters deleted successfully" })
  } catch (error) {
    res.status(400).json({ message: "An error Occurred" })
  }
}

const storeMasters = async (req, res, next) => {
  try {
    let newModel = new Masters(req.body)
    const data = await newModel.save()
    res.status(200).json({ data })
  } catch (err) {
    res.status(400).json({ messgae: err.message })
  }
}

const updateBulkMasters = async (req, res, next) => {
  try {
    csv()
      .fromFile(req.file.path)
      .then(async (data) => {
        for (var x = 0; x < data.length; x++) {
          const id = data[x].id
          delete data[x].id
          await Masters.findByIdAndUpdate(id, { $set: data[x] })
        }
      })
    res.status(200).json({ message: "Bulk Update Done" })
  } catch (error) {
    res.status(400).json({ messgae: "An error Occoured" })
  }
}

const insertBulkMasters = async (req, res, next) => {
  try {
    csv()
      .fromFile(req.file.path)
      .then(async (data) => {
        for (var x = 0; x < data.length; x++) {
          console.log(data[x])
          let newModel = new Masters(data[x])
          await newModel.save()
        }
      })
    res.status(200).json({ message: "Bulk Insert Done" })
  } catch (error) {
    res.status(400).json({ messgae: "An error Occoured" })
  }
}

export default {
  getMastersList,
  storeMasters,
  getMastersById,
  deleteMastersById,
  updateMastersByID,
  updateBulkMasters,
  insertBulkMasters,
}
