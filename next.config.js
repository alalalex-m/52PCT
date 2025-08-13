/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 启用静态导出
  basePath: '/52PCT',  // 设置基本路径为仓库名
  images: {
    unoptimized: true,  // 对于静态导出，图像需要未优化
  },
};

module.exports = nextConfig; 