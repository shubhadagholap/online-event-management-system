const axios = require('axios');
const fs = require('fs');
const path = require('path');

class CSVExportUtility {
  constructor(baseURL = 'http://localhost:5000/api', adminCredentials = null) {
    this.baseURL = baseURL;
    this.adminCredentials = adminCredentials || {
      email: 'admin@gmail.com',
      password: 'admin123'
    };
    this.token = null;
  }

  async login() {
    try {
      const response = await axios.post(`${this.baseURL}/auth/login`, this.adminCredentials);
      this.token = response.data.token;
      console.log('✓ Admin authentication successful');
      return true;
    } catch (error) {
      console.error('❌ Login failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async exportCSV(endpoint, filters = {}, saveToFile = false) {
    if (!this.token) {
      const loginSuccess = await this.login();
      if (!loginSuccess) return null;
    }

    try {
      const headers = { 'Authorization': `Bearer ${this.token}` };
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${this.baseURL}/${endpoint}/export${queryParams ? '?' + queryParams : ''}`;
      
      console.log(`📊 Exporting ${endpoint} CSV...`);
      const response = await axios.get(url, { headers });

      if (response.headers['content-type']?.includes('text/csv')) {
        console.log(`✓ CSV export successful`);
        console.log(`✓ Content length: ${response.data.length} characters`);
        console.log(`✓ Total rows: ${response.data.split('\n').length - 1}`);

        if (saveToFile) {
          const filename = `${endpoint}_export_${new Date().toISOString().split('T')[0]}.csv`;
          const filepath = path.join(__dirname, 'exports', filename);
          
          // Create exports directory if it doesn't exist
          const exportsDir = path.join(__dirname, 'exports');
          if (!fs.existsSync(exportsDir)) {
            fs.mkdirSync(exportsDir);
          }

          fs.writeFileSync(filepath, response.data);
          console.log(`✓ CSV saved to: ${filepath}`);
        }

        return response.data;
      } else {
        console.log(`❌ Response is not CSV format`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Export failed: ${error.response?.status} ${error.response?.statusText || error.message}`);
      return null;
    }
  }

  async exportAll(saveToFile = false) {
    const endpoints = ['users', 'events', 'bookings', 'categories', 'payments'];
    const results = {};

    console.log('🚀 Starting bulk CSV export...\n');

    for (const endpoint of endpoints) {
      const csvData = await this.exportCSV(endpoint, {}, saveToFile);
      results[endpoint] = csvData ? 'success' : 'failed';
      console.log(''); // Add spacing between exports
    }

    console.log('📋 Export Summary:');
    Object.entries(results).forEach(([endpoint, status]) => {
      console.log(`  ${status === 'success' ? '✓' : '❌'} ${endpoint}: ${status}`);
    });

    return results;
  }

  async exportWithFilters(endpoint, filters) {
    console.log(`🔍 Exporting ${endpoint} with filters:`, filters);
    return await this.exportCSV(endpoint, filters, true);
  }
}

// CLI usage
if (require.main === module) {
  const utility = new CSVExportUtility();
  
  const command = process.argv[2];
  const endpoint = process.argv[3];
  
  if (command === 'export' && endpoint) {
    utility.exportCSV(endpoint, {}, true);
  } else if (command === 'export-all') {
    utility.exportAll(true);
  } else {
    console.log('CSV Export Utility');
    console.log('Usage:');
    console.log('  node csvExportUtility.js export <endpoint>     - Export single endpoint');
    console.log('  node csvExportUtility.js export-all           - Export all endpoints');
    console.log('');
    console.log('Available endpoints: users, events, bookings, categories, payments');
  }
}

module.exports = CSVExportUtility;