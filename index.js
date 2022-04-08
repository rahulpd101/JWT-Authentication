const express = require("express");
const app = express();
const auth = require("./routes/auth");
const post = require("./routes/post");

app.use(express.json());

app.use("/auth", auth);
app.use("/posts", post);

app.get("/", (req, res) => {
	res.send("Hi, This is my second try!");
});

app.listen(5000, () => {
	console.log("Now running on port 5000");
});
