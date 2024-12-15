
const API_URL = 'http://localhost:8000/test';
const TRACE_URL = 'http://localhost:4318/v1/traces';
const SERVICE_NAME = 'test-with-curl';
const SCOPE_NAME = 'manual-test';
const SPAN_NAME = 'spanitron';

function generateId(length) {
    return Array.from(crypto.getRandomValues(new Uint8Array(length / 2)), byte => byte.toString(16).padStart(2, '0')).join('');
}

async function sendRequestWithTrace() {
    const traceId = generateId(32);
    const spanId = generateId(16);
    console.log(`traceId: ${traceId}, spanId: ${spanId}`);
    const startTime = Date.now() * 1_000_000;
    let endTime;
    let hasError = false;

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: { 'traceparent': `00-${traceId}-${spanId}-01` },
        });
        console.log('Request sent:', await response.text());
        endTime = Date.now() * 1_000_000;
    } catch (error) {
        console.error('Error during API request:', error);
        hasError = true;
        endTime = Date.now() * 1_000_000;
    }

    const spanData = {
        resourceSpans: [{
            resource: { attributes: [{ key: 'service.name', value: { stringValue: SERVICE_NAME } }] },
            scopeSpans: [{
                scope: { name: SCOPE_NAME },
                spans: [{
                    traceId, spanId, name: SPAN_NAME, kind: 2,
                    startTimeUnixNano: startTime.toString(),
                    endTimeUnixNano: endTime.toString(),
                    droppedAttributesCount: 0, events: [], droppedEventsCount: 0,
                    status: { code: hasError ? 2 : 1 },
                }],
            }],
        }],
    };

    try {
        const traceResponse = await fetch(TRACE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(spanData),
        });
        console.log('Span sent:', await traceResponse.json());
    } catch (traceError) {
        console.error('Error sending span:', traceError);
    }
}

sendRequestWithTrace();
