import renderPlaylists from './render-playlists.js';
import handleRenderDashboard from './render-dashboard.js';
import handleEvents from './handle-events.js';

function run() {
    renderPlaylists();
    handleRenderDashboard(currentIndex);
    handleEvents();
}

run();