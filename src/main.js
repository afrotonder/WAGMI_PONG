import Phaser, { Scene } from 'phaser'

import TitleScreen from './scenes/TitleScreen'
import Game from './scenes/Game'
import GameBackground from './scenes/GameBackground'
import GameOver from './scenes/GameOver'
import Preload from './scenes/Preload'
import * as SceneKeys from './constants/SceneKeys'
import Moralis from 'moralis/dist/moralis.min.js';
// WAGMI
var wagmiballz = []

const config = {
    width: 800,
    height: 500,
    type: Phaser.AUTO, // WEB GL OR CANVAS
    // backgroundColor: 'none',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0}
        }
    }
}

// start engine
const game = new Phaser.Game(config)
// load scenes
game.scene.add(SceneKeys.TitleScreen, TitleScreen)
game.scene.add(SceneKeys.Game, Game)
game.scene.add(SceneKeys.GameBackground, GameBackground)
game.scene.add(SceneKeys.GameOver, GameOver)
game.scene.add(SceneKeys.Preload, Preload)


// game.scene.start('titleScreen')

game.scene.start(SceneKeys.Preload)


async function getUserNFTs(address) {

    try {
        console.log('address ', address);
        
        // moralis server URL
        const serverUrl = "https://vq0bmxygbla7.usemoralis.com:2053/server"

        //  // moralis server appID
        const appId = "QjBQlVqdFSsul0PyHOVlzvayekf4HQGOG8ZPYII2"
        
        //  // start moralis engine
        Moralis.start({ serverUrl, appId });

        const options = { chain: 'matic', address: address };
        const polygonNFTs = await Moralis.Web3API.account.getNFTs(options);

        // console.log(polygonNF?Ts);


        for (let asset of polygonNFTs.result) {
            let nft = JSON.parse(asset.metadata)
            if (!!nft) {
                // console.log(nft.name.toString() );
                if (nft.name.includes('PixelMiibs')) {
                    // console.log('WOWOWOWOWOWOWOWOWOWO');
                    wagmiballz.push(nft)

                }
            }
        }

        if (wagmiballz.length) {
            document.getElementsByClassName('tvContainer')[0].style.display = 'none'
            document.getElementsByClassName('connectWallet')[0].style.display = 'none'
            document.querySelectorAll('canvas')[0].style.display = 'flex'

        } else {
            alert('Plz go buy a wagmiball @ OpenSea!')
        }

        console.log(wagmiballz);

        // game.load.image('wagmiball', wagmiballz[0].image);


        // polygonNFTs.result.forEach(asset => {
        //     let nft = JSON.parse(asset.metadata)
        //     console.log(nft.name);

      

        // });

        // const opts = { address: "0x2953399124f0cbb46d2cbacd8a89cf0599974963", token_id: "92986716105997878495280914514219232026124040552936354403148946709141996437505", chain: "matic" };
        // const tokenIdMetadata = await Moralis.Web3API.token.getTokenIdMetadata(opts);

        // console.log(tokenIdMetadata);

    } catch (error) {
        console.log(error);
    }
    

}

// getUserNFTs()


document.getElementById('walletID').addEventListener('input', function(event) {
    console.log('EJE ', event.target.value.length);
    // console.log(document.getElementById('walletID'))
    if (event.target.value.length === 42) {
        getUserNFTs(event.target.value)
    }
})