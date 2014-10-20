define(function (require, exports, module) {
  module.exports = {
    // URL for RUM data collection.
    'beacon_url': 'https://stats.decadecity.net/boomerang/beacon?',
    // Prefix for data attributes.
    'data_attribute_prefix': 'dc',
    // Open up private methods for testing.
    'debug': true,
    // Number of loads over which we look for a fast load.
    'load_speed_count': 4,
    // Number of seconds above which we count a slow load.
    'load_speed_timout': 2.5,
    // URL to send the profile information.
    'profiler_url': '/profile',
    // Bucket for images.
    's3_bucket': 'test-bucket'
  }
});
