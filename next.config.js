const withPlugins = require("next-compose-plugins");

module.exports = withPlugins([], {});

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
  })
  
  module.exports = withBundleAnalyzer({})