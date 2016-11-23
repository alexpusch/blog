Case study of Javascript Flat Buffers
================================

Data serialization is very common process in web application. So common that no one thinks of it. You just pull data from the DB, and your server and client frameworks just handle this thing for you. The server serializes the data into JSON, and the client parses it to JS object. This flow is simple and natural but, as everything, when taken to the extreme start to show scaling issues.

Whats an 'extreme' for data serialization? A lot of data. Serializing and deseriazling tens of thousands of objects takes it toll from the server, and more importantly, from the single threaded browser page.

A possible solution for this scaling issue are FlatBuffers. We've utilized this tool to do our heavy lifting and lived to tell about it.

# Who are we?
Before diving into FlatBuffers internals let me tell you a bit about us. Why do we even need to transfer so many objects to the browser?

We are [Jaco](https://getjaco.com), a UX analytics tool that enable you to watch your user sessions exactly as they happen - a movie clip of a users screen while he or she browse your site.

The basic building blocks of a user session recording tools are:
* A recorder
* Processing pipeline
* Recordings storage
* Recordings player

The recorder have the ability to capture any event or DOM mutation in a page, and stream the recorded entities to our servers. As you can imagine a session might consist of a huge number of events. Every mouse move, every scroll, every change to the page itself must be recorded. This can easily mount to ten or hundreds of thousands of data points.

All this data must be stored and accessible for the recorders counterpart - the player. The player knows how to take the mass of events and reconstruct them into a watchable clip.

This undertaking raises many challenges, one of which is to transfer all of those events from the recorded user to our servers, and from our servers to the player. The efficiency of this process is measured both by the size of the transfered data and by the time it takes to parse it, measures that JSON does not excel in.

# What are FlatBuffers?
[FlatBuffers](https://google.github.io/flatbuffers) is a serialization library by Google. It was first made by Google with android games in mind, but now it has ports to several languages including JavaScript.

The main goal of FlatBuffers is to avoid deseriazation what so ever. This is achieved by defining a binary data protocol - a well defined method to convert data to, and from binary. The binary structure created by this protocol can be sent over the wire, and read without further processing. To reiterate, when transferring JSON, we need to transform data into a string, send the string over the wire, parse the string, and transform it into a native object. Flatbuffers does not require any of it. You start up with binary, send the same binary, and read directly from binary.

In addition to the parsing efficiency the binary format gains us another advantage - binary representation of data is often more size efficient. We can store a 10 digit int using 4 UInt bytes, instead of 10 chars.

## Flat buffers Example
This won't be a FlatBuffers tutorial, but to give you a feel for what it's like lets took on a simplified version of our data model.

The first step of FlatBuffers is to define an *idl* file. This file defines the scheme of our data. We define an ```Event``` object that stores event_type, timestamp, and event_data. Each event type has it's own data object

```idl
// we can define enums
enum EventType:short {
  MOUSE_CLICK,
  MOUSE_POSITION,
  INPUT,
  DOM_MUTATION
}

// a table is similar to struct definition
table MouseClickData{
  x: ushort;
  y: ushort;
  target_node_id: ushort;
}

table MousePositionData{ /* ... */ }
table InputData{ /* ... */ }
table DomMutationData{ /* ... */ }

// union allows us to store different types of data in the same field
union EventData {
  MouseClickData,
  MousePositionData,
  InputData,
  DomMutationData
}

table Event {
  timestamp: ulong;
  type: EventType;
  event_data: EventData;
}

root_type Event;
```

After defining the schema, we run the flatbuffer 'compiler' - flatc. This generates code in our language of choice. That code handles all the bytes and bits calculation flatbuffer is based on.

Using this generated file we can write our event flatbuffer:

```javascript
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
```

These bytes are stored for later use. We simply store this data in Amazon S3.

Reading the bytes looks like this:

```javascript
const buffer = new flatbuffers.ByteBuffer(bytes)
const event = EventSerializer.Event.getRootAsEvent(buffer)

console.log('event timestamp', event.timestamp())
console.log('event type', event.type())
console.log('event data type', event.dataType())
console.log('event data', event.event_data(new EventSerializer.MousePositionData())).x()
```

As you can see, Flatbuffers creation and reading is not trivial. The API is verbal and cumbersome.

# Phases of refactor
Refactoring our entire flow from JSON to FlatBuffers is quite a feat. It's a architecture crossing change that will be dangerous to try and accomplish in one go. We've considered this issue for a while and managed to split the redactor into several independent steps.

## FB in recorder
We began in transforming our recorder messages to FlatBuffers. The recorder creates and send the recorded events as FlatBuffers. The first step of the processing pipeline is to transform the binary data back to JSON allowing the rest of the architecture to stay unchanged.

There is good value to this seemingly small change. It would allow us to skip the process blocking JSON.stringify, and minimize the amount of data the end user needs to upload to our server.

## FB in player
The second step we took was to add FlatBuffers support to our player. Naturally we needed to convert the JSON data we store to FlatBuffers but this extra converting code is a small price to pay in order to achieve a factorize a big refactor.

## Store FB - "point of no return"
The Final step is to actually store the FlatBuffers bytes in our storage. This is the "point of no return". A benefit of the previous steps is that we could easily roll back the change. Once we loose the JSON all together a rollback would be very difficult.

In fact we have not taken this step yet. A Major benefit of JSON is that it's easily streamable using libraries such as [Oboe.js](http://oboejs.com/). We have yet to discover a method to achieve a similar goal using FlatBuffers.

# benchmarks
We have expected FlatBuffers to reduce the size of our data. We've converted some of our JSON sessions to FlatBuffers to check this hypothesis. Each tested session

<scatter plot>

The results where quite impressive! 40% - 94% size decrease in our test data.

# Drawbacks
The advantages FlatBuffers offers do not come for free.

* Non human readable
* Verbal and cumbersome API
* Backwards compatibility issues
* Lack of streaming support
