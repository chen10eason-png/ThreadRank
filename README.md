# ThreadRank V3

這是重新設計的 ThreadRank 響應式網站版本。

## 這版重點

- 電腦版：保留深色 + 螢光綠品牌風格，但比舊版更簡潔
- 手機版：獨立資訊層級，不是單純把桌面版縮小
- Top 3 熱門串文卡片
- Top 20 排行榜
- 1小時 / 1天 / 1週 / 1個月 / 6個月 / 1年 / 5年 / 10年 / 全部
- 爆紅 / 瀏覽 / 按讚 / 留言 / 分享
- 搜尋、地區、主題篩選
- 手機底部導覽列
- GitHub Pages 可直接部署

## 使用方法

把此資料夾全部內容上傳到 GitHub repository 根目錄，開啟 GitHub Pages 即可。

## 資料狀態

目前仍使用 `data/sample-posts.json` 的 DEMO 資料，並未宣稱是 Threads 全站真實排行。
正式版可沿用 `supabase/01_schema.sql` 與 `scripts/fetch-threads.mjs` 串接合法資料來源。
