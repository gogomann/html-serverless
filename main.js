import './style.css';
import $ from 'jquery';

const configKey = 'dataClientConfig';
let refreshTimer = null;

// Function to load configuration from localStorage
function loadConfig() {
  const savedConfig = localStorage.getItem(configKey);
  if (savedConfig) {
    const config = JSON.parse(savedConfig);
    $('#apiEndpoint').val(config.apiEndpoint || '');
    $('#refreshInterval').val(config.refreshInterval || 5000);
  }
}

// Function to save configuration to localStorage
function saveConfig() {
  const config = {
    apiEndpoint: $('#apiEndpoint').val(),
    refreshInterval: parseInt($('#refreshInterval').val(), 10) || 5000
  };
  localStorage.setItem(configKey, JSON.stringify(config));
  alert('Configuration saved!');
  // Restart data fetching with new interval
  startFetchingData();
}

// Function to fetch data from the API
function fetchData() {
  const apiEndpoint = $('#apiEndpoint').val();
  if (!apiEndpoint) {
    $('#jsonData').text('Please configure an API endpoint.');
    return;
  }

  $.ajax({
    url: apiEndpoint,
    method: 'GET',
    dataType: 'json',
    success: function(data) {
      $('#jsonData').text(JSON.stringify(data, null, 2));
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $('#jsonData').text('Error fetching data: ' + textStatus + ' - ' + errorThrown);
    }
  });
}

// Function to start periodic data fetching
function startFetchingData() {
  stopFetchingData(); // Clear any existing timer

  const refreshInterval = parseInt($('#refreshInterval').val(), 10) || 5000;
  if (refreshInterval > 0) {
    // Fetch immediately on start
    fetchData();
    // Set interval for subsequent fetches
    refreshTimer = setInterval(fetchData, refreshInterval);
  } else {
     // If interval is 0 or less, just fetch once
     fetchData();
  }
}

// Function to stop periodic data fetching
function stopFetchingData() {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
}

// Initialize when the document is ready
$(document).ready(function() {
  loadConfig();
  $('#saveConfig').on('click', saveConfig);

  // Start fetching data initially
  startFetchingData();
});
