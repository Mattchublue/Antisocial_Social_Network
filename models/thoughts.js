const {
    Schema,
    model,
    Types
  } = require('mongoose');
  const moment = require('moment');
  const reactionSchema = require("./reaction")
  const ThoughtSchema = new Schema(
    {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => moment(createdAtVal).format('MMM DD')
    },
    username: {
      type: String,
      required: true
    },
    reactions: [reactionSchema]
  }, {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  });
  
  ThoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
  });
  
  const Thought = model('Thought', ThoughtSchema);
  
  module.exports = Thought;