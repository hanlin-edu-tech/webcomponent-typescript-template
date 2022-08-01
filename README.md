# webcomponent-typescript-template

開發 WebComponent 的模板專案

## 基礎環境介紹
- 使用 TypeScript 作為主要語言 **gulpfile 保留 js，方便 UI、UX 需要時更新**
- 內建 Live Update 的開發環境，Code 變動馬上能在瀏覽器看到效果，不需重新載入
- 完善的構建 Pipeline，`自動化 src -> ts 轉 js -> 合併成一個文件 -> babel 支援多瀏覽器 -> 混淆 uglify`

## 開始使用
1. 首先複製此專案
```
git clone git@github.com:hanlin-edu-tech/webcomponent-typescript-template.git
```
2. 使用 [nvm](https://github.com/nvm-sh/nvm) 切換到正確的 node 版本
```
nvm use
```
3. 安裝依賴項目
```
npm install
```
4. 啟動開發環境
```
gulp dev
```
5. 完畢！記得閱讀下方文件說明，Happy Coding!

## 參數設定
所有可自訂化的環境變數皆獨立寫在 `env.js` 中，包含 gcp 上傳的機器、bundle 後的文件名稱...等


## 放置私密資料
所有 key 文件建議放置於 credential 資料夾，該位置已經過處理，除了 README.txt 外都不會被 push 上去

## 開發
使用 gulp 搭配 browser sync 達成 live reload 功能，以下指令可開啟開發模式
```
gulp dev
```

## 構建說明
若需要 Local Build，有幾個 Pipeline

- `gulp build` 初步將程式碼打包，Ts 轉 Js 後輸出到 `build` 資料夾 (通常這是為了開發用，`dev` pipeline 中也包含此段 Task)
- `gulp productionBuild` 除執行 `build` 外，還會加上 uglify、minify 等步驟混淆、最小化程式碼後輸出到 `dist` 資料夾
- `gulp uploadToGcs` 則會將 `dist` 資料夾中的內容上傳 Google Cloud Storage

## Github Action Pipeline
因為每個 Component 的 Github Action 可能不同，所以此專案不提供 workflow 檔案。不過在 `package.json` 中提供了 `buildAndUpload` 的 Task，方便建置自動化時使用。
```
npm run buildAndUpload
```