const axios = require("axios");
require('dotenv').config()

const getAddresssDetail = async (lat, lng) => {
    const result = await axios.get(`${process.env.MAP_IR_URL}?lat=${lat}&lng=${lng}`, {
        header: {
            "x-api-key": process.env.MAP_IR_KEY
        }
    }).then((res) => res.data)
    return {
        address: result?.address,
        province: result?.province,
        city: result?.city,
        district: result?.district
    }

}

module.exports = {getAddresssDetail}