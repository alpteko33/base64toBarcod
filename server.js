const express = require('express');
const cors = require('cors');
const Base64ToPdfConverter = require('./base64ToPdf');

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '50mb' }));

const converter = new Base64ToPdfConverter();

// Test için basit bir GET endpoint'i
app.get('/test', (req, res) => {
    res.json({ message: 'Sunucu çalışıyor!' });
});

app.post('/api/extract-barcode', async (req, res) => {
    try {
        const { base64String } = req.body;
        
        if (!base64String) {
            return res.status(400).json({
                success: false,
                error: 'Base64 verisi gerekli',
                message: 'Lütfen base64 formatında veri gönderin'
            });
        }

        if (!/^[A-Za-z0-9+/=]+$/.test(base64String)) {
            return res.status(400).json({
                success: false,
                error: 'Geçersiz base64 formatı',
                message: 'Gönderilen veri geçerli bir base64 formatında değil'
            });
        }

        const barcodeNumber = await converter.extractNumberFromBase64(base64String);
        
        if (!barcodeNumber) {
            return res.status(404).json({
                success: false,
                error: 'Barkod bulunamadı',
                message: 'Gönderilen veride barkod numarası tespit edilemedi'
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                barcodeNumber: barcodeNumber,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('API Hatası:', error);
        return res.status(500).json({
            success: false,
            error: 'Sunucu hatası',
            message: 'Barkod işlenirken bir hata oluştu',
            details: error.message
        });
    }
});

// Vercel için export
module.exports = app; 