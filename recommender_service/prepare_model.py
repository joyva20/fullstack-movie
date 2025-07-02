from flask import Flask, request, jsonify
import pandas as pd
import pickle

# Inisialisasi aplikasi Flask
app = Flask(__name__)

# Memuat model dan data yang sudah disimpan
try:
    movies_dict = pickle.load(open('movies.pkl', 'rb'))
    movies = pd.DataFrame(movies_dict)
    similarity = pickle.load(open('similarity.pkl', 'rb'))
except FileNotFoundError:
    print("Error: File model 'movies.pkl' atau 'similarity.pkl' tidak ditemukan.")
    print("Jalankan 'prepare_model.py' terlebih dahulu.")
    exit()

# Membuat endpoint untuk rekomendasi
@app.route('/recommend', methods=['GET'])
def recommend():
    # Mengambil judul film dari query parameter URL (?movie=...)
    movie_title = request.args.get('movie')

    if not movie_title:
        return jsonify({'error': 'Parameter "movie" tidak ditemukan'}), 400

    # Mencari index dari film
    indices = pd.Series(movies.index, index=movies['title'])
    if movie_title not in indices:
        return jsonify({'error': f'Film "{movie_title}" tidak ditemukan'}), 404
    
    idx = indices[movie_title]

    # Mendapatkan skor kemiripan dan merekomendasikan film
    sim_scores = list(enumerate(similarity[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:11] # Mengambil 10 film teratas
    movie_indices = [i[0] for i in sim_scores]
    
    # Mengambil judul film dari index yang direkomendasikan
    recommended_movies = movies['title'].iloc[movie_indices].tolist()
    
    return jsonify(recommended_movies)

# Menjalankan server
if __name__ == '__main__':
    # Jalankan di port 5000
    app.run(debug=True, port=5000)
