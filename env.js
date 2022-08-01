//這裡必須輸入所有 typescript 的文件
exports.TS_SOURCE_LIST = [
    "src/ts/example-component.ts",
    "src/dataprovider/data-provider.ts"
];

//將所有 typescript 整合且 browserify 後的文件名稱 (通常不必變化)
exports.TS_OUT = "bundle.js";


exports.ALPHA_MACHINE = {
    projectId: 'a-alpha-312605',
    bucketName: 'a-dev-apps',
    keyFilePath: 'alpha.json',
    gcsPath: 'app/widget/loading-widget/'
};

exports.TUTOR_TEST_MACHINE = {
    projectId: 'tutor-test',
    bucketName: 'tutor-test-apps',
    keyFilePath: 'tutor-test.json',
    gcsPath: 'app/widget/loading-widget/'
};