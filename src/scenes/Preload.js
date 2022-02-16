import Phaser from 'phaser'
import WebFontFile from './WebFontFile'
import * as SceneKeys from '../constants/SceneKeys'
import * as Colors from '../constants/Colors'

export default class Preload extends Phaser.Scene {
    preload() {

        const fonts = new WebFontFile(this.load, 'Press Start 2P')
        this.load.addFile(fonts)

    }

    create() {
        this.scene.start(SceneKeys.TitleScreen)
    }
}