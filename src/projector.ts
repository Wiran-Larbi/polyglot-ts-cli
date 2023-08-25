import fs from "fs"
import path from "path"
import {Config} from "./config";

export type Data = {
    projector: {
        // key -> value
        [key: string]: {
            [key: string]: string
        }
    }
};

const defaultData: Data = {
    projector: {}
};

export default class Projector {

    constructor(private config: Config,private data: Data){}

    static fromConfig(config: Config): Projector {
        if (fs.existsSync(config.config)) {
            let data;

            try {
                data = JSON.parse(fs.readFileSync(config.config).toString());
                
            } catch (error) {
                data = defaultData;
            }
            return new Projector(config,data);
        }

        return new Projector(config,defaultData);
    }

    getValueAll(): {[key:string]:string} {
        
        let curr: string = this.config.pwd;
        let prev: string = "";
        // let out: Record<string,string> = {};
        const paths: string[] = [];

        do {
            prev = curr;
            paths.push(curr);
            curr = path.dirname(curr);
        } while (curr != prev);

        return paths.reverse().reduce((acc, path) => {
            const value = this.data.projector[path];
            if (value) {
                Object.assign(acc, value);
            }

            return acc;
        }, {});
    }

    getValue(key: string): string | undefined {

        let curr: string = this.config.pwd;
        let prev: string = "";
        let out: string | undefined = undefined;

        do {
            const value = this.data.projector[curr]?.[key];
            if (value) {
                out = value;
                break;
            }
            prev = curr;
            curr = path.dirname(curr);
        } while (curr != prev);

        return out;
    }

    setValue(key: string, value: string): void {
        let dir = this.data.projector[this.config.pwd];
        if (!dir) {
            dir = this.data.projector[this.config.pwd] = {};
        }
        dir[key] = value;
    }

    removeValue(key: string) : void {
        let dir = this.data.projector[this.config.pwd];
        if (dir) {
            delete dir[key];
        }
    }
}