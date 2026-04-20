import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DatasetView from './pages/DatasetView';
import TimelineView from './pages/TimelineView';

function App() {
  return (
    <BrowserRouter>
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<DatasetView />} />
          <Route path="/dataset/:id/timeline" element={<TimelineView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
