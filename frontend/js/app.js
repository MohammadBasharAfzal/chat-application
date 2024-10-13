document.addEventListener("DOMContentLoaded", function () {
    // WebSocket connection setup
    let socket;
    const chatMessages = document.getElementById("chat-messages");
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const loginContainer = document.getElementById("login-container");
    const signupContainer = document.getElementById("signup-container");
    const chatContainer = document.getElementById("chat-container");
    const logoutButton = document.getElementById("logout-button");
  
    // Handle login form submission
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const username = document.getElementById("login-username").value;
      const password = document.getElementById("login-password").value;
  
      // Send login request to backend API
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      if (data.success) {
        // On successful login, connect to WebSocket server
        socket = new WebSocket(`ws://localhost:3000`);
  
        // Show chat interface and hide login form
        loginContainer.classList.add("hidden");
        chatContainer.classList.remove("hidden");
  
        // Handle WebSocket message receiving
        socket.onmessage = function (event) {
          const message = JSON.parse(event.data);
          displayMessage(message.text);
        };
  
        // Handle chat form submission
        chatForm.addEventListener("submit", function (e) {
          e.preventDefault();
          const message = chatInput.value;
          if (message) {
            // Send message to WebSocket server
            socket.send(JSON.stringify({ text: message }));
            chatInput.value = "";
          }
        });
  
        // Handle logout
        logoutButton.addEventListener("click", async function () {
          // Close WebSocket connection
          socket.close();
          await fetch("/auth/logout", { method: "POST" });
          chatContainer.classList.add("hidden");
          loginContainer.classList.remove("hidden");
        });
      } else {
        alert("Invalid login credentials");
      }
    });
  
    // Handle signup form submission
    signupForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const username = document.getElementById("signup-username").value;
      const password = document.getElementById("signup-password").value;
  
      // Send signup request to backend API
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      if (data.success) {
        alert("Signup successful! Please login.");
        signupContainer.classList.add("hidden");
        loginContainer.classList.remove("hidden");
      } else {
        alert("Signup failed. Try again.");
      }
    });
  
    // Switching between login and signup forms
    document.getElementById("show-signup").addEventListener("click", function () {
      loginContainer.classList.add("hidden");
      signupContainer.classList.remove("hidden");
    });
  
    document.getElementById("show-login").addEventListener("click", function () {
      signupContainer.classList.add("hidden");
      loginContainer.classList.remove("hidden");
    });
  
    // Display chat messages in the chat window
    function displayMessage(message) {
      const messageElement = document.createElement("li");
      messageElement.textContent = message;
      chatMessages.appendChild(messageElement);
    }
  });
  