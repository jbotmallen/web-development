import mysql from 'mysql';
import cors from 'cors';
import express from 'express';
import multer from 'multer';
import bcrypt from 'bcrypt';
import { config as configDotenv } from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';

const app = express();
const saltRounds = 10;
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "quick-ink-reserve"
});
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '@' + file.originalname);
    }
});
const upload = multer({ storage: storage });

configDotenv();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT"],
    credentials: true
}));
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    key: 'name',
    secret: 'helloworld',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        path: '/',
        maxAge: 60 * 60 * 24 * 1000,
    }
}));
app.use('/uploads', express.static('uploads'));
app.use(express.static('/public'));

db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
    } else {
      console.log('Connected to MySQL database');
    }
});

//HOMEPAGE POST AND GET, AND LOGOUT
app.get('/', (req, res) => {
    if(req.session.user) {
        return res.status(200).json({ loggedIn: true, user: req.session.user });
    } else {
        return res.status(200).json({ loggedIn: false });
    }
});
app.post('/logout', (req, res) => {
    if (req.session && req.session.user) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ Message: 'Error in logging out. ' + err })
            } else {
                if (req.cookies['name']) {
                    res.clearCookie('name');
                }
                return res.status(200).json({ Message: 'Logout was Successful.', loggedIn: false });
            }
        });
    } else {
        return res.status(401).json({ Message: 'Not logged in' });
    }
});

//LOGIN POST AND GET
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const emailCheck = 'SELECT * FROM user WHERE userEmail = ?';

    db.query(emailCheck, [email], (checkError, checkResult) => {
        if (checkError) {
            return res.status(500).json({ Message: "Error from the server side." });
        }

        if (checkResult.length === 0) {
            return res.status(401).json({ errorEmailMessage: "Email not found." });
        }

        const user = checkResult[0];

        bcrypt.compare(password, user.userPassword, (err, response) => {
            if (err) {
                return res.status(401).json({ errorPasswordMessage: "Incorrect password." });
            }
            if (response) {
                req.session.user = user;
                req.session.loggedIn = true;
                return res.status(200).json({ Message: "Login successful", user });
            } else {
                return res.status(401).json({ errorPasswordMessage: "Incorrect password." });
            }
        });
    });
});
app.get('/login', (req, res) => {
    if(req.session.user) {
        return res.status(200).json({ loggedIn: true, user: req.session.user })
    } else {
        return res.status(200).json({ loggedIn: false });
    }
});

//SIGNUP POST AND GET
app.post('/signup', upload.single('profilePicture'), (req, res) => {
  const { email, password, userName } = req.body;
  const profilePicturePath = req.file ? req.file.path : null;

  const emailCheck = 'SELECT * FROM user WHERE userEmail = ?';

  db.query(emailCheck, [email], (checkError, checkResult) => {
      if (checkError) {
          return res.status(500).json({ Message: "Error from the server side." });
      }

      if (checkResult.length > 0) {
          return res.status(500).json({ Message: "Email already exists in the database" });
      }

      const insertSql = 'INSERT INTO user (userEmail, userPassword, userName, profilePicture) VALUES (?, ?, ?, ?)';
      
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                return res.status(500).json({ Message: 'Error on the server side!' });
            }
            
            const values = [email, hash, userName, profilePicturePath];
            db.query(insertSql, values, (err, insertResult) => {
                if (err) {
                    return res.status(500).json({ Message: 'Error on the server side!' });
                }
                return res.status(200).json({ Message: 'User registration successful' , user: insertResult});
            });
        });    
    });
});

app.put('/reset', (req, res) => {
    const { email, newUsername, newPassword, currPassword } = req.body;  
    const checkCurrPasswordQuery = 'SELECT * FROM user WHERE userEmail = ?';
  
    db.query(checkCurrPasswordQuery, [email], (checkError, checkResult) => {
      if (checkError) {
        return res.status(500).json({ Message: 'Error on the server side.' });
      }
  
      if (checkResult.length === 0) {
        return res.status(401).json({ Message: 'User not found.' });
      }
  
      const user = checkResult[0];
  
      bcrypt.compare(currPassword, user.userPassword, (compareErr, passwordMatch) => {
        if (compareErr) {
          return res.status(500).json({ Message: 'Error on the server side.' });
        }
  
        if (passwordMatch) {
          const updateSql = 'UPDATE user SET userName = ?, userPassword = ? WHERE userEmail = ?';
  
          bcrypt.hash(newPassword, saltRounds, (hashErr, hash) => {
            if (hashErr) {
              return res.status(500).json({ Message: 'Error on the server side.' });
            }
  
            const values = [newUsername, hash, email];
  
            db.query(updateSql, values, (updateErr, updateResult) => {
              if (updateErr) {
                return res.status(500).json({ Message: 'Error on the server side.' });
              }
  
              return res.status(200).json({ Message: 'User information updated successfully. Redirecting in 3 seconds...' });
            });
          });
        } else {
          return res.status(401).json({ passMessage: 'Wrong current password! Please input the correct current password.' });
        }
      });
    });
});
  

//PROFILE STUFF
app.get('/profile', (req, res) => {
    if(req.session.user) {
        const id = req.session.user.userID;
        const userCheck = 'SELECT * FROM user WHERE userID = ?';

        db.query(userCheck, id, (err, result) => {
            if(err) {
                return res.status(401).json({ Message: 'Error on the server side' });
            }
            if(result.length === 0) {
                return res.status(401).json({ Message: 'Email was not found' });
            }

            const user = result[0];

            if(user) {
                return res.status(200).json({ loggedIn: req.session.loggedIn, Message: 'User was found', user: user });
            } else {
                return res.status(401).json({ Message: 'Error on the server side' });
            }
        })
    } else {
        return res.status(401).json({ Message: 'No user is logged in.' });
    }
});

//TEST STUFF
app.get('/test', (req, res) => {
    if (req.cookies['name']) {
        console.log('Cookie with key "name" exists');
        res.send('Cookie Exists');
    } else {
        console.log('Cookie with key "name" does not exist');
    }
});
app.get('/test-get', (req, res) => {
    const testValue = req.session.testVariable || 'No session data found';
    //const loggedIn = (req.session.user.userPassword) ? req.session.user.userPassword : null;
    res.send(`Session variable value: ${testValue}, Logged In: `);
});

app.listen(5000, () => {
    console.log('Listening to port!');
});