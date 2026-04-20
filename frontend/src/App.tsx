import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DatasetView from './pages/DatasetView';
import TimelineView from './pages/TimelineView';

function App() {
  return (
    <BrowserRouter>
      <div className="layout-container">
        <Routes>
          <Route path="/" element={<DatasetView />} />
          <Route path="/dataset/:id/timeline" element={<TimelineView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
