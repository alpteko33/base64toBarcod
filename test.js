const Base64ToPdfConverter = require('./base64ToPdf');

async function testExtraction() {
    const converter = new Base64ToPdfConverter();
    
    // Test için base64 string (kendi base64 kodunuzu buraya ekleyin)
    const testBase64 = "asdasd"; 
    // // Buraya kendi base64 kodunuzu yapıştırın
    
    try {
        // Direkt olarak numarayı çıkar
        const number = await converter.getNumberFromBuffer(testBase64);
        
        if (number) {
            console.log('İşlem başarılı!');
            console.log('Çıkarılan 13 haneli numara:', number);
        } else {
            console.log('Numara bulunamadı');
        }
        
    } catch (error) {
        console.error('Test hatası:', error);
    }
}

// Testi çalıştır
testExtraction();