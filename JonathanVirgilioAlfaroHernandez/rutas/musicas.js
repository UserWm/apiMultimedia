const express = require('express')
const rutas = express.Router()
const Producto = require('../modelos/productos')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Puppeteer = require('puppeteer')

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const carga = multer({storage:storage})

rutas.get('/', async (req, res) => {
    try {
        const productos = await Producto.find()
        res.status(200).json(productos)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})


// metodo get ara el reporte

rutas.get('/reporte', async (req, res) => {
    try {
        const productos = await Producto.find();
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
            <body>
                <h1>Reporte de productos</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Productos</th>
                            <th>Categoria</th>
                            <th>Existencia</th>
                            <th>Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${productos.map(producto => `
                        <tr>
                            <td>${producto.producto}</td>
                            <td>${producto.categoria}</td>
                            <td>${producto.existencia}</td>
                            <td>${producto.precio.toFixed(2)}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>`;
        const browser = await Puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();

        const timespan = new Date().toISOString().replace(/:/g, '-');
        const pdfFilename = `reporte-${timespan}.pdf`;

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${pdfFilename}`,
            'Content-Length': pdfBuffer.length
        });
        res.send(pdfBuffer);
    } catch (error) {
        console.log('Error al generar el reporte: ', error);
        res.status(500).json({ error: error.message });
    }
});


rutas.post('/', carga.single('imagen'), async function (req, res) {
    const { producto, categoria, existencia, precio } = req.body
    const imagen = req.file ? req.file.filename: null
    try {
        const nuevoProducto = new Producto({ producto, categoria, existencia, precio, imagen })
        await nuevoProducto.save()
        res.status(201).json(nuevoProducto)
    } catch (error) {
        res.status(500).json({ error })
    }
})


rutas.put('/:id', carga.single('imagen'), async function (req, res) {
    const { producto, categoria, existencia, precio } = req.body;
    try {
        const productos = await Producto.findById(req.params.id)
        const imagen = req.file ? req.file.filename: null
        if (!productos)
            return res.status(404).json({ error: 'Producto no encontrado' })

        productos.producto = producto || productos.producto
        productos.categoria = categoria || productos.categoria
        productos.existencia = existencia || productos.existencia
        productos.precio = precio || productos.precio
        if(imagen)
        productos.imagen=imagen
        await productos.save()
        res.status(200).json(productos)

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});


rutas.delete('/:id', async function (req, res) {
    try {
        const productos = await Producto.findByIdAndDelete(req.params.id)
        if (!productos)
            return res.status(404).json({ error: 'Producto no encontrado' })
        if(productos.imagen){
            const imagenPath = path.join(__dirname, '..', 'uploads', productos.imagen)
            fs.unlink(imagenPath, (err) => {
                if(err){
                    console.log('Error al eliminar la imagen')
                }else {
                    console.log('Imagen eliminada: ', productos.imagen)
                }
            })
        }
        res.status(200).json({ message: 'Producto eliminado' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});

rutas.get('/:id', async (req, res) => {
    try {
        const productos = await Producto.findById(req.params.id)
        if (!productos)
            return res.status(404).json({ error: 'Producto no encontrado' })
        res.status(200).json(productos)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = rutas