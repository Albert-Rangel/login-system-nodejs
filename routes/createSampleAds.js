// Ejemplo de cómo crear una publicidad de prueba directamente
const Ad = require('./models/Ad');

async function createSampleAd() {
  const newAd = new Ad({
    title: "Oferta Secundaria",
    imageUrl: "/ads/oferta.jpg",
    destinationUrl: "https://ejemplo.com/oferta",
    active: true
  });

  await newAd.save();
  console.log("Publicidad de prueba creada");
}

createSampleAd();