import { User } from "../modals/userModal.js";
import { v4 as uuidv4 } from 'uuid';
import { createToken } from "../utils/token.js";

export const insertUser = async (req, res) => {
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

      userExists.last_logged_in = new Date(Date.now());
      await userExists.save();

      const options = {
        httpOnly: true,
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRY * 24 * 60 * 60 * 1000),
      };

      return res.status(200).cookie("token",token,options).json({
        success:false,
        message:"user login successfully",
        token
      });

   } catch (error) {
      res.status(500).json({
        success:false,
        message:error.message
      })
   }
};

export const userDetails = async(req,res)=>{
  try {
    const {user_id}= req.params;

    if( user_id === ":user_id"){
      return res.status(400).json({
        success:false,
        message:"user id cannot be blank"
      })
    };

    const userData = await User.findOne({user_id}).select("-user_password -user_id -_id -created_at -last_logged_in -__v");
    if(!userData){
      return res.status(404).json({
        success:false,
        message:"No user found"
      })
    };

    return res.status(200).json({
      success:true,
      message:"fetch user details successfully",
      userData:userData
    });

  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }
};

export const updateUser = async(req,res) => {
  try {
     const userId = req.userId;
     const {user_name,user_password,user_image} = req.body;
     
     const userExists = await User.findOne({user_id:userId});
     
     if (userId !== userExists.user_id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    };

    if(user_name==="" && user_image==="" && user_password===""){
      return res.status(400).json({
        success:false,
        message:"updation fields cannot be empty"
      })
    }

     if(user_name !== ""){
      userExists.user_name=user_name;
     };
     if(user_image!==""){
      userExists.user_image=user_image;
     };
     if(user_password!==""){
      userExists.user_password=user_password;
     };


     const updatedData = await userExists.save();
     console.log(updatedData)

     return res.status(200).json({
      success:true,
      message:"User updated successfully",
      updatedData:{
        user_name:updatedData.user_name,
        user_email:updatedData.user_email,
        user_password:updatedData.user_password,
        user_image:updatedData.user_image
       }
     })
     
  } catch (error) {
     return res.status(500).json({
         success:false,
         message:error.messge,
      
     })
  }
};

export const getImage = async(req,res) => {
    try {
      const {user_id} = req.params;

      if( user_id === ":user_id"){
        return res.status(400).json({
          success:false,
          message:"user id cannot be blank"
        })
      };

      const userData = await User.findOne({user_id:user_id});
      console.log(userData)

      if(!userData){
        return res.status(404).json({
          success:false,
          message:"No such user"
        })
      }

      return res.status(200).json({
        success:true,
        message:"User image fetched successfully",
        userImage:{
          user_image:userData.user_image
         }
       })

    } catch (error) {
      return res.status(500).json({
        success:false,
        message:error.messge,
     
    })
    }
};
