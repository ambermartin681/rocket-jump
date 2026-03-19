/**
 * Example webhook receiver for Rocket -Jump burn events
 * 
 * This is a simple Express server that receives and verifies
 * webhook notifications from the Rocket -Jump backend.
 */

const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// Your webhook secret (from subscription response)
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-secret-here';

/**
 * Verify webhook signature
 */
function verifySignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Main webhook endpoint
 */
app.post('/webhook', (req, res) => {
  try {
    const signature = req.headers['x-webhook-signature'];
    const eventType = req.headers['x-webhook-event'];
    
    if (!signature) {
      return res.status(401).json({ error: 'Missing signature' });
    }
    
    // Verify signature
    const payload = JSON.stringify(req.body);
    if (!verifySignature(payload, signature, WEBHOOK_SECRET)) {
      console.error('Invalid signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    // Process event
    const { event, timestamp, data } = req.body;
    
    console.log(`\nÃ°Å¸â€œÂ¨ Received webhook: ${event}`);
    console.log(`Ã¢ÂÂ° Timestamp: ${timestamp}`);
    console.log(`Ã°Å¸â€œÅ  Data:`, JSON.stringify(data, null, 2));
    
    // Handle different event types
    switch (event) {
      case 'token.burn.self':
        handleBurnSelf(data);
        break;
      
      case 'token.burn.admin':
        handleBurnAdmin(data);
        break;
      
      case 'token.created':
        handleTokenCreated(data);
        break;
      
      case 'token.metadata.updated':
        handleMetadataUpdated(data);
        break;
      
      default:
        console.log(`Unknown event type: ${event}`);
    }
    
    // Respond quickly (within 5 seconds)
    res.json({ 
      received: true,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Handle token.burn.self event
 */
function handleBurnSelf(data) {
  console.log(`Ã°Å¸â€Â¥ Self-burn detected:`);
  console.log(`   Token: ${data.tokenAddress}`);
  console.log(`   From: ${data.from}`);
  console.log(`   Amount: ${data.amount}`);
  console.log(`   TX: ${data.transactionHash}`);
  
  // Your custom logic here
  // - Send notification to user
  // - Update analytics
  // - Trigger other actions
}

/**
 * Handle token.burn.admin event
 */
function handleBurnAdmin(data) {
  console.log(`Ã°Å¸â€Â¥ Admin burn detected:`);
  console.log(`   Token: ${data.tokenAddress}`);
  console.log(`   From: ${data.from}`);
  console.log(`   Amount: ${data.amount}`);
  console.log(`   Burner: ${data.burner}`);
  console.log(`   TX: ${data.transactionHash}`);
  
  // Your custom logic here
}

/**
 * Handle token.created event
 */
function handleTokenCreated(data) {
  console.log(`Ã°Å¸Å½â€° New token created:`);
  console.log(`   Token: ${data.tokenAddress}`);
  console.log(`   Name: ${data.name}`);
  console.log(`   Symbol: ${data.symbol}`);
  console.log(`   Creator: ${data.creator}`);
  console.log(`   Initial Supply: ${data.initialSupply}`);
  console.log(`   TX: ${data.transactionHash}`);
  
  // Your custom logic here
  // - Add to token registry
  // - Send welcome email
  // - Update dashboard
}

/**
 * Handle token.metadata.updated event
 */
function handleMetadataUpdated(data) {
  console.log(`Ã°Å¸â€œÂ Metadata updated:`);
  console.log(`   Token: ${data.tokenAddress}`);
  console.log(`   Metadata URI: ${data.metadataUri}`);
  console.log(`   Updated By: ${data.updatedBy}`);
  console.log(`   TX: ${data.transactionHash}`);
  
  // Your custom logic here
}

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Ã°Å¸Å¡â‚¬ Webhook receiver running on port ${PORT}`);
  console.log(`Ã°Å¸â€œÂ¡ Endpoint: http://localhost:${PORT}/webhook`);
  console.log(`Ã°Å¸â€Â Secret configured: ${WEBHOOK_SECRET ? 'Yes' : 'No'}`);
});