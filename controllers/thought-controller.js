const {
    Thought,
    User
} = require('../models');
const thoughtController = {

    //Gets all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    //Gets a thought by ID
    getThoughtById({
        params
    }, res) {
        Thought.findOne({
                _id: params.thoughtId
            })
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({
                        message: 'There are not any thoughts on file for this ID.'
                    });
                    return;
                }
                res.json(dbThoughtData)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // Adds a new thought
    addThought(req, res) {
        Thought.create(req.body)
          .then((dbThoughtData) => {
            return User.findOneAndUpdate(
              { _id: req.body.userId },
              { $push: { thoughts: dbThoughtData._id } },
              { new: true }
            );
          })
          .then((dbUserData) => {
            res.json({ message: 'You have added a new thought.  Thought created successfully!' });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      },

    //Update a thought by ID
    updateThought({
        params,
        body
    }, res) {
        Thought.findOneAndUpdate({
                _id: params.thoughtId
            }, {
                $set: body
            }, {
                runValidators: true,
                new: true
            })
            .then(updateThought => {
                if (!updateThought) {
                    return res.status(404).json({
                        message: 'There is not a thought on file with this ID'
                    });
                }
                return res.json({
                    message: "Success"
                });
            })
            .catch(err => res.json(err));
    },

    //Removes a thought
    removeThought({
        params
    }, res) {
        Thought.findOneAndRemove({
                _id: params.thoughtId
            })
            .then(deletedThought => {
                if (!deletedThought) {
                    return res.status(404).json({
                        message: 'The thought has been destroyed!'
                    });
                }
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({
                        message: 'The thought has been destroyed!'
                    });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    //Adds new reactions
    addReaction({
        params,
        body
    }, res) {
        Thought.findOneAndUpdate({
                _id: params.thoughtId
            }, {
                $push: {
                    reactions: body
                }
            }, {
                new: true,
                runValidators: true
            })
            .then(updatedThought => {
                if (!updatedThought) {
                    res.status(404).json({
                        message: 'There is not a reaction on file with this ID'
                    });
                    return;
                }
                res.json(updatedThought);
            })
            .catch(err => res.json(err));
    },
    // Removes a reaction
    removeReaction({
        params
    }, res) {
        Thought.findOneAndUpdate({
                    _id: params.thoughtId
                },
                {
                    $pull: {
                        reactions: {
                            reactionId: params.reactionId
                        }
                    }
                }, {
                    new: true
                }
            )
            .then((thought) => {
                if (!thought) {
                    res.status(404).json({
                        message: 'There is not a reaction on file with this ID'
                    });
                    return;
                }
                res.json(thought)
            })
            .catch(err => res.json(err));
    },
}

module.exports = thoughtController;