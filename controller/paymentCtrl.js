const Razorpay = require('razorpay');
const instance = new Razorpay({ key_id: 'rzp_test_jHrd7TTYPg5BWv', key_secret: 'ZqkjjW9OCmDDSWYFK7KyfdFe' });


 exports.checkout = async(req,res)=>{
    const {amount} = req.body;
    const option = {
        amount: amount * 100,  // amount in the smallest currency unit
        currency: "INR",
       // receipt: "order_rcptid_11"
      };

      const order = await instance.orders.create(option)
      res.json({
        order,
        success:true,
     })
    }

    exports.paymentVerification = async(req,res)=>{
        const {razorpayOrderId,razorpayPaymentId} = req.body;
        res.json({
            razorpayOrderId,
            razorpayPaymentId,
        })
    }