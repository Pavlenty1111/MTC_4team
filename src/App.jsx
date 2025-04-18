import React, { useState, useEffect, useRef } from 'react';


// Базовые URL для разных сервисов
const UPLOAD_BASE_URL = 'http://172.29.62.95:8000'; // Для загрузки видео и получения списка кадров
const FRAMES_BASE_URL = 'http://172.29.62.95:9000'; // Для загрузки самих картинок
const CLASSIFICATION_URL = 'http://172.29.62.95:8000/classifications/'; // Для отправки порога четкости

function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleThemeToggle = () => {
    setIsRotating(true);
    setDarkMode(!darkMode);
  };

  return (
    <header className="bg-gradient-to-r from-blue-500 to-blue-800 text-white p-4 flex justify-between items-center shadow-xl fixed w-full top-0 z-10 relative h-16">
      <img
        src={require('./assets/tusur-logo.png')}
        alt="IT Academy TUSUR Logo"
        className="h-12 transform hover:scale-105 transition-transform duration-300"
      />
      <button
        onClick={handleThemeToggle}
        onAnimationEnd={() => setIsRotating(false)}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white hover:text-blue-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:scale-110"
      >
        <span className={isRotating ? 'animate-spin-slow' : ''}>
          {darkMode ? (
            // Иконка солнца (для перехода в светлый режим)
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            // Иконка луны (для перехода в тёмный режим)
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </span>
      </button>
      <img
        src={require('./assets/mts-logo.png')}
        alt="MTS Logo"
        className="h-12 transform hover:scale-105 transition-transform duration-300"
      />
    </header>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-500';

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-2 rounded-xl shadow-2xl flex items-center space-x-2 animate-toast-in`}>
      {type === 'success' ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span>{message}</span>
    </div>
  );
}

function FrameGallery({ frames, classificationResults, openModal }) {
  const getSharpnessStatus = frameNumber =>
    classificationResults.find(
      res => Number(res.frame_number) === Number(frameNumber)
    );

  return (
    <div className="p-4 sm:p-8 rounded-3xl w-full sm:w-96 text-center bg-white dark:bg-gray-800 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300">
      <h2 className="text-4xl font-extrabold mb-4 tracking-tight text-black dark:text-white">
        Галерея кадров
      </h2>

      {frames && frames.length > 0 ? (
        classificationResults.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Ожидание классификации...
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {frames.map(frame => {
              const result = getSharpnessStatus(frame.frame_number);
              const isSharp = result?.is_sharp;

              return (
                <div
                  key={frame.frame_number}
                  className="relative w-32 h-32 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200 shadow-md"
                  onClick={() => openModal(frame)}
                >
                  <img
                    src={`${FRAMES_BASE_URL}${frame.url}`}
                    alt={`Frame ${frame.frame_number}`}
                    className="w-full h-full object-cover"
                    onError={e =>
                      (e.target.src =
                        'https://via.placeholder.com/150?text=Error')
                    }
                  />

                  {isSharp != null && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isSharp ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-10 h-10"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          style={{ color: "#66FF00" }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-10 h-10 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Кадры отсутствуют
        </p>
      )}
    </div>
  );
}






function Parameters({ samplingRate, setSamplingRate, loyalty, setLoyalty }) {
  const handleLoyaltyChange = (value) => {
    setLoyalty(value);
  };

  return (
    <div className="p-4 sm:p-8 rounded-3xl w-full sm:w-96 text-center bg-white dark:bg-gray-800 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300">
      <h2 className="text-4xl font-extrabold mb-4 tracking-tight text-black dark:text-white">Параметры</h2>
      <div className="text-left text-gray-700 dark:text-gray-300">
        <div className="mb-4">
          <label className="block mb-2 font-semibold">
            Частота выборки кадра с видео: {samplingRate}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={samplingRate}
            onChange={(e) => setSamplingRate(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">
            Порог четкости при классификации: {loyalty}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={loyalty}
            onChange={(e) => handleLoyaltyChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

function FileStats({ file, duration, fps, resolution, videoHash }) {
  const stats = file
    ? {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} МБ`,
        type: file.type,
        lastModified: new Date(file.lastModified).toLocaleDateString(),
        duration: duration ? `${Math.floor(duration / 60)}:${(duration % 60).toFixed(0).padStart(2, '0')}` : 'Неизвестно',
        fps: fps || 'Неизвестно',
        resolution: resolution || 'Неизвестно',
      }
    : null;

  const handleDownloadJsonReport = async () => {
    if (!videoHash) {
      alert('Видео-хеш не найден. Пожалуйста, загрузите видео.');
      return;
    }

    try {
      const response = await fetch(`http://172.29.62.95:8000/reports/${videoHash}/full/?format=json`);
      if (!response.ok) throw new Error('Ошибка при получении отчета');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${videoHash}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка при скачивании отчета:', error);
      alert('Не удалось скачать отчет');
    }
  };

  return (
    <div className="p-4 sm:p-8 rounded-3xl w-full sm:w-96 text-center bg-white dark:bg-gray-800 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300">
      <h2 className="text-4xl font-extrabold mb-4 tracking-tight text-black dark:text-white">Статистика файла</h2>
      {stats ? (
        <>
          <div className="text-left text-gray-700 dark:text-gray-300">
            <p className="mb-2"><strong>Имя:</strong> {stats.name}</p>
            <p className="mb-2"><strong>Размер:</strong> {stats.size}</p>
            <p className="mb-2"><strong>Тип:</strong> {stats.type}</p>
            <p className="mb-2"><strong>Дата изменения:</strong> {stats.lastModified}</p>
            <p className="mb-2"><strong>Длительность:</strong> {stats.duration}</p>
            <p className="mb-2"><strong>Частота кадров (FPS):</strong> {stats.fps}</p>
            <p className="mb-2"><strong>Разрешение:</strong> {stats.resolution}</p>
          </div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleDownloadJsonReport}
              className="bg-blue-500 text-white px-6 py-2 rounded-xl cursor-pointer hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500 transition-all duration-300"
            >
              Сохранить JSON
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-lg">Файл не выбран</p>
      )}
    </div>
  );
}



