/* jshint qunit:true */
/*
  ======== A Handy Little QUnit Reference ========
  http://api.qunitjs.com/

  Test methods:
    module(name, {[setup][ ,teardown]})
    test(name, callback)
    expect(numberOfAssertions)
    stop(increment)
    start(decrement)
  Test assertions:
    ok(value, [message])
    equal(actual, expected, [message])
    notEqual(actual, expected, [message])
    deepEqual(actual, expected, [message])
    notDeepEqual(actual, expected, [message])
    strictEqual(actual, expected, [message])
    notStrictEqual(actual, expected, [message])
    throws(block, [expected], [message])
*/


define(function(require) {
  "use strict";

  var attributes = require('namespaced_attributes');

  return {
    runTests: function() {

      module('Namespced Attributes', {
        setup: function() {
          attributes.setPrefix();
        }
      });

      test('Interface', function() {
        strictEqual(typeof attributes.set, 'function', 'set is a function');
        strictEqual(typeof attributes.get, 'function', 'get is a function');
        strictEqual(typeof attributes.cssSelector, 'function', 'cssSelector is a function');
        strictEqual(typeof attributes.selector, 'function', 'selector is a function');
        strictEqual(typeof attributes.selectorAll, 'function', 'selectorAll is a function');
        strictEqual(typeof attributes.attributeString, 'function', 'attributeString is a function');
      });

      test('Attribute String', function () {
        strictEqual(attributes.attributeString(''), 'data-dc-', 'Selector, no attribute, no value');
        strictEqual(attributes.attributeString('test'), 'data-dc-test', 'Selector, no value');
        strictEqual(attributes.attributeString('test', 'item'), 'data-dc-test="item"', 'Selector');
        strictEqual(attributes.attributeString('test-attribute'), 'data-dc-test-attribute', 'Selector, two word vaule');
        attributes.setPrefix('test');
        strictEqual(attributes.attributeString('test', 'item'), 'data-test-test="item"', 'Selector, changed prefix');
      });

      test('CSS selector', function () {
        strictEqual(attributes.cssSelector(''), '[data-dc-]', 'Selector, no attribute, no value');
        strictEqual(attributes.cssSelector('test'), '[data-dc-test]', 'Selector, no value');
        strictEqual(attributes.cssSelector('test', 'item'), '[data-dc-test="item"]', 'Selector');
        strictEqual(attributes.cssSelector('test-attribute'), '[data-dc-test-attribute]', 'Selector, two word vaule');
        attributes.setPrefix('test');
        strictEqual(attributes.cssSelector('test', 'item'), '[data-test-test="item"]', 'Selector, changed prefix');
      });

      test('Get data attribute name', function () {
        strictEqual(attributes.getDataAttributeName(''), 'dc', 'No attribute');
        strictEqual(attributes.getDataAttributeName('test'), 'dcTest', 'Attribute');
        strictEqual(attributes.getDataAttributeName('test-item-name'), 'dcTestItemName', 'Multi-word attribute');
        attributes.setPrefix('test');
        strictEqual(attributes.getDataAttributeName('test'), 'testTest', 'Attribute, changed prefix');
      });

      test('Selector All (default prefix)', function () {
        strictEqual(attributes.selectorAll('test')[0].id, 'test-default-prefix0', 'selects correct item - no attribute, no parent.');
        strictEqual(attributes.selectorAll('test', 'test')[0].id, 'test-default-prefix1', 'selects correct item - attribute, no parent.');
        strictEqual(attributes.selectorAll('test', 'test', document.querySelector('#default-prefix'))[0].id, 'test-default-prefix1', 'selects correct item - attribute, parent.');
      });

      test('Selector (default prefix)', function () {
        strictEqual(attributes.selector('test').id, 'test-default-prefix0', 'selects correct item - no attribute, no parent.');
        strictEqual(attributes.selector('test', 'test').id, 'test-default-prefix1', 'selects correct item - attribute, no parent.');
        strictEqual(attributes.selector('test', 'test', document.querySelector('#default-prefix')).id, 'test-default-prefix1', 'selects correct item - attribute, parent.');
      });

      test('Get (default prefix)', function () {
        var element = document.querySelector('#test-default-key');
        strictEqual(attributes.get(element, 'key'), 'value', 'retrieved data set in markup');
      });

      test('Set (default prefix)', function () {
        var element = document.querySelector('#test-default-key');
        strictEqual(attributes.get(element, 'setter'), undefined, 'data initially unset');
        attributes.set(element, 'setter', 'this is a test');
        strictEqual(attributes.get(element, 'setter'), 'this is a test', 'data correctly retrieved');
      });

      test('Selector All (no prefix)', function () {
        attributes.setPrefix('');
        strictEqual(attributes.selectorAll('test')[0].id, 'test-no-prefix0', 'selects correct item - no attribute, no parent.');
        strictEqual(attributes.selectorAll('test', 'test')[0].id, 'test-no-prefix1', 'selects correct item - attribute, no parent.');
        strictEqual(attributes.selectorAll('test', 'test', document.querySelector('#no-prefix'))[0].id, 'test-no-prefix1', 'selects correct item - attribute, parent.');
      });

      test('Selector (no prefix)', function () {
        attributes.setPrefix('');
        strictEqual(attributes.selector('test').id, 'test-no-prefix0', 'selects correct item - no attribute, no parent.');
        strictEqual(attributes.selector('test', 'test').id, 'test-no-prefix1', 'selects correct item - attribute, no parent.');
        strictEqual(attributes.selector('test', 'test', document.querySelector('#no-prefix')).id, 'test-no-prefix1', 'selects correct item - attribute, parent.');
      });

      test('Get (no prefix)', function () {
        attributes.setPrefix('');
        var element = document.querySelector('#test-no-key');
        strictEqual(attributes.get(element, 'key'), 'value', 'retrieved data set in markup');
      });

      test('Set (no prefix)', function () {
        attributes.setPrefix('');
        var element = document.querySelector('#test-no-key');
        strictEqual(attributes.get(element, 'setter'), undefined, 'data initially unset');
        attributes.set(element, 'setter', 'this is a test');
        strictEqual(attributes.get(element, 'setter'), 'this is a test', 'data correctly retrieved');
      });

      test('Selector All (custom prefix)', function () {
        attributes.setPrefix('other');
        strictEqual(attributes.selectorAll('test')[0].id, 'test-custom-prefix0', 'selects correct item - custom attribute, custom parent.');
        strictEqual(attributes.selectorAll('test', 'test')[0].id, 'test-custom-prefix1', 'selects correct item - attribute, custom parent.');
        strictEqual(attributes.selectorAll('test', 'test', document.querySelector('#custom-prefix'))[0].id, 'test-custom-prefix1', 'selects correct item - attribute, parent.');
      });

      test('Selector (custom prefix)', function () {
        attributes.setPrefix('other');
        strictEqual(attributes.selector('test').id, 'test-custom-prefix0', 'selects correct item - custom attribute, custom parent.');
        strictEqual(attributes.selector('test', 'test').id, 'test-custom-prefix1', 'selects correct item - attribute, custom parent.');
        strictEqual(attributes.selector('test', 'test', document.querySelector('#custom-prefix')).id, 'test-custom-prefix1', 'selects correct item - attribute, parent.');
      });

      test('Get (custom prefix)', function () {
        attributes.setPrefix('other');
        var element = document.querySelector('#test-custom-key');
        strictEqual(attributes.get(element, 'key'), 'value', 'retrieved data set in markup');
      });

      test('Set (custom prefix)', function () {
        attributes.setPrefix('other');
        var element = document.querySelector('#test-custom-key');
        strictEqual(attributes.get(element, 'setter'), undefined, 'data initially unset');
        attributes.set(element, 'setter', 'this is a test');
        strictEqual(attributes.get(element, 'setter'), 'this is a test', 'data correctly retrieved');
      });

    }
  };

});
