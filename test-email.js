const nodemailer = require('nodemailer');

async function testEmail() {
  try {
    console.log('Testing email system...');
    
    // Test Gmail SMTP settings
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'cleantabsapp@gmail.com',
        pass: 'mcvp xbxy qmkv mbhc',
      },
    });

    // Verify connection
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection is ready');

    // Send test email
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: '"CleanTabs Test" <cleantabsapp@gmail.com>',
      to: 'umitakdenizjob@gmail.com',
      subject: '✅ CleanTabs Email Sistemi Test Maili',
      text: 'CleanTabs email sistemi başarıyla çalışıyor! Bu test maili sistem fonksiyonlarını doğrulamak için gönderildi.',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>CleanTabs Test Email</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
          <div style="background: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); padding: 40px 30px; text-align: center;">
              <div style="background: rgba(255, 255, 255, 0.1); padding: 12px; border-radius: 50%; width: 60px; height: 60px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                ✅
              </div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">CleanTabs</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Email Sistemi Test Başarılı!</p>
            </div>
            
            <div style="padding: 40px 30px;">
              <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">Merhaba! 👋</h2>
              <p style="color: #64748b; margin: 0 0 24px 0; font-size: 16px;">CleanTabs email sistemi başarıyla çalışıyor ve bu test maili size ulaştı!</p>
              
              <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #3b82f6;">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                  <strong style="color: #1e293b; font-size: 14px;">✨ Sistem Özellikleri:</strong>
                </div>
                <ul style="color: #475569; margin: 0; font-size: 15px; line-height: 1.6;">
                  <li>📧 Email gönderimi aktif</li>
                  <li>🔐 Gmail SMTP entegrasyonu</li>
                  <li>📋 Modern email şablonları</li>
                  <li>⚡ Hızlı teslimat</li>
                </ul>
              </div>
              
              <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 24px 0;">
                <p style="color: #64748b; margin: 0; font-size: 14px; text-align: center;">
                  <strong>Test Tarihi:</strong> ${new Date().toLocaleString('tr-TR')}
                </p>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 24px; color: #94a3b8; font-size: 12px;">
            <p>© 2024 CleanTabs. Email sistemi test maili.</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.error('Error details:', error);
  }
}

testEmail();