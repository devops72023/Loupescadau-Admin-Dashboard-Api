import User from "../Models/user.js";
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';



const qeuryAllUsers = async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

const findUserById = async (req, res, next, id) => {
    const user = await User.findById(id)
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    } else {
      req.profile = user;
      next();
    }
  };

const read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
  
    return res.json(req.profile);
  };

const update = async (req, res) => {
  let newUser = { 
    name: req.body.nom,
    email: req.body.email,
    role: Number(req.body.role),
    about: req.body.description,
    }
  if(req.body.image!='null'){
    newUser.image = req.body.image
  }
  const user = await User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: newUser },
    { new: true }
  );
  if(user) {
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  } else {
    return res.status(400).json({
      error: `User with ID ${req.profile._id} does not exist`,
    });
  }

  };

const create = async (req, res) => {
  try {
    let newUser = { 
      name: req.body.nom,
      email: req.body.email,
      role: Number(req.body.role),
      about: req.body.description,
      }
    if(req.body.image!='null'){
      newUser.image = req.body.image
    }

    const user = await new User(newUser);
    user.password = "secret" // new Date.now();

    await user.save();
    res.status(200).json({message: "new user created successfully"})

  } catch (err) {
    console.log(err);
    res.status(500).json({error: 'Something went wrong creating the user', err: err.messages}); 
  }
};

async function deleteUser(req, res) {
  try {
    const result = await User.deleteOne({ _id: req.profile._id });
    if (result.deletedCount === 1) {
      try{
        const users = await User.find();
        res.status(200).json({message: "User deleted successfully", users: users});
      }catch(err){
          res.status(500).json({error: err.message});
      }
    } else {
      res.status(404).json({error: "User not found"});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Error deleting user: ' + error.message});
  }
}

export { qeuryAllUsers, findUserById, read, update, create, deleteUser }