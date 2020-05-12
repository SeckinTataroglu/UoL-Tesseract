// Imports
const express = require("express");
const app = express();
const fs = require("fs");
const multer = require("multer");

const { createWorker } = require("tesseract.js");
const worker = createWorker({
	logger: (m) => console.log(m), // Add logger here
});

// Storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads");
	},
	filename: (res, file, cb) => {
		cb(null, file.originalname);
	},
});
const upload = multer({ storage: storage }).single("avatar");

app.set("view engine", "ejs");

// Routes

app.get("/", (req, res) => {
	res.render("index");
});

app.post("/upload", (req, res) => {
	upload(req, res, (err) => {
		// fs.readFile(`./uploads/${req.file.originalname}`, (err, data) => {
		// 	if(err) return console.log("This is your error", err);

		(async () => {
			await worker.load();
			await worker.loadLanguage("eng");
			await worker.initialize("eng");
			const {
				data: { text },
			} = await worker
				.recognize(`./uploads/${req.file.originalname}`);
            console.log("console started")
            console.log(text);
            console.log("console ended")
			res.send(text);
			await worker.terminate();
		})();
	});
});

// Start up our server
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log(`Hey I'm running on port ${PORT}`));
