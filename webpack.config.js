const path = require('path');
module.exports = {
   entry: [
       "./app/CCT.ts"
   ],
   output: {
       library: 'CctLce',
       libraryTarget: 'assign',
       filename: "bundle.js",
       path: path.resolve(__dirname, 'dist.browser')
   },
   resolve: {
       extensions: [".ts", ".umd.js", ".js"]
   },
   module: {
        rules: [{
            test: /\.ts$/, 
            loader: "ts-loader",
            options: {
                configFile: "tsconfig.browser.json"
            }
        }]
   }
}