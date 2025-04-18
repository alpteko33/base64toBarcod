const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

class HtmlToPdfConverter {
    constructor() {
        this.defaultOptions = {
            format: 'A4',
            margin: {
                top: '10mm',
                right: '10mm',
                bottom: '10mm',
                left: '10mm'
            }
        };
    }

    /**
     * HTML içeriğini PDF'e dönüştürür
     * @param {string} htmlContent - PDF'e dönüştürülecek HTML içeriği
     * @param {Object} options - PDF oluşturma seçenekleri (isteğe bağlı)
     * @returns {Promise<Buffer>} Oluşturulan PDF'in buffer'ı
     */
    async convertToPdf(htmlContent, options = {}) {
        try {
            const browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: true,
                ignoreHTTPSErrors: true
            });

            const page = await browser.newPage();
            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
            
            const pdfOptions = { ...this.defaultOptions, ...options };
            const buffer = await page.pdf(pdfOptions);
            
            await browser.close();
            return buffer;
        } catch (error) {
            console.error('PDF oluşturma hatası:', error);
            throw error;
        }
    }

    /**
     * HTML içeriğini PDF'e dönüştürür ve dosya olarak kaydeder
     * @param {string} htmlContent - PDF'e dönüştürülecek HTML içeriği
     * @param {string} outputPath - Kaydedilecek dosya yolu
     * @param {Object} options - PDF oluşturma seçenekleri (isteğe bağlı)
     * @returns {Promise<string>} Kaydedilen dosyanın yolu
     */
    convertToPdfFile(htmlContent, outputPath, options = {}) {
        return new Promise((resolve, reject) => {
            try {
                // Varsayılan seçeneklerle kullanıcı seçeneklerini birleştir
                const pdfOptions = { ...this.defaultOptions, ...options };
                
                // HTML'den PDF oluştur ve dosyaya kaydet
                htmlPdf.create(htmlContent, pdfOptions).toFile(outputPath, (err, res) => {
                    if (err) {
                        console.error('PDF oluşturma hatası:', err);
                        reject(err);
                    } else {
                        console.log(`PDF başarıyla oluşturuldu: ${res.filename}`);
                        resolve(res.filename);
                    }
                });
            } catch (error) {
                console.error('Dönüştürme hatası:', error);
                reject(error);
            }
        });
    }

    /**
     * HTML içeriğini PDF'e dönüştürür ve Base64 string olarak döndürür
     * @param {string} htmlContent - PDF'e dönüştürülecek HTML içeriği
     * @param {Object} options - PDF oluşturma seçenekleri (isteğe bağlı)
     * @returns {Promise<string>} Base64 formatında PDF içeriği
     */
    async convertToBase64(htmlContent, options = {}) {
        try {
            const buffer = await this.convertToPdf(htmlContent, options);
            return buffer.toString('base64');
        } catch (error) {
            console.error('Base64 dönüştürme hatası:', error);
            throw error;
        }
    }
}

module.exports = HtmlToPdfConverter; 