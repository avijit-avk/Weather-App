// Selecting the input field and adding an event listener for when the user enters a city name
document.getElementById("cityInput").addEventListener("change", async () => {
    const location = document.getElementById("cityInput").value.trim(); // Get user input and remove extra spaces
  
    if (!location) {
      alert("Please enter a valid city name."); // Prevents empty input submissions
      return;
    }
  
    try {
      const weatherData = await getWeatherData(location); // Fetch weather data for the entered city
      displayWeatherData(weatherData); // Display the retrieved data on the page
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Could not fetch weather data. Please try again.");
    }
  });
  
  // Function to fetch weather data using the WeatherAPI
  const getWeatherData = async (location) => {
    if (!location) return {}; // If no location is provided, return an empty object
  
    const apiKey = "100a4f3521de48f7936191021252703"; // API key for WeatherAPI
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;
  
    try {
      // Using a proxy to bypass CORS restrictions
      const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
  
      const data = await response.json(); // Convert API response to JSON
      return data; // Return the parsed weather data
    } catch (error) {
      console.error("Error fetching data:", error);
      return {}; // Return empty data in case of an error
    }
  };
  
  // Function to determine background color based on temperature
  function getBackgroundColor(temperature) {
    if (temperature < 0) return "lightblue"; // Very cold (below 0°C)
    if (temperature < 10) return "lightgreen"; // Cold (0-9°C)
    if (temperature < 20) return "lightyellow"; // Mild (10-19°C)
    if (temperature < 30) return "rose"; // Warm (20-29°C)
    return "pink"; // Hot (30°C and above)
  }
  
  // Function to display weather data on the webpage
  const displayWeatherData = (data) => {
    const weatherDataElement = document.getElementById("weather-data");
  
    // Check if valid data is received
    if (!data || !data.current) {
      weatherDataElement.innerHTML = "<p>Please enter a valid location.</p>";
      return;
    }
  
    // Extracting necessary weather details
    const temperature = data.current?.temp_c; // Use optional chaining to prevent undefined errors
    if (temperature === undefined) {
      console.error("Temperature data is missing from API response.");
      weatherDataElement.innerHTML = "<p>Weather data unavailable. Try another location.</p>";
      return;
    }
  
    const condition = data.current.condition.text;
    const windSpeed = data.current.wind_kph;
    const cityName = data.location.name;
    const country = data.location.country;
  
    // Apply background color only to "weather-data" instead of the whole body
    weatherDataElement.style.backgroundColor = getBackgroundColor(temperature);
  
    // Updating the HTML
    weatherDataElement.innerHTML = `
      <h2>${cityName}, ${country}</h2>
      <p>Temperature: ${temperature}°C</p>
      <p>Condition: ${condition}</p>
      <p>Wind Speed: ${windSpeed} km/h</p>
    `;
  };
  
  
  // Automatically load weather data for a default city (Delhi) when the page loads
  window.onload = async () => {
    try {
      const defaultLocation = "Delhi,IN"; // Default city
      const weatherData = await getWeatherData(defaultLocation); // Fetch weather data
      if (Object.keys(weatherData).length > 0) {
        displayWeatherData(weatherData); // Display weather info
      } else {
        console.log("No weather data available for default location.");
      }
    } catch (error) {
      console.error("Error loading default weather:", error);
    }
  };
  