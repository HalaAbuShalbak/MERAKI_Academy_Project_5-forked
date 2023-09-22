const pool = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  const {
    firstName,
    lastName,
    birthDate,
    city,
    email,
    password,
    phoneNumber,
    gender,
    role_id,
  } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);


  const query = `INSERT INTO users  (firstName ,lastName ,birthDate ,city ,email,password ,phoneNumber ,gender,role_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;
  const value = [
    firstName,
    lastName,
    birthDate,
    city,
    email.toLowerCase(),
    encryptedPassword,
    phoneNumber,
    gender,
    role_id,
  ];

  const response=await pool.query(query, value).
    then((result) => {
      if(response.rowCount){
        res.status(200).json({
        success: true,
        message: "Account created successfully",
        result: result.rows,
      })}
    }).catch((err) => {
      res.status(409).json({
        success: false,
        message: "The email already exists",
        err,
      });
    });

  
}


const login = (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const query = `SELECT * FROM users WHERE email = $1`;
  const data = [email.toLowerCase()];
  pool
    .query(query, data)
    .then((result) => {
      console.log(result.rows[0].user_id);
      if (result.rows.length) {
        bcrypt.compare(password, result.rows[0].password, (err, response) => {
          if (err) res.json(err);
          if (response) {
            const payload = {
              userId: result.rows[0].user_id,
              city: result.rows[0].city,
              role: result.rows[0].role_id,
            };
            console.log(payload);
            const options = { expiresIn: "1d" };
            const secret = process.env.SECRET;
            const token = jwt.sign(payload, secret, options);
            if (token) {
              return res.status(200).json({
                token,
                success: true,
                message: `Valid login credentials`,
                userId: result.rows[0].user_id,

              });
            } else {
              throw Error;
            }
          } else {
            res.status(403).json({
              success: false,
              message: `The email doesn’t exist or the password you’ve entered is incorrect`,
            });
          }
        });
      } else throw Error;
    })
    .catch((err) => {
      res.status(403).json({
        success: false,
        message:
          "The email doesn’t exist or the password you’ve entered is incorrect",
        err,
      });
  })}
  module.exports = {
    register,login
  }


    

