const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// On web, Metro's package-exports resolution picks zustand's ESM build
// (esm/middleware.mjs), whose devtools middleware references `import.meta`.
// Metro serves the web bundle as a plain <script> (not type="module"), so
// that's a parse-time SyntaxError that blanks the whole app. Force zustand
// to resolve its CommonJS build on web, where it uses `process.env` instead.
const { resolveRequest: defaultResolveRequest } = config.resolver;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && (moduleName === 'zustand' || moduleName.startsWith('zustand/'))) {
    return {
      type: 'sourceFile',
      filePath: require.resolve(moduleName, { paths: [context.originModulePath] }),
    };
  }
  return defaultResolveRequest
    ? defaultResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
