import { User } from "../modals/userModal.js";
import { v4 as uuidv4 } from 'uuid';
import { createToken } from "../utils/token.js";

export const registerUser = async (req, res) => {
    try {
        const {
            user_name,
            user_email,
            user_password,
            user_image,
          } = req.body;

          //  USER INPUT VALIDATION ==================================================>
        
          if(user_name === ""){
            return res.status(400).json({success:false,message:"username cannot be blank"})
          }
          if(user_email === ""){
            return res.status(400).json({success:false,message:"email cannot be blank"})
          }
          if(user_password === ""){
            return res.status(400).json({success:false,message:"password cannot be blank"})
          }
          if(user_image === ""){
            return res.status(400).json({success:false,message:"image cannot be blank"})
          };

          const userExists = await User.findOne({user_email});

          if(userExists){
            return res.status(409).json({
              success:false,
              message:"Email id already in use"
            })
          }

          const user_id = uuidv4();
          const total_orders =Math.floor(Math.random()*100);

          const userData = {
            user_id : uuidv4(),
            user_name,
            user_email,
            user_password,
            user_image,
            total_orders : Math.floor(Math.random()*100),
            created_at: new Date(Date.now()),
            last_logged_in:null
          };

          const saveData = await User.create(userData);

          if(!saveData){
            return res.status(400).json({success:false,message:"Unable to save data, Please try again"})
          }

          const token = await createToken(user_id,user_email);

          const options = {
            httpOnly: true,
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRY * 24 * 60 * 60 * 1000),
          };
          
          res.status(201).cookie("token",token,options).json({
            success:true,
            message:"User registered successfully",
            data:{
                user_id,
                user_name,
                user_email,
                user_image,
                total_orders, 
                token
            }
          });
        
    } catch (error) {
        res.status(500).send({success:false,message:error.message})
    }
};

export const loginUser = async (req,res) => {
   try {
      const {user_email,user_password} = req.body;
      if(user_email ===""){
        return res.status(400).json({
          success:false,
          message:"email cannot be blank"
        })
      }
      if(user_password ===""){
        return res.status(400).json({
          success:false,
          message:"password cannot be blank"
        })
      }
      const userExists = await User.findOne({user_email,user_password});

      if(!userExists){
        return res.status(404).json({
          success:false,
          message:"No user found"
        })
      };

      const token =await createToken(userExists.user_id,userExists.user_email);

      const options = {
        httpOnly: true,
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRY * 24 * 60 * 60 * 1000),
      };

      return res.status(200).cookie("token",token,options).json({
        success:false,
        message:"user login successfully",
      });

   } catch (error) {
      res.status(500).json({
        success:false,
        message:error.message
      })
   }
};
