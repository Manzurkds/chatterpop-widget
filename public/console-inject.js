
// ChatterPop Widget Inject Script
(function() {
  // Configuration (modify these values as needed)
  const config = {
    botName: "ChatterPop",
    welcomeMessage: "👋 Hello! How can I help you today?",
    primaryColor: "#4F46E5",
    position: "bottom-right"
    // Uncomment and add your API keys for production use
    // llmConfig: {
    //   apiKey: "your-api-key-here",
    //   model: "gpt-3.5-turbo"
    // },
    // contentfulSpaceId: "your-contentful-space-id",
    // contentfulToken: "your-contentful-token"
  };

  // URLs for the widget files (change these to your actual hosted files)
  const cssUrl = "https://cdn.jsdelivr.net/gh/yourusername/chatterpop/chatterpop.css";
  const jsUrl = "https://cdn.jsdelivr.net/gh/yourusername/chatterpop/chatterpop.js";

  // Function to load CSS
  function loadCSS(url) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load CSS: ${url}`));
      document.head.appendChild(link);
    });
  }

  // Function to load JavaScript
  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
      document.body.appendChild(script);
    });
  }

  // Main function to load and initialize widget
  async function initWidget() {
    try {
      console.log("ChatterPop: Loading widget...");
      
      // Load CSS first
      await loadCSS(cssUrl);
      console.log("ChatterPop: CSS loaded");
      
      // Then load JS
      await loadScript(jsUrl);
      console.log("ChatterPop: JS loaded");
      
      // Wait a moment for everything to initialize
      setTimeout(() => {
        // Check if ChatterPop is properly defined with init function
        if (window.ChatterPop && typeof window.ChatterPop.init === 'function') {
          // Initialize the widget
          window.ChatterPop.init(config);
          console.log("ChatterPop: Widget initialized successfully!");
        } else {
          console.error("ChatterPop: Widget failed to initialize. The ChatterPop object is not properly defined.");
          console.log("ChatterPop:", window.ChatterPop);
          
          // Fallback: Check if it's available as a default export
          if (window.chatterpop && typeof window.chatterpop.default === 'function') {
            window.chatterpop.default(config);
            console.log("ChatterPop: Widget initialized using default export!");
          } else {
            // Create a container and display error
            const errorContainer = document.createElement('div');
            errorContainer.style.position = 'fixed';
            errorContainer.style.bottom = '20px';
            errorContainer.style.right = '20px';
            errorContainer.style.backgroundColor = '#f44336';
            errorContainer.style.color = 'white';
            errorContainer.style.padding = '10px';
            errorContainer.style.borderRadius = '5px';
            errorContainer.style.zIndex = '9999';
            errorContainer.textContent = 'ChatterPop initialization failed';
            document.body.appendChild(errorContainer);
          }
        }
      }, 1000); // Increased timeout to give more time for initialization
    } catch (error) {
      console.error("ChatterPop: Failed to load widget:", error);
    }
  }

  // Run the initialization
  initWidget();
})();
