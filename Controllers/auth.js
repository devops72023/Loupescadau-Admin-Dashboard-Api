import jwt from 'jsonwebtoken';
import User from './../Models/user.js';
import errorHandler from './../helpers/dbErrorHandler.js';

const signIn = async (req, res) => {

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  
  if (!user) {
    return res.status(400).json({
      error: "User not found. Please, signup",
    });
  } else {
    if (user.role != 1) {
      return res.status(403).json({
        error: "You don't have the right permissions to access that page.",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password doesn't match.",
      });
    }

    const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET);

    return res.json({
      accessToken: token,
    });
  }
};


const requireSignIn = async function authMiddlware(req, res, next) {
  try {
    const Authorization = req.headers.authorization || null;
    if (Authorization) {
      const token = Authorization.split(' ')[1];
      const secretKey = process.env.JWT_SECRET;
      const verificationResponse = jwt.verify(token, secretKey);
      const userId = verificationResponse._id;
      const foundUser = await User.findOne({ _id: userId });

      if (foundUser) {
        req.data = foundUser;
        next();
      } else {
        res.status(401).json({
          error: "Wrong authentication token",
        });
      }
    } else {
      res.status(404).json({
        error: "Authentication token missing",
      });
    }
  } catch (error) {
    res.status(401).json({
      error: "Wrong authentication token",
    });
  }
};

const isAuth = (req, res, next) => {
  let user = req.data;

  if (!user) {
    res.status(403).json({
      error: "Access denied",
    });
  }

  next();
};

const isAdmin = (req, res, next) => {
  if (req.data.role != 1) {
    return res.status(403).json({
      error: "Admin resource! Access denied",
    });
  }

  next();
};

export { signIn, requireSignIn, isAuth, isAdmin };