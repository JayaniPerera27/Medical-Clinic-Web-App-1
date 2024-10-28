/*import React from 'react';
import ReactDOM from 'react-dom/client'; // Ensure this import is correct
import App from './App'; // Ensure this path is correct
import './index.css'; // Ensure this file exists

const rootElement = document.getElementById('root'); // Get the DOM element

if (rootElement) { // Check if the root element exists
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error('Target container is not a DOM element.'); // Log error if element is not found
}*/
/*import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);*/

import React from 'react';
import ReactDOM from 'react-dom/client'; // Correct import for React 18
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


