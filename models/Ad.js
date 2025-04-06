const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,  // Debe contener rutas relativas como "/ads/oferta.jpg"
  destinationUrl: String,
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, {
  // ¡Estas opciones son cruciales!
  toJSON: { virtuals: true },  // Incluye virtuals al convertir a JSON
  toObject: { virtuals: true } // Incluye virtuals al convertir a objeto
});

// Virtual para URL completa
adSchema.virtual('fullImageUrl').get(function() {
  // Si ya es URL absoluta (http/https)


  console.log("entro en afullImageUrl")
  console.log("startsWith('https')1" +  this.imageUrl)

  if (this.imageUrl?.startsWith('https')) {
    console.log("startsWith('https')2" +  this.imageUrl)

    return this.imageUrl;
  }
  
  // En producción, usa BASE_URL + ruta relativa
  if (process.env.NODE_ENV === 'production' && process.env.BASE_URL) {

    // Asegura que no haya doble barra en la URL
    const baseUrl = process.env.BASE_URL.endsWith('/') 
      ? process.env.BASE_URL.slice(0, -1) 
      : process.env.BASE_URL;
    const imagePath = this.imageUrl?.startsWith('/') 
      ? this.imageUrl 
      : `/${this.imageUrl}`;

      console.log("producion")
      console.log("`${baseUrl}${imagePath}`:" + `${baseUrl}${imagePath}`)
    
    return `${baseUrl}${imagePath}`;
    // return this.imageUrl;
  }
  
  console.log("desarrollo")
  console.log("this.imageUrl3:"+ this.imageUrl)
  // En desarrollo, usa ruta relativa
  return this.imageUrl;
});

module.exports = mongoose.model('Ad', adSchema);