import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './components/App';
import store from './store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom'
import history from './history';


const container = document.getElementById('root');
const root = createRoot(container);  
root.render(
 <Provider store={store}>
     <Router history={history}>
        <App />
     </Router>
</Provider>

);
