const jwt = require("jsonwebtoken");

const User = require("../models/User.model");

exports.register = (req, res) => {
  const { email, password } = req.body;

  const confirmationCode = jwt.sign({ email }, process.env.JWT_SECRET);

  //check if the email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  //check if the email is valid
  if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  //Check if the password is valid, at least 8 characters, 1 uppercase, 1 lowercase and 1 number
  if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
    return res.status(400).json({
      error:
        "Invalid password, please use at least 8 characters, 1 uppercase, 1 lowercase and 1 number",
    });
  }

  //Look for user in database
  User.findOne({ email })
    .then((user) => {
      //Check if user already exists
      if (user) {
        return res.status(400).json({ error: "User already exists" });
      }

      //Create new user
      const newUser = new User({ email, confirmationCode });
      newUser.setPassword(password);

      newUser
        .save()
        .then((user) => {
          user.password = undefined;
          user.confirmationCode = undefined;
          user.hash = undefined;
          user.salt = undefined;
          return res
            .status(200)
            .json({ message: "User created successfully", user });
        })
        .catch((err) => {
          return res.status(400).json({ error: err });
        });
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  //check if the email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  //Find user and login
  User.findOne({ email })
    .then((user) => {
      if (!user) return res.status(400).json({ error: "User not found" });

      if (!user.validPassword(password, user.salt))
        return res.status(400).json({ error: "Invalid password" });

      if (user.status === "pending")
        return res.status(400).json({ error: "User not confirmed" });
      user.password = undefined;
      user.confirmationCode = undefined;
      user.salt = undefined;
      user.hash = undefined;
      const token = jwt.sign({ _id, email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res
        .status(200)
        .json({ message: "User logged in successfully", user, token });
    })
    .catch((err) => {
      console.log("error");
      return res.status(400).json({ error: err });
    });
};

exports.validate = (req, res) => {
  const { confirmationCode } = req.params;

  User.findOne({ confirmationCode })
    .then((user) => {
      if (!user)
        return res.status(400).json({ error: "Invalid confirmation code" });

      user.status = "active";
      user.confirmationCode = undefined;

      user
        .save()
        .then((user) => {
          user.password = undefined;
          user.confirmationCode = undefined;
          user.salt = undefined;
          user.hash = undefined;
          return res
            .status(200)
            .json({ message: "User validated successfully", user });
        })
        .catch((err) => {
          return res.status(400).json({ error: err });
        });
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
};

exports.userById = (req, res, next, id) => {
  User.findById(id)
    .then((user) => {
      if (!user) return res.status(400).json({ error: "User not found" });

      req.user = user;
      next();
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
};

exports.userByConfirmationCode = (req, res, next, confirmationCode) => {
  User.findOne({ confirmationCode })
    .then((user) => {
      if (!user) return res.status(400).json({ error: "User not found" });

      req.user = user;
      next();
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
};
