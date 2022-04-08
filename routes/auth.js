const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const { users } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post(
	"/signup",
	[
		check("email", "Please provide a valid email!").isEmail(),
		check("password", "Please provide a password, greater than 5").isLength({ min: 6 }).isAlphanumeric(),
	],
	async (req, res) => {
		const { email, password } = req.body;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		let user = users.find((user) => {
			return user.email === email;
		});
		if (user) {
			return res.status(400).json({
				errors: [
					{
						msg: "User already exists!",
					},
				],
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		users.push({ email, password: hashedPassword });
		const token = jwt.sign({ email }, "f39sq9jn23kn12k0abz08gpp12", { expiresIn: 20 });
		res.json({ token });
	}
);

router.post("/login", async (req, res) => {
	const { password, email } = req.body;
	let user = users.find((user) => {
		return user.email === email;
	});
	if (!user) {
		return res.status(400).json({
			errors: [
				{
					msg: "Invalid Credentials!",
				},
			],
		});
	}

	let isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		return res.status(400).json({
			errors: [
				{
					msg: "Invalid credentials",
				},
			],
		});
	}

	const token = await jwt.sign(
		{
			email,
		},
		"fnisnsdsijc9s8324nf309f3nk32nk",
		{ expiresIn: 20 }
	);
	res.json({ token });
});

router.get("/all", (req, res) => {
	res.json(users);
});

module.exports = router;
