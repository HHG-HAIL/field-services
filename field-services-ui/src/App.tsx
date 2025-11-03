/**
 * App Component
 * Main application component
 */

import Layout from './components/layout/Layout';
import WorkOrders from './components/workOrder/WorkOrders';
import './App.css';

function App() {
  return (
    <Layout>
      <WorkOrders />
    </Layout>
  );
}

export default App;
