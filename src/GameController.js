export default class GameController {

    constructor(game, view, dataloader) {
        // Game Logic //
        this.game = game;

        // View //
        this.view = view;

        // Data Loader //
        this.dataloader = dataloader;

        // Used to increment time for various game elements
        this.startTime = performance.now();
    }

    async setup() {
        // TEST DATA FOR LOADING & RENDERING MAPS //
        let gridmap = await this.dataloader.importGridmap('level1grid');
        gridmap = this.dataloader.parseMapData(gridmap);

        let fgTileset;
        let bgTileset;

        try {
            fgTileset = await this.dataloader.importTileset('appearancetest');
        } catch (error) {
            console.log(error);
        }

        try {
            bgTileset = await this.dataloader.importTileset('bgappearancetest');
        } catch (error) {
            console.log(error);
        }
        
        let fgTilesetMap = await this.dataloader.importTilesetMap('level1fgtilemap');
        
        this.view.renderMap(gridmap, fgTileset, fgTilesetMap, bgTileset);

        this.renderLoop();
    }

    // Temp render loop to test shader patterns
    renderLoop = () => {
        const time = (performance.now() - this.startTime) * 0.001;

        this.view.updateShader(time);

        requestAnimationFrame(this.renderLoop);
    }
}