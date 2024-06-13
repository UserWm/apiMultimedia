
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';

const Canciones = () => {
    const [canciones, setCanciones] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/api/canciones')
            .then(response => {
                console.log('Datos obtenidos:', response.data);
                setCanciones(response.data);
            })
            .catch(error => {
                console.error('Error fetching the songs:', error);
            });
    }, []);

    return (
        <div className="container">
            <h1 className="text-center my-4">Biblioteca de Música</h1>
            <div className="row">
                {canciones.length === 0 ? (
                    <p className="text-center">No hay canciones disponibles.</p>
                ) : (
                    canciones.map(cancion => (
                        <div key={cancion._id} className="col-md-4 mb-4">
                              
                              <div className="card-body" style={{ background: 'rgba(0, 0, 0, 0.6)', padding: '1em', borderRadius: '10px' }}>
                                    <h2 className="card-title mt-3" style={{ color: 'white' }}>{cancion.nombreCancion}</h2>
                                    <p className="card-text" style={{ color: 'white' }}>Artistas: {cancion.artistas}</p>
                                    <p className="card-text" style={{ color: 'white' }}>Género: {cancion.genero}</p>
                                    <p className="card-text" style={{ color: 'white' }}>Precio: ${cancion.precio.toFixed(2)}</p>
                                    {cancion.audio && (
                                        <audio controls className="w-100 mt-3">
                                            <source src={`http://localhost:3001/tracks/${cancion.audio}`} type="audio/mpeg" />
                                            
                                        </audio>
                                    )}
                                </div>
                            </div>   
                        ))
                    )}
            </div>
      </div>
    );
}

export default Canciones;
