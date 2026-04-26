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

        let fgTileset;
        let bgTileset;

        try {
            fgTileset = await this.dataloader.importTileset('appearancetest');
        } catch (error) {
            console.log(error);
        }

        try {
            bgTileset = await this.dataloader.importTileset('bgappearancetestdark');
        } catch (error) {
            console.log(error);
        }
        
        let fgTilesetMap = await this.dataloader.importTilesetMap('level1fgtilemap');
        
        this.view.renderMap(gridmap, fgTileset, fgTilesetMap, bgTileset);
    }
}