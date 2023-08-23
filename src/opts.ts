import cli from "command-line-args";

export type Opts = {
    args?: string[],
    pwd?: string,
    config?: string,

}

export default function getOpts(): Opts {
    const opts: Opts = {};
    return cli([{
        name: "args",
        defaultOption: true,
        multiple: true
    }, {
        name: "config",
        alias: "c",
        type: String
    }, {
        name: "pwd",
        alias: "p",
        type: String
    }]) as Opts;
}