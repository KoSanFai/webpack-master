# 1 SplitChunksPlugin
# 2 tree-shaking
# 3 DllPlugin
# 4 HappyPack

# eslint
* `Expected linebreaks to be 'LF' but found 'CRLF'.` 解决方法：`"linebreak-style": [0 ,"error", "windows"]` [Why](https://www.cnblogs.com/guangzan/p/11866261.html)

# webpack-cli
* 在项目中，我们更多地会把 webpack 作为项目的开发依赖来安装使用，这样可以指定项目中使用的 webpack
版本，更加方便多人协同开发
* 大多数前端框架都提供了简单的工具来协助快速生成项目基础文件，一般都会包含项目使用的 webpack
的配置
  * [create-react-app](https://github.com/facebook/create-react-app)
    - create-react-app 的 webpack 配置在这个项目下：react-scripts。
  * [angular/devkit/build-webpack]()
    - 通常 angular 的项目开发和生产的构建任务都是使用 angular-cli 来运行的，但 angular-cli 只是命令的使用接口，基础功能是由  angular/devkit 来实现的，webpack 的构建相关只是其中一部分，详细的配置可以参考 webpack-configs 。
  * [vue-cli](https://github.com/vuejs/vue-cli/)
    - vue-cli 使用 webpack 模板生成的项目文件中，webpack 相关配置存放在 build 目录下。

# loader
  - module type
    * webpack 4.x 版本强化了 module type，即模块类型的概念，不同的模块类型类似于配置了不同的 loader，webpack 会有针对性地进行处理，现阶段实现了以下 5 种模块类型。
      - javascript/auto：即 webpack 3 默认的类型，支持现有的各种 JS 代码模块类型 —— CommonJS、
      AMD、ESM
      - javascript/esm：ECMAScript modules，其他模块系统，例如 CommonJS 或者 AMD 等不支持，是
      .mjs 文件的默认类型
      - javascript/dynamic：CommonJS 和 AMD，排除 ESM
      - javascript/json：JSON 格式数据，require 或者 import 都可以引入，是 .json 文件的默认类型
      - webassembly/experimental：WebAssembly modules，当前还处于试验阶段，是 .wasm 文件的默认
      类型
    ```
      // 如果不希望使用默认的类型的话，在确定好匹配规则条件时，我们可以使用 type 字段来指定模块类型，例如把所有的 JS 代码文件都设置为强制使用 ESM 类型：
        {
          test: /\.js/,
          include: [
            path.resolve(__dirname, 'src'),
          ],
          type: 'javascript/esm', // 这里指定模块类型
        }
    ```

  - noParse
    - module.noParse 字段，可以用于配置哪些模块文件的内容不需要进行解析。对于一些不需要解析依赖（即无依赖） 的第三方大型类库等，可以通过这个字段来配置，以提高整体的构建速度
    - 使用 noParse 进行忽略的模块文件中不能使用 import、require、define 等导入机制。

# plugins
  - ProvidePlugin
    * 引用某些模块作为应用运行时的变量，从而不必每次都用 require 或者 import，
    ```
      new webpack.ProvidePlugin({
        identifier: 'module',
        // ...
      })
    ```
  - IgnorePlugin
    * 用于忽略某些特定的模块，让 webpack 不把这些指定的模块打包进去。
    ```
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ```

# webpack-dev-server configuration
  * 建议将 devServer.publicPath 和 output.publicPath 的值保持一致。
  - public
    * 字段用于指定静态服务的域名，默认是 http://localhost:8080/
  - port
    * 默认是 8080
  - publicPath
    * 用于指定构建好的静态文件在浏览器中用什么路径去访问，默认是 /，例如，对于一个构建
      好的文件 bundle.js，完整的访问路径是 http://localhost:8080/bundle.js，如果你配置了
      publicPath: 'assets/'，那么上述 bundle.js 的完整访问路径就是
      http://localhost:8080/assets/bundle.js
  
# 在配置文件中区分mode
  * 配置文件不仅可以直接导出一个对象，还可以导出一个函数
  ```
    module.exports = (env, argv) => ({
      optimization: {
        minimize: false,
        // 使用 argv 来获取 mode 参数的值
        minimizer: argv.mode === 'production' ? [new UglifyJsPlugin({})] : []
      }
    })
  ```

# mainfest
  * webpack 内部运行时，会维护一份用于管理构建代码时各个模块之间交互的表数据，webpack 官方称之为 Manifest，其中包括入口代码文件和构建出来的 bundle 文件的对应关系。可以使用WebpackManifestPlugin 插件来输出这样的一份数据。

# Tree shaking
  - 在webpack 中，只有启动了 JS 代码压缩功能（即使用 uglify）时，会做 Tree shaking 的优化。webpack 4.x 需要指定 mode 为 production，而 webpack 3.x 的话需要配置 UglifyJsPlugin。
  - 如果你在项目中使用了 Babel 的话，要把 Babel 解析模块语法的功能关掉，在 .babelrc 配置中增加
"modules": false 这个配置：
  ```
    {
      "presets": [["env", { "modules": false }]]
    }
  ```
  - 在 Babel 配置中增加 "loose": true 配置的话,可以去掉class

#babel
  - Babel 7.4.0 以后， 不推荐使用polyfill,推荐直接引入`core-js/stable`和`regenerator-runtime/runtime`
  ```
    import "core-js/stable";
    import "regenerator-runtime/runtime";
  ```
  - 引入polyfill的方式：
  ``` 
    When used alongside @babel/preset-env,
    * If useBuiltIns: 'usage' is specified in .babelrc then do not include @babel/polyfill in either webpack.config.js entry array nor source. Note, @babel/polyfill still needs to be installed.

    * If useBuiltIns: 'entry' is specified in .babelrc then include @babel/polyfill at the top of the entry point to your application via require or import as discussed above.

    * If useBuiltIns key is not specified or it is explicitly set with useBuiltIns: false in your .babelrc, add @babel/polyfill directly to the entry array in your webpack.config.js.
  ```
  - We do not recommend that you import the whole polyfill directly: either try the useBuiltIns options or import only the polyfills you need manually 

  - @babel/plugin-transform-runtime
  * A plugin that enables the re-use of Babel's injected helper code to save on codesize.

# happypack (等同于 thread-loader)
* 对file-loader、url-loader 支持的不友好，所以不建议对该loader使用
```
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: 5 })

module: {
  rules: [
    {
      test: /\.js$/,
      //把对.js 的文件处理交给id为happyBabel 的HappyPack 的实例执行
      loader: 'happypack/loader?id=happyBabel',
      include: [resolve('src'), resolve('test')]
    }
  ]
}

plugins: [
  // ** 代表必填
  new HappyPack({
   ** id: 'happyBabel',
    // Number 代表开启几个子进程去处理这一类型的文件，默认是3个
    threads: 3,
    // 共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多
   ** threadPool: happyThreadPool,
    // 是否允许 HappyPack 输出日志，默认是 true
    verbose: true,
    // Boolean 启用debug 用于故障排查。默认 false
    debug: true,
   ** loaders: [{
      loader: 'babel-loader',
      options: {
        cacheDirectory: true
      }
    }]
  })
]
```

# 必知必会
* webpack 是 dependencies
* webpack-cli 是 devDependencies
* package-lock.json (npm version >= 5.0.0）
* npx (npm version >= 5.2.0 集成了npx)
  - 运行node_modules中的包
  - 避免全局安装包，当local和global都不存在时，会临时下载，使用完毕后删除
  - 运行远程仓库中的包
  
# utility package
- terser-webpack-plugin (webpack-deep-scope-plugin) 辅助tree-shaking
- speed-measure-webpack-plugin 分析打包速度
- purgecss-webpack-plugin 去除无用css
- lodash-es 
- rimraf 删除文件
- moment-timezone-data-webpack-plugin 根据时间范围压缩moment包
- sass-resources-loader (This loader will @import your SASS resources into every required SASS module)
- add-asset-html-webpack-plugin(将静态文件添加到html文件中，配合dllPlugin使用)

# webpack3 VS webpack4
- been removed in webpack v4
  * NoEmitOnErrorsPlugin
  * ModuleConcatenationPlugin
  * NamedModulesPlugin
  * CommonsChunkPlugin

- subsititute
```
optimization: {
    namedModules: true, // NamedModulesPlugin()
    splitChunks: { // CommonsChunkPlugin()
        name: 'vendor',
        minChunks: 2
    },
    noEmitOnErrors: true, // NoEmitOnErrorsPlugin
    concatenateModules: true //ModuleConcatenationPlugin
}
```

# devtool
- development: devtool: 'eval-cheap-module-source-map'
- production: devtool: 'cheap-module-source-map'

# Tree Shaking
- 只支持 ES module， 不支持 commonjs

- development: 会标记出未使用的代码，但是还是会引入（防止影响source-map，导致报错位置不对应）
- production: 会清除dead code （只需配置sideEffects，usedExports默认已配置）

- usage:
  * 在package.json中配置 sideEffects
  * 在webpack配置文件中配置 optimization: { usedExports: true }

# splitChunks
- cacheGroups 当inital(同步引入的依赖)匹配所有条件时，会进入cacheGroups匹配，符合同一个条件的包会打包进同一个文件

# chunk
- 打包完成后的dist中的一个文件就是一个chunk

# 打包分析
- [analyse](https://github.com/webpack/analyse)
- 1.生成打包过程描述文件 `webpack --profile --json > stats.json`
- 2.根据stats.json文件可视化分析打包过程 [analyse](http://webpack.github.io/analyse/)
- 其他分析插件 https://webpack.js.org/guides/code-splitting/#bundle-analysis

# 查看页面代码利用率
- 在控制台 ctrl+shift+p -> coverage
# Prefetching/Preloading
- [doc](https://webpack.js.org/guides/code-splitting/#prefetchingpreloading-modules)

# 踩坑
- 使用PWA(WorkboxPlugin)后,访问同一域名会出现无法正常访问 
- 解决方案：
  * 1.换个端口　
  * 2.在控制台中 application -> Service Workers -> unregister 

# providePlugin
- e.g.
- $: 'jquery' 当在模块中遇到 $ 符号时，便会自动帮忙在该模块中引入jquery

# imports-loader
- allow you use modules that depend on specific global variables

# npm发包踩坑
```
// Error
npm ERR! code E403
npm ERR! 403 403 Forbidden - PUT https://registry.npm.taobao.org/npm-replace-img - [no_perms] Private mode enable, only admin can publish this module
npm ERR! 403 In most cases, you or one of your dependencies are requesting
npm ERR! 403 a package version that is forbidden by your security policy.

npm ERR! A complete log of this run can be found in:
npm ERR!     C:\Users\zhangle\AppData\Roaming\npm-cache\_logs\2020-03-18T11_51_49_786Z-debug.log

// Resolution
- 1. 检查仓库是否被设成了淘宝镜像库 'npm config get registry'
- 2. 如过镜像显示是淘宝，需要设回原仓库 'npm config set registry=http://registry.npmjs.org'
- 3. 重新登录NPM账号，再次发布 'npm login' (如未登录过账号，则添加用户 'npm adduser')
- 4. 如果需要淘宝镜像，重新设置 'npm config set registry=https://registry.npm.taobao.org/'
```

# eslint
- install eslint
- 生成eslint文件： `npx eslint --init`
- 3种使用方式
  * 1. `npx eslint src(文件夹目录)` 在命令行中提示错误
  * 2. 安装 eslint 插件， 配合 .eslintrc 文件进行检查， 在编辑器中提示错误
  * 3. 配置 eslint-loader + 在devServer中配置 overlay 在浏览器中提示错误

# 性能优化
- 1. 保持 Node, npm 版本处于最新版本
- 2. 在尽可能少的模块上使用loader
- 3. plugin 尽可能精简且可靠（使用官方推荐的plugin）
- 4.
- 5. 使用 dllPlugin
- 6. 控制包文件大小
- 7. thread-loader, happypack, parallel-webpack 多进程打包
- 8. 合理使用sourcemap
- 9. 结合stats分析打包结果（webpack-bundle-analyzer、speed-measure-webpack-plugin）
- 10. 开发环境你无用插件剔除f

# chunk VS bundle （Chunk是过程中的代码块，Bundle是结果的代码块）
### 区别
- Chunk是Webpack**打包过程中**，一堆module的集合 (有多个入口文件，会产出多条打包路径，一条路径就会形成一个Chunk)
- Bundle是我们**最终输出**的一个或多个打包文件(大多数情况下，一个Chunk会生产一个Bundle。但有时候也不完全是一对一的关系，比如把 devtool配置成'source-map'。只有一个入口文件，也不配置代码分割，这样的配置，会产生一个Chunk，但是会产生两个bundle)
```
/**
 * A Chunk is a unit of encapsulation for Modules.
 * Chunks are "rendered" into bundles that get emitted when the build completes.
 */
class Chunk { 
}
```
### 产生Chunk的三种途径（4个规则限制）
- entry入口
- 异步加载模块
- 代码分割（code spliting）