function VideoUploader({ setFileForStats, setVideoDuration, setVideoFps, setVideoResolution, setFrames, samplingRate, setVideoHash, setFps, loyalty, setClassificationResults }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const videoRef = useRef(null);

  const maxSizeMB = 100;
  const allowedFormats = ['video/mp4', 'video/avi', 'video/quicktime'];
  const uploadUrl = `${UPLOAD_BASE_URL}/videos/`;

  const handleDrag = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files[0]) validateFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = e => {
    if (e.target.files[0]) validateFile(e.target.files[0]);
  };

  const validateFile = f => {
    if (!allowedFormats.includes(f.type)) {
      alert("Пожалуйста, выберите видео в формате MP4, AVI или MOV!");
      return;
    }
    if (f.size > maxSizeMB * 1024 * 1024) {
      alert(`Максимальный размер файла — ${maxSizeMB} МБ.`);
      return;
    }
    setFile(f);
    setFileForStats(f);
    setVideoFps(30);
    uploadBinary(f);
  };

  const sendLoyalty = async (videoHash, fps, loyaltyValue) => {
    try {
      const response = await fetch(CLASSIFICATION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: `video_hash=${videoHash}&fps=${fps}&loyalty=${loyaltyValue}`,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Ошибка отправки параметров классификации: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log('Classification response:', data); // Отладочный лог
      setClassificationResults(data.results || []); // Сохраняем результаты классификации
      setShowSuccessToast(true);
    } catch (error) {
      console.error('Classification error:', error); // Отладочный лог
      setErrorMessage(`Ошибка отправки параметров классификации: ${error.message}`);
      setShowErrorToast(true);
    }
  };

  const fetchFrames = async (videoHash, fps) => {
    try {
      const framesUrl = `${UPLOAD_BASE_URL}/frames/${videoHash}/${fps}/`;
      const res = await fetch(framesUrl, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        throw new Error(`Ошибка получения кадров: ${res.status}`);
      }
      const data = await res.json();
      console.log('Frames fetched:', data); // Отладочный лог
      setFrames(data.frames || []);
    } catch (e) {
      console.error('Frames fetch error:', e); // Отладочный лог
      setErrorMessage(`Ошибка получения кадров: ${e.message}`);
      setShowErrorToast(true);
    }
  };

  const uploadBinary = async f => {
    const formData = new FormData();
    formData.append('file', f);

    // Проверяем samplingRate, если 0 — устанавливаем минимальное значение 0.1
    const fpsToSend = samplingRate === 0 ? 0.1 : samplingRate;
    formData.append('fps', String(fpsToSend));

    // Логируем данные, которые отправляем
    console.log('Отправляемые данные:', { file: f.name, fps: fpsToSend });

    try {
      setUploadProgress(0);
      setErrorMessage('');
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });

      // Логируем статус ответа
      console.log('Статус ответа:', res.status);

      if (!res.ok) {
        const text = await res.text();
        console.error('Ошибка сервера:', text);
        throw new Error(`${res.status} ${text}`);
      }

      const data = await res.json();
      console.log('Ответ сервера:', data);

      setUploadProgress(100);
      setShowSuccessToast(true);

      if (data.video_hash && data.fps) {
        setVideoHash(data.video_hash); // Сохраняем video_hash
        setFps(data.fps); // Сохраняем fps
        await fetchFrames(data.video_hash, data.fps);
        // Отправляем параметры классификации после успешной загрузки видео
        await sendLoyalty(data.video_hash, data.fps, loyalty);
      } else {
        setErrorMessage('Не удалось получить video_hash или fps из ответа сервера');
        setShowErrorToast(true);
      }
    } catch (e) {
      console.error('Ошибка при загрузке:', e);
      setErrorMessage(`Ошибка загрузки: ${e.message}`);
      setShowErrorToast(true);
      simulateProgress();
    }
  };

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(p => {
        const next = p + 10;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 300);
  };

  const clearFile = () => {
    setFile(null);
    setFileForStats(null);
    setVideoDuration(null);
    setVideoFps(null);
    setVideoResolution(null);
    setFrames([]);
    setVideoHash(null); // Очищаем video_hash
    setFps(null); // Очищаем fps
    setUploadProgress(0);
    setErrorMessage('');
    setShowSuccessToast(false);
    setShowErrorToast(false);
    setClassificationResults([]); // Очищаем результаты классификации
  };

  useEffect(() => {
    if (file && videoRef.current) {
      videoRef.current.src = URL.createObjectURL(file);
      videoRef.current.onloadedmetadata = () => {
        setVideoDuration(videoRef.current.duration);
        setVideoResolution(`${videoRef.current.videoWidth}x${videoRef.current.videoHeight}`);
      };
    }
    return () => {
      if (file) URL.revokeObjectURL(file);
    };
  }, [file, setVideoDuration, setVideoResolution]);

  return (
    <div className="p-4 sm:p-8 rounded-3xl w-full sm:w-96 text-center bg-white dark:bg-gray-800 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed border-blue-400 p-6 rounded-2xl transition-all duration-300 bg-white dark:bg-gray-900 text-black dark:text-white shadow-2xl ${dragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-800 scale-105" : ""}`}
      >
        <div className="flex justify-center mb-4">
          <svg className="w-10 h-10 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l-3-3m0 0l-3 3m3-3v12m-8-3a4 4 0 004 4h8a4 4 0 004-4v-8a4 4 0 00-4-4h-8a4 4 0 00-4 4v8z" />
          </svg>
        </div>
        <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Загрузка видео</h2>
        <p className="mb-4 text-gray-500 dark:text-gray-400 text-lg">Выберите или перетащите видео (MP4, AVI, MOV)</p>
        <div className="flex justify-center">
          <input
            id="fileInput"
            type="file"
            accept="video/mp4,video/avi,video/quicktime"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-xl cursor-pointer hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500 transition-all duration-300"
          >
            Выбрать видео
          </label>
        </div>

        <div className={`mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 ${file ? "" : "opacity-0 pointer-events-none"}`}>
          <p className="text-gray-700 dark:text-gray-300 mb-2 text-sm">
            {file ? `Выбран: ${file.name}` : "Нет файла"}
          </p>
          <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden shadow-md">
            {file ? (
              <video ref={videoRef} controls className="w-full h-full object-contain" />
            ) : (
              <span className="text-gray-400 dark:text-gray-600">Предпросмотр видео</span>
            )}
          </div>
          {file && (
            <button
              onClick={clearFile}
              className="mt-4 bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 hover:shadow-lg transition-all duration-300"
            >
              Очистить
            </button>
          )}
        </div>

        {uploadProgress > 0 && (
          <div className={`mt-6 flex flex-col items-center p-4 rounded-xl ${errorMessage ? "bg-red-100 dark:bg-red-900" : "bg-gray-100 dark:bg-gray-800"}`}>
            <div className="relative w-24 h-24 mx-auto">
              <svg className="absolute w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-gray-200 dark:text-gray-600"
                  d="
                    M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831
                  "
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.8"
                />
                <path
                  className={errorMessage ? "text-red-500 dark:text-red-600" : "text-blue-500 dark:text-blue-600"}
                  d="
                    M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831
                  "
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.8"
                  strokeDasharray={`${uploadProgress}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-black dark:text-white">
                {Math.round(uploadProgress)}%
              </div>
            </div>
            {errorMessage && (
              <div className="mt-4 text-red-500 dark:text-red-400">
                {errorMessage}
              </div>
            )}
          </div>
        )}
      </div>
      {showSuccessToast && (
        <Toast
          message="Видео успешно загружено и параметры классификации отправлены!"
          type="success"
          onClose={() => setShowSuccessToast(false)}
        />
      )}
      {showErrorToast && (
        <Toast
          message={errorMessage || "Ошибка при загрузке видео или отправке параметров!"}
          type="error"
          onClose={() => setShowErrorToast(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  const [fileForStats, setFileForStats] = useState(null);
  const [videoDuration, setVideoDuration] = useState(null);
  const [videoFps, setVideoFps] = useState(null);
  const [videoResolution, setVideoResolution] = useState(null);
  const [frames, setFrames] = useState([]);
  const [samplingRate, setSamplingRate] = useState(0.2);
  const [loyalty, setLoyalty] = useState(0);
  const [videoHash, setVideoHash] = useState(null);
  const [fps, setFps] = useState(null);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [classificationResults, setClassificationResults] = useState([]);

  const openModal = (frame) => {
    setSelectedFrame(frame);
    document.body.style.overflow = 'hidden'; // Отключаем прокрутку фона
  };

  const closeModal = () => {
    setSelectedFrame(null);
    document.body.style.overflow = 'auto'; // Включаем прокрутку фона
  };

  // Отладочный лог для проверки classificationResults
  useEffect(() => {
    console.log('Current classificationResults:', classificationResults);
  }, [classificationResults]);

  return (
  <div className="min-h-screen bg-gradient-to-tl from-blue-50 via-gray-100 to-blue-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-all duration-500">
    <Header />
    <div className="flex flex-col md:flex-row justify-center items-start gap-10 pt-20 px-4">
      <FrameGallery
        frames={frames}
        classificationResults={classificationResults}
        openModal={openModal}
      />
      <VideoUploader
        setFileForStats={setFileForStats}
        setVideoDuration={setVideoDuration}
        setVideoFps={setVideoFps}
        setVideoResolution={setVideoResolution}
        setFrames={setFrames}
        samplingRate={samplingRate}
        setVideoHash={setVideoHash}
        setFps={setFps}
        loyalty={loyalty}
        setClassificationResults={setClassificationResults}
      />
      <div className="flex flex-col gap-10">
        <Parameters
          samplingRate={samplingRate}
          setSamplingRate={setSamplingRate}
          loyalty={loyalty}
          setLoyalty={setLoyalty}
        />
        <FileStats
          file={fileForStats}
          duration={videoDuration}
          fps={videoFps}
          resolution={videoResolution}
          videoHash={videoHash}
        />
      </div>
    </div>

    {selectedFrame && (
      <div
        className="fixed inset-0 bg-gradient-to-br from-gray-900/90 to-blue-900/90 flex items-center justify-center z-50 p-4 sm:p-8 animate-fade-in"
        onClick={closeModal}
      >
        <div
          className="relative w-full h-full max-w-[95vw] max-h-[95vh] bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-3xl flex flex-col items-start justify-start overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100 pt-8 px-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Верхняя панель с заголовком и крестиком */}
          <div className="w-full flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Кадр №{selectedFrame.frame_number}
            </h3>
            <button
              className="text-gray-500 hover:text-red-600 transition-colors duration-300"
              onClick={closeModal}
              aria-label="Закрыть"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Контент модалки с изображением */}
          <div className="relative w-full h-full flex items-center justify-center p-6">
            <div className="absolute inset-0 m-4 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 opacity-20 blur-xl"></div>
            <img
              src={`${FRAMES_BASE_URL}${selectedFrame.url}`}
              alt={`Frame ${selectedFrame.frame_number}`}
              className="w-full h-full object-contain rounded-xl shadow-lg z-10"
              onError={(e) => (e.target.src = 'https://via.placeholder.com/600?text=Error')}
            />
          </div>
        </div>
      </div>
    )}
  </div>
);

}