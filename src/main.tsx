import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App';
import "./index.css"
import { enablePatches } from 'immer';

enablePatches()
ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
