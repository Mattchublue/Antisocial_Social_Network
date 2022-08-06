const { User } = require("../models");

const userController = {
  //Gets all of the users
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: "thoughts",
      })
      .populate({
        path: "friends",
      })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  //Gets a user by ID
  getUserById({ params }, res) {
    User.findOne({
      _id: params.id,
    })
      .populate({
        path: "thoughts",
      })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  //creates a new user
  createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
  },

  //Updates an existing user by ID
  updateUser({ params, body }, res) {
    User.findOneAndUpdate(
      {
        _id: params.id,
      },
      body,
      {
        new: true,
        runValidators: true,
      }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({
            message: "No user found with this id.",
          });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },

  //Deletes a user

  deleteUser({ params }, res) {
    User.findOneAndDelete({
      _id: params.id,
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({
            message: "No user found with this id.",
          });
          return;
        }
        res.status(200).json({ 
            message: "Your user is deleted."
        })
        return dbUserData; 
      })
      .then((dbUserData) => {
        User.updateMany(
          {
            _id: {
              $in: dbUserData.friends,
            },
          },
          {
            $pull: {
              friends: params.userId,
            },
          }
        )
          .then(() => {
            Thought.deleteMany({
              username: dbUserData.username,
            })
              .then(() => {
                res.json({
                  message: "User deleted successfully",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(400).json(err);
              });
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  //Add friend to friend list
  addToFriendList({ params }, res) {
    User.findOneAndUpdate(
      {
        _id: params.userId,
      },
      {
        $push: {
          friends: params.friendId,
        },
      },
      {
        new: true,
      }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({
            message: "No user found with this id!",
          });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
  },

  //Remove a friend from friend list
  
  removefromFriendList({ params }, res) {
    User.findOneAndUpdate(
      {_id: params.userId,
    })
      .then((deletedFriend) => {
        if (!deletedFriend) {
          return res.status(404).json({
            message: "No friend found with this id.",
          });
        }
        return User.findOneAndUpdate(
          {
            friends: params.friendId,
          },
          {
            $pull: {
              friends: params.friendId,
            },
          },
          {
            new: true,
          }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({
            message: "No friend found with this id.",
          });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = userController;
