// automatically generated by the FlatBuffers compiler, do not modify

/**
 * @const
*/
var Serializer = Serializer || {};

/**
 * @enum
 */
Serializer.EventType = {
  MOUSE_CLICK: 0,
  MOUSE_POSITION: 1,
  INPUT: 2,
  DOM_MUTATION: 3
};

/**
 * @enum
 */
Serializer.EventData = {
  NONE: 0,
  MouseClickData: 1,
  MousePositionData: 2,
  InputData: 3,
  DomMutationData: 4
};

/**
 * @constructor
 */
Serializer.MouseClickData = function() {
  /**
   * @type {flatbuffers.ByteBuffer}
   */
  this.bb = null;

  /**
   * @type {number}
   */
  this.bb_pos = 0;
};

/**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {Serializer.MouseClickData}
 */
Serializer.MouseClickData.prototype.__init = function(i, bb) {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Serializer.MouseClickData=} obj
 * @returns {Serializer.MouseClickData}
 */
Serializer.MouseClickData.getRootAsMouseClickData = function(bb, obj) {
  return (obj || new Serializer.MouseClickData).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @param {flatbuffers.Builder} builder
 */
Serializer.MouseClickData.startMouseClickData = function(builder) {
  builder.startObject(0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
Serializer.MouseClickData.endMouseClickData = function(builder) {
  var offset = builder.endObject();
  return offset;
};

/**
 * @constructor
 */
Serializer.MousePositionData = function() {
  /**
   * @type {flatbuffers.ByteBuffer}
   */
  this.bb = null;

  /**
   * @type {number}
   */
  this.bb_pos = 0;
};

/**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {Serializer.MousePositionData}
 */
Serializer.MousePositionData.prototype.__init = function(i, bb) {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Serializer.MousePositionData=} obj
 * @returns {Serializer.MousePositionData}
 */
Serializer.MousePositionData.getRootAsMousePositionData = function(bb, obj) {
  return (obj || new Serializer.MousePositionData).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @param {flatbuffers.Builder} builder
 */
Serializer.MousePositionData.startMousePositionData = function(builder) {
  builder.startObject(0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
Serializer.MousePositionData.endMousePositionData = function(builder) {
  var offset = builder.endObject();
  return offset;
};

/**
 * @constructor
 */
Serializer.InputData = function() {
  /**
   * @type {flatbuffers.ByteBuffer}
   */
  this.bb = null;

  /**
   * @type {number}
   */
  this.bb_pos = 0;
};

/**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {Serializer.InputData}
 */
Serializer.InputData.prototype.__init = function(i, bb) {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Serializer.InputData=} obj
 * @returns {Serializer.InputData}
 */
Serializer.InputData.getRootAsInputData = function(bb, obj) {
  return (obj || new Serializer.InputData).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @param {flatbuffers.Builder} builder
 */
Serializer.InputData.startInputData = function(builder) {
  builder.startObject(0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
Serializer.InputData.endInputData = function(builder) {
  var offset = builder.endObject();
  return offset;
};

/**
 * @constructor
 */
Serializer.DomMutationData = function() {
  /**
   * @type {flatbuffers.ByteBuffer}
   */
  this.bb = null;

  /**
   * @type {number}
   */
  this.bb_pos = 0;
};

/**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {Serializer.DomMutationData}
 */
Serializer.DomMutationData.prototype.__init = function(i, bb) {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Serializer.DomMutationData=} obj
 * @returns {Serializer.DomMutationData}
 */
Serializer.DomMutationData.getRootAsDomMutationData = function(bb, obj) {
  return (obj || new Serializer.DomMutationData).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @param {flatbuffers.Builder} builder
 */
Serializer.DomMutationData.startDomMutationData = function(builder) {
  builder.startObject(0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
Serializer.DomMutationData.endDomMutationData = function(builder) {
  var offset = builder.endObject();
  return offset;
};

/**
 * @constructor
 */
Serializer.Event = function() {
  /**
   * @type {flatbuffers.ByteBuffer}
   */
  this.bb = null;

  /**
   * @type {number}
   */
  this.bb_pos = 0;
};

/**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {Serializer.Event}
 */
Serializer.Event.prototype.__init = function(i, bb) {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Serializer.Event=} obj
 * @returns {Serializer.Event}
 */
Serializer.Event.getRootAsEvent = function(bb, obj) {
  return (obj || new Serializer.Event).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @returns {flatbuffers.Long}
 */
Serializer.Event.prototype.timestamp = function() {
  var offset = this.bb.__offset(this.bb_pos, 4);
  return offset ? this.bb.readUint64(this.bb_pos + offset) : this.bb.createLong(0, 0);
};

/**
 * @returns {Serializer.EventType}
 */
Serializer.Event.prototype.type = function() {
  var offset = this.bb.__offset(this.bb_pos, 6);
  return offset ? /** @type {Serializer.EventType} */ (this.bb.readInt16(this.bb_pos + offset)) : Serializer.EventType.MOUSE_CLICK;
};

/**
 * @returns {Serializer.EventData}
 */
Serializer.Event.prototype.dataType = function() {
  var offset = this.bb.__offset(this.bb_pos, 8);
  return offset ? /** @type {Serializer.EventData} */ (this.bb.readUint8(this.bb_pos + offset)) : Serializer.EventData.NONE;
};

/**
 * @param {flatbuffers.Table} obj
 * @returns {?flatbuffers.Table}
 */
Serializer.Event.prototype.data = function(obj) {
  var offset = this.bb.__offset(this.bb_pos, 10);
  return offset ? this.bb.__union(obj, this.bb_pos + offset) : null;
};

/**
 * @param {flatbuffers.Builder} builder
 */
Serializer.Event.startEvent = function(builder) {
  builder.startObject(4);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Long} timestamp
 */
Serializer.Event.addTimestamp = function(builder, timestamp) {
  builder.addFieldInt64(0, timestamp, builder.createLong(0, 0));
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {Serializer.EventType} type
 */
Serializer.Event.addType = function(builder, type) {
  builder.addFieldInt16(1, type, Serializer.EventType.MOUSE_CLICK);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {Serializer.EventData} dataType
 */
Serializer.Event.addDataType = function(builder, dataType) {
  builder.addFieldInt8(2, dataType, Serializer.EventData.NONE);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} dataOffset
 */
Serializer.Event.addData = function(builder, dataOffset) {
  builder.addFieldOffset(3, dataOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
Serializer.Event.endEvent = function(builder) {
  var offset = builder.endObject();
  return offset;
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} offset
 */
Serializer.Event.finishEventBuffer = function(builder, offset) {
  builder.finish(offset);
};

// Exports for Node.js and RequireJS
this.Serializer = Serializer;
