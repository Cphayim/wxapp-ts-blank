const gulp = require('gulp');
const loadPlugins = require('gulp-load-plugins');
const $ = loadPlugins();
// gulp 输出日志配置项
const log = require('./gulp.log.config');
// ts 编译配置
const tsProject = $.typescript.createProject('tsconfig.json');

// 配置项
const config = {
    srcDir: 'src/',
    outDir: 'dist/',
}
// 编译 TS
const TSCompile = (filePath) => {
    const taskName = 'TSCompile',
        startTime = Date.now();

    log.start(taskName, startTime);

    // 如果有传递指定文件的参数，使用参数，没有则使用开发目录下的所有 ts 文件
    filePath = filePath || config.srcDir + '**/*.ts';

    return gulp.src(['typings/index.d.ts', filePath, `!${config.srcDir}dev-resource/**/*`], {
            base: config.srcDir
        })
        .pipe($.sourcemaps.init())
        .pipe(tsProject())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(config.outDir))
        // 监听完成
        .on('end', () => {
            const endTime = Date.now(),
                time = endTime - startTime;
            log.finish(taskName, endTime, time);
        });
}

// 转译 ES6
const ES6Transpile = (filePath) => {
    const taskName = 'ES6Transpile',
        startTime = Date.now();

    log.start(taskName, startTime);
    filePath = filePath || config.srcDir + '**/*.js';
    return gulp.src([filePath, `!${config.srcDir}dev-resource/**/*`], {
            base: config.srcDir
        })
        .pipe($.sourcemaps.init())
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(config.outDir))
        // 监听完成
        .on('end', () => {
            const endTime = Date.now(),
                time = endTime - startTime;
            log.finish(taskName, endTime, time);
        });
}

// 编译 SCSS
const SCSSCompile = (filePath) => {
    const taskName = 'SCSSCompile',
        startTime = Date.now();

    log.start(taskName, startTime);

    filePath = filePath || config.srcDir + '**/*.scss';
    // 图片转 base 64 配置
    const base64config = {
        extensions: ['png', 'jpg', 'jpeg'],
        maxImageSize: 500 * 500,
        debug: false
    }
    return gulp.src([filePath, `!${config.srcDir}dev-resource/**/*`], {
            base: config.srcDir
        })
        // .pipe($.sourcemaps.init())
        .pipe($.sass({
            outputStyle: 'compact'
        })).on('error', $.sass.logError)
        .pipe($.replace(/\/\*!(.*)scss(.*)!\*\//g, '$1wxss$2'))
        .pipe($.base64(base64config))
        .pipe($.rename({
            extname: '.wxss' // 修改扩展名
        }))
        // .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(config.outDir))
        .on('end', () => {
            const endTime = Date.now(),
                time = endTime - startTime;
            log.finish(taskName, endTime, time);
        });

}

// 拷贝 wxml
const WXMLCopy = (filePath) => {
    const taskName = 'WXMLCopy',
        startTime = Date.now();

    log.start(taskName, startTime);

    filePath = filePath || config.srcDir + '**/*.wxml';
    return gulp.src([filePath, `!${config.srcDir}dev-resource/**/*`], {
            base: config.srcDir
        })
        .pipe(gulp.dest(config.outDir))
        .on('end', () => {
            const endTime = Date.now(),
                time = endTime - startTime;
            log.finish(taskName, endTime, time);
        });
}
// 拷贝 json
const JSONCopy = (filePath) => {
    const taskName = 'JSONCopy',
        startTime = Date.now();

    log.start(taskName, startTime);

    filePath = filePath || config.srcDir + '**/*.json';
    return gulp.src([filePath, `!${config.srcDir}dev-resource/**/*`], {
            base: config.srcDir
        })
        .pipe(gulp.dest(config.outDir))
        .on('end', () => {
            const endTime = Date.now(),
                time = endTime - startTime;
            log.finish(taskName, endTime, time);
        });
}

// 拷贝需要打包的资源文件
const AssetsCopy = (filePath) => {
    const taskName = 'AssetsCopy',
        startTime = Date.now();

    log.start(taskName, startTime);

    filePath = filePath || config.srcDir + 'assets/**/*';
    return gulp.src(filePath)
        .pipe(gulp.dest(`${config.outDir}assets`))
        .on('end', () => {
            const endTime = Date.now(),
                time = endTime - startTime;
            log.finish(taskName, endTime, time);
        });
}

// 图片压缩 src/dev-resource/icon-image/ -> src/dev-resource/icon-image-min/
gulp.task('Imagemin', () => {
    return gulp.src(`${config.srcDir}dev-resource/image/**/*`)
        .pipe($.imagemin())
        .pipe(gulp.dest(`${config.srcDir}dev-resource/image-min`))
});


// 清空 dist 目录
gulp.task('clean', () => {
    return gulp.src(`${config.outDir}*`)
        .pipe($.clean())
});


gulp.task('start', ['clean','Imagemin'], () => {
    WXMLCopy();
    JSONCopy();
    SCSSCompile();
    TSCompile();
    ES6Transpile();
    AssetsCopy();

    const reg = new RegExp('(' + config.srcDir + '.*)');

    // 监视 wxml 文件变动
    gulp.watch([`${config.srcDir}**/*.wxml`, `!${config.srcDir}dev-resource/**/*`],
        event => {
            const taskName = 'WXMLCopy';
            log.watch(event.path.match(reg)[0], event.type, taskName);
            WXMLCopy();
        }
    );
    // 监视 json 文件变动
    gulp.watch([`${config.srcDir}**/*.json`, `!${config.srcDir}dev-resource/**/*`],
        event => {
            const taskName = 'JSONCopy';
            log.watch(event.path.match(reg)[0], event.type, taskName);
            JSONCopy();
        }
    );
    // 监视 scss 文件变动
    gulp.watch([`${config.srcDir}**/*.scss`, `!${config.srcDir}dev-resource/**/*`],
        event => {
            const taskName = 'SCSSCompile';
            log.watch(event.path.match(reg)[0], event.type, taskName);
            SCSSCompile(event.path);
        }
    );
    // 监视 ts 文件变动
    gulp.watch([`${config.srcDir}**/*.ts`, `!${config.srcDir}dev-resource/**/*`],
        event => {
            const taskName = 'TSCompile';
            log.watch(event.path.match(reg)[0], event.type, taskName);
            TSCompile(event.path);
        }
    );
    // 监视 js 文件变动
    gulp.watch([`${config.srcDir}**/*.js`, `!${config.srcDir}dev-resource/**/*`],
        event => {
            const taskName = 'ES6Transpile';
            log.watch(event.path.match(reg)[0], event.type, taskName);
            ES6Transpile(event.path);
        }
    );
    // 监视资源文件变动
    gulp.watch([`${config.srcDir}assets/**/*`],
        event => {
            const taskName = 'AssetsCopy';
            log.watch(event.path.match(reg)[0], event.type, taskName);
            AssetsCopy(event.path);
        }
    );

    // 监视开发资源下的图片文件变动，执行压缩
    gulp.watch([`${config.srcDir}dev-resource/image/**/*`], ['Imagemin']);
});