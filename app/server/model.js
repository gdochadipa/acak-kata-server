const mongoose = require('mongoose');

let serverSchema = mongoose.Schema({
    url_api_server: {
        type: String,
    },
    url_api_port: {
        type: String,
    },
    url_socket_server: {
        type: String,
    },
    url_socket_port: {
        type: String,
    },
    name_server: {
        type: String,
    },
    main_server:{
        type: Number,
        default: 0
    },
    status_server:{
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('servers',serverSchema);