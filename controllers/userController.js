import { User } from "../modals/userModal.js";
import { v4 as uuidv4 } from 'uuid';
import { createToken } from "../utils/token.js";

export const registerUser = async (req, res) => {
    try {
        const {
            // user_id,
            user_name,
            user_email,
            user_password,
            user_image,
            total_orders,
            // created_at,
            // last_logged_in,
          } = req.body;

          //  USER INPUT VALIDATION ==================================================>
        
          if(user_name === ""){
            return res.status(400).json({success:false,message:"username cannot be blank"})
          }
          if(user_email === ""){
            return res.status(400).json({success:false,message:"username cannot be blank"})
          }
          if(user_password === ""){
            return res.status(400).json({success:false,message:"username cannot be blank"})
          }
          if(user_image === ""){
            return res.status(400).json({success:false,message:"username cannot be blank"})
          };

          const user_id = uuidv4();

          const token = await createToken(user_id,user_email);
        //   console.log(token);

        //   const options = {
        //     httpOnly: true,
        //     expires: new Date(Date.now() + process.env.COOKIE_EXPIRY),
        //   };
        
          res.status(201).cookie("token",token).json({
            success:true,
            message:"User registered successfully",
            data:{
                user_id,
                user_name,
                user_email
            }
          });
        
    } catch (error) {
        res.status(500).send({success:false,message:error.message})
    }
};
