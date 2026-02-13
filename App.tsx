
import React, { useState, useCallback, useEffect } from 'react';
import { NeonInput } from './components/NeonInput';
import { ThumbnailDisplay } from './components/ThumbnailDisplay';
import { extractVideoId, getThumbnailUrls, downloadImageWithProgress } from './services/youtube';
import { ThumbnailData, DownloadQueueItem } from './types';

const SLOGANS = [
  "NEURAL_EXTRACTION: CAPTURE THE DIGITAL PULSE",
  "VOID_WALKER: BREACHING THE THUMBNAIL PROTOCOL",
  "SIGNAL_RECOVERY: PIXELS RECLAIMED FROM THE ETHER",
  "CYBER_LENS: SEEING THROUGH THE DATA STORM",
  "QUANTUM_DECODING: REALITY BYPASS INITIATED",
  "GHOST_PROTOCOL: EXTRACTING THE UNSEEN"
];

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [thumbnailData, setThumbnailData] = useState<ThumbnailData | null>(null);
  const [error, setError] = useState<{code: string; message: string} | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [queue, setQueue] = useState<DownloadQueueItem[]>([]);
  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);

  // Rotating slogan logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSloganIndex((prev) => (prev + 1) % SLOGANS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleFetch = useCallback(async () => {
    if (!url.trim()) {
       setError({code: 'EMPTY_SIGNAL', message: 'Input buffer is empty. Provide a valid YouTube URL.'});
       return;
    }

    setError(null);
    setThumbnailData(null);
    setLoading(true);
    setScanProgress(0);

    const videoId = extractVideoId(url);

    if (!videoId) {
      setError({code: 'PROTOCOL_ERROR', message: 'The provided URL signature does not match any recognized YouTube patterns.'});
      setLoading(false);
      return;
    }

    const intervals = [10, 35, 62, 88, 100];
    for (let i = 0; i < intervals.length; i++) {
      await new Promise(r => setTimeout(r, 100 + Math.random() * 100));
      setScanProgress(intervals[i]);
    }

    const urls = getThumbnailUrls(videoId);
    setThumbnailData({
      videoId,
      ...urls
    });
    setLoading(false);
  }, [url]);

  const addToQueue = async (res: string, downloadUrl: string) => {
    if (!thumbnailData) return;
    
    const downloadId = Math.random().toString(36).substr(2, 9);
    const newItem: DownloadQueueItem = {
      id: downloadId,
      videoId: thumbnailData.videoId,
      resolution: res,
      progress: 0,
      status: 'pending'
    };

    setQueue(prev => [newItem, ...prev].slice(0, 5)); // Keep only latest 5

    try {
      setQueue(prev => prev.map(item => item.id === downloadId ? { ...item, status: 'downloading' } : item));
      
      await downloadImageWithProgress(
        downloadUrl, 
        `cyberthum-${thumbnailData.videoId}-${res}.jpg`,
        (progress) => {
          setQueue(prev => prev.map(item => 
            item.id === downloadId 
              ? { ...item, progress: progress === -1 ? item.progress : progress, status: progress === -1 ? 'failed' : progress === 100 ? 'completed' : 'downloading' } 
              : item
          ));
        }
      );
    } catch (e) {
      setQueue(prev => prev.map(item => item.id === downloadId ? { ...item, status: 'failed' } : item));
    }
  };

  return (
    <div className="min-h-screen cyber-bg relative overflow-hidden flex flex-col items-center px-4 py-12 md:py-20">
      <div className="scanline"></div>
      
      {/* Decorative Side Slogans */}
      <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-center whitespace-nowrap">
        <span className="text-red-950 font-orbitron text-[10px] tracking-[1em] uppercase opacity-40">
          NEURAL_EXTRACTION // SIGNAL_CLARITY // ULTRA_HD_RECOVERY
        </span>
      </div>
      <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 rotate-90 origin-center whitespace-nowrap">
        <span className="text-red-950 font-orbitron text-[10px] tracking-[1em] uppercase opacity-40">
          EXTRACT. ENHANCE. EXECUTE. // DIGITAL_FRONTIER_CAPTURED
        </span>
      </div>

      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(239, 68, 68, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.15) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }}></div>

      <header className="relative z-10 text-center mb-12 max-w-3xl">
        <div className="flex justify-center items-center gap-4 mb-4">
          <div className="h-[1px] w-12 bg-red-900"></div>
          <div className="px-4 py-1.5 bg-zinc-900/80 text-red-500 font-orbitron text-[10px] tracking-[0.5em] uppercase border border-red-500/20 backdrop-blur-sm">
            Terminal_Access_v4.5.0
          </div>
          <div className="h-[1px] w-12 bg-red-900"></div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-orbitron font-bold text-white mb-2 tracking-tighter relative">
          <span className="relative">
            CYBER<span className="text-red-600">THUM</span>
            <div className="absolute -inset-1 blur-2xl opacity-20 bg-red-600 -z-10 animate-pulse"></div>
          </span>
        </h1>

        <div className="mb-4">
          <p className="text-red-500 font-orbitron text-sm md:text-base uppercase tracking-[0.3em] neon-glow">
            FRAME THE FUTURE. EXTRACT THE ESSENCE.
          </p>
        </div>

        {/* Technical Rotating Slogan Bar */}
        <div className="relative mb-8 flex justify-center overflow-hidden h-10 items-center">
          <div className="absolute top-0 h-full w-full bg-gradient-to-r from-transparent via-red-950/20 to-transparent"></div>
          <div key={currentSloganIndex} className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex items-center gap-3">
             <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></div>
             <p className="font-orbitron text-[10px] md:text-xs text-red-400 tracking-[0.2em] uppercase font-semibold">
              {SLOGANS[currentSloganIndex]}
             </p>
             <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex justify-center gap-8 font-rajdhani text-zinc-500 text-[10px] uppercase tracking-[0.4em]">
          <span>[ SEARCH ]</span>
          <span>[ EXTRACT ]</span>
          <span>[ DEPLOY ]</span>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-2xl flex flex-col items-center">
        <div className="w-full space-y-6">
          <div className="relative group">
            <NeonInput
              value={url}
              onChange={setUrl}
              placeholder="PASTE_YOUTUBE_SIGNAL_HERE..."
              disabled={loading}
            />
          </div>

          <div className="relative w-full">
            <button
              onClick={handleFetch}
              disabled={loading || !url}
              className={`w-full py-5 font-orbitron text-sm tracking-[0.5em] uppercase transition-all relative overflow-hidden group ${
                loading || !url
                  ? 'bg-zinc-950 border border-zinc-900 text-zinc-800 cursor-not-allowed'
                  : 'bg-black border border-red-600/50 text-red-500 hover:text-white hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:shadow-[0_0_40px_rgba(239,68,68,0.4)]'
              }`}
            >
              <div className="relative z-10 flex items-center justify-center gap-4">
                {loading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>}
                {loading ? `INITIALIZING_SCAN_${scanProgress}%` : 'DECRYPT_THUMBNAIL'}
              </div>
            </button>
            {loading && (
              <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-zinc-900">
                <div className="h-full bg-red-600 transition-all duration-300 shadow-[0_0_10px_#E11D48]" style={{ width: `${scanProgress}%` }}></div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-8 p-5 border-2 border-red-900/50 bg-red-950/10 backdrop-blur-xl w-full animate-in slide-in-from-top-4">
            <div className="flex items-start gap-4">
              <div className="bg-red-600 p-1"><svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg></div>
              <div>
                <div className="font-orbitron text-xs text-red-500 uppercase tracking-widest mb-1">CRITICAL_ERROR: {error.code}</div>
                <div className="font-rajdhani text-zinc-400 text-sm tracking-wide">{error.message}</div>
              </div>
            </div>
          </div>
        )}

        {thumbnailData && !loading && (
          <ThumbnailDisplay data={thumbnailData} onDownload={addToQueue} />
        )}
      </main>

      {/* Download Manager Queue */}
      {queue.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 w-72 space-y-3 hidden sm:block">
          <div className="bg-zinc-950/90 border border-zinc-800 p-3 rounded-sm shadow-2xl backdrop-blur-md">
            <div className="flex justify-between items-center mb-3 border-b border-zinc-800 pb-2">
              <h5 className="font-orbitron text-[9px] text-zinc-500 uppercase tracking-widest">Download_Queue</h5>
              <button onClick={() => setQueue([])} className="text-[8px] text-zinc-600 hover:text-red-500 font-orbitron uppercase">Clear_All</button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {queue.map(item => (
                <div key={item.id} className="relative group/q bg-black/40 p-2 border border-zinc-900/50">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] font-orbitron text-zinc-400 uppercase truncate max-w-[120px]">{item.videoId}</span>
                    <span className={`text-[8px] font-orbitron ${
                      item.status === 'completed' ? 'text-green-500' : 
                      item.status === 'failed' ? 'text-red-600' : 'text-zinc-600'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[8px] text-zinc-600 mb-2 uppercase font-rajdhani">{item.resolution}</div>
                  <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${item.status === 'failed' ? 'bg-red-900' : item.status === 'completed' ? 'bg-green-600' : 'bg-red-600'}`}
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <footer className="mt-auto pt-20 relative z-10 w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-t border-zinc-900 pt-8 px-4">
          <div className="text-[10px] font-orbitron text-zinc-600 uppercase tracking-[0.3em] order-2 md:order-1 text-center md:text-left">
            SYS_STATUS: <span className="text-red-900 animate-pulse">ACTIVE_SECURE</span>
          </div>
          <div className="flex flex-col items-center order-1 md:order-2 gap-2">
            <div className="flex justify-center gap-6">
              <div className="h-1 w-1 bg-red-600 rounded-full animate-ping"></div>
              <div className="h-1 w-1 bg-red-900 rounded-full"></div>
              <div className="h-1 w-1 bg-red-900 rounded-full"></div>
            </div>
            <p className="text-[9px] font-orbitron text-red-900 tracking-[0.5em] uppercase">PIXELS_BEYOND_BOUNDARIES</p>
          </div>
          <div className="text-[10px] font-rajdhani text-zinc-600 uppercase tracking-[0.2em] order-3 text-center md:text-right">
             &copy; MMXXIV // NEURAL_OPS_NETWORK
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
