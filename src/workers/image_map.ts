export default class ImageMap {
    public bytes: number;
    constructor(
        public name: string,
        public width: number,
        public height: number,
        public data: Uint8ClampedArray
    ) {
        this.bytes = data.length;
    }

    /**
     * channels
     */
    public channels() {
        let channels: 1 | 2 | 3 | 4 = 1;
        let c = this.bytes / this.width / this.height;
        if (c > 4) {
            channels = 4;
        } else if (c < 1) {
            channels = 1;
        } else {
            channels = c as 1 | 2 | 3 | 4;
        }
        return channels;
    };

}