import loki from 'k6/x/loki';

const BASE_URL = "http://localhost:64643";
const KB = 1024;
const MB = KB * KB;

export const options = {
    vus: 150,
    iterations: 10000,
};

const labels = loki.Labels({
    "format": ["logfmt"], // must contain at least one of the supported log formats
    "os": ["linux"],
    "cluster": ["k3d"],
    "namespace": ["AAA"],
    "container": ["BBBB"],
    "instance": ["localhost"], // overrides the `instance` label which is otherwise derived from the hostname and VU
});

const conf = new loki.Config(BASE_URL, 10000, 0, {}, labels);
const client = new loki.Client(conf);

export default () => {
    // Push a batch of 2 streams with a payload size between 500KB and 1MB
    client.pushParameterized(1, 216 * 1024, 555 * 1024);
};
