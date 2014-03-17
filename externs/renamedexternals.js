/**
 * @externs
 */



var CanvasRenderingContext2D = function() {};
/**
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @return {undefined}
 */
CanvasRenderingContext2D.prototype.flc = function(x, y, w, h) {};

/**
 * @constructor
 */
var Ado = function() {};

/** @type {!AudioDestinationNode} */
Ado.prototype.dsa;

/** @type {number} */
Ado.prototype.smR;

/**
 * @param {number} bufferSize
 * @param {number=} numberOfInputChannels_opt
 * @param {number=} numberOfOutputChannels_opt
 * @return {!ScriptProcessorNode}
 */
Ado.prototype.ceS = function(bufferSize,
    numberOfInputChannels_opt, numberOfOutputChannels_opt) {};

/**
 * @constructor
 */
var AudioNode = function() {};

/**
 * @param {AudioNode} destination
 * @param {number=} output
 * @param {number=} input
 */
AudioNode.prototype.cnt = function(destination, output, input) {};



/**
 * @constructor
 * @extends {AudioNode}
 */
var ScriptProcessorNode = function() {};

/** @type {EventListener} */
ScriptProcessorNode.prototype.onaudioprocess;



/**
 * @constructor
 */
var AudioBuffer = function() {};

/**
 * @param {number} channel
 * @return {!Float32Array}
 */
AudioBuffer.prototype.gtn= function(channel) {};


/**
 * @constructor
 * @extends {Event}
 */
var AudioProcessingEvent = function() {};

/** @type {AudioBuffer} */
AudioProcessingEvent.prototype.otB;
