require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Initialize app FIRST
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Serve static files (for oauth-success.html)
app.use(express.static('public'));

// Routes
const authRoutes = require('./routes/authRoutes');
const cakeRoutes = require('./routes/cakeRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

app.use('/auth', authRoutes);
app.use('/api/cakes', cakeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

// Swagger
const swaggerDocument = YAML.load('./swagger/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 3000, () =>
      console.log(`Server running on port ${process.env.PORT || 3000}`)
    );
  })
  .catch(err => console.error(err));
