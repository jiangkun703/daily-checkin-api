# Daily Checkin API - 部署指南

## 🚀 部署状态

✅ **GitHub仓库准备完成**
- 仓库地址：https://github.com/jiangkun703/daily-checkin-api
- 分支：main
- 状态：包含所有必要文件

✅ **API代码已上传**
- 核心文件：`vercel/api/simple.js`
- 配置文件：`vercel.json`, `package.json`
- 文档：`README.md`

## 📋 Vercel部署步骤

### 方法1：通过Vercel网站部署（推荐）

1. **访问Vercel部署页面**：
   ```
   https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjiangkun703%2Fdaily-checkin-api
   ```

2. **登录Vercel账号**（使用GitHub账户）

3. **配置项目**：
   - 项目名称：`daily-checkin-wechat`（或任何其他可用名称）
   - 框架预设：`Other`（Vercel会自动检测）
   - 根目录：`./`（保持默认）
   
4. **点击"Deploy"按钮**

5. **等待部署完成**（约1-2分钟）

### 方法2：通过Vercel控制台部署

1. 访问：https://vercel.com/dashboard
2. 点击"Add New..." → "Project"
3. 搜索并选择：`jiangkun703/daily-checkin-api`
4. 点击"Import"
5. 配置项目设置
6. 点击"Deploy"

## 🔧 API测试

部署成功后，测试API：

### 1. 基础测试
```
GET https://[你的项目名称].vercel.app/api/simple?msg=签到&userId=user001&userName=测试用户
```

### 2. 完整测试
```
GET https://[你的项目名称].vercel.app/api/simple?msg=签到&userId=wx12345&userName=张三&format=groupchat
```

### 3. 参数说明
- `msg`：必填，包含"签到"或"打卡"
- `userId`：用户唯一ID（可选，默认"user001"）
- `userName`：用户名（可选，默认"用户"）
- `format`：输出格式（可选，`simple` 或 `groupchat`，默认`simple`）

## 📱 微信集成

### API响应格式

#### simple格式（默认）：
```
[张三]签到成功

连续：15天
积分：+25分
物品：福袋
数字：42
颜色：金

连续7天奖励🎉
```

#### groupchat格式：
```
张三 签到成功 ⭐⭐

📅 连续签到：15天
💰 获得积分：+25分
🎁 幸运物品：福袋
🔢 幸运数字：42
🎨 幸运颜色：金

连续7天奖励🎉

✅ 签到完成！
```

## 🔒 环境变量

当前无需配置环境变量。如需存储用户签到数据，可添加：
- `DATABASE_URL`：数据库连接字符串
- `REDIS_URL`：Redis连接字符串

## 📊 监控与日志

- Vercel Dashboard → 查看部署日志
- GitHub Actions → 自动部署配置
- 错误监控：Vercel内置错误追踪

## 🛠️ 本地开发

```bash
# 克隆仓库
git clone https://github.com/jiangkun703/daily-checkin-api.git

# 安装依赖
npm install

# 本地测试
npm run dev

# 构建
npm run build
```

## 📞 支持

如有问题，请检查：
1. Vercel部署日志
2. GitHub仓库状态
3. API参数是否正确

或联系：jiangkun703