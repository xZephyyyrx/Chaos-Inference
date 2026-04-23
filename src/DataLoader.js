export default class DataLoader {
    #filepathPrefix = '../data/';

    async importTextData(filename) {

        try {
            const response = await fetch(`${this.#filepathPrefix}config/${filename}.txt`);

            if (!response.ok) {
                throw new Error(`Failed to load ${filename}.txt!`);
            }

            return await response.text();
        } catch (error) {
            console.log(error);
        }
    }
}