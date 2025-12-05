const fs = require('fs').promises;
const path = require('path');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, botName, botId, username } = req.body;
    
    // For Vercel, we'll use /tmp directory which is writable
    const BASE_DIR = path.join('/tmp', 'ruin-hosting-bots');
    
    // Create bot folder path
    const botFolderPath = path.join(BASE_DIR, botName.toLowerCase().replace(/\s+/g, '_'));
    
    // Create bot folder
    await fs.mkdir(botFolderPath, { recursive: true });
    
    // Create users.txt file
    const usersFilePath = path.join(botFolderPath, 'users.txt');
    const userContent = `User ID: ${userId}\nUsername: ${username}\nBot Name: ${botName}\nBot ID: ${botId}\nCreated: ${new Date().toLocaleString()}\n\n`;
    
    await fs.writeFile(usersFilePath, userContent);
    
    // Create bot configuration file
    const configFilePath = path.join(botFolderPath, 'config.json');
    const configContent = {
      botId: botId,
      botName: botName,
      owner: userId,
      createdAt: new Date().toISOString(),
      status: 'offline'
    };
    
    await fs.writeFile(configFilePath, JSON.stringify(configContent, null, 2));
    
    res.json({
      success: true,
      message: 'Bot folder created successfully',
      folderPath: botFolderPath
    });
    
  } catch (error) {
    console.error('Error creating bot folder:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create bot folder',
      error: error.message
    });
  }
};