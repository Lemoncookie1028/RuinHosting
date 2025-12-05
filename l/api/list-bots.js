const fs = require('fs').promises;
const path = require('path');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const BASE_DIR = path.join('/tmp', 'ruin-hosting-bots');
    
    try {
      await fs.access(BASE_DIR);
    } catch {
      return res.json({ success: true, bots: [] });
    }
    
    const items = await fs.readdir(BASE_DIR);
    const bots = [];
    
    for (const item of items) {
      const itemPath = path.join(BASE_DIR, item);
      const stat = await fs.stat(itemPath);
      
      if (stat.isDirectory()) {
        try {
          const configPath = path.join(itemPath, 'config.json');
          const configContent = await fs.readFile(configPath, 'utf8');
          const config = JSON.parse(configContent);
          
          bots.push({
            name: item,
            path: itemPath,
            config: config,
            created: stat.birthtime
          });
        } catch (error) {
          bots.push({
            name: item,
            path: itemPath,
            config: null,
            created: stat.birthtime
          });
        }
      }
    }
    
    res.json({
      success: true,
      bots: bots
    });
    
  } catch (error) {
    console.error('Error listing bots:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list bots',
      error: error.message
    });
  }
};