// app.js (or index.js)
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const moment = require("moment-timezone");
require("dotenv").config();

const app = express();
const port = 5005;

const URL = process.env.MONGO_URL;

mongoose.connect(URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(cors());

const Note = require("./models/note");

app.get("/", async (req, res) => {
	res.send("Working");
});

app.post("/new", async (req, res) => {
	console.log("in");
	try {
		const { content } = req.body;
		const newNote = new Note({
			content,
		});
		await newNote.save();
		console.log("saved");
		res.status(201).json({
			message: "Note created successfully",
			note: newNote,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

app.post("/find", async (req, res) => {
	const { date } = req.body;
	const istDate = moment.tz(date, "Asia/Kolkata");
	const istDateFormatted = istDate.format("YYYY-MM-DD");
	const startOfDay = moment.tz(
		`${istDateFormatted} 00:00:00`,
		"Asia/Kolkata"
	);
	const endOfDay = moment.tz(
		`${istDateFormatted} 23:59:59.999`,
		"Asia/Kolkata"
	);
	console.log("Start of day:", startOfDay.toISOString());
	console.log("End of day:", endOfDay.toISOString());
	try {
		const result = await Note.find({
			createdAt: { $gte: startOfDay.toDate(), $lt: endOfDay.toDate() },
		});
		console.log(result);
		res.json(result);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});