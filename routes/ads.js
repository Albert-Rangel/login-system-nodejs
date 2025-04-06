const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Ad = require('../models/Ad');
const AdClick = require('../models/AdClick');

// Middleware para validar ObjectIds
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return res.status(400).json({ error: 'ID no válido' });
  }
  next();
};

//Obtener publicidades activas
router.get('/active', async (req, res) => {
  try {
    console.log('Solicitando publicidades activas'); // Debug
    const ads = await Ad.find({ active: true });
    console.log(`Encontradas ${ads.length} publicidades`); // Debug
    res.json(ads);
  } catch (err) {
    console.error('Error al obtener publicidades:', err); // Debug
    res.status(500).json({ 
      error: 'Error al cargar publicidades',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// router.get('/active', async (req, res) => {
//   try {
//     const ads = await Ad.find({ active: true }).lean();
//     res.json(ads.map(ad => ({
//       ...ad,
//       imageUrl: ad.fullImageUrl // Usa el virtual
//     })));
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });




// Registrar un click (versión mejorada)
router.post('/click', async (req, res) => {
  console.log('Datos recibidos:', req.body); // Debug
  
  try {
    // Validación completa
    if (!req.body.userId || !req.body.adId) {
      return res.status(400).json({ error: 'Faltan userId o adId' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.userId) || 
        !mongoose.Types.ObjectId.isValid(req.body.adId)) {
      return res.status(400).json({ error: 'Formato de ID inválido' });
    }

    const newClick = new AdClick({
      userId: req.body.userId,
      adId: req.body.adId,
      clickedAt: new Date() // Asegurar fecha de registro
    });

    const savedClick = await newClick.save();
    console.log('Click registrado:', savedClick); // Debug
    
    res.status(201).json({ 
      success: true,
      clickId: savedClick._id
    });

  } catch (err) {
    console.error('Error al registrar click:', err); // Debug
    res.status(500).json({ 
      error: 'Error al registrar click',
      details: process.env.NODE_ENV === 'development' ? {
        message: err.message,
        stack: err.stack
      } : undefined
    });
  }
});

// Obtener estadísticas (versión mejorada)
router.get('/stats/:userId', validateObjectId, async (req, res) => {
  try {
    console.log(`Obteniendo stats para usuario ${req.params.userId}`); // Debug
    
    const stats = await AdClick.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(req.params.userId) } },
      { 
        $group: {
          _id: null,
          totalClicks: { $sum: 1 },
          lastClick: { $max: "$clickedAt" }
        } 
      }
    ]);

    const result = stats[0] || { totalClicks: 0, lastClick: null };
    console.log('Estadísticas obtenidas:', result); // Debug
    
    res.json(result);
  } catch (err) {
    console.error('Error al obtener estadísticas:', err); // Debug
    res.status(500).json({ 
      error: 'Error al obtener estadísticas',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;