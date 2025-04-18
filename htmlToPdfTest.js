const HtmlToPdfConverter = require('./htmlToPdf');

// Test için örnek HTML içeriği
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Test Dökümanı</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .content {
            margin: 20px 0;
            line-height: 1.6;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <h1>HTML'den PDF Dönüşüm Testi</h1>
    
    <div class="content">
        <p>Bu dosya, HTML'den PDF'e dönüşüm özelliğini test etmek için oluşturulmuştur.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor, nisl eget ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.</p>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>Başlık 1</th>
                <th>Başlık 2</th>
                <th>Başlık 3</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Hücre 1-1</td>
                <td>Hücre 1-2</td>
                <td>Hücre 1-3</td>
            </tr>
            <tr>
                <td>Hücre 2-1</td>
                <td>Hücre 2-2</td>
                <td>Hücre 2-3</td>
            </tr>
            <tr>
                <td>Hücre 3-1</td>
                <td>Hücre 3-2</td>
                <td>Hücre 3-3</td>
            </tr>
        </tbody>
    </table>
    
    <div class="content">
        <p>Tüm testler başarıyla tamamlandı!</p>
        <p>Tarih: ${new Date().toLocaleString()}</p>
    </div>
</body>
</html>
`;

// Test fonksiyonu
async function testHtmlToPdf() {
    try {
        console.log('HTML\'den PDF\'e dönüşüm testi başlatılıyor...');
        
        const converter = new HtmlToPdfConverter();
        
        // 1. PDF Buffer oluşturma testi
        console.log('Test 1: PDF Buffer oluşturma');
        const pdfBuffer = await converter.convertToPdf(htmlContent);
        console.log(`PDF buffer başarıyla oluşturuldu. Boyut: ${pdfBuffer.length} byte`);
        
        // 2. PDF dosyası oluşturma testi
        console.log('\nTest 2: PDF dosyası oluşturma');
        const outputPath = './test_output.pdf';
        const filePath = await converter.convertToPdfFile(htmlContent, outputPath);
        console.log(`PDF dosyası başarıyla oluşturuldu: ${filePath}`);
        
        // 3. Base64 formatında PDF oluşturma testi
        console.log('\nTest 3: Base64 formatında PDF oluşturma');
        const base64String = await converter.convertToBase64(htmlContent);
        console.log(`PDF Base64 formatında başarıyla oluşturuldu. İlk 100 karakter: ${base64String.substring(0, 100)}...`);
        
        console.log('\nTüm testler başarıyla tamamlandı!');
    } catch (error) {
        console.error('Test hatası:', error);
    }
}

// Testi çalıştır
testHtmlToPdf(); 