# CleanCopy for Safari

按 **⌘⇧C** 複製目前頁面的乾淨網址，像 Arc 的 Copy Current URL，但順手拿掉追蹤參數。

## 功能

- 快捷鍵 **⌘⇧C** 複製目前分頁網址
- 移除常見追蹤參數：`utm_*`、`fbclid`、`gclid`、`msclkid`、`mc_eid` 等
- 針對 YouTube、Spotify、Amazon、X、Google 清理已知的分享追蹤參數
- 保留搜尋字詞、影片時間、商品選項等正常參數
- 顯示 3.5 秒提示，告知移除了幾個追蹤參數
- 只要求 `activeTab` 與 `scripting`，沒有常駐讀取所有網站的權限
- 無遙測、無網路請求、無第三方套件

## 需求

- macOS 與 Safari 16.4+
- Xcode（建置用）

## 建置與安裝

```bash
npm test          # 網址清理邏輯測試
./package-safari.sh
```

接著：

1. 開啟 `safari-app/CleanCopy/CleanCopy.xcodeproj`。
2. 在 **Signing & Capabilities** 選擇你的 Team（免費 Personal Team 即可）。
3. 建置並執行 CleanCopy。
4. 到 **Safari → 設定 → 擴充功能** 啟用 CleanCopy。

### 未簽署建置

若使用臨時簽署（Sign to Run Locally），Safari 預設不會顯示該擴充功能。需要：

1. **Safari → 設定 → 進階 → 顯示網頁開發者功能**
2. **開發 → 允許未簽署的擴充功能**

這個設定會在 Safari 離開後失效，因此建議使用 Team 簽署。

## 自訂追蹤參數

清理規則集中在 `extension/clean-url.js`：

- `TRACKING_PARAMETERS`：完全比對的參數名稱
- `TRACKING_PREFIXES`：前綴比對
- `isTrackingParameter`：特定網站規則

修改後執行 `npm test`。

## 授權

MIT
