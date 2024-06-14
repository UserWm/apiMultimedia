const express = require('express')
const rutas = express.Router()
const Musica = require('../modelos/musicas')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Puppeteer = require('puppeteer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const carga = multer({ storage: storage })

rutas.get('/', async (req, res) => {
    try {
        const musicas = await Musica.find()
        res.status(200).json(musicas)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})


// metodo get ara el reporte
// rutas.get('/reporte', async (req, res) => {
//     try {
//         const productos = await Producto.find();
//         const htmlContent = `
//             <!DOCTYPE html>
//             <html lang="en">
//             <head>
//                 <meta charset="UTF-8">
//                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                 <title>Document</title>
//             </head>
//             <body>
//                 <h1>Reporte de productos</h1>
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>Productos</th>
//                             <th>Categoria</th>
//                             <th>Existencia</th>
//                             <th>Precio</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                     ${productos.map(producto => `
//                         <tr>
//                             <td>${producto.producto}</td>
//                             <td>${producto.categoria}</td>
//                             <td>${producto.existencia}</td>
//                             <td>${producto.precio.toFixed(2)}</td>
//                         </tr>
//                         `).join('')}
//                     </tbody>
//                 </table>
//             </body>
//             </html>`;
//         const browser = await Puppeteer.launch({
//             headless: true,
//             args: ['--no-sandbox', '--disable-setuid-sandbox']
//         });
//         const page = await browser.newPage();
//         await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
//         const pdfBuffer = await page.pdf({ format: 'A4' });
//         await browser.close();

//         const timespan = new Date().toISOString().replace(/:/g, '-');
//         const pdfFilename = `reporte-${timespan}.pdf`;

//         res.set({
//             'Content-Type': 'application/pdf',
//             'Content-Disposition': `attachment; filename=${pdfFilename}`,
//             'Content-Length': pdfBuffer.length
//         });
//         res.send(pdfBuffer);
//     } catch (error) {
//         console.log('Error al generar el reporte: ', error);
//         res.status(500).json({ error: error.message });
//     }
// });


rutas.post('/', carga.single('audio'), async function (req, res) {
    const { nombre, artista, genero, precio } = req.body
    const audio = req.file ? req.file.filename : null
    try {
        const nuevaMusica = new Musica({ nombre, artista, genero, precio, audio })
        await nuevaMusica.save()
        res.status(201).json(nuevaMusica)
    } catch (error) {
        res.status(500).json({ error })
    }
})


rutas.put('/:id', carga.single('audio'), async function (req, res) {
    const { nombre, artista, genero, precio } = req.body;
    const audio = req.file ? req.file.filename : null
    try {
        const musicas = await Musica.findById(req.params.id)
        if (!musicas)
            return res.status(404).json({ error: 'Musica no encontrada' })

        musicas.nombre = nombre || musicas.nombre
        musicas.artista = artista || musicas.artista
        musicas.genero = genero || musicas.genero
        musicas.precio = precio || musicas.precio
        if (audio)
            musicas.audio = audio
        await musicas.save()
        res.status(200).json(musicas)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});


rutas.delete('/:id', async function (req, res) {
    try {
        const musicas = await Musica.findByIdAndDelete(req.params.id)
        if (!musicas)
            return res.status(404).json({ error: 'Musica no encontrada' })
        if (musicas.audio) {
            const audioPath = path.join(__dirname, '..', 'tracks', musicas.audio)
            fs.unlink(audioPath, (err) => {
                if (err) {
                    console.log('error al eliminar la musica')
                } else {
                    console.log('musica eliminada', musicas.audio)
                }
            })
        }
        res.status(200).json({ message: 'Musica eliminada' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});

rutas.get('/:id', async (req, res) => {
    try {
        const musicas = await Musica.findById(req.params.id)
        if (!musicas)
            return res.status(404).json({ error: 'Musica no encontrada' })
        res.status(200).json(musicas)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = rutas