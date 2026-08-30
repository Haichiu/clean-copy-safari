#!/bin/zsh
set -euo pipefail

root=${0:A:h}
output="$root/safari-app"

if xcrun --find safari-web-extension-packager >/dev/null 2>&1; then
  tool=safari-web-extension-packager
elif xcrun --find safari-web-extension-converter >/dev/null 2>&1; then
  tool=safari-web-extension-converter
else
  print -u2 "需要安裝完整 Xcode，並將 xcode-select 指向 Xcode.app。"
  exit 1
fi

xcrun "$tool" \
  "$root/extension" \
  --project-location "$output" \
  --app-name CleanCopy \
  --bundle-identifier "${BUNDLE_ID:-com.haichiu.CleanCopy}" \
  --swift \
  --macos-only \
  --copy-resources \
  --no-open \
  --no-prompt \
  --force

print "已產生 Safari 專案："
find "$output" -name '*.xcodeproj' -maxdepth 4 -print
