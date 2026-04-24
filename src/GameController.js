export default class GameController {

    constructor(game, view, dataloader) {
        // Game Logic //
        this.game = game;

        // View //
        this.view = view;

        // Data Loader //
        this.dataloader = dataloader;
    }

    async setup() {
        // TEST DATA FOR LOADING RENDERING MAPS //
        let mapData = await this.dataloader.importTextData('level1');
        mapData = this.dataloader.parseMapData(mapData);

        let tilesetData = await this.dataloader.importTilesetData('tempFgTileSheet.webp');
        this.view.renderMap(mapData, tilesetData);
    }
}