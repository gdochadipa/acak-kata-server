const mongoose = require('mongoose')

let languageSchema = mongoose.Schema({
    language_name:{
        type:String,
        require:[true, "nama bahasa harus diisi"]
    },
    language_code:{
        type:String,
        require:[true,"Kode bahasa harus diisi"]
    },
    language_collection:{
        type: String,
        require: [true, "Nama Koleksi bahasa harus diisi"]
    },
    language_icon: {
        type: String,
        require: [true, "Icon bahasa harus diisi"]
    }
})

module.exports = mongoose.model('languages', languageSchema)