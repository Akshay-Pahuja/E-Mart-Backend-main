const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshtoken");
const crypto = require("crypto");
const User = require("../models/userModel")
const {validateMongoDbId} = require("../utils/validateMongodbId")
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler")
const sendEmail = require("./emailCtrl");
const Cart = require("../models/cartModel")
const Product = require("../models/productModel")
const Coupon = require("../models/couponModel")
const Order = require("../models/orderModel");
const uniqid = require("uniqid");


exports.createUser = asyncHandler(async(req,res)=>{
    const email = req.body.email;
     const findUser = await User.findOne({email:email});

     if(!findUser)
     {
        const newUser = await User.create(req.body);
        res.json(newUser);
     }
     else{
        throw new Error("User already exists");
     }
})

exports.loginUserCtrl = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    const findUser = await User.findOne({email :email});

    if(findUser && (await findUser.isPasswordMatched(password))){

         const refreshToken = await generateRefreshToken(findUser?._id);
         const updateuser = await User.findByIdAndUpdate(
            findUser._id,
            {
                refreshToken:refreshToken,
            },
            {new:true},
         );

         res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            maxAge:72*60*60*1000,
         });

        res.json({
            _id : findUser?._id,
            firstname : findUser?.firstname,
            lastname : findUser?.lastname,
            email : findUser?.email,
            mobile : findUser?.mobile,
            token : generateToken(findUser?._id),
        });

    }
    else{
        throw new Error("Invalid Credentials");
    }
})

// admin login

exports.loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") throw new Error("Not Authorised");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

exports.handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error(" No Refresh token present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err || user.id !== decoded.id) {
        throw new Error("There is something wrong with refresh token");
      }
      const accessToken = generateToken(user?._id);
      res.json({ accessToken });
    });
  });


  exports.logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(204); // forbidden
    }
    await User.findOneAndUpdate({ refreshToken: refreshToken }, {
        refreshToken: "",
      });
      
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204); // forbidden
  });

exports.getallUser = asyncHandler(async(req,res)=>{
    try{
        const getUsers = await User.find();
    res.json(getUsers);
    }
    catch(error)
    {
        throw new Error(error);
    }
})

exports.getaUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const getUser = await User.findById(id);

        res.json({
            getUser,
        })
    }
    catch(error)
    {
        throw new Error(error);
    }
})


exports.deleteaUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deleteUser = await User.findByIdAndDelete(id);

        res.json({
            deleteUser,
        })
    }
    catch(error)
    {
        throw new Error(error);
    }
})

exports.updateaUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    
    try {
      const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
          firstname: req?.body?.firstname,
          lastname: req?.body?.lastname,
          email: req?.body?.email,
          mobile: req?.body?.mobile,
        },
        {
          new: true,
        }
      );
      res.json(updatedUser);
    } catch (error) {
      throw new Error(error);
    }
  });

  exports.blockUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const block = await User.findByIdAndUpdate(
            id,
            {
                isBlocked : true,
            },
            {
                new : true,
            },
        );
        res.json({
            message:"User blocked",
        });
    }catch(error){
        throw new Error(error);
    }
  });

  exports.unblockUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const unblock = await User.findByIdAndUpdate(
            id,
            {
                isBlocked : false,
            },
            {
                new : true,
            },
        );
        res.json({
            message:"User unblocked",
        });
    }catch(error){
        throw new Error(error);
    }
  });

  exports.updatePassword = asyncHandler(async(req,res)=>{
    const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
  })

  exports.forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email");
    try {
      const token = await user.createPasswordResetToken();
      await user.save();
      const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:3000/reset-password/${token}'>Click Here</>`;
      const data = {
        to: email,
        text: "BetterMart",
        subject: "Forgot Password Link",
        htm: resetURL,
      };
      sendEmail(data);
      res.json(token);
    } catch (error) {
      throw new Error(error);
    }
  });
  

  exports.resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error(" Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
  });

  exports.getWishlist = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    try{
      const user = await User.findById(_id).populate("wishlist");
      res.json(user);
    }catch(error)
    {
      throw new Error(error);
    }
  }) 

  // save user Address

exports.saveAddress = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});


exports.userCart = asyncHandler(async (req, res) => {
  const { productId,color,quantity,price } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    

    let newCart = await new Cart({
     
      userId : _id,
      productId,
      color,
      quantity,
      price,
    }).save();

    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});


exports.getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.find({ userId : _id }).populate(
      "productId"
    ).populate("color");
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

exports.removeProductFromCart = asyncHandler(async(req,res)=>{
  const { _id } = req.user;
  const {cartItemId} = req.params;
  validateMongoDbId(_id);
  try{

    const deleteProductFromCart = await Cart.deleteOne({userId: _id, _id: cartItemId});
    res.json(deleteProductFromCart);
    

  }catch(error){
    throw new Error(error);
  }
})

