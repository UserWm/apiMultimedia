import React, { useState, useEffect, useRef } from "react";
import Header from "../components/elements/Header";
import Footer from "../components/elements/Footer";
import { getAllMusic } from "../components/api/RoutesConnection";

const HomeClient = () => {
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMusic, setCurrentMusic] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchMusics = async () => {
      try {
        const musicData = await getAllMusic();
        setMusics(musicData);
        if (musicData.length > 0) {
          setCurrentMusic(musicData[0]);
        }
      } catch (err) {
        setError(err.message || "Error fetching music");
      } finally {
        setLoading(false);
      }
    };

    fetchMusics();
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handleTimeUpdate = () => setCurrentTime(audioElement.currentTime);
    const handleLoadedMetadata = () => setDuration(audioElement.duration);

    audioElement.addEventListener("play", handlePlay);
    audioElement.addEventListener("pause", handlePause);
    audioElement.addEventListener("ended", handleEnded);
    audioElement.addEventListener("timeupdate", handleTimeUpdate);
    audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audioElement.removeEventListener("play", handlePlay);
      audioElement.removeEventListener("pause", handlePause);
      audioElement.removeEventListener("ended", handleEnded);
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [currentMusic]);

  const handleMusicSelect = (music) => {
    setCurrentMusic(music);
    if (audioRef.current) {
      audioRef.current.src = `http://localhost:3000/uploads/${music.music}`;
      audioRef.current.load();
      audioRef.current.play().catch((e) => console.error("Error playing audio:", e));
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause().catch((e) => console.error("Error pausing audio:", e));
      } else {
        audioRef.current.play().catch((e) => console.error("Error playing audio:", e));
      }
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };


  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div></div>;
  if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert">{error}</div>;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-indigo-900 text-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center p-6">
        <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">DJ Ultimate</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl">
          {musics.map((music) => (
            <div
              key={music._id}
              className={`bg-gray-800 p-5 rounded-xl shadow-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-indigo-500/50 ${currentMusic?._id === music._id ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-900" : ""}`}
              onClick={() => handleMusicSelect(music)}
            >
              <img
                src={`http://localhost:3000/uploads/${music.imagen}`}
                alt={music.nameMusic}
                className="w-full h-48 object-cover rounded-lg mb-4 shadow-md"
              />
              <h2 className="text-2xl font-bold text-indigo-300">{music.nameMusic}</h2>
              <p className="text-sm text-gray-300 mt-2">Artist: {music.artist}</p>
              <p className="text-sm text-gray-400">Genre: {music.musicGenre}</p>
              <p className="text-lg font-semibold text-indigo-400 mt-2">${music.price}</p>
            </div>
          ))}
        </div>
        {currentMusic && (
          <div className="fixed bottom-0 left-0 right-0 bg-gray-800 bg-opacity-90 backdrop-filter backdrop-blur-sm p-4 flex items-center justify-between shadow-2xl z-50">
            <div className="flex items-center space-x-4">
              <img
                src={`http://localhost:3000/uploads/${currentMusic.imagen}`}
                alt={currentMusic.nameMusic}
                className="w-12 h-12 object-cover rounded-full shadow-md"
              />
              <div>
                <h3 className="text-lg font-bold text-indigo-300">{currentMusic.nameMusic}</h3>
                <p className="text-sm text-gray-400">{currentMusic.artist}</p>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center mx-6">
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 mb-2 transition duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
              <div className="flex items-center w-full space-x-2">
                <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  value={currentTime}
                  onChange={handleSeek}
                  min={0}
                  max={duration}
                  step={1}
                  className="flex-1 h-2 bg-gray-600 appearance-none rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  style={{ backgroundImage: `linear-gradient(to right, #6366F1 0%, #6366F1 ${(currentTime / duration) * 100}%, #4B5563 ${(currentTime / duration) * 100}%, #4B5563 100%)` }}
                />
                <span className="text-xs text-gray-400">{formatTime(duration)}</span>
              </div>
            </div>

            <audio ref={audioRef} />
          </div>
        )}
      </main>
      
    </div>
    
  );
};

export default HomeClient;