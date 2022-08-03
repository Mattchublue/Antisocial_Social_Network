const {
    Schema,
    Types
} = require('mongoose');
const moment = require('moment');
models/index.js
const reactionSchema = new Schema({

    reactionId: {
        type: Schema.Types.ObjectId, 
        default: () => new Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: true,
        maxLength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => moment(createdAtVal).format('MMM DD')
    }
}, {
    toJSON: {
        getters: true
    },
    id: false
});

module.exports = reactionSchema;