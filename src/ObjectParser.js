import Tile from "./Tile.js";

export default class ObjectParser {

    static directionKey = Object.freeze({
        TOPLEFT: 'topLeft',
        TOPCENTER: 'topCenter',
        TOPRIGHT: 'topRight',
        MIDLEFT: 'midLeft',
        MIDCENTER: 'midCenter',
        MIDRIGHT: 'midRight',
        BOTTOMLEFT: 'bottomLeft',
        BOTTOMCENTER: 'bottomCenter',
        BOTTOMRIGHT: 'bottomRight'
    });

    static parseObject(pos, char) {
        let tile;
        let direction;

        switch(char) {
            case '1':
                direction = ObjectParser.directionKey.BOTTOMLEFT;
                break;
            case '2':
                direction = ObjectParser.directionKey.BOTTOMCENTER;
                break;
            case '3':
                direction = ObjectParser.directionKey.BOTTOMRIGHT;
                break;
            case '4':
                direction = ObjectParser.directionKey.MIDLEFT;
                break;
            case '5':
                direction = ObjectParser.directionKey.MIDCENTER;
                break;
            case '6':
                direction = ObjectParser.directionKey.MIDRIGHT;
                break;
            case '7':
                direction = ObjectParser.directionKey.TOPLEFT;
                break;
            case '8':
                direction = ObjectParser.directionKey.TOPCENTER;
                break;
            case '9':
                direction = ObjectParser.directionKey.TOPRIGHT;
                break;
            default:
                direction = null;
                break;
        }

        if (direction === null) {
            tile = null;
        } else {
            tile = new Tile(pos, direction);
        }

        return tile;
    }
}