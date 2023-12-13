import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import { getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

var faro = initializeFaro({
    url: 'http://localhost:12347/collect',
    app: {
        name: 'frontend-app',
        version: '1.0.0',
        environment: 'production'
    },
    instrumentations: [
        // Mandatory, overwriting the instrumentations array would cause the default instrumentations to be omitted
        ...getWebInstrumentations(),
        new TracingInstrumentation(),
    ],
});

console.log(faro);
faro.api.pushError(123123);
faro.api.pushTraces(123123);
faro.api.pushTraces([{name: 'test', duration: 123123, timestamp: 123123}]);
faro.api.pushLog(['This is a warning']);
faro.api.pushLog(['This is a warning']);
faro.api.pushLog(['This is a warning']);
faro.api.pushLog(['This is a warning']);
faro.api.pushLog(['This is a warning']);

fetch('https://www.google.com')
fetch('https://www.google.com', {method: 'POST'})

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
