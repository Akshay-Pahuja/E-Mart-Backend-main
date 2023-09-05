const express = require("express")
const dbConnect = require("./config/dbConnect")
const mongoose=require("mongoose")
const app = express();
const dotenv = require("dotenv").config();
const authRouter = require("./routes/authRoute")
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const categoryRouter = require("./routes/prodcategoryRoute");
const blogcategoryRouter = require("./routes/blogCatRoute");
const couponRouter = require("./routes/couponRoute");
const brandRouter = require("./routes/brandRoute");
const colorRouter = require("./routes/colorRoute");
const enquiryRouter = require("./routes/enqRoute");
const uploadRouter = require("./routes/uploadRoute")
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cors = require("cors")
const PORT = process.env.PORT || 4000;
// dbConnect();

const DB = process.env.MONGODB_CLUSTER.replace(
    "<password>",
    process.env.CLUSTER_PASSWORD
  );

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex:true,
    // useFindAndModify:false
  })
  .then(() => console.log(`Connection sucessfully`));

// app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.use("/api/user",authRouter);
app.use("/api/product",productRouter);
app.use("/api/blog",blogRouter);
app.use("/api/category",categoryRouter);
app.use("/api/blogcategory",blogcategoryRouter);
app.use("/api/brand",brandRouter);
app.use("/api/coupon",couponRouter);
app.use("/api/color",colorRouter);
app.use("/api/enquiry",enquiryRouter);
app.use("/api/upload",uploadRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT,()=>{
    console.log(`Server is running at PORT ${PORT}`)
})