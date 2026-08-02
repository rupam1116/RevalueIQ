import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';

function Upload() {
  const [file, setFile] = useState(null);
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);

    try {
      // Mock API call to backend
      const res = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, brand, condition: 'Good' }) // Mock condition initially
      });
      const result = await res.json();
      
      if (result.success) {
        navigate('/result', { state: { resultData: result.data } });
      }
    } catch (error) {
      console.error('Error analyzing product:', error);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--color-background)]">
      <div className="max-w-3xl w-full glass-card p-8 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Evaluate Your Device</h2>
          <p className="text-gray-500">Upload a clear image of your device for AI-powered analysis</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Drag & Drop Area */}
          <div 
            className="mt-1 flex justify-center px-6 pt-10 pb-12 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-gray-100 hover:border-primary-400 transition-colors cursor-pointer group"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <div className="space-y-4 text-center">
              {file ? (
                <div className="flex flex-col items-center text-emerald-600">
                  <ImageIcon size={48} className="mb-2" />
                  <span className="font-medium">{file.name}</span>
                </div>
              ) : (
                <>
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400 group-hover:text-primary-500 transition-colors" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => setFile(e.target.files[0])} accept="image/*" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Product Name/Model</label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white"
                placeholder="e.g. iPhone 13 Pro"
                required
              />
            </div>
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
              <input
                type="text"
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white"
                placeholder="e.g. Apple"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!file || !productName || isAnalyzing}
            className={`w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-gradient-hero hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all ${(!file || !productName) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles className="-ml-1 mr-2 h-5 w-5" />
                Analyze Now
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Upload;
