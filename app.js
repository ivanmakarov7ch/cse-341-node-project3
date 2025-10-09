require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');



require('./config/passport')(passport);
app.use(passport.initialize());
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);



const app = express();
app.use(express.json());
app.use(cors());

// Swagger setup
const swaggerDocument = YAML.load('./swagger/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
const cakeRoutes = require('./routes/cakeRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/cakes', cakeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch(err => console.error(err));

// app.get('/', (req, res) => {
//   res.send('<h1>Welcome to the CSE341 Project 3 API</h1><p>Use /api-docs for Swagger documentation.</p>');
// });

app.use(express.static('public'));