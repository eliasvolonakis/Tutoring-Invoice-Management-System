const req = require('express');

const app = express();
app.use(express.json());
app.listen(8080, () => console.log("Server running on port 8080"));
