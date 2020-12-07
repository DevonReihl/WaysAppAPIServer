const express = require("express");
const path = require("path");
const UserService = require("./user-service");

const userRouter = express.Router();

userRouter
  .route('/')
  .post( async (req, res, next) => {
    const { password, username } = req.body;

    for (const field of ["username", "password"])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`,
        });

    try {
      const passwordError = UserService.validatePassword(password);

      if (passwordError) return res.status(400).json({ error: passwordError });

      const hasUserWithUserName = await UserService.hasUserWithUserName(
        req.app.get("db"),
        username
      );

      if (hasUserWithUserName)
        return res.status(400).json({ error: `Username already taken` });

      const hashedPassword = await UserService.hashPassword(password);

      const newUser = {
        user_name: username,
        password: hashedPassword,
      };

      const user = await UserService.insertUser(req.app.get("db"), newUser);

      res.status(201).location(path.posix.join(req.originalUrl, `/${user.id}`)).json(UserService.serializeUser(user));
    } catch (error) {
      next(error);
    }

});

module.exports = userRouter;
