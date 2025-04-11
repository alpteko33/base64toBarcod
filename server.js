const express = require('express');
const cors = require('cors');
const Base64ToPdfConverter = require('./base64ToPdf');

const app = express();
const port = 3000;
const host = '0.0.0.0'; // Tüm IP'lerden gelen bağlantılara izin ver

// Middleware
app.use(cors({
    origin: '*', // Tüm originlere izin ver
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '50mb' }));

const converter = new Base64ToPdfConverter();

// Test için basit bir GET endpoint'i ekleyelim
app.get('/test', (req, res) => {
    res.json({ message: 'Sunucu çalışıyor!' });
});

app.post('/api/extract-barcode', async (req, res) => {
    try {
        // Base64 verisini al
        const { base64String } = req.body;
        
        // Base64 verisi kontrolü
        if (!base64String) {
            return res.status(400).json({
                success: false,
                error: 'Base64 verisi gerekli',
                message: 'Lütfen base64 formatında veri gönderin'
            });
        }

        // Base64 formatı kontrolü
        if (!/^[A-Za-z0-9+/=]+$/.test(base64String)) {
            return res.status(400).json({
                success: false,
                error: 'Geçersiz base64 formatı',
                message: 'Gönderilen veri geçerli bir base64 formatında değil'
            });
        }

        // Barkod numarasını çıkar
        const barcodeNumber = await converter.extractNumberFromBase64(base64String);
        
        if (!barcodeNumber) {
            return res.status(404).json({
                success: false,
                error: 'Barkod bulunamadı',
                message: 'Gönderilen veride barkod numarası tespit edilemedi'
            });
        }

        // Başarılı yanıt
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

app.listen(port, host, () => {
    console.log(`API sunucusu http://${host}:${port} adresinde çalışıyor`);
    console.log('API Endpoint: POST /api/extract-barcode');
    // Tüm ağ arayüzlerini göster
    const networkInterfaces = require('os').networkInterfaces();
    Object.keys(networkInterfaces).forEach(interfaceName => {
        networkInterfaces[interfaceName].forEach(interface => {
            if (interface.family === 'IPv4' && !interface.internal) {
                console.log(`http://${interface.address}:${port}`);
            }
        });
    });
}); 