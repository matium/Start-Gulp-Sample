// Gulp本体を読み込む
let gulp = require("gulp");
// Compassコンパイラ
let compass = require('gulp-compass');
// TypeScriptのコンパイラ
let typescript = require('gulp-typescript');
// コンパイラ後のJSを圧縮・最適化
let uglify = require('gulp-uglify');
// エラーによるGulpの監視とタスクがストップするのを防ぐ
let plumber = require('gulp-plumber');
// ブラウザの自動更新をする
let browserSync = require('browser-sync');


// 簡易サーバー（localhost:3001）を起動し、indexページをブラウザに表示する
gulp.task('browser-sync', function() {
	browserSync({
		port: 3001, // 起動するlocalhostサーバーへリクエストするポート番号
		server: {
			baseDir: "public_html/", //プロジェクト内のどのディレクトリをrootにするか
			index : "index.html" //Indexページの指定
		}
	});
});

// localhost:3001で表示しているページをリロードする
gulp.task('bs-reload', function () {
	browserSync.reload();
});


// SCSSファイルをコンパイルするタスク
gulp.task('compass', function(){
	gulp.src('scss/**/*.scss')
	.pipe(plumber())
	.pipe(compass({
		config_file: 'config.rb',
		comments: false,
		css: 'public_html/css/',
		sass: 'src/scss/'
	}));
});


// TypeScriptのコンパイル設定を読み込む設定
let tsProject = typescript.createProject('tsconfig.json');

// TypeScriptをコンパイルし、uglifyで圧縮
gulp.task('tscompile', function(){
	let tsResult = tsProject.src()
		.pipe(plumber())
		.pipe(tsProject());

	tsResult.js.pipe(plumber())
		.pipe(uglify({output: {comments: 'some'}}))
		.pipe(gulp.dest('./'));
});


// 監視タスクの実行
gulp.task('watch', function(){
	// SCSSファイルを監視しCompassコンパイルを実行
	gulp.watch('src/scss/**/*.scss', function(event) {
		gulp.run('compass');
	});

	// TSファイルを監視してTypeScriptコンパイルを実行
	gulp.watch('src/ts/**/*.ts', function(event){
		gulp.run('tscompile');
	});

	// HTMLファイルが更新されたらブラウザをリロード
	gulp.watch("public_html/**/*.html",    ['bs-reload']);

	// CSSファイルが更新されたらブラウザをリロード
	gulp.watch("public_html/css/*.css", ['bs-reload']);

	// JSファイルが更新されたらブラウザをリロード
	gulp.watch("public_html/js/*.js",   ['bs-reload']);
});


/* タスクの実行コマンド：gulp */
// gulpコマンドでデフォルトで実行されるメソッド
gulp.task('default', function(){
	// 簡易ブラウザの起動
	gulp.run('browser-sync');
	// 監視タスクの実行
	gulp.run('watch');
});
