import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Komponen ini menerima judul film sebagai prop
const Recommendations = ({ movieTitle }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!movieTitle) return;

        const fetchRecommendations = async() => {
            setLoading(true);
            setError('');
            try {
                // Panggil endpoint di server Node.js Anda
                const response = await axios.get(`/api/movies/${movieTitle}/recommendations`);
                setRecommendations(response.data);
            } catch (err) {
                setError(err.response ? .data ? .message || 'Gagal memuat rekomendasi.');
                setRecommendations([]); // Kosongkan rekomendasi jika error
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [movieTitle]); // Efek ini akan berjalan lagi jika movieTitle berubah

    return ( <
            div className = "recommendations-container" >
            <
            h3 > Film Serupa yang Mungkin Anda Suka < /h3> {
            loading && < p > Mencari rekomendasi... < /p>} {
            error && < p style = {
                { color: 'red' }
            } > { error } < /p>} {!loading && !error && ( <
                ul > {
                    recommendations.length > 0 ? (
                        recommendations.map((title, index) => ( <
                            li key = { index } > { title } < /li>
                        ))
                    ) : ( <
                        p > Tidak ada rekomendasi yang ditemukan. < /p>
                    )
                } <
                /ul>
            )
        } <
        /div>
);
};

export default Recommendations;