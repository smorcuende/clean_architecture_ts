import console = require('node:console');
import {getHealthStatus} from './src/shared/health';

const health = getHealthStatus();
console.log('Current Health Status:', health.status, 'Timestamp:', health.timestamp);
