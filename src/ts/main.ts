/// <reference path="libs/jquery.d.ts" />

namespace matium.startgulp {

	/**
	 * デバイスの種類を示す定数リスト
	 */
	export const DEVICE_SMP: string = "smp";
	export const DEVICE_TABLET: string = "tablet";
	export const DEVICE_DESKTOP: string = "desktop";
	export const DEVICE_XLARGE: string = "xlarge";

	/**
	 * メインクラス
	 */
	export class Main {

		// メディアクエリのブレイクポイントになるviewport幅
		static readonly SMP_WIDTH: number = 320;
		static readonly TABLET_WIDTH: number = 640;
		static readonly DESKTOP_WIDTH: number = 1024;
		static readonly XLARGE_WIDTH: number = 1600;

		// コンテンツの操作をするオブジェクト
		public contents: Contents;

		constructor() {
			this.contents = new Contents();
		}

		resize = ():void => {
			let winWidth: number = window.innerWidth;
			if (winWidth > Main.XLARGE_WIDTH) {
				// 大型ディスプレイおよびテレビ向けにコンテンツを入れ替える
				this.contents.setContents(DEVICE_XLARGE);
			}
			else if (winWidth > Main.DESKTOP_WIDTH) {
				// PC向けにコンテンツを入れ替える
				this.contents.setContents(DEVICE_DESKTOP);
			}
			else if (winWidth > Main.TABLET_WIDTH) {
				// タブレット端末向けにコンテンツを入れ替える
				this.contents.setContents(DEVICE_TABLET);
			}
			else {
				// スマートフォン向けにコンテンツを入れ替える
				this.contents.setContents(DEVICE_SMP);
			}
		};
	}

	/**
	 * コンテンツの操作をするためのクラス
	 */
	export class Contents {

		public $deviceImage: JQuery;
		public $deviceName: JQuery;
		public $viewportSize: JQuery;

		protected readonly SMP_IMAGE_URL: string = "images/device-image_smp.png";
		protected readonly TABLET_IMAGE_URL: string = "images/device-image_tablet.png";
		protected readonly DESKTOP_IMAGE_URL: string = "images/device-image_desktop.png";
		protected readonly XLARGE_IMAGE_URL: string = "images/device-image_xlarge.png";

		protected current: string = '';

		constructor() {
			this.$deviceImage = $('.device-image img');
			this.$deviceName = $('.mq-device-name');
			this.$viewportSize = $('.mq-viewport-size');
		}

		/**
		 * デバイスのタイプを渡してコンテンツの内容を入れ替えるメソッド
		 * @param {string} deviceType デバイスの種類を示す定数文字列
		 */
		public setContents(deviceType: string):void {
			if (this.current == deviceType) { return; }

			// 現在のデバイスの種類を書き換える
			this.current = deviceType;
			// デバイス種類によってコンテンツを入れ替える
			switch(this.current) {
				case DEVICE_SMP:
				this.changeDeviceImage(this.SMP_IMAGE_URL);
				this.changeDeviceName('SMART PHONE');
				this.changeViewportSize('(640〜320)');
				break;

				case DEVICE_TABLET:
				this.changeDeviceImage(this.TABLET_IMAGE_URL);
				this.changeDeviceName('TABLET');
				this.changeViewportSize('(1024〜641)');
				break;

				case DEVICE_DESKTOP:
				this.changeDeviceImage(this.DESKTOP_IMAGE_URL);
				this.changeDeviceName('DESKTOP');
				this.changeViewportSize('(1600〜1025)');
				break;

				case DEVICE_XLARGE:
				this.changeDeviceImage(this.XLARGE_IMAGE_URL);
				this.changeDeviceName('X-LARGE');
				this.changeViewportSize('(〜1601)');
				break;

				default:
				break;
			}
		}

		/**
		 * デバイスイメージの画像を変更する
		 * @param {string} imageUrl 変更する画像のURL
		 */
		protected changeDeviceImage(imageUrl: string):void {
			this.$deviceImage.attr('src', imageUrl);
		}

		/**
		 * デバイスの名前を変更する
		 * @param {string} deviceNameText 変更する文字列
		 */
		protected changeDeviceName(deviceNameText: string):void {
			this.$deviceName.text(deviceNameText);
		}

		/**
		 * デバイスのサイズを変更する
		 * @param {string} viewportSizeText 変更する文字列
		 */
		protected changeViewportSize(viewportSizeText: string):void {
			this.$viewportSize.text(viewportSizeText);
		}
	}
}


let main: matium.startgulp.Main;
let resizer: any;
/**
 * メインクラスをマウントして、リサイズイベントにリスナーをセット
 */
$(function(){
	main = new matium.startgulp.Main();

	// リサイズタイマーをセット
	$(window).resize(() => {
		if (resizer !== false) {
			clearTimeout(resizer);
		}
		resizer = setTimeout(() => {
			main.resize();
		}, 100);
	});

	// 一度、リサイズ処理をしてコンテンツをセットする
	main.resize();
});
