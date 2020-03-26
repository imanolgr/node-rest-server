// ====================================
// PUERTO
// ====================================

process.env.PORT = (process.env.PORT || 3000);


// =======================
// ENTORNO
// =======================
process.env.NODE_ENV = (process.env.NODE_ENV || 'dev');

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://imanolgr:NodeJS@cafe-xbiwy.mongodb.net/cafe';
}
console.log('guardamos', urlDB);
process.env.URLDB = urlDB; //Nos lo hemos inventado