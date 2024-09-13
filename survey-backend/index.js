const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(bodyParser.json());
const corsOptions = {
  origin:'http://localhost:3000',
  credentials:true
}
app.use(cors(corsOptions));

app.post('/api/survey', (req, res) => {
  const { customerId, answers, status } = req.body;
  console.log('Received survey data:', { customerId, answers, status });

  // You can save the data to a database or log it to the console
  res.status(200).json({ message: 'Survey submitted successfully!' });
});





app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
