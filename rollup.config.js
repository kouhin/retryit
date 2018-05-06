import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

const NAME = 'retryit';

const env = process.env.NODE_ENV;
const config = {
  input: 'src/index.js',
  plugins: []
};

if (env === 'es' || env === 'cjs') {
  config.output = {
    format: env,
    indent: false,
    exports: 'named'
  };
  config.external = ['symbol-observable'];
  config.plugins.push(babel());
}

if (env === 'development' || env === 'production') {
  config.output = {
    format: 'umd',
    name: NAME,
    indent: false,
    exports: 'named'
  };
  config.plugins.push(
    nodeResolve({
      jsnext: true
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  );
}

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  );
}

export default config;
