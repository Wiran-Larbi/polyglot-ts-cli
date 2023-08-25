import { Operation } from "../config"
import Projector from "../projector"
import { Data } from "../projector"

function getData(): Data{
    return {
        projector: {
            "/": {
                "foo": "bar1",
                "fem": "is_great",
            },
            "/foo": {
                "foo": "bar2",
            },
            "/foo/bar": {
                "foo": "bar3",
            }
        }
    }
};

function getProjector(pwd: string, data = getData()): Projector {
    return new Projector({
        args: [],
        operation: Operation.Print,
        pwd,
        config: "Hello, Ther 🌟"
    }, data);
}

test("getValueAll", function() {
    const projector = getProjector("/foo/bar");
    expect(projector.getValueAll()).toEqual({
        "fem": "is_great",
        "foo": "bar3",
    })
});
test("getValue", function() {
    let projector = getProjector("/foo/bar");
    expect(projector.getValue("foo")).toEqual("bar3");

    projector = getProjector("/foo");
    expect(projector.getValue("foo")).toEqual("bar2");
    expect(projector.getValue("fem")).toEqual("is_great");

});
test("setValue", function() {
    let data = getData();
    let projector = getProjector("/foo/bar", data);
    projector.setValue("foo", "baz");
    
    expect(projector.getValue("foo")).toEqual("baz");
    projector.setValue("fem", "is_even_greater");
    expect(projector.getValue("fem")).toEqual("is_even_greater");

    projector = getProjector("/", data);
    expect(projector.getValue("fem")).toEqual("is_great");
});
test("removeValue", function() {
    const projector = getProjector("/foo/bar");
    projector.removeValue("fem");
    
    expect(projector.getValue("fem")).toEqual("is_great");

    projector.removeValue("foo");
    expect(projector.getValue("foo")).toEqual("bar2");
});