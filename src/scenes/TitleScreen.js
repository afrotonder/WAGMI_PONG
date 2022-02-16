import Phaser from 'phaser'

import WebFontFile from './WebFontFile'

import * as SceneKeys from '../constants/SceneKeys'


export default class TitleScreen extends Phaser.Scene {
    preload() {
        const fonts = new WebFontFile(this.load, 'Press Start 2P')
        this.load.addFile(fonts)
        
    }


    create() {
        const title = this.add.text(400, 200, 'WAGMI PONG',
            {
                fontSize: 50,
                fontFamily: SceneKeys.Font
            }).setOrigin(0.5, 0.5)

            const subTitle = this.add.text(400, 300, 'Connect Wallet',
            {
                fontSize: 22,
                fontFamily: SceneKeys.Font
            }).setOrigin(0.5, 0.5)


            this.input.keyboard.once('keydown-SPACE', () => {
                console.log('s[ace');
                this.scene.start(SceneKeys.Game)
            } )
    }

}