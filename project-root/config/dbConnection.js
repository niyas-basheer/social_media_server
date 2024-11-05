// MongoDB Connection
connectDB = mongoose.connect("YOUR_MONGODB_CONNECTION_STRING", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));