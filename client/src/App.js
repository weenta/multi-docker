import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import OtherPage from './OtherPage';
import Fib from './Fib';

function App() {
  return (
    <div className="App">
      <Router>
        <h1>Hi, there3</h1>
        <Link to='/'>Home</Link>
        <Link to='/otherpage'>Other Page</Link>
        <div>
          <Route exact path='/' component={Fib} />
          <Route path='/otherpage'  component={OtherPage} />
        </div>

      </Router>

    </div>
  );
}

export default App;
