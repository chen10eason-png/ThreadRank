# Threads Trend Radar V1

GitHub Pages 可直接開啟的前端原型，包含：

- Top 20 排行
- 1小時 / 1天 / 1週 / 1個月 / 6個月 / 1年 / 5年 / 10年 / 全部
- 爆紅 / 瀏覽 / 按讚 / 留言 / 分享
- 全球 / 台灣 / 美國 / 日本 / 韓國
- 主題與關鍵字篩選
- Rising / Trend Score 架構
- Supabase 每小時快照資料表
- GitHub Actions 每小時排程

## 目前 V1 的資料狀態

網站預設使用 `data/sample-posts.json` 示範資料，因此介面會明確顯示 `DEMO MODE`。
這不是 Threads 真實全站排行榜。

原因是官方 Threads API 並不提供完整公開平台 firehose；正式版必須接上專案可合法使用的資料來源。

## GitHub Pages 測試

1. 把整個資料夾內容上傳到 GitHub repository 根目錄。
2. GitHub → Settings → Pages。
3. Source 選 `Deploy from a branch`。
4. Branch 選 `main` / `(root)`。
5. 儲存後即可使用。

## Supabase

到 Supabase SQL Editor 執行：

`supabase/01_schema.sql`

會建立：
- `threads_posts`
- `post_snapshots`
- `latest_post_metrics`

## 每小時更新

`.github/workflows/hourly-refresh.yml` 已設定每小時執行一次。
正式使用前，需要在 GitHub repository Secrets 加入：

- `THREADS_ACCESS_TOKEN`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

注意：`scripts/fetch-threads.mjs` 現階段是資料供應商 adapter placeholder，尚未偽裝成可抓全 Threads 的爬蟲。

## 下一版建議

V1.1：接 Supabase、建立 API endpoint、加入真實快照折線圖與首次進榜紀錄。
V1.2：接合法 Threads 資料來源、加入作者排行榜與通知。
