// models/note.js
const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
	createdAt: {
		type: Date,
		default: function () {
			const currentDate = new Date();
			const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5.5
			const istDate = new Date(currentDate.getTime() + istOffset);
			return istDate;
		},
	},
	content: { type: String, required: true },
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
