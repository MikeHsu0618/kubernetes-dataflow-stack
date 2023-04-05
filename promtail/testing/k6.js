import loki from 'k6/x/loki';

const timeout = 5000; // ms
const conf = loki.Config("http://localhost", timeout);
const client = loki.Client(conf);

export default () => {
    client.pushParameterized(2, 512*1024, 1024*1024);
};