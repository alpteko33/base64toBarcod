const fs = require('fs');
const pdf = require('pdf-parse');

class Base64ToPdfConverter {
    constructor() {
        this.outputPath = './output.pdf'; // Varsayılan çıktı yolu
    }

    /**
     * Base64 stringi PDF dosyasına dönüştürür
     * @param {string} base64String - PDF'in base64 kodlanmış hali
     * @param {string} outputPath - İsteğe bağlı: Çıktı dosyasının yolu
     * @returns {Promise<string>} Oluşturulan PDF dosyasının yolu
     */
    async convert(base64String, outputPath = this.outputPath) {
        try {
            // Base64'ü buffer'a çevir
            const pdfBuffer = Buffer.from(base64String, 'base64');
            
            // Buffer'ı PDF dosyası olarak kaydet
            fs.writeFileSync(outputPath, pdfBuffer);
            
            console.log(`PDF başarıyla oluşturuldu: ${outputPath}`);
            return outputPath;
            
        } catch (error) {
            console.error('PDF dönüştürme hatası:', error);
            throw error;
        }
    }

    /**
     * Oluşturulan PDF dosyasının buffer'ını döndürür
     * @param {string} base64String - PDF'in base64 kodlanmış hali
     * @returns {Buffer} PDF buffer
     */
    getBuffer(base64String) {
        try {
            return Buffer.from(base64String, 'base64');
        } catch (error) {
            console.error('Buffer dönüştürme hatası:', error);
            throw error;
        }
    }

    /**
     * Base64 stringden direkt olarak 13 haneli numarayı çıkarır
     * @param {string} base64String - PDF'in base64 kodlanmış hali
     * @returns {Promise<string|null>} Bulunan 13 haneli numara veya null
     */
    async extractNumberFromBase64(base64String) {
        try {
            // Base64'ü buffer'a çevir
            const pdfBuffer = Buffer.from(base64String, 'base64');
            
            // PDF'i parse et
            const data = await pdf(pdfBuffer);
            
            // Yıldızlar arasındaki 13 haneli numarayı bul
            const regex = /\*(\d{13})\*/g;
            const matches = data.text.match(regex);
            
            if (matches && matches.length > 0) {
                // Yıldızları kaldır ve numarayı döndür
                const number = matches[0].replace(/\*/g, '');
                console.log('Bulunan numara:', number);
                return number;
            } else {
                console.log('13 haneli numara bulunamadı');
                return null;
            }
            
        } catch (error) {
            console.error('İşlem hatası:', error);
            throw error;
        }
    }

    /**
     * PDF dosyası oluşturmadan buffer üzerinden numarayı çıkarır
     * @param {string} base64String - PDF'in base64 kodlanmış hali
     * @returns {Promise<string|null>} Bulunan 13 haneli numara veya null
     */
    async getNumberFromBuffer(base64String) {
        try {
            return await this.extractNumberFromBase64(base64String);
        } catch (error) {
            console.error('Buffer işleme hatası:', error);
            throw error;
        }
    }
}

module.exports = Base64ToPdfConverter;