exports.updateProdQuantityFromCart = asyncHandler(async(req,res)=>{
  const { _id } = req.user;
  const {cartItemId,newQuantity} = req.params;
  validateMongoDbId(_id);
  try{

    const cartItem = await Cart.findOne({userId: _id, _id: cartItemId});
    cartItem.quantity = newQuantity;
    cartItem.save();
    res.json(cartItem);
    
  }catch(error){
    throw new Error(error);
  }
})

exports.emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndRemove({ orderby: user._id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

exports.applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon === null) {
    throw new Error("Invalid Coupon");
  }
  const user = await User.findOne({ _id });
  let { cartTotal } = await Cart.findOne({
    orderby: user._id,
  }).populate("products.product");
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );
  res.json(totalAfterDiscount);
});


 exports.createOrder = asyncHandler(async (req, res) => {

    const {shippingInfo,paymentInfo,orderItems,totalPrice,totalPriceAfterDiscount} = req.body;
    const {_id} = req.user;
    try{
        const order = await Order.create({shippingInfo,paymentInfo,orderItems,totalPrice,totalPriceAfterDiscount,user:_id});
        res.json({
          order,
          success:true,
        })
    }catch(error){
      throw new Error(error);
    }
})

exports.getMyOrders = asyncHandler(async(req,res)=>{
  const {_id} = req.user;
  try{
        const orders = await Order.find({user:_id}).populate("user").populate("orderItems.product").populate("orderItems.color");
        res.json({
          orders,
        })
  }catch(error){
    throw new Error(error)
  }
})

//  exports.getOrders = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   validateMongoDbId(_id);
//   try {
//     const userorders = await Order.findOne({ orderby: _id })
//       .populate("products.product")
//       .populate("orderby")
//       .exec();
//     res.json(userorders);
//   } catch (error) {
//     throw new Error(error);
//   }
//  });

 exports.getallOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const userorders = await Order.find()
      .populate("shippingInfo")
      .populate("orderItems")
      .populate("orderItems.product")
      .populate("orderItems.color")
      .populate("paymentInfo")
      .populate("user")
      .exec();
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
 });

 exports.updateOrderStatus = asyncHandler(async(req,res)=>{
//   const {status} = req.body;
//   const {id} = req.params;
//   validateMongoDbId(id);
//   try{

//   const updateOrderStatus = await Order.findByIdAndUpdate(id,
//     {
      
//       orderStatus : status,

//       paymentIntent:{
//           status:status,
//       }
//     }
    
//     )

//     res.json(updateOrderStatus);

//   }catch(error){
//     throw new Error(error);
//   }
 })

 exports.getMonthWiseOrderIncome = asyncHandler(async(req,res)=>{
  let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
   let d = new Date(Date.now());
   //d = a.toString()
   let endDate = "";
   d.setDate(1);
   for(let index = 0;index<11;index++){
    d.setMonth(d.getMonth()-1);
    endDate = monthNames[d.getMonth()-1]+" " + d.getFullYear();
   
   }

   const data = await Order.aggregate([
    {$match:{
      createdAt:{
        $lte: new Date(),
        $gte:new Date(endDate)
      }
    }
   
  },{
    $group:{
      _id:{
        
        month: { $month: "$paidAt" }
       // date.getUTCMonth() + 1
       //month : "$paidAt"
      },
      amount:{$sum:"$totalPriceAfterDiscount"},
      count:{$sum:1}
    }
    
  }
   ])

   res.json(data);
   
 })


 exports.getYearlyTotalOrders = asyncHandler(async(req,res)=>{
  let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
   let d = new Date(Date.now());
   //d = a.toString()
   let endDate = "";
   d.setDate(1);
   for(let index = 0;index<11;index++){
    d.setMonth(d.getMonth()-1);
    endDate = monthNames[d.getMonth()]+" " + d.getFullYear();
   
   }

   const data = await Order.aggregate([
    {$match:{
      createdAt:{
        $lte: new Date(),
        $gte:new Date(endDate)
      }
    }
   
  },{
    $group:{
      _id:null,
      count:{$sum:1},
      amount:{$sum:"$totalPriceAfterDiscount"}
    }
    
  }
   ])

   res.json(data);
   
 })

 exports.updateOrder = asyncHandler(async(req,res)=>{
  const {id} = req.params;
  console.log(id)
  try{
    const order = await Order.findById(id);
    order.orderStatus = req.body.status;
    await order.save();
    res.json({
      order,
    })
  }catch(error){
    throw new Error(error)
  }
 })


