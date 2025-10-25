import app from './web.js';
import { loadConfig } from './utils/config.js';

const { PORT } = loadConfig();
app.listen(PORT, () => {
  console.log(`[SIGLAD] API listening on port ${PORT}`);
});
