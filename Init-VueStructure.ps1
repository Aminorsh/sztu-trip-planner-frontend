$root = "src"

$dirs = @(
  "$root\assets\images",
  "$root\assets\styles",
  "$root\components\base",
  "$root\components\layout",
  "$root\components\map",
  "$root\views",
  "$root\views\Auth",
  "$root\router",
  "$root\store",
  "$root\services",
  "$root\composables",
  "$root\utils"
)

# 创建目录
foreach ($d in $dirs) {
  New-Item -ItemType Directory -Force -Path $d | Out-Null
}

# 创建视图页面 Vue 文件
$filePaths = @(
  "$root\views\Home.vue",
  "$root\views\Dashboard.vue",
  "$root\views\TripDetail.vue",
  "$root\views\PlaceSearch.vue",
  "$root\views\PlaceDetail.vue",
  "$root\views\ShareTrip.vue",
  "$root\views\ExportPanel.vue",
  "$root\views\Notifications.vue",
  "$root\views\Profile.vue",
  "$root\views\Auth\Login.vue",
  "$root\views\Auth\Register.vue",
  "$root\views\Auth\ForgotPassword.vue",
  "$root\App.vue",
  "$root\main.js",
  "$root\router\index.js",
  "$root\store\index.js",
  "$root\store\user.js",
  "$root\store\trip.js",
  "$root\store\notification.js",
  "$root\services\apiClient.js",
  "$root\services\authService.js",
  "$root\services\tripService.js",
  "$root\services\placeService.js",
  "$root\services\exportService.js",
  "$root\services\notificationService.js",
  "$root\composables\useAuth.js",
  "$root\composables\useTrip.js",
  "$root\composables\useMap.js",
  "$root\composables\useNotifications.js",
  "$root\utils\dateUtils.js",
  "$root\utils\geoUtils.js",
  "$root\utils\helpers.js",
  "$root\assets\styles\global.css"
)

foreach ($f in $filePaths) {
  New-Item -ItemType File -Force -Path $f | Out-Null
}

# ... existing code ...
#Write-Host "目录与空文件结构已创建。"
