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
    if (temperature < 30) return "lightgoldenrodyellow"; // Warm (20-29°C)
    return "lightcoral"; // Hot (30°C and above)
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
    const temperature = data.current.temp_c; // Temperature in Celsius
    const condition = data.current.condition.text; // Weather condition (e.g., Sunny, Cloudy)
    const windSpeed = data.current.wind_kph; // Wind speed in kph
    const cityName = data.location.name; // City name from API response
    const country = data.location.country; // Country name
    const iconUrl = `https:${data.current.condition.icon}`; // Weather condition icon
  
    // Changing background color based on temperature
    document.body.style.backgroundColor = getBackgroundColor(temperature);
  
    // Updating the HTML to show the weather data
    weatherDataElement.innerHTML = `
      <h2>${cityName}, ${country}</h2>
      <img src="${iconUrl}" alt="Weather Icon">
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
  