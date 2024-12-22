import { check, fail } from 'k6';
import loki from 'k6/x/loki';

/*
 * Host name with port
 * @constant {string}
 */
const HOST = "http://rum-collector-pub.uat.sportybet2.com";

/**
 * URL used for push and query requests
 * Path is automatically appended by the client
 * @constant {string}
 */
const BASE_URL = `${HOST}`;

const MIN_VUS = 1

const MAX_VUS = 10;


const KB = 1024;
const MB = KB * KB;

/**
 * Definition of test scenario
 */
export const options = {
  thresholds: {
    'http_req_failed': [{ threshold: 'rate<=0.01', abortOnFail: true }],
  },
  scenarios: {
    write: {
      executor: 'ramping-vus',
      exec: 'write',
      startVUs: MIN_VUS,
      stages: [
        { duration: '1m', target: MAX_VUS },
        { duration: '30m', target: MAX_VUS },
      ],
      gracefulRampDown: '1m',
    },
  },
};

const labelCardinality = {
  "app": 5,
  "namespace": 1,
  "pod": 100,
};
const timeout = 10000; // 10s
const ratio = 0.9; // 90% Protobuf
const conf = new loki.Config(BASE_URL, timeout, ratio, labelCardinality);
const client = new loki.Client(conf);

/**
 * Entrypoint for write scenario
 */
export function write() {
  let streams = randomInt(4, 8);
  let res = client.pushParameterized(streams, 800 * KB, 1 * MB);
  check(res,
    {
      'successful write': (res) => {
        let success = res.status === 204;
        if (!success) console.log(res.status, res.body);
        return success;
      },
    }
  );
}

/**
 * Return a random integer between min and max including min and max
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}