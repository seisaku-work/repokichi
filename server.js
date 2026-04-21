const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- 1. データベース接続 ---
const MONGO_URI = process.env.MONGODB_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB接続成功。日報データベースにアクセスしています。"))
  .catch(err => console.error("❌ MongoDB接続エラー:", err));

// --- 2. データ構造の定義 ---
// (ここは変更ありません)
const userSchema = new mongoose.Schema({ name: { type: String, required: true }, email: { type: String, required: true, unique: true }, password: { type: String, required: true }, role: { type: String, enum: ['制作課', '学生課', '管理者'], required: true } });
const User = mongoose.model('User', userSchema);
const ocEventSchema = new mongoose.Schema({ name: { type: String, required: true }, eventDate: { type: Date, required: true }, isTracking: { type: Boolean, default: false }, lastYearCount: { type: Number, default: 0 } });
const OcEvent = mongoose.model('OcEvent', ocEventSchema);
const ocEntrySchema = new mongoose.Schema({ report: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' }, ocEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'OcEvent' }, campus: String, department: String, grade: String, type: String, count: { type: Number, default: 0 } });
const OcEntry = mongoose.model('OcEntry', ocEntrySchema);
const snsStatSchema = new mongoose.Schema({ report: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' }, platform: String, campus: String, count: { type: Number, default: 0 } });
const SnsStat = mongoose.model('SnsStat', snsStatSchema);
const attendanceSchema = new mongoose.Schema({ report: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' }, name: { type: String, required: true }, count: { type: Number, default: 0 } });
const Attendance = mongoose.model('Attendance', attendanceSchema);
const reportSchema = new mongoose.Schema({ date: { type: Date, required: true, unique: true }, author_seisaku: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, author_gakusei: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, homepageOcReservations: { type: Number, default: 0 }, remarks: String, snsStats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SnsStat' }], ocEntries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OcEntry' }], attendances: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' }], }, { timestamps: true });
const Report = mongoose.model('Report', reportSchema);


// --- 3. サーバーの基本設定 ---
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- 4. API（データの出入り口）定義 ---

// ★★★【新機能】日報を新規作成するためのAPI ★★★
app.post('/api/reports', async (req, res) => {
  try {
    // まずは送られてきたデータで、日報の「殻」だけを作成します。
    // （将来的には、SNSやOCエントリーの詳細データもここで一緒に保存します）
    const newReport = new Report({
      date: req.body.date,
      homepageOcReservations: req.body.homepageOcReservations,
      // snsFollowersは、実際にはSnsStatモデルに保存するので、ここでは直接保存しません。
      // remarks: req.body.remarks,
    });

    await newReport.save(); // データベースに保存

    // 成功したことをフロントエンドに伝える
    res.status(201).json({ success: true, message: '日報が正常に保存されました。', data: newReport });

  } catch (error) {
    console.error("日報の保存中にエラーが発生しました:", error);
    // 失敗したことをフロントエンドに伝える
    res.status(500).json({ success: false, message: 'サーバー側でエラーが発生しました。', error: error.message });
  }
});


// --- 5. サーバー起動 ---
app.listen(PORT, () => {
    console.log(`🚀 新生『レポきち』、ポート ${PORT} で起動準備完了。`);
});
