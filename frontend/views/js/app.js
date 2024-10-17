document.addEventListener("DOMContentLoaded", function () {
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
  let sessionId; // Variable to store session ID

  // Handle login form submission
  loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const username = document.getElementById("login-username").value;
      const password = document.getElementById("login-password").value;

      // Send login request to backend API
      const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
          sessionId = data.sessionId; // Get session ID from response
          socket = new WebSocket(`ws://localhost:3000`);

          loginContainer.classList.add("hidden");
          chatContainer.classList.remove("hidden");

          socket.onmessage = function (event) {
              const message = JSON.parse(event.data);
              displayMessage(message.text);
          };

          // Handle chat form submission
          chatForm.addEventListener("submit", function (e) {
              e.preventDefault();
              const message = chatInput.value;
              if (message) {
                  // Send message with session ID to WebSocket server
                  socket.send(JSON.stringify({
                      text: message,
                      sessionId: sessionId // Include session ID in the message
                  }));
                  chatInput.value = "";
              }
          });

          logoutButton.addEventListener("click", async function () {
              socket.close();
              await fetch("/api/auth/logout", { method: "POST" });
              chatContainer.classList.add("hidden");
              loginContainer.classList.remove("hidden");
          });
      } else {
          alert(data.message || "Invalid login credentials");
      }
  });

  signupForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const username = document.getElementById("signup-username").value;
      const password = document.getElementById("signup-password").value;

      const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
          alert("Signup successful! Please login.");
          signupContainer.classList.add("hidden");
          loginContainer.classList.remove("hidden");
      } else {
          alert(data.message || "Signup failed. Try again.");
      }
  });

  function displayMessage(message) {
      const messageElement = document.createElement("li");
      messageElement.textContent = message;
      chatMessages.appendChild(messageElement);
  }
});
