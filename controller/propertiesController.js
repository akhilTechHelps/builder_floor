import mongoose from 'mongoose';
import properties from '../models/propertiesModel.js';


const getpropertiesList = async (req, res, next) => {
  try {
    let data = await properties.find()
    const filter = req.query.filter;

    let filteredProperties = data;

    if (filter) {
      const parsedFilter = JSON.parse(filter);

      if (parsedFilter.cities && parsedFilter.cities.length > 0) {
        filteredProperties = filteredProperties.filter(property => parsedFilter.cities.includes(property.City));
      }

      if (parsedFilter.accommodation && parsedFilter.accommodation.length > 0) {
        filteredProperties = filteredProperties.filter(property => parsedFilter.accommodation.includes(property.Accommodation));
      }

      if (parsedFilter.facing && parsedFilter.facing.length > 0) {
        filteredProperties = filteredProperties.filter(property => parsedFilter.facing.includes(property.Facing));
      }

      if(parsedFilter.locations && parsedFilter.locations.length > 0) {
        filteredProperties = filteredProperties.filter(property => parsedFilter.locations.includes(property.Location));
      }

      if(parsedFilter.floors && parsedFilter.floors.length > 0) {
        filteredProperties = filteredProperties.filter(property => parsedFilter.floors.includes(property.Floor));
      }

      if(parsedFilter.possession && parsedFilter.floors.possession > 0) {
        filteredProperties = filteredProperties.filter(property => parsedFilter.possession.includes(property.Possession));
      }

      if (parsedFilter.priceRange && parsedFilter.priceRange.length === 2) {
        const [minPrice, maxPrice] = parsedFilter.priceRange;
        filteredProperties = filteredProperties.filter(property => property.Price >= minPrice && property.Price <= maxPrice);
      }

      if (parsedFilter.sizeRange && parsedFilter.sizeRange.length === 2) {
        const [minSize, maxSize] = parsedFilter.sizeRange;
        filteredProperties = filteredProperties.filter(property => property.Size >= minSize && property.Size <= minSize);
      }

      res.status(200).json(filteredProperties);

    }
    else{
      res.status(200).json({ data })
    }
  } catch (error) {
    res.status(400).json({ messgae: "An error Occoured" })
  }
}

const updatepropertiesByID = async (req, res, next) => {
  try {
    let id = req.query.id
    let updateData = req.body
    const updatedData = await properties.findByIdAndUpdate(id, { $set: updateData })
    res.status(200).json({ messgae: "properties updated" })
  } catch (error) {
    res.status(400).json({ messgae: "An error Occoured" })
  }
}

const getpropertiesById = async (req, res, next) => {
  try {
    let id = req.query.id
    let data = await properties.findById(id)
    res.status(200).json({ data })
  } catch (err) {
    res.status(400).json({ messgae: err.message })
  }
}

const deletepropertiesById = async (req, res, next) => {
  try {
    let id = req.query.id
    const updatedData = await properties.findByIdAndRemove(id)
    res.status(200).json({ messgae: "properties deleted" })
  } catch (err) {
    res.status(400).json({ messgae: err.message })
  }
}

const deletepropertiesByID = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await properties.findByIdAndRemove(id);
    if (!result) {
      return res.status(404).json({ message: 'properties not found' });
    }
    res.status(200).json({ message: "properties deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "An error Occurred" });
  }
}

const storeproperties = async (req, res, next) => {
  try {
    let newModel = new properties(req.body)
    const data = await newModel.save()
    res.status(200).json({ data })
  } catch (err) {
    res.status(400).json({ messgae: err.message })
  }
}


const updateBulkproperties = async (req, res, next) => {
  try {
    csv()
      .fromFile(req.file.path)
      .then(async (data) => {
        for (var x = 0; x < data.length; x++) {
          const id = data[x].id
          delete data[x].id
          await properties.findByIdAndUpdate(id, { $set: data[x] })
        }
      })
    res.status(200).json({ message: "Bulk Update Done" })
  } catch (error) {
    res.status(400).json({ messgae: "An error Occoured" })
  }
}

const insertBulkproperties = async (req, res, next) => {
  try {
    csv()
      .fromFile(req.file.path)
      .then(async (data) => {
        for (var x = 0; x < data.length; x++) {
          console.log(data[x])
          let newModel = new properties(data[x])
          await newModel.save()
        }
      })
    res.status(200).json({ message: "Bulk Insert Done" })
  } catch (error) {
    res.status(400).json({ messgae: "An error Occoured" })
  }
}

const getSimilarProperties = async(req, res) => {
  const city = req.query.city;

  properties.find({ City: city }, (err, properties) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching properties.' });
    } else {
      res.json(properties);
    }
  });
});

export default {
  getpropertiesList,
  storeproperties,
  getpropertiesById,
  deletepropertiesById,
  updatepropertiesByID,
  updateBulkproperties,
  insertBulkproperties,
  getSimilarProperties
}
