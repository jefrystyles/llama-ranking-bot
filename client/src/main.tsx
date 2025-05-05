import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add meta tag for title
const titleElement = document.createElement('title');
titleElement.textContent = 'Llama Ranking Bot - Discord Interface';
document.head.appendChild(titleElement);

// Add meta description
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'A Discord bot for retrieving and displaying Llamacoin rankings';
document.head.appendChild(metaDescription);

// Add icon
const linkIcon = document.createElement('link');
linkIcon.rel = 'icon';
linkIcon.href = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f999.png';
document.head.appendChild(linkIcon);

// Add font awesome for icons
const fontAwesome = document.createElement('link');
fontAwesome.rel = 'stylesheet';
fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
document.head.appendChild(fontAwesome);

// Render the app
createRoot(document.getElementById("root")!).render(<App />);
