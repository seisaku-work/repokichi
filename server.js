const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const xlsx = require('xlsx'); // ★ この行が主役です

const app = express();
const PORT = process.env.PORT || 3000;

// --- ファイルアップロード設定 ---
const upload = multer({ storage: multer.memoryStorage() });

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

// [POST] /api/reports (日報保存用API - 今回は変更なし)
app.post('/api/reports', async (req, res) => {
  try {
    const newReport = new Report({
      date: req.body.date,
      homepageOcReservations: req.body.homepageOcReservations,
    });
    await newReport.save();
    res.status(201).json({ success: true, message: '日報が正常に保存されました。', data: newReport });
  } catch (error) {
    console.error("日報の保存中にエラーが発生しました:", error);
    res.status(500).json({ success: false, message: 'サーバー側でエラーが発生しました。', error: error.message });
  }
});


// [POST] /api/import (Excelインポート用API)
app.post('/api/import', upload.single('excelFile'), async (req, res) => {
    console.log('--- 🚚 Excelファイル受信開始 ---');

    if (!req.file) {
        console.log('❌ ファイルがアップロードされませんでした。');
        return res.status(400).json({ success: false, message: 'ファイルが選択されていません。' });
    }

    try {
        console.log(`📄 ファイル名: ${req.file.originalname}`);

        // ★★★ ここからが今回の修正部分です ★★★
        console.log('--- 📖 Excelファイル解析開始 ---');

        // 1. アップロードされたファイルデータを読み込む
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });

        // 2. 最初のシートの名前を取得する
        const sheetName = workbook.SheetNames[0];
        console.log(`🔍 最初のシート名: "${sheetName}" を解析します。`);
        const worksheet = workbook.Sheets[sheetName];

        // 3. シートの内容をJSON形式に変換する
        //    (Excelの1行目が、JSONのキーになります)
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        console.log(`✅ 解析成功！ ${jsonData.length} 件のデータが見つかりました。`);

        // 4. 【重要】解析したデータの一部をログに出力して確認する
        console.log('--- プレビュー (最初の5件) ---');
        console.log(jsonData.slice(0, 5));
        console.log('---------------------------');
        
        res.status(200).json({ success: true, message: `Excelファイルを正常に解析し、${jsonData.length}件のデータを確認しました。` });
        // ★★★ 修正ここまで ★★★

    } catch (error) {
        console.error('❌ インポート処理中にエラーが発生:', error);
        res.status(500).json({ success: false, message: 'サーバー側でエラーが発生しました。' });
    } finally {
        console.log('--- 🚚 ファイル受信処理完了 ---');
    }
});


// --- 5. サーバー起動 ---
app.listen(PORT, () => {
    console.log(`🚀 新生『レポきち』、ポート ${PORT} で起動準備完了。`);
});
