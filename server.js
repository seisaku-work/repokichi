const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- 1. データベース接続 ---
const MONGO_URI = process.env.MONGODB_URI; // これはRenderの環境変数で設定します
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB接続成功。日報データベースにアクセスしています。"))
  .catch(err => console.error("❌ MongoDB接続エラー:", err));

// --- 2. データ構造の定義（ここが新しい設計図です！） ---

// 【ユーザーモデル】役割（部署）を管理
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['制作課', '学生課', '管理者'], required: true }
});
const User = mongoose.model('User', userSchema);

// 【OCイベントモデル】追跡するOCを管理
const ocEventSchema = new mongoose.Schema({
    name: { type: String, required: true }, // 例: "2026年5月17日(日) OC"
    eventDate: { type: Date, required: true },
    isTracking: { type: Boolean, default: false }, // 現在追跡中か
    lastYearCount: { type: Number, default: 0 }, // 昨年の最終実績
});
const OcEvent = mongoose.model('OcEvent', ocEventSchema);

// 【OCエントリーモデル】学科・学年ごとの詳細な予約数
const ocEntrySchema = new mongoose.Schema({
    report: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
    ocEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'OcEvent' },
    campus: String,
    department: String,
    grade: String, // 高3生, 高2生, etc.
    type: String, // 新規, リピーター
    count: { type: Number, default: 0 }
});
const OcEntry = mongoose.model('OcEntry', ocEntrySchema);

// 【SNS統計モデル】
const snsStatSchema = new mongoose.Schema({
    report: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
    platform: String, // Instagram, TikTok
    campus: String,
    count: { type: Number, default: 0 }
});
const SnsStat = mongoose.model('SnsStat', snsStatSchema);

// 【出席項目モデル】「入試まるわかり講座」などを柔軟に管理
const attendanceSchema = new mongoose.Schema({
    report: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
    name: { type: String, required: true }, // "午前", "入試まるわかり講座" etc.
    count: { type: Number, default: 0 }
});
const Attendance = mongoose.model('Attendance', attendanceSchema);

// 【日報モデル】すべてを統括する中央司令塔
const reportSchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true },
    author_seisaku: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    author_gakusei: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    homepageOcReservations: { type: Number, default: 0 },
    remarks: String,
    // 各詳細データへのリンク
    snsStats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SnsStat' }],
    ocEntries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OcEntry' }],
    attendances: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' }],
}, { timestamps: true });
const Report = mongoose.model('Report', reportSchema);


// --- 3. サーバーの基本設定 ---
app.use(express.json()); // POSTリクエストのJSONを読めるようにする
app.use(express.static(path.join(__dirname, 'public'))); // publicフォルダを公開する

// --- 4. API（データの出入り口）定義 ---
// (ここに、これからPOSTやGETの処理をどんどん追加していきます)


// --- 5. サーバー起動 ---
app.listen(PORT, () => {
    console.log(`🚀 新生『レポきち』、ポート ${PORT} で起動準備完了。`);
});
