/**
 * Provides a basic set of helpers to handle prefixed data attributes.
 *
 * Usage:
 *   Select an element with the attribute 'bar':
 *     var element = attributes.slect('bar')[0];
 *   Set some test data with the key 'baz' on the element:
 *     attributes.set(element, 'baz', JSON.stringify({ 'test_data': true }));
 *   Retrieve the data from the element:
 *     var data = JSON.parse(attributes.get(element, 'baz'));
 */

define(function(require, exports, module) {
  "use strict";

  var config = require('config');

  var data_prefix = config.data_attribute_prefix || /* istanbul ignore next default */ 'dc';

  var api = {};

  /**
   * Sets the data prefix.
   * @private
   *
   * @param new_prefix {string} New prefix to use.
   */
  function setPrefix(new_prefix) {
    if (typeof new_prefix === 'string') {
      data_prefix = new_prefix;
    } else {
      data_prefix = config.data_attribute_prefix;
    }
    data_prefix = data_prefix.toLowerCase();
  }

  /**
   * Builds a data attribute name using the configured prefix.
   * @private
   *
   * @param attribute {string} Attribute name you wish to use.
   *
   * @returns {string} Attribute name with configured prefix.
   */
  function getDataAttributeName(attribute) {
    var words = attribute.split('-'),
        new_attribute = '';

    words.forEach(function(word) {
      new_attribute += word.slice(0, 1).toUpperCase() + word.slice(1);
    });
    if (data_prefix.length) {
      new_attribute = data_prefix + new_attribute;
    } else {
      new_attribute = new_attribute.slice(0, 1).toLowerCase() + attribute.slice(1);
    }
    return new_attribute;
  }

  /**
   * Builds a prefixed CSS data selector.
   *
   * @param attribute {string} Attribute name you wish to use.
   * @param value {string} Optional value to qualify selector.
   */
  api.attributeString = function(attribute, value) {
    var selector = 'data';
    if (data_prefix.length) {
      selector += '-' + data_prefix;
    }
    selector += '-' + attribute;
    if (typeof value !== 'undefined') {
      selector += '="' + value + '"';
    }
    return selector;
  };

  /**
   * Builds a prefixed CSS data selector.
   *
   * @param attribute {string} Attribute name you wish to use.
   * @param value {string} Optional value to qualify selector.
   */
  api.cssSelector = function(attribute, value) {
    return '[' + api.attributeString(attribute, value) + ']';
  };

  /**
   * Gets a data attribute value.
   *
   * @param element {element} DOM element from which to get the data.
   * @param attribute {element} Name of attribute to get.
   *
   * @returns {mixed} Value of data attribute.
   */
  api.get = function(element, attribute) {
    return element.dataset[getDataAttributeName(attribute)];
  };

  /**
   * Sets a data attribute value.
   *
   * @param element {element} DOM element on which to set the data.
   * @param attribute {element} Name of attribute to set.
   * @param value {mixed} Data to set on attribute.
   */
  api.set = function(element, attribute, value) {
    element.dataset[getDataAttributeName(attribute)] = value;
  };

  /**
   * Selects elements based on a data attribute with an optional value.
   *
   * @param attribute {string} Attribute name to select.
   * @param value {string} Value of attribute to use in selector. (Optional)
   * @param parent {element} DOM element on which to base selection. (Optional, defaults to `document`.)
   *
   * @returns {NodeList} Elements that match the selector.
   */
  api.selectorAll = function(attribute, value, parent) {
    parent = parent || document;
    var selector = api.cssSelector(attribute, value);
    return parent.querySelectorAll(selector);
  };

  /**
   * Selects an element based on a data attribute with an optional value.
   *
   * @param attribute {string} Attribute name to select.
   * @param value {string} Value of attribute to use in selector. (Optional)
   * @param parent {element} DOM element on which to base selection. (Optional, defaults to `document`.)
   *
   * @returns {Node} Element that matches the selector.
   */
  api.selector = function(attribute, value, parent) {
    parent = parent || document;
    var selector = api.cssSelector(attribute, value);
    return parent.querySelector(selector);
  };

  /* istanbul ignore next */
  if (config.debug) {
    api.setPrefix = setPrefix;
    api.getDataAttributeName = getDataAttributeName;
  }

  module.exports = api;
});
