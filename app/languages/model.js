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
    language_icon: {
        type: String,
        require: [true, "Icon bahasa harus diisi"]
    },
    language_name_en: {
        type: String,
        require: [true, "Isi Nama bahasa dalam Inggris"]
    },
    language_name_id: {
        type: String,
        require: [true, "Isi Nama bahasa dalam Bahasa Indonesia"]
    }
})

module.exports = mongoose.model('languages', languageSchema)