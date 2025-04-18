const express = require('express');
const cors = require('cors');
const Base64ToPdfConverter = require('./base64ToPdf');
const HtmlToPdfConverter = require('./htmlToPdf');

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '50mb' }));

const converter = new Base64ToPdfConverter();
const htmlConverter = new HtmlToPdfConverter();

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

// HTML'den PDF oluşturma endpoint'i
app.post('/api/html-to-pdf', async (req, res) => {
    try {
        const { htmlContent } = req.body;
        
        if (!htmlContent) {
            return res.status(400).json({
                success: false,
                error: 'HTML içeriği gerekli',
                message: 'Lütfen dönüştürülecek HTML içeriğini gönderin'
            });
        }

        // HTML'i PDF'e dönüştür ve Base64 formatında döndür
        const pdfBase64 = await htmlConverter.convertToBase64(htmlContent);
        
        return res.status(200).json({
            success: true,
            data: {
                pdfBase64: pdfBase64,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('PDF Dönüştürme Hatası:', error);
        return res.status(500).json({
            success: false,
            error: 'Sunucu hatası',
            message: 'HTML PDF\'e dönüştürülürken bir hata oluştu',
            details: error.message
        });
    }
});

// HTML'i direkt PDF olarak indirme endpoint'i
app.post('/api/download-pdf', async (req, res) => {
    try {
        const { htmlContent } = req.body;
        
        if (!htmlContent) {
            return res.status(400).json({
                success: false,
                error: 'HTML içeriği gerekli',
                message: 'Lütfen dönüştürülecek HTML içeriğini gönderin'
            });
        }

        // HTML'i PDF'e dönüştür
        const pdfBuffer = await htmlConverter.convertToPdf(htmlContent);
        
        // PDF'i indirme yanıtı olarak gönder
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=dokuman.pdf');
        res.setHeader('Content-Length', pdfBuffer.length);
        
        return res.end(pdfBuffer);

    } catch (error) {
        console.error('PDF İndirme Hatası:', error);
        return res.status(500).json({
            success: false,
            error: 'Sunucu hatası',
            message: 'PDF oluşturulurken bir hata oluştu',
            details: error.message
        });
    }
});

// Vercel için export
module.exports = app; 