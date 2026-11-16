# sub-store-deploy（个人自用部署）

把 Sub-Store 后端部署到 Abasthan 免费档的包装仓库。

## 来源

- 程序本体 `sub-store.bundle.js` 是 Sub-Store 官方发布文件，取自 https://github.com/sub-store-org/Sub-Store/releases/tag/2.44.16 ，版本 2.44.16，许可证 AGPL-3.0，未做任何修改。
- 本仓库只额外提供 `package.json` 与 `launcher.js` 两个包装文件。

## 为什么需要 launcher.js

官方 bundle 固定监听 3000 端口且不读 PORT 环境变量。launcher.js 先拉起 bundle；当平台通过 PORT 分配了其他端口时，再起一个本地反向代理把平台端口转发到 3000。

## 运行所需环境变量

- `SUB_STORE_FRONTEND_BACKEND_PATH`：后端访问路径（相当于访问口令），部署时单独设置，不写在本仓库里。
