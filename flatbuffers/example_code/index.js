const flatbuffers = require('./vendor/flatbuffers.js').flatbuffers
const Long = require('long')
const EventSerializer = require('./event_generated.js').Serializer

const builder = new flatbuffers.Builder(1024);

EventSerializer.MousePositionData.startMousePositionData(builder)
// add mouse position data into buffer
// ...
const mousePositionDataOffset = EventSerializer.MousePositionData.endMousePositionData(builder)

const timestamp = Long.fromNumber(Date.now())
const timestampFbLong = flatbuffers.Long.create(timestamp.low, timestamp.high)
EventSerializer.Event.startEvent(builder)
EventSerializer.Event.addTimestamp(builder, timestamp)
EventSerializer.Event.addType(builder, EventSerializer.EventType.MOUSE_POSITION)
EventSerializer.Event.addDataType(builder, EventSerializer.EventData.MousePositionData)
EventSerializer.Event.addData(builder, mousePositionDataOffset)
const eventOffset = EventSerializer.Event.endEvent(builder)

EventSerializer.Event.finishEventBuffer(builder, eventOffset)

const bytes = builder.asUint8Array() // our data bytes

// Read
const buffer = new flatbuffers.ByteBuffer(bytes)
const event = EventSerializer.Event.getRootAsEvent(buffer)

console.log('event timestamp', event.timestamp())
console.log('event type', event.type())
console.log('event data type', event.dataType())
console.log('event data', event.data(new EventSerializer.MousePositionData())).position()
