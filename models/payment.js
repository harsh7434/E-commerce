const mongoose = require('mongoose');


const paymentSchema = mongoose.Schema({
    stripeId : {
        type : String,
        required : true
    },
   

})

const Payment = mongoose.model("Payment",paymentSchema);

module.exports = Payment;