const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI;

// Importar modelos
const User = require('./models/User');
const Ad = require('./models/Ad');
const AdClick = require('./models/AdClick');

async function testDatabase() {
  try {
    // 1. Conectar a MongoDB
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conexión a MongoDB establecida');

    // 2. Crear usuario de prueba
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123' // En producción esto debería estar hasheado
    });
    const savedUser = await testUser.save();
    console.log('✅ Modelo User validado:', savedUser);

    // 3. Crear anuncio de prueba
    const testAd = new Ad({
      title: 'Anuncio de Prueba',
      imageUrl: '/ads/test.jpg',
      destinationUrl: 'https://example.com'
    });
    const savedAd = await testAd.save();
    console.log('✅ Modelo Ad validado:', savedAd);

    // 4. Crear click de prueba
    const testClick = new AdClick({
      userId: savedUser._id,
      adId: savedAd._id
    });
    const savedClick = await testClick.save();
    console.log('✅ Modelo AdClick validado:', savedClick);

    // 5. Consultas de relación
    const userWithClicks = await AdClick.find({ userId: savedUser._id })
      .populate('adId')
      .populate('userId');
    console.log('🔍 Relaciones validadas:', userWithClicks);

    // 6. Limpieza (opcional)
    await User.deleteMany({ email: 'test@example.com' });
    await Ad.deleteMany({ title: 'Anuncio de Prueba' });
    await AdClick.deleteMany({ _id: savedClick._id });

    console.log('🧹 Datos de prueba eliminados');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en las pruebas:', err);
    process.exit(1);
  }
}

testDatabase();