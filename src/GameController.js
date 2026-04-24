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
        // TEST DATA FOR LOADING & RENDERING MAPS //
        let gridmap = await this.dataloader.importText('level1grid');
        gridmap = this.dataloader.parseMapData(gridmap);

        let tileset;
        try {
            tileset = await this.dataloader.importTileset('appearancetest');
        } catch (error) {
            console.log(error);
        }
        
        let tilesetMap = await this.dataloader.importTilesetMap('level1tilemap');
        
        this.view.renderMap(gridmap, tileset, tilesetMap);
    }
}