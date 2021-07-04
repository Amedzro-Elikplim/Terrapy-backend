const User = require("../models/User");
const { validateRegistrationInputs, validateUserLoginInputs } = require("../utils/validator");
const { generateToken, verifyToken } = require("../auth/Services");


//register user
const registerUser = async (req, res) => {
    //get user info from front end and validate using joi
    try {

        const result = await validateRegistrationInputs.validateAsync(req.body);
        const { first_name, last_name, email, password, confirm_password } = result;
      
      const newUser = {
          first_name,
          last_name,
          email,
          password,
          confirm_password
      };

      //check if the user exist in the data base
      let userExist = await User.findOne({ email });
      if(userExist) return  res.status(405).send("user with email already exist");

      const user = await User.create(newUser);

      res.status(201).send({user});

    }catch(err) {
        res.status(400).send(err);
    }
    
} 


const userLogin = async(req, res) => {
    try {
        const result = await validateUserLoginInputs.validateAsync(req.body);
        const { email, password } = result;

        const user = await User.findOne({email});
        

        if(!user) {
            return res.status(400).send("user not found")
        }

        const accessToken = generateToken(email, password);

        if(accessToken) return res.status(200).send({user, accessToken });
        
    }catch(err) {
       return res.status(400).send(err);
    }
   
}

module.exports = {
    registerUser,
    userLogin
}