// 例如计算两点经纬度距离（大圆距离公式，千米单位）
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const toRad = x => (x * Math.PI) / 180
  const R = 6371  // 地球半径（千米）
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c  // 返回千米距离
}
