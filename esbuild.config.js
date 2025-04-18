const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'bundle.js',
  loader: {
    '.js': 'jsx',
    '.png': 'file',
  },
  define: { 'process.env.NODE_ENV': '"development"' },
  assetNames: 'assets/[name]-[hash]',
}).catch(() => process.exit(1));