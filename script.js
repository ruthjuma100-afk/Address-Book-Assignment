// mini TDD helpers
function test(description, fn) {
    try {
        fn();
         console.log(description);
    } catch (error) {
         console.error(description);
         console.error(error.message);
    }
}

function expect(value) {
    return {
        toBe(expected) {
            if (value !== expected) {
                throw new Error(`${value} is not ${expected}`);
            }
        },
        toEqual(expected) {
            if (JSON.stringify(value) !== JSON.stringify(expected)) {
                throw new Error("Values are not equal");
            }
        },
        toBeDefined() {
            if (value === undefined) {
                throw new Error("Value is undefined");
            }
        },
        toBeType(type) {
            if (typeof value !== type) {
                throw new Error(`Expected ${type}, got ${typeof value}`);
            }
        }
    };
}