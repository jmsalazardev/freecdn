export class Photo {
    type: string;
    id: string;
    url: string;
    name: string;
    width: number;
    height: number;

    constructor (id: string, url: string, name: string, width: number,  height: number) {
        
        this.type = "Photo";
        this.id = id;
        this.url = url;
        this.name = name;
        this.width = width;
        this.height=height;
    }

    toString() {
        return JSON.stringify(this);
    }
}
