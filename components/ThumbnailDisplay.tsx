
import React, { useState, useEffect } from 'react';
import { ThumbnailData, ResolutionType, VideoResolution } from '../types';
import { checkThumbnailAvailability } from '../services/youtube';

interface Props {
  data: ThumbnailData;
  onDownload: (res: string, url: string) => void;
}

const VIDEO_TIERS: VideoResolution[] = [
  { label: '4K_ULTRA', quality: '2160p', isAvailable: true },
  { label: 'FHD_EXTRACT', quality: '1080p', isAvailable: true },
  { label: 'HD_SIGNAL', quality: '720p', isAvailable: true },
  { label: 'SD_CORE', quality: '440p', isAvailable: true },
  { label: 'MIN_LINK', quality: '240p', isAvailable: true },
];

export const ThumbnailDisplay: React.FC<Props> = ({ data, onDownload }) => {
  const [selectedRes, setSelectedRes] = useState<keyof Omit<ThumbnailData, 'videoId'>>('maxRes');
  const [isVerifying, setIsVerifying] = useState(true);
  const [availableRes, setAvailableRes] = useState<Record<string, boolean>>({});
  const [shareStatus, setShareStatus] = useState<'idle' | 'success'>('idle');
  const [extractionMode, setExtractionMode] = useState(false);

  const resMeta = {
    maxRes: { label: ResolutionType.MAX_RES, dims: '1280 × 720', size: '~250KB' },
    hq: { label: ResolutionType.HQ, dims: '480 × 360', size: '~80KB' },
    mq: { label: ResolutionType.MQ, dims: '320 × 180', size: '~45KB' },
    sd: { label: ResolutionType.SD, dims: '120 × 90', size: '~15KB' },
  };

  useEffect(() => {
    const verify = async () => {
      setIsVerifying(true);
      const checks = await Promise.all([
        checkThumbnailAvailability(data.maxRes),
        checkThumbnailAvailability(data.hq),
        checkThumbnailAvailability(data.mq),
        checkThumbnailAvailability(data.sd),
      ]);
      
      const availability = {
        maxRes: checks[0],
        hq: checks[1],
        mq: checks[2],
        sd: checks[3],
      };
      
      setAvailableRes(availability);
      if (!checks[0]) setSelectedRes('hq');
      setIsVerifying(false);
    };
    verify();
  }, [data]);

  const handleShare = async () => {
    const shareData = {
      title: 'YouTube Thumbnail',
      text: `Check out this thumbnail for video ${data.videoId}`,
      url: data[selectedRes]
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(data[selectedRes]);
        setShareStatus('success');
        setTimeout(() => setShareStatus('idle'), 2000);
      }
    } catch (err) {
      console.error('Error sharing', err);
    }
  };

  const handleVideoDownloadRequest = (quality: string) => {
    // For full video downloads in a pure frontend environment, 
    // we use the popular 'ss' redirect method as direct CORS bypass is not possible client-side.
    const redirectUrl = `https://www.ssyoutube.com/watch?v=${data.videoId}`;
    window.open(redirectUrl, '_blank');
  };

  return (
    <div className="mt-12 animate-in fade-in zoom-in-95 duration-500 w-full max-w-5xl relative z-10 space-y-8">
      <div className="relative group">
        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-red-500 z-20"></div>
        <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-right-2 border-red-500 z-20"></div>
        <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-red-500 z-20"></div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-right-2 border-red-500 z-20"></div>

        <div className="bg-zinc-950/90 neon-border rounded-sm overflow-hidden backdrop-blur-md border-zinc-800">
          <div className="flex flex-wrap items-center justify-between p-4 border-b border-zinc-900 bg-black/40">
            <div className="flex items-center gap-4">
              <div className="px-2 py-0.5 bg-red-600 text-[10px] font-orbitron text-white uppercase tracking-tighter">Live_Feed</div>
              <h3 className="font-orbitron text-xs text-zinc-400 tracking-[0.2em] uppercase">
                Source_ID: <span className="text-red-500 neon-glow">{data.videoId}</span>
              </h3>
            </div>
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
               <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 hover:border-red-500 text-[10px] font-orbitron text-zinc-400 hover:text-red-500 transition-all uppercase"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                {shareStatus === 'success' ? 'LINK_COPIED' : 'SHARE_RESOURCE'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4">
            <div className="lg:col-span-3 relative aspect-video bg-zinc-900 overflow-hidden flex items-center justify-center border-r border-zinc-900">
              {isVerifying ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  <div className="font-orbitron text-[10px] text-red-500 animate-pulse tracking-widest">VERIFYING_RESOURCES...</div>
                </div>
              ) : (
                <img
                  src={data[selectedRes]}
                  alt="YouTube Thumbnail"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
            </div>

            <div className="lg:col-span-1 p-6 flex flex-col justify-between bg-zinc-950">
              <div>
                <h4 className="font-orbitron text-[10px] text-zinc-500 uppercase tracking-widest mb-4">Select_Tier</h4>
                <div className="space-y-3">
                  {(Object.keys(resMeta) as Array<keyof typeof resMeta>).map((key) => {
                    const isAvailable = availableRes[key] !== false;
                    return (
                      <div key={key} className="relative group/tooltip">
                        <button
                          disabled={!isAvailable}
                          onClick={() => setSelectedRes(key)}
                          className={`w-full text-left p-3 border transition-all relative overflow-hidden group/btn hover:scale-[1.02] active:scale-[0.98] ${
                            selectedRes === key
                              ? 'bg-red-950/20 border-red-500/50 text-white shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                              : isAvailable 
                                ? 'bg-transparent border-zinc-900 text-zinc-500 hover:border-red-900 hover:text-zinc-300'
                                : 'bg-zinc-900/50 border-zinc-900 text-zinc-800 cursor-not-allowed'
                          }`}
                        >
                          {selectedRes === key && (
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500 shadow-[0_0_10px_#E11D48]"></div>
                          )}
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-xs font-orbitron font-bold tracking-tight">{resMeta[key].label}</div>
                              <div className="text-[10px] font-rajdhani opacity-60 tracking-wider mt-1">{resMeta[key].dims}</div>
                            </div>
                            {!isAvailable && (
                              <span className="text-[8px] font-orbitron text-red-900/50">UNAVAILABLE</span>
                            )}
                          </div>
                        </button>
                        
                        {isAvailable && (
                          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 hidden md:block">
                            <div className="bg-zinc-900 border border-red-900/50 p-2 rounded shadow-2xl min-w-[120px]">
                              <div className="text-[10px] font-orbitron text-red-500 uppercase border-b border-zinc-800 mb-1 pb-1">Spec_Data</div>
                              <div className="text-[9px] font-rajdhani text-zinc-400 space-y-1">
                                <p>RES: <span className="text-zinc-100">{resMeta[key].dims}</span></p>
                                <p>SIZE: <span className="text-zinc-100">{resMeta[key].size}</span></p>
                              </div>
                            </div>
                            <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-zinc-900 border-l border-b border-red-900/50 rotate-45"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <button
                  onClick={() => onDownload(selectedRes, data[selectedRes])}
                  className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-orbitron text-xs tracking-[0.3em] font-bold transition-all relative group overflow-hidden shadow-[0_4px_15px_rgba(239,68,68,0.3)] hover:shadow-[0_4px_25px_rgba(239,68,68,0.5)]"
                >
                  <span className="relative z-10">DOWNLOAD_DATA</span>
                  <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-full transition-all duration-700"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Video Binary Extraction Section */}
      <div className="relative group">
        <div className="bg-zinc-950/80 border border-zinc-900 p-6 rounded-sm backdrop-blur-lg">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-orbitron text-sm text-red-500 tracking-[0.4em] uppercase flex items-center gap-3">
              <span className="w-2 h-2 bg-red-600 animate-pulse"></span>
              Video_Binary_Extraction
            </h4>
            <div className="px-2 py-0.5 border border-red-900 text-[8px] font-orbitron text-red-900 uppercase">
              Encrypted_Tunnel_Active
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {VIDEO_TIERS.map((tier) => (
              <button
                key={tier.quality}
                onClick={() => handleVideoDownloadRequest(tier.quality)}
                className="group/video relative bg-black/40 border border-zinc-800 hover:border-red-600 p-4 transition-all hover:bg-red-950/10 flex flex-col items-center gap-2"
              >
                <div className="text-xs font-orbitron text-zinc-300 group-hover/video:text-white transition-colors">{tier.quality}</div>
                <div className="text-[9px] font-rajdhani text-zinc-600 group-hover/video:text-red-500 transition-colors uppercase tracking-widest">{tier.label}</div>
                <div className="absolute top-0 right-0 p-1 opacity-0 group-hover/video:opacity-100 transition-opacity">
                  <svg className="w-2 h-2 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L4 10H8V22H16V10H20L12 2Z" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
          <p className="mt-6 text-[9px] font-rajdhani text-zinc-600 uppercase tracking-widest text-center border-t border-zinc-900 pt-4">
            Note: Video extraction requires external buffer processing. Links are generated for direct deployment.
          </p>
        </div>
      </div>
    </div>
  );
};
