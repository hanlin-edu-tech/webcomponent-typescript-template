export {}

declare global {
    interface Window {
        eHanlin: {
            dataprovider: {
                exampleApi: ExmapleApi
            }
        }
    }
}

interface ExmapleApi {
    exampleApiMethod: () => void
}

class ExampleAPIImpl implements ExmapleApi {
    exampleApiMethod(): void {
    }
}

if (window.eHanlin === undefined || window.eHanlin === null) {
    window.eHanlin = {
        dataprovider: {
            exampleApi: new ExampleAPIImpl()
        }
    };